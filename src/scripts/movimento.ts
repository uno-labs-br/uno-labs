const raiz = document.documentElement;
export const preferenciaMovimento = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

export function movimentoReduzido(): boolean {
  return raiz.classList.contains('rm') || !!preferenciaMovimento?.matches;
}

export function observarPreferencia(atualizar: () => void): void {
  if (!preferenciaMovimento) return;
  if (typeof preferenciaMovimento.addEventListener === 'function') {
    preferenciaMovimento.addEventListener('change', atualizar);
  } else {
    preferenciaMovimento.addListener(atualizar);
  }
}

export function iniciarPreferencias(): void {
  function atualizar(): void {
    raiz.classList.toggle('rm', !!preferenciaMovimento?.matches);
  }
  atualizar();
  observarPreferencia(atualizar);

  function visibilidade(): void {
    raiz.classList.toggle('page-hidden', document.hidden);
  }
  document.addEventListener('visibilitychange', visibilidade);
  visibilidade();

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        entrada.target.classList.toggle('motion-paused', !entrada.isIntersecting);
      });
    });
    document.querySelectorAll('.hero-palco, .orbita-caixa').forEach((elemento) => {
      observador.observe(elemento);
    });
  }
}

/** A exposição considera viewport útil, clipping dos ancestrais e etapa da jornada. */
export function copiaElegivel(elemento: HTMLElement): boolean {
  if (!elemento.isConnected || document.hidden) return false;
  const etapa = elemento.closest('[data-etapa]');
  if (etapa && !etapa.classList.contains('is-ativo')) return false;

  const retangulo = elemento.getBoundingClientRect();
  if (retangulo.width <= 0 || retangulo.height <= 0) return false;
  let x1 = retangulo.left;
  let y1 = retangulo.top;
  let x2 = retangulo.right;
  let y2 = retangulo.bottom;
  let ancestral = elemento.parentElement;
  const overflowComRecorte = new Set(['hidden', 'clip', 'scroll', 'auto']);
  while (ancestral && ancestral !== document.body) {
    const estilo = getComputedStyle(ancestral);
    if (estilo.display === 'none' || estilo.visibility === 'hidden') return false;
    if (overflowComRecorte.has(estilo.overflowX) || overflowComRecorte.has(estilo.overflowY)) {
      const recorte = ancestral.getBoundingClientRect();
      x1 = Math.max(x1, recorte.left);
      y1 = Math.max(y1, recorte.top);
      x2 = Math.min(x2, recorte.right);
      y2 = Math.min(y2, recorte.bottom);
      if (x2 <= x1 || y2 <= y1) return false;
    }
    ancestral = ancestral.parentElement;
  }

  const cabecalho = document.querySelector('.topo')?.getBoundingClientRect();
  const topoUtil = cabecalho && cabecalho.bottom > 0 && cabecalho.top <= 0
    ? Math.max(0, cabecalho.bottom)
    : 0;
  const baseUtil = window.innerHeight;
  const direitaUtil = window.innerWidth;
  const visivelX1 = Math.max(x1, 0);
  const visivelY1 = Math.max(y1, topoUtil);
  const visivelX2 = Math.min(x2, direitaUtil);
  const visivelY2 = Math.min(y2, baseUtil);
  if (visivelX2 <= visivelX1 || visivelY2 <= visivelY1) return false;

  const larguraModelo = Math.max(0, x2 - x1);
  const alturaModelo = Math.max(0, y2 - y1);
  const alturaUtil = Math.max(0, baseUtil - topoUtil);
  const larguraUtil = Math.max(0, direitaUtil);
  if (larguraModelo <= 0 || alturaModelo <= 0 || alturaUtil <= 0 || larguraUtil <= 0) return false;
  const areaVisivel = (visivelX2 - visivelX1) * (visivelY2 - visivelY1);
  const referencia = Math.min(alturaModelo, alturaUtil) * Math.min(larguraModelo, larguraUtil);
  return areaVisivel >= 0.5 * referencia;
}

export function iniciarOrbita(): void {
  const figura = document.querySelector<HTMLElement>('.orbita-fig');
  if (!figura || !('IntersectionObserver' in window)) return;
  const botao = figura.querySelector<HTMLButtonElement>('[data-pausar-orbita]');
  const estado = figura.querySelector('[data-estado-orbita]');
  if (!botao) return;
  let pausado = false;
  const atualizar = (): void => {
    const reduzido = movimentoReduzido();
    figura.classList.toggle('is-paused', pausado);
    botao.disabled = reduzido;
    botao.textContent = reduzido ? 'Animação estática' : pausado ? 'Retomar animação' : 'Pausar animação';
    if (estado) {
      estado.textContent = reduzido
        ? 'Sua preferência por movimento reduzido mantém a imagem estática.'
        : pausado ? 'Animação pausada.' : 'Animação em movimento.';
    }
  };
  botao.addEventListener('click', () => {
    pausado = !pausado;
    atualizar();
  });
  observarPreferencia(atualizar);
  atualizar();
  botao.hidden = false;
  if (botao.parentElement) botao.parentElement.hidden = false;
  figura.classList.add('is-motion-ready');
}
