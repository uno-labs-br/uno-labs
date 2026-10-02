import { clonarEstudo } from './estudos';

type Formato = 'desk' | 'mob';

function formatoValido(valor: string | undefined): valor is Formato {
  return valor === 'desk' || valor === 'mob';
}

export function iniciarVisualizador(): void {
  const modal = document.getElementById('visualizador');
  if (typeof HTMLDialogElement === 'undefined' || !(modal instanceof HTMLDialogElement) || typeof modal.showModal !== 'function') return;
  const canvas = modal.querySelector<HTMLElement>('.visualizador__canvas');
  const rolagem = modal.querySelector<HTMLElement>('.visualizador__rolagem');
  const titulo = modal.querySelector('h2');
  const decisao = modal.querySelector('[data-decisao]');
  const fechar = modal.querySelector<HTMLButtonElement>('[data-fechar]');
  if (!canvas || !rolagem || !titulo || !decisao || !fechar) return;
  let acionador: HTMLButtonElement | null = null;
  let estudo = '';

  const mostrar = (tipo: Formato): boolean => {
    const fragmento = clonarEstudo(estudo + '-' + tipo);
    if (!fragmento) return false;
    canvas.replaceChildren(fragmento);
    modal.querySelectorAll<HTMLButtonElement>('[data-formato]').forEach((botao) => {
      const selecionado = botao.dataset.formato === tipo;
      botao.setAttribute('aria-pressed', String(selecionado));
      botao.classList.toggle('btn--escuro', selecionado);
      botao.classList.toggle('btn--contorno', !selecionado);
    });
    rolagem.scrollTo(0, 0);
    return true;
  };
  document.querySelectorAll<HTMLButtonElement>('[data-ampliar]').forEach((botao) => {
    botao.hidden = false;
    botao.addEventListener('click', () => {
      const texto = botao.closest('.capitulo__texto');
      const tituloEstudo = texto?.querySelector('h3');
      if (!texto || !tituloEstudo || !botao.dataset.ampliar) return;
      acionador = botao;
      estudo = botao.dataset.ampliar;
      titulo.textContent = tituloEstudo.textContent;
      decisao.textContent = Array.from(texto.querySelectorAll('dd')).map((elemento) => elemento.textContent).join(' ');
      if (!mostrar(window.innerWidth < 700 ? 'mob' : 'desk')) return;
      modal.showModal();
      document.body.style.overflow = 'hidden';
      fechar.focus();
    });
  });
  fechar.addEventListener('click', () => modal.close());
  modal.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Tab') return;
    const controles = Array.from(modal.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]'));
    const primeiro = controles[0];
    const ultimo = controles[controles.length - 1];
    if (!primeiro || !ultimo) return;
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });
  modal.querySelectorAll<HTMLButtonElement>('[data-formato]').forEach((botao) => {
    botao.addEventListener('click', () => {
      if (formatoValido(botao.dataset.formato)) mostrar(botao.dataset.formato);
    });
  });
  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
    canvas.replaceChildren();
    acionador?.focus({ preventScroll: true });
  });
}
