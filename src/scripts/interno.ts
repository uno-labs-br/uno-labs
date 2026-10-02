import { aoDOMPronto, iniciarAno, iniciarMenu } from './comum';

/** Entrada opcional de páginas internas que tenham menu ou [data-ano]. */
function iniciar(): void {
  iniciarMenu();
  iniciarAno();
  document.documentElement.classList.add('js');
}

aoDOMPronto(iniciar);
