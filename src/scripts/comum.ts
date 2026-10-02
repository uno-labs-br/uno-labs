/** Executa cada inicializador uma vez, depois que o DOM da página está disponível. */
const inicializadores = new Set<() => void>();

export function aoDOMPronto(iniciar: () => void): void {
  if (inicializadores.has(iniciar)) return;
  inicializadores.add(iniciar);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
}

export function iniciarMenu(): void {
  const botao = document.querySelector<HTMLButtonElement>('.menu-botao');
  const menu = document.getElementById('menu-movel');
  if (!botao || !menu) return;

  const definir = (aberto: boolean): void => {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };

  botao.addEventListener('click', () => definir(!menu.classList.contains('aberto')));
  menu.addEventListener('click', (evento) => {
    if (evento.target instanceof Element && evento.target.closest('a')) definir(false);
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
      definir(false);
      botao.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1100) definir(false);
  });
}

export function iniciarAno(): void {
  document.querySelectorAll('[data-ano]').forEach((elemento) => {
    elemento.textContent = String(new Date().getFullYear());
  });
}
