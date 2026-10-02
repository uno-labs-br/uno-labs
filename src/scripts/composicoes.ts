import { sincronizarCopiaEstudo } from './estudos';
import { movimentoReduzido, observarPreferencia } from './movimento';

export function iniciarEscalas(): void {
  const caixas = document.querySelectorAll<HTMLElement>('.escala');
  if (!caixas.length) return;
  const aplicar = (elemento: HTMLElement, largura: number): void => {
    const base = parseFloat(getComputedStyle(elemento).getPropertyValue('--bw')) || 1;
    if (largura > 0) elemento.style.setProperty('--s', (largura / base).toFixed(4));
  };
  if (typeof ResizeObserver !== 'undefined') {
    const observador = new ResizeObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.target instanceof HTMLElement) aplicar(entrada.target, entrada.contentRect.width);
      });
    });
    caixas.forEach((elemento) => observador.observe(elemento));
  } else {
    const todas = (): void => caixas.forEach((elemento) => aplicar(elemento, elemento.clientWidth));
    todas();
    window.addEventListener('resize', todas);
  }
}

export function iniciarLuz(): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero || typeof window.matchMedia !== 'function' || !window.matchMedia('(hover: hover)').matches) return;
  let ultimo: PointerEvent | null = null;
  let agendado = false;
  hero.addEventListener('pointermove', (evento) => {
    if (movimentoReduzido()) return;
    ultimo = evento;
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => {
      agendado = false;
      if (!ultimo) return;
      const retangulo = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (ultimo.clientX - retangulo.left) + 'px');
      hero.style.setProperty('--my', (ultimo.clientY - retangulo.top) + 'px');
    });
  }, { passive: true });
}

/** Três alturas de tela estáveis; usa quatro etapas lineares quando não cabe. */
export function iniciarJornada(): void {
  const secao = document.querySelector<HTMLElement>('.jornada');
  if (!secao) return;
  const fixo = secao.querySelector<HTMLElement>('.jornada__fixo');
  const grade = secao.querySelector<HTMLElement>('.j-grade');
  const mobile = secao.querySelector<HTMLElement>('.jornada__mob');
  const composicao = secao.querySelector<HTMLElement>('.jm-comp');
  const cabecalho = document.querySelector<HTMLElement>('.topo__in');
  if (!fixo || !grade || !mobile || !composicao || !cabecalho) return;
  const etapas = secao.querySelectorAll<HTMLElement>('[data-etapa]');
  const botoes = secao.querySelectorAll<HTMLButtonElement>('[data-ir]');
  const contador = secao.querySelector('[data-contador]');
  let atual = -1;
  let agendado = false;
  let sticky = false;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;width:0;height:100svh;visibility:hidden;pointer-events:none';
  probe.setAttribute('aria-hidden', 'true');
  secao.appendChild(probe);

  const aplicar = (passo: number, sub: number): void => {
    const mudou = passo !== atual;
    secao.setAttribute('data-passo', String(passo));
    etapas.forEach((elemento) => {
      const indice = Number(elemento.getAttribute('data-etapa'));
      const ativo = indice === passo;
      elemento.classList.toggle('is-ativo', ativo);
      elemento.style.setProperty('--sub', String(ativo ? sub : 0));
      if (elemento.classList.contains('j-item') || elemento.classList.contains('jm-aba')) {
        elemento.classList.toggle('is-feito', indice < passo);
      }
      if (elemento.classList.contains('jm-texto')) {
        elemento.setAttribute('aria-hidden', !sticky || ativo ? 'false' : 'true');
      }
      if (elemento.classList.contains('j-item')) {
        elemento.querySelector('.j-det')?.setAttribute('aria-hidden', ativo ? 'false' : 'true');
      }
    });
    botoes.forEach((botao) => {
      if (sticky && Number(botao.getAttribute('data-ir')) === passo) botao.setAttribute('aria-current', 'step');
      else botao.removeAttribute('aria-current');
    });
    if (contador) contador.textContent = '0' + (passo + 1);
    atual = passo;
    if (mudou) secao.querySelectorAll<HTMLElement>('[data-estudo]').forEach(sincronizarCopiaEstudo);
  };

  const medir = (): void => {
    agendado = false;
    if (!sticky) return;
    const topo = parseFloat(getComputedStyle(fixo).top) || 0;
    const faixa = Math.max(1, secao.offsetHeight - fixo.offsetHeight);
    const progresso = Math.min(1, Math.max(0, (topo - secao.getBoundingClientRect().top) / faixa));
    const passo = Math.min(3, Math.floor(progresso * 4));
    aplicar(passo, Math.min(1, Math.max(0, progresso * 4 - passo)));
  };
  const agendar = (): void => {
    if (agendado || !sticky) return;
    agendado = true;
    requestAnimationFrame(medir);
  };
  const adaptar = (): void => {
    const topo = cabecalho.offsetHeight;
    document.documentElement.style.setProperty('--topo', topo + 'px');
    const tela = probe.offsetHeight || window.innerHeight;
    const altura = Math.min(tela, window.visualViewport?.height ?? window.innerHeight);
    const util = altura - topo;
    secao.style.setProperty('--j-tela', tela + 'px');
    secao.style.setProperty('--j-util', util + 'px');
    secao.classList.add('is-sticky');
    sticky = true;
    aplicar(Math.max(0, atual), 1);
    let cabe = false;
    if (window.innerWidth >= 1100) {
      const escala = Math.min(1, (window.innerWidth - 64) / 1296);
      grade.style.setProperty('--je', escala.toFixed(3));
      const detalhes = Array.from(secao.querySelectorAll<HTMLElement>('.j-det'));
      const extra = Math.max(...detalhes.map((elemento) => elemento.scrollHeight)) - (detalhes[atual]?.scrollHeight ?? 0);
      cabe = escala >= 0.88 && (grade.offsetHeight + Math.max(0, extra)) * escala + 48 <= util;
    } else {
      const textos = Array.from(secao.querySelectorAll<HTMLElement>('.jm-texto'));
      secao.style.setProperty('--j-texto', Math.max(...textos.map((elemento) => elemento.scrollHeight)) + 'px');
      composicao.style.setProperty('--jm', '1');
      const semImagem = mobile.offsetHeight - composicao.offsetHeight;
      const tamanho = Math.min(1.1, (util - semImagem - 36) / 404, (window.innerWidth - 40) / 350);
      composicao.style.setProperty('--jm', Math.max(0.8, tamanho).toFixed(3));
      cabe = tamanho >= 0.8 && mobile.offsetHeight + 24 <= util;
    }
    sticky = cabe && !movimentoReduzido();
    secao.classList.toggle('is-sticky', sticky);
    if (sticky) medir();
    else aplicar(1, 1);
  };
  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      if (!sticky) return;
      const indice = Number(botao.getAttribute('data-ir'));
      const topoSecao = window.scrollY + secao.getBoundingClientRect().top;
      const topo = parseFloat(getComputedStyle(fixo).top) || 0;
      const faixa = secao.offsetHeight - fixo.offsetHeight;
      window.scrollTo({
        top: topoSecao - topo + faixa * ((indice + 0.25) / 4),
        behavior: movimentoReduzido() ? 'auto' : 'smooth',
      });
    });
  });
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', adaptar);
  window.visualViewport?.addEventListener('resize', adaptar);
  observarPreferencia(adaptar);
  if (document.fonts) void document.fonts.ready.then(adaptar);
  adaptar();
}

export function iniciarTerminal(): void {
  const terminal = document.querySelector('.terminal');
  if (!terminal) return;
  if (!('IntersectionObserver' in window)) {
    terminal.classList.add('is-visivel');
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    if (entradas[0]?.isIntersecting) {
      terminal.classList.add('is-visivel');
      observador.disconnect();
    }
  }, { threshold: 0.25 });
  observador.observe(terminal);
}
