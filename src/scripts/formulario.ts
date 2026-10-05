import { movimentoReduzido } from './movimento';
import { registrarInicioFormulario, redefinirInicioFormulario, registrarLead } from './analytics';

const camposObrigatorios = ['nome', 'empresa', 'canal', 'contexto'] as const;
type CampoValidado = typeof camposObrigatorios[number];
type CampoFormulario = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface ContatoPayload {
  nome: string;
  empresa: string;
  canal: string;
  site: string;
  servicos: string[];
  contexto: string;
  invest: string;
  website: string;
  turnstile: string;
  pagina: string;
}

interface TurnstileOptions {
  sitekey: string;
  language: 'pt-BR';
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
}

interface TurnstileAPI {
  render: (container: HTMLElement, options: TurnstileOptions) => string | undefined;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
    unoTurnstilePronto?: () => void;
  }
}

function campoValido(nome: unknown): nome is CampoValidado {
  return nome === 'nome' || nome === 'empresa' || nome === 'canal' || nome === 'contexto';
}

function objetoJSON(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

/** HTTP 2xx só confirma o contrato explícito de aceite pelo serviço de e-mail. */
function envioConfirmado(resposta: unknown): boolean {
  return objetoJSON(resposta) && resposta.ok === true && resposta.encaminhamento === 'smtp_aceito';
}

class ErroContato extends Error {
  readonly status: number;
  readonly campos: CampoValidado[];

  constructor(status: number, resposta: unknown) {
    const dados = objetoJSON(resposta) ? resposta : {};
    super(typeof dados.erro === 'string' && dados.erro ? dados.erro : 'http_' + status);
    this.name = 'ErroContato';
    this.status = status;
    this.campos = Array.isArray(dados.campos) ? dados.campos.filter(campoValido) : [];
  }
}

function canalValido(valor: string): boolean {
  if (/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(valor)) return true;
  const digitos = valor.replace(/\D/g, '').length;
  return /^[+()\d\s.-]+$/.test(valor) && digitos >= 10 && digitos <= 15;
}

const regras: Record<CampoValidado, (valor: string) => boolean> = {
  nome: (valor) => valor.length >= 2,
  empresa: (valor) => valor.length >= 2,
  canal: canalValido,
  contexto: (valor) => valor.length >= 10,
};

export function iniciarFormulario(): void {
  const form = document.getElementById('form-contato');
  if (!(form instanceof HTMLFormElement)) return;
  const sucesso = document.getElementById('form-sucesso');
  const aviso = document.getElementById('form-aviso');
  const botao = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const cartao = form.closest('.form-cartao');
  if (!sucesso || !aviso || !botao || !cartao) return;

  const obterCampo = (nome: string): CampoFormulario | null => {
    const campo = form.elements.namedItem(nome);
    return campo instanceof HTMLInputElement || campo instanceof HTMLTextAreaElement || campo instanceof HTMLSelectElement
      ? campo
      : null;
  };
  if (camposObrigatorios.some((nome) => !obterCampo(nome))) return;
  if (
    new URLSearchParams(window.location.search).get('servico') === 'whatsapp' ||
    window.location.pathname.startsWith('/whatsapp')
  ) {
    const opcao = form.querySelector<HTMLInputElement>('input[name="servicos"][value="whatsapp"]');
    if (opcao) opcao.checked = true;
  }
  const textoBotao = botao.textContent;
  const recuperacao = form.querySelector<HTMLElement>('.form-recuperacao');
  const endpoint = form.getAttribute('data-endpoint') || '/api/contato';
  const chaveTurnstile = (form.getAttribute('data-turnstile') || '').trim();
  let tokenTurnstile = '';
  let widgetTurnstile: string | undefined;
  let enviando = false;

  const valor = (nome: string): string => obterCampo(nome)?.value.trim() ?? '';
  const marcar = (nome: CampoValidado, valido: boolean): void => {
    const campo = obterCampo(nome);
    const caixa = campo?.closest('.campo');
    if (!campo || !caixa) return;
    caixa.classList.toggle('tem-erro', !valido);
    campo.setAttribute('aria-invalid', valido ? 'false' : 'true');
  };
  const mostrarAviso = (mensagem = '', carregando = false): void => {
    aviso.textContent = mensagem;
    aviso.classList.toggle('erro', !!mensagem && !carregando);
    aviso.classList.toggle('carregando', carregando);
    if (recuperacao) recuperacao.hidden = !mensagem || carregando;
  };
  const reiniciarTurnstile = (): void => {
    if (!chaveTurnstile) return;
    if (window.turnstile && widgetTurnstile) {
      try {
        window.turnstile.reset(widgetTurnstile);
      } catch {
        // A falha do widget não deve apagar os campos ou esconder a recuperação.
      }
    }
    tokenTurnstile = '';
  };

  camposObrigatorios.forEach((nome) => {
    const campo = obterCampo(nome);
    if (!campo) return;
    campo.addEventListener('input', () => {
      if (campo.closest('.campo')?.classList.contains('tem-erro')) marcar(nome, regras[nome](valor(nome)));
    });
    campo.addEventListener('blur', () => {
      if (valor(nome)) marcar(nome, regras[nome](valor(nome)));
    });
  });

  const ehCampoValidoParaInicio = (el: unknown): boolean => {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return false;
    if (el.type === 'hidden' || el.disabled || ('readOnly' in el && el.readOnly)) return false;
    if (el.name === 'website' || el.closest('.armadilha')) return false;
    return true;
  };

  form.addEventListener('input', (evento) => {
    const alvo = evento.target;
    if (ehCampoValidoParaInicio(alvo) && (alvo as HTMLInputElement).value.trim().length > 0) {
      try { registrarInicioFormulario(); } catch {}
    }
  });
  form.addEventListener('change', (evento) => {
    const alvo = evento.target;
    if (ehCampoValidoParaInicio(alvo)) {
      const input = alvo as HTMLInputElement;
      if (input.value.trim().length > 0 || input.checked) {
        try { registrarInicioFormulario(); } catch {}
      }
    }
  });

  // Compatibilidade existente: sem chave pública, nenhum script é carregado.
  if (chaveTurnstile) {
    const alvo = form.querySelector<HTMLElement>('.form__turnstile');
    if (alvo) {
      let carregado = false;
      const carregar = (): void => {
        if (carregado) return;
        carregado = true;
        window.unoTurnstilePronto = (): void => {
          if (!window.turnstile) return;
          alvo.hidden = false;
          widgetTurnstile = window.turnstile.render(alvo, {
            sitekey: chaveTurnstile,
            language: 'pt-BR',
            callback: (token) => { tokenTurnstile = token; },
            'expired-callback': () => { tokenTurnstile = ''; },
            'error-callback': () => { tokenTurnstile = ''; },
          });
        };
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=unoTurnstilePronto';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      };
      if ('IntersectionObserver' in window) {
        const observador = new IntersectionObserver((entradas) => {
          if (entradas[0]?.isIntersecting) {
            carregar();
            observador.disconnect();
          }
        }, { rootMargin: '600px 0px' });
        observador.observe(form);
      } else carregar();
      form.addEventListener('focusin', carregar);
    }
  }

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (enviando) return;
    let primeiroErro: CampoFormulario | null = null;
    for (const nome of camposObrigatorios) {
      const valido = regras[nome](valor(nome));
      marcar(nome, valido);
      if (!valido && !primeiroErro) primeiroErro = obterCampo(nome);
    }
    if (primeiroErro) {
      mostrarAviso('Revise os campos destacados para enviar.');
      primeiroErro.focus();
      return;
    }
    if (chaveTurnstile && !tokenTurnstile) {
      mostrarAviso('Aguarde a verificação anti-spam terminar e envie de novo.');
      return;
    }
    const dados: ContatoPayload = {
      nome: valor('nome'),
      empresa: valor('empresa'),
      canal: valor('canal'),
      site: valor('site'),
      servicos: Array.from(form.querySelectorAll<HTMLInputElement>('input[name="servicos"]:checked')).map((campo) => campo.value),
      contexto: valor('contexto'),
      invest: valor('invest'),
      website: valor('website'),
      turnstile: tokenTurnstile,
      pagina: location.pathname,
    };

    enviando = true;
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    form.setAttribute('aria-busy', 'true');
    mostrarAviso('Enviando seu contexto. Aguarde a confirmação.', true);
    const controle = 'AbortController' in window ? new AbortController() : null;
    const limite = controle ? window.setTimeout(() => controle.abort(), 15000) : null;
    try {
      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(dados),
        signal: controle?.signal,
      });
      let json: unknown;
      try {
        json = await resposta.json();
      } catch {
        json = null;
      }
      if (!resposta.ok || !envioConfirmado(json)) throw new ErroContato(resposta.status, json);
      try {
        registrarLead();
      } catch {
        // Ausência/erro do tracker nunca transforma sucesso em falha ou bloqueia contatos.
      }
      form.hidden = true;
      sucesso.classList.add('visivel');
      sucesso.scrollIntoView({ block: 'center', behavior: movimentoReduzido() ? 'auto' : 'smooth' });
      sucesso.querySelector('h3')?.focus({ preventScroll: true });
    } catch (erro: unknown) {
      if (erro instanceof ErroContato && erro.status === 422 && erro.campos.length) {
        let primeiro: CampoFormulario | null = null;
        for (const nome of erro.campos) {
          marcar(nome, false);
          if (!primeiro) primeiro = obterCampo(nome);
        }
        mostrarAviso('O envio precisa de uma correção. Revise os campos indicados; seus dados continuam aqui.');
        primeiro?.focus();
      } else {
        const status = erro instanceof ErroContato ? erro.status : undefined;
        const abortado = erro instanceof Error && erro.name === 'AbortError';
        const mensagem = status === 503
          ? 'O formulário está temporariamente indisponível.'
          : status === 403
            ? 'A verificação de segurança não foi concluída. Tente novamente.'
            : abortado
              ? 'A confirmação demorou mais que o esperado. O envio pode ter sido encaminhado; confira com a equipe antes de repetir.'
              : 'Não foi possível confirmar o envio.';
        mostrarAviso(mensagem + ' Seus dados continuam aqui. Você pode tentar novamente ou usar um dos canais abaixo.');
      }
      reiniciarTurnstile();
    } finally {
      if (limite !== null) window.clearTimeout(limite);
      enviando = false;
      botao.disabled = false;
      form.setAttribute('aria-busy', 'false');
      botao.textContent = textoBotao;
    }
  });

  sucesso.querySelector<HTMLButtonElement>('[data-reiniciar]')?.addEventListener('click', () => {
    form.reset();
    try {
      redefinirInicioFormulario();
    } catch {
      // Falha silenciosa
    }
    camposObrigatorios.forEach((nome) => marcar(nome, true));
    mostrarAviso();
    sucesso.classList.remove('visivel');
    form.hidden = false;
    reiniciarTurnstile();
    obterCampo('nome')?.focus();
  });
  cartao.classList.add('is-ready');
  botao.disabled = false;
}
