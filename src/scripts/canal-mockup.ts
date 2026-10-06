import { movimentoReduzido } from './movimento';

/** Momento (ms) em que cada etapa do mockup do Canal WhatsApp aparece. */
const ETAPAS = [400, 1500, 2900, 4100, 6200] as const;
const ULTIMA = ETAPAS.length;

/**
 * Anima o mockup do hero uma única vez, quando ele entra na tela.
 * O HTML estático já mostra o estado final; sem script ou com movimento
 * reduzido, nada é escondido.
 */
export function iniciarMockupCanal(): void {
  const fig = document.getElementById('canal-mockup');
  if (!(fig instanceof HTMLElement)) return;
  fig.dataset.pronto = '1';
  const controle = fig.querySelector<HTMLButtonElement>('.canal-mockup__controle');
  const passos = Array.from(fig.querySelectorAll<HTMLElement>('[data-passo]'));
  let timers: number[] = [];

  const mostrar = (etapa: number): void => {
    for (const el of passos) {
      const de = Number(el.dataset.passo);
      const ate = el.dataset.ate ? Number(el.dataset.ate) : Infinity;
      el.classList.toggle('is-visivel', etapa >= de && etapa <= ate);
    }
  };
  const encerrar = (): void => {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
    fig.classList.remove('is-animando');
    passos.forEach((el) => el.classList.remove('is-visivel'));
    if (controle) controle.textContent = 'Rever animação';
  };
  const tocar = (): void => {
    if (movimentoReduzido()) {
      encerrar();
      return;
    }
    timers.forEach((id) => window.clearTimeout(id));
    fig.classList.add('is-animando');
    mostrar(0);
    if (controle) {
      controle.hidden = false;
      controle.textContent = 'Pular animação';
    }
    timers = ETAPAS.map((momento, i) => window.setTimeout(() => mostrar(i + 1), momento));
    timers.push(window.setTimeout(encerrar, ETAPAS[ULTIMA - 1] + 900));
  };

  controle?.addEventListener('click', () => {
    if (fig.classList.contains('is-animando')) encerrar();
    else tocar();
  });

  if (!fig.classList.contains('is-animando')) return;
  mostrar(0);
  if (!('IntersectionObserver' in window)) {
    tocar();
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    if (entradas.some((entrada) => entrada.isIntersecting)) {
      observador.disconnect();
      tocar();
    }
  }, { threshold: 0.35 });
  observador.observe(fig);
}
