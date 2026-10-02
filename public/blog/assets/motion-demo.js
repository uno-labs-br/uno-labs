/* Demonstração local: nenhuma chamada de rede, coleta ou envio de formulário. */
(() => {
  const root = document.querySelector('.motion-demo');
  if (!root || !Element.prototype.animate) return;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)');
  const short = root.querySelector('[data-track="curta"]');
  const long = root.querySelector('[data-track="longa"]');
  const play = root.querySelector('[data-action="play"]');
  const progress = root.querySelector('progress');
  const output = root.querySelector('output');
  const status = root.querySelector('[data-status]');
  const duration = 6000;
  let animations = [];
  let frame = 0;
  let state = 'ready';
  let interacted = false;
  const setStatus = text => { status.textContent = text; };
  function meter(time) {
    progress.value = time;
    output.textContent = (time / 1000).toFixed(1).replace('.', ',') + ' s / 6,0 s';
  }
  function cancel() {
    cancelAnimationFrame(frame);
    for (const animation of animations) { animation.onfinish = null; animation.cancel(); }
    animations = [];
  }
  function reset() {
    cancel();
    short.style.transform = 'translateY(0)';
    long.style.transform = 'translateY(0)';
    state = 'ready'; root.dataset.state = state; meter(0);
    play.textContent = mobile.matches ? 'Reproduzir esta versão' : 'Reproduzir comparação';
    setStatus(mobile.matches ? 'Escolha uma versão e pressione Reproduzir para observar o movimento.' : 'A demonstração está pronta.');
  }
  function finish() {
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
  }
  function tick() {
    if (state !== 'playing') return;
    meter(Math.min(duration, Number(animations[0]?.currentTime || 0)));
    frame = requestAnimationFrame(tick);
  }
  function pause(message = 'Comparação pausada. Use Continuar para retomar.') {
    if (state !== 'playing') return;
    animations.forEach(animation => animation.pause());
    cancelAnimationFrame(frame);
    state = 'paused'; root.dataset.state = state; play.textContent = 'Continuar';
    setStatus(message);
  }
  function start() {
    interacted = true;
    if (media.matches) { finish(); return; }
    if (state === 'playing') { pause(); return; }
    if (state === 'paused') animations.forEach(animation => animation.play());
    else {
      reset();
      const options = { duration, fill: 'both', easing: 'linear' };
      // A versão curta inicia em 0,2 s e move por 0,35 s.
      animations = [
        short.animate([
          { transform: 'translateY(0)', offset: 0 },
          { transform: 'translateY(0)', offset: 0.2 / 6, easing: 'cubic-bezier(.16,1,.3,1)' },
          { transform: 'translateY(-50%)', offset: 0.55 / 6 },
          { transform: 'translateY(-50%)', offset: 1 }
        ], options),
        long.animate([
          { transform: 'translateY(0)', offset: 0 },
          { transform: 'translateY(0)', offset: 0.2 / 6, easing: 'ease-in-out' },
          { transform: 'translateY(-33.333333%)', offset: 2 / 6 },
          { transform: 'translateY(-33.333333%)', offset: 2.7 / 6, easing: 'ease-in-out' },
          { transform: 'translateY(-66.666667%)', offset: 4.7 / 6 },
          { transform: 'translateY(-66.666667%)', offset: 1 }
        ], options)
      ];
      animations[0].onfinish = finish;
    }
    state = 'playing'; root.dataset.state = state; play.textContent = 'Pausar';
    setStatus(mobile.matches
      ? (root.dataset.variant === 'curta' ? 'Transição direta em reprodução: observe como o contato aparece rapidamente.' : 'Sequência demorada em reprodução: observe a etapa intermediária antes do contato.')
      : 'Comparação em reprodução. A versão direta chega primeiro; observe a etapa intermediária da outra versão.');
    tick();
  }
  play.addEventListener('click', start);
  root.querySelector('[data-action="restart"]').addEventListener('click', () => { reset(); start(); });
  root.querySelector('[data-action="finish"]').addEventListener('click', () => { interacted = true; finish(); });
  root.querySelectorAll('[name="versao-animacao"]').forEach(input => {
    input.addEventListener('change', () => {
      interacted = true;
      root.dataset.variant = input.value;
      if (media.matches) finish(); else reset();
    });
  });
  mobile.addEventListener('change', () => { if (media.matches) finish(); else reset(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause('Comparação pausada enquanto esta aba estava oculta.'); });
  media.addEventListener('change', () => { if (media.matches) finish(); else reset(); });
  root.querySelector('[data-controls]').hidden = false;
  root.querySelector('[data-variant-controls]').hidden = false;
  root.dataset.variant = 'curta';
  if (media.matches) finish(); else reset();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .75;
      if (!inView) pause('Comparação pausada fora da área visível. Use Continuar para retomar.');
      else if (!mobile.matches && !interacted && !media.matches && !document.hidden) start();
    }, { threshold: [0, .75] }).observe(root.querySelector('.motion-demo__comparacao'));
  }
})();
