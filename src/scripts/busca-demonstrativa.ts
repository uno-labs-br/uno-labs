import { copiaElegivel, movimentoReduzido, observarPreferencia } from './movimento';

/** Demonstração local: não envia pesquisas nem captura dados do visitante. */
export function iniciarBuscaDemonstrativa(): void {
  document.querySelectorAll<HTMLElement>('[data-busca-demo]').forEach((cartao) => {
    const texto = cartao.querySelector<HTMLElement>('[data-busca-texto]');
    if (!texto) return;
    const frase = texto.textContent || '';
    const letras = Array.from(frase);
    const inicio = 120;
    const fimDigitacao = inicio + letras.length * 42;
    const fimEnter = fimDigitacao + 240;
    const fim = fimEnter + 240;
    let tempo = 0;
    let anterior = 0;
    let quadro = 0;
    let concluida = false;

    function finalizar(): void {
      cancelAnimationFrame(quadro);
      quadro = 0;
      concluida = true;
      texto!.textContent = frase;
      cartao.dataset.buscaEstado = 'concluida';
      cartao.style.setProperty('--busca-resultado', '1');
    }

    function desenhar(): void {
      const quantidade = Math.min(letras.length, Math.floor(Math.max(0, tempo - inicio) / 42));
      texto!.textContent = letras.slice(0, quantidade).join('');
      cartao.dataset.buscaEstado = tempo < fimDigitacao ? 'digitando' : tempo < fimEnter ? 'enter' : 'resultado';
      cartao.style.setProperty('--busca-resultado', String(Math.max(0, Math.min(1, (tempo - fimEnter) / 240))));
    }

    function avancar(agora: number): void {
      quadro = 0;
      if (!copiaElegivel(cartao) || document.hidden) { anterior = 0; return; }
      if (anterior) tempo += Math.min(agora - anterior, 64);
      anterior = agora;
      if (tempo >= fim) { finalizar(); return; }
      desenhar();
      quadro = requestAnimationFrame(avancar);
    }

    function sincronizar(): void {
      if (concluida) return;
      if (movimentoReduzido()) { finalizar(); return; }
      if (!copiaElegivel(cartao) || document.hidden) {
        cancelAnimationFrame(quadro);
        quadro = 0;
        anterior = 0;
      } else if (!quadro) quadro = requestAnimationFrame(avancar);
    }

    // O HTML contém a composição completa. Sem observador ou com movimento reduzido,
    // preservamos esse estado e não deixamos o resultado dependente da animação.
    if (movimentoReduzido() || !('IntersectionObserver' in window)) { finalizar(); return; }
    desenhar();
    const observador = new IntersectionObserver(sincronizar, { threshold: [0, 0.5, 1] });
    observador.observe(cartao);
    document.addEventListener('scroll', sincronizar, { passive: true });
    window.addEventListener('resize', sincronizar);
    document.addEventListener('visibilitychange', sincronizar);
    observarPreferencia(sincronizar);
    sincronizar();
  });
}
