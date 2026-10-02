import { aoDOMPronto, iniciarAno, iniciarMenu } from './comum';
import { iniciarEscalas, iniciarJornada, iniciarLuz, iniciarTerminal } from './composicoes';
import { iniciarEstudos } from './estudos';
import { iniciarFormulario } from './formulario';
import { iniciarOrbita, iniciarPreferencias } from './movimento';
import { iniciarVisualizador } from './visualizador';

/** Entrada exclusiva da home, processada como módulo pelo Astro. */
function iniciar(): void {
  iniciarPreferencias();
  iniciarOrbita();
  iniciarEscalas();
  iniciarEstudos();
  iniciarLuz();
  iniciarJornada();
  iniciarTerminal();
  iniciarMenu();
  iniciarFormulario();
  iniciarVisualizador();
  iniciarAno();
}

aoDOMPronto(iniciar);
