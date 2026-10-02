import { copiaElegivel, movimentoReduzido, observarPreferencia } from './movimento';

interface EstadoAnimacao {
  geracao: number;
}

const estados = new WeakMap<HTMLElement, EstadoAnimacao>();
let contadorClone = 0;
let motivoReplayEstatico = '';
let controleMovimentoIniciado = false;

/** Toda cópia recebe IDs próprios, inclusive no visualizador. */
export function clonarEstudo(nome: string): DocumentFragment | null {
  const template = document.getElementById('tpl-' + nome);
  if (!(template instanceof HTMLTemplateElement)) return null;
  const fragmento = template.content.cloneNode(true);
  if (!(fragmento instanceof DocumentFragment)) return null;
  const sufixo = '-c' + (++contadorClone);
  const ids = new Map<string, string>();
  fragmento.querySelectorAll('[id]').forEach((elemento) => {
    const novoId = elemento.id + sufixo;
    ids.set(elemento.id, novoId);
    elemento.id = novoId;
  });
  if (ids.size) {
    fragmento.querySelectorAll('*').forEach((elemento) => {
      Array.from(elemento.attributes).forEach((atributo) => {
        const valor = atributo.value;
        let novo = valor.replace(/url\(#([^)]+)\)/g, (original: string, id: string) => {
          const destino = ids.get(id);
          return destino ? 'url(#' + destino + ')' : original;
        });
        if (novo.startsWith('#')) {
          const destino = ids.get(novo.slice(1));
          if (destino) novo = '#' + destino;
        }
        if (atributo.name === 'aria-labelledby' || atributo.name === 'aria-describedby') {
          novo = novo.split(/\s+/).map((id) => ids.get(id) ?? id).join(' ');
        }
        if (novo !== valor) elemento.setAttribute(atributo.name, novo);
      });
    });
  }
  return fragmento;
}

function montarEstudo(elemento: HTMLElement): void {
  if (elemento.getAttribute('data-montado')) return;
  const nome = elemento.getAttribute('data-estudo');
  if (!nome) return;
  const fragmento = clonarEstudo(nome);
  if (!fragmento) return;
  elemento.appendChild(fragmento);
  elemento.setAttribute('data-montado', '1');
  elemento.setAttribute('aria-hidden', 'true');
  elemento.inert = true;
}

function estadoAnimacao(elemento: HTMLElement): EstadoAnimacao {
  let estado = estados.get(elemento);
  if (!estado) {
    estado = { geracao: 0 };
    estados.set(elemento, estado);
  }
  return estado;
}

function concluirAnimacao(elemento: HTMLElement, geracao: number): void {
  if (estadoAnimacao(elemento).geracao !== geracao || !elemento.classList.contains('anim-play')) return;
  elemento.setAttribute('data-anim-concluida', '1');
  elemento.classList.remove('anim-play', 'is-pausado');
}

function iniciarEfeitosAnimacao(elemento: HTMLElement): void {
  const geracao = ++estadoAnimacao(elemento).geracao;
  elemento.removeAttribute('data-anim-concluida');
  elemento.classList.remove('is-pausado');
  elemento.classList.add('anim-play');
  // Considera efeitos CSS finitos de descendentes e pseudo-elementos.
  const finitas = elemento.getAnimations({ subtree: true }).filter((animacao) => {
    const tempo = animacao.effect?.getComputedTiming();
    return tempo && typeof tempo.endTime === 'number' && Number.isFinite(tempo.endTime) && tempo.endTime > 0;
  });
  void Promise.all(finitas.map((animacao) => animacao.finished.then(() => {}, () => {})))
    .then(() => concluirAnimacao(elemento, geracao));
}

function dispararAnimacao(elemento: HTMLElement): void {
  if (motivoReplayEstatico || movimentoReduzido() || !copiaElegivel(elemento) || typeof elemento.getAnimations !== 'function') return;
  if (elemento.getAttribute('data-animou')) return;
  montarEstudo(elemento);
  elemento.setAttribute('data-animou', '1');
  iniciarEfeitosAnimacao(elemento);
}

function pausarAnimacao(elemento: HTMLElement): void {
  if (elemento.getAttribute('data-anim-concluida') || !elemento.classList.contains('anim-play')) return;
  elemento.classList.add('is-pausado');
}

function retomarAnimacao(elemento: HTMLElement): void {
  if (!elemento.classList.contains('anim-play')) return;
  if (movimentoReduzido()) {
    cancelarAnimacaoEstudo(elemento);
    return;
  }
  if (!copiaElegivel(elemento)) {
    pausarAnimacao(elemento);
    return;
  }
  if (elemento.getAttribute('data-anim-concluida')) return;
  elemento.classList.remove('is-pausado');
}

function reiniciarAnimacao(elemento: HTMLElement): void {
  if (movimentoReduzido() || !copiaElegivel(elemento) || typeof elemento.getAnimations !== 'function') return;
  montarEstudo(elemento);
  estadoAnimacao(elemento).geracao++;
  elemento.classList.remove('anim-play', 'is-pausado');
  void elemento.offsetWidth;
  elemento.setAttribute('data-animou', '1');
  iniciarEfeitosAnimacao(elemento);
}

function cancelarAnimacaoEstudo(elemento: HTMLElement): void {
  estadoAnimacao(elemento).geracao++;
  elemento.classList.remove('anim-play', 'is-pausado');
  elemento.setAttribute('data-anim-concluida', '1');
}

export function sincronizarCopiaEstudo(elemento: HTMLElement): void {
  if (movimentoReduzido()) {
    if (elemento.classList.contains('anim-play')) cancelarAnimacaoEstudo(elemento);
    return;
  }
  if (!copiaElegivel(elemento)) {
    pausarAnimacao(elemento);
    return;
  }
  if (!elemento.getAttribute('data-animou')) dispararAnimacao(elemento);
  else retomarAnimacao(elemento);
}

function sincronizarPreferencia(): void {
  if (!movimentoReduzido()) return;
  document.querySelectorAll<HTMLElement>('.anim-play[data-estudo]').forEach(cancelarAnimacaoEstudo);
}

function iniciarControleMovimento(): void {
  if (controleMovimentoIniciado) return;
  controleMovimentoIniciado = true;
  observarPreferencia(sincronizarPreferencia);
  if ('MutationObserver' in window) {
    const observador = new MutationObserver(sincronizarPreferencia);
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
}

function iniciarBotoesReplay(): void {
  const nomes = new Map([
    ['modulo', 'Módulo Engenharia'],
    ['atria', 'Atria Clinic'],
    ['casanoma', 'Casa Noma'],
  ]);
  document.querySelectorAll<HTMLButtonElement>('[data-replay]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const capitulo = botao.closest('.capitulo');
      const live = capitulo?.querySelector('.live-replay');
      const nome = nomes.get(botao.getAttribute('data-replay') ?? '') ?? 'estudo';
      if (motivoReplayEstatico) {
        if (live) live.textContent = motivoReplayEstatico;
        return;
      }
      if (movimentoReduzido()) {
        if (live) live.textContent = 'Preferência de movimento reduzido ativa. Nenhuma animação espacial executada para ' + nome + '.';
        const texto = botao.querySelector('span');
        if (texto && !botao.getAttribute('data-notificando')) {
          botao.setAttribute('data-notificando', '1');
          const anterior = texto.textContent;
          texto.textContent = 'Movimento reduzido ativo';
          window.setTimeout(() => {
            texto.textContent = anterior;
            botao.removeAttribute('data-notificando');
          }, 2200);
        }
        return;
      }
      if (!capitulo) return;
      let reiniciadas = 0;
      capitulo.querySelectorAll<HTMLElement>('[data-estudo]').forEach((elemento) => {
        if (copiaElegivel(elemento)) {
          reiniciarAnimacao(elemento);
          reiniciadas++;
        }
      });
      if (live) {
        live.textContent = reiniciadas > 0
          ? 'Animação de ' + nome + ' reiniciada.'
          : 'Role a página para visualizar o modelo de ' + nome + ' antes de reiniciar a animação.';
      }
    });
  });
}

export function iniciarEstudos(): void {
  const alvos = document.querySelectorAll<HTMLElement>('[data-estudo]');
  if (!alvos.length) return;
  if (!('IntersectionObserver' in window)) {
    motivoReplayEstatico = 'Este navegador não oferece suporte à observação de visibilidade; os estudos permanecem estáticos.';
    alvos.forEach(montarEstudo);
    iniciarBotoesReplay();
    return;
  }

  const montagem = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting && entrada.target instanceof HTMLElement) {
        montarEstudo(entrada.target);
        montagem.unobserve(entrada.target);
      }
    });
  }, { rootMargin: '800px 0px' });
  alvos.forEach((elemento) => montagem.observe(elemento));

  if (typeof Element.prototype.getAnimations !== 'function') {
    motivoReplayEstatico = 'Este navegador não oferece suporte à sincronização das animações; os estudos permanecem estáticos.';
    iniciarBotoesReplay();
    return;
  }
  iniciarControleMovimento();
  const visibilidade = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.target instanceof HTMLElement) sincronizarCopiaEstudo(entrada.target);
    });
  }, { threshold: Array.from({ length: 21 }, (_, indice) => indice / 20) });
  alvos.forEach((elemento) => visibilidade.observe(elemento));

  let agendado = false;
  function sincronizarPorFrame(): void {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => {
      agendado = false;
      alvos.forEach(sincronizarCopiaEstudo);
    });
  }
  window.addEventListener('scroll', sincronizarPorFrame, { passive: true });
  window.addEventListener('resize', sincronizarPorFrame, { passive: true });
  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll<HTMLElement>('.anim-play[data-estudo]:not([data-anim-concluida])').forEach((elemento) => {
      if (document.hidden || !copiaElegivel(elemento)) pausarAnimacao(elemento);
      else retomarAnimacao(elemento);
    });
  });
  iniciarBotoesReplay();
}
