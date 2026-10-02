import { aoDOMPronto } from '../../scripts/comum';

/** Comparação didática local: não coleta dados nem usa chamadas de rede. */
function iniciar(): void {
  const root = document.querySelector<HTMLElement>('.motion-demo');
  if (!root || !Element.prototype.animate) return;
  const short = root.querySelector<HTMLElement>('[data-track="curta"]');
  const long = root.querySelector<HTMLElement>('[data-track="longa"]');
  const play = root.querySelector<HTMLButtonElement>('[data-action="play"]');
  const restart = root.querySelector<HTMLButtonElement>('[data-action="restart"]');
  const final = root.querySelector<HTMLButtonElement>('[data-action="finish"]');
  const progress = root.querySelector<HTMLProgressElement>('progress');
  const output = root.querySelector<HTMLOutputElement>('output');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const controls = root.querySelector<HTMLElement>('[data-controls]');
  const variants = root.querySelector<HTMLElement>('[data-variant-controls]');
  const comparison = root.querySelector<HTMLElement>('.motion-demo__comparacao');
  if (!short || !long || !play || !restart || !final || !progress || !output || !status || !controls || !variants || !comparison) return;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)');
  const duration = 6000;
  let animations: Animation[] = [];
  let frame = 0;
  let state: 'ready' | 'playing' | 'paused' | 'finished' = 'ready';
  let interacted = false;
  const setStatus = (text: string): void => { status.textContent = text; };
  const meter = (time: number): void => {
    progress.value = time;
    output.textContent = `${(time / 1000).toFixed(1).replace('.', ',')} s / 6,0 s`;
  };
  const cancel = (): void => {
    cancelAnimationFrame(frame);
    for (const animation of animations) { animation.onfinish = null; animation.cancel(); }
    animations = [];
  };
  const reset = (): void => {
    cancel();
    short.style.transform = 'translateY(0)';
    long.style.transform = 'translateY(0)';
    state = 'ready'; root.dataset.state = state; meter(0);
    play.textContent = mobile.matches ? 'Reproduzir esta versão' : 'Reproduzir comparação';
    setStatus(mobile.matches ? 'Escolha uma versão e pressione Reproduzir para observar o movimento.' : 'A demonstração está pronta.');
  };
  const finish = (): void => {
    cancel();
    short.style.transform = 'translateY(-50%)';
    long.style.transform = 'translateY(-66.666667%)';
    state = 'finished'; root.dataset.state = state; meter(duration);
    play.textContent = media.matches ? 'Ver comparação sem movimento' : 'Reproduzir novamente';
    setStatus(media.matches
      ? 'Movimento reduzido ativado: os estados finais aparecem sem deslocamento. A explicação dos tempos está acima.'
      : mobile.matches
        ? 'A versão chegou ao contato. Selecione a outra versão para comparar o tempo de espera.'
        : 'Ambas chegaram ao contato. A versão direta terminou o movimento em 350 ms; a sequência longa chegou ao destino em 4,7 s.');
  };
  const tick = (): void => {
    if (state !== 'playing') return;
    meter(Math.min(duration, Number(animations[0]?.currentTime || 0)));
    frame = requestAnimationFrame(tick);
  };
  const pause = (message = 'Comparação pausada. Use Continuar para retomar.'): void => {
    if (state !== 'playing') return;
    animations.forEach(animation => animation.pause());
    cancelAnimationFrame(frame);
    state = 'paused'; root.dataset.state = state; play.textContent = 'Continuar';
    setStatus(message);
  };
  const start = (): void => {
    interacted = true;
    if (media.matches) { finish(); return; }
    if (state === 'playing') { pause(); return; }
    if (state === 'paused') animations.forEach(animation => animation.play());
    else {
      reset();
      const options: KeyframeAnimationOptions = { duration, fill: 'both', easing: 'linear' };
      animations = [
        short.animate([
          { transform: 'translateY(0)', offset: 0 },
          { transform: 'translateY(0)', offset: .2 / 6, easing: 'cubic-bezier(.16,1,.3,1)' },
          { transform: 'translateY(-50%)', offset: .55 / 6 },
          { transform: 'translateY(-50%)', offset: 1 },
        ], options),
        long.animate([
          { transform: 'translateY(0)', offset: 0 },
          { transform: 'translateY(0)', offset: .2 / 6, easing: 'ease-in-out' },
          { transform: 'translateY(-33.333333%)', offset: 2 / 6 },
          { transform: 'translateY(-33.333333%)', offset: 2.7 / 6, easing: 'ease-in-out' },
          { transform: 'translateY(-66.666667%)', offset: 4.7 / 6 },
          { transform: 'translateY(-66.666667%)', offset: 1 },
        ], options),
      ];
      animations[0]!.onfinish = finish;
    }
    state = 'playing'; root.dataset.state = state; play.textContent = 'Pausar';
    setStatus(mobile.matches
      ? (root.dataset.variant === 'curta' ? 'Transição direta em reprodução: observe como o contato aparece rapidamente.' : 'Sequência demorada em reprodução: observe a etapa intermediária antes do contato.')
      : 'Comparação em reprodução. A versão direta chega primeiro; observe a etapa intermediária da outra versão.');
    tick();
  };
  play.addEventListener('click', start);
  restart.addEventListener('click', () => { reset(); start(); });
  final.addEventListener('click', () => { interacted = true; finish(); });
  root.querySelectorAll<HTMLInputElement>('[name="versao-animacao"]').forEach(input => {
    input.addEventListener('change', () => {
      interacted = true; root.dataset.variant = input.value;
      if (media.matches) finish(); else reset();
    });
  });
  mobile.addEventListener('change', () => { if (media.matches) finish(); else reset(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause('Comparação pausada enquanto esta aba estava oculta.'); });
  media.addEventListener('change', () => { if (media.matches) finish(); else reset(); });
  controls.hidden = false; variants.hidden = false; root.dataset.variant = 'curta';
  if (media.matches) finish(); else reset();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const entry = entries[0];
      const inView = entry?.isIntersecting && entry.intersectionRatio >= .75;
      if (!inView) pause('Comparação pausada fora da área visível. Use Continuar para retomar.');
      else if (!mobile.matches && !interacted && !media.matches && !document.hidden) start();
    }, { threshold: [0, .75] }).observe(comparison);
  };
}

aoDOMPronto(iniciar);
