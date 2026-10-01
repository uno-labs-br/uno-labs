# Restauração da órbita e conferência das cores

Pedido de Urias em 01/10/2026. Continuação de `feat/adapt-contato`, PR #4, a partir de `044ed3d`. O checkout estava limpo, o remoto era o oficial e `git fetch origin` não trouxe commits à frente dessa branch. Fonte: `04 - SITE/public/index.html`, servida estaticamente em `127.0.0.1:8790`, a partir de `public/`. Não houve mensagem externa ou publicação.

## O que foi constatado

A cor dos títulos e rótulos de “O site é o centro” não foi alterada no adapt: é Pine `#0E2B24`. Apoio e legenda usam `#355048`, “Site” usa Off White `#F3F7F3` e “sob medida” usa Mint2 `#A7E5C5`. A comparação no navegador usou o mesmo HTML, carregando primeiro o CSS do checkpoint anterior `15cd947` e depois o CSS atual. Sete elementos tiveram cor, família e peso idênticos. Nenhum deles foi substituído por preto `#000000`. O resultado bruto registra os valores computados.

A órbita, a contrarrotação dos rótulos e o pulso verde foram removidos no adapt. No checkpoint, eram `gira 90s linear infinite`, `gira 90s linear infinite reverse` e `pulso 3.2s ease-out infinite`. O pulso é uma borda circular Mint que cresce até 2,8 vezes e desaparece; não era um feixe radial giratório. Esses mesmos efeitos, curvas e tempos foram restaurados.

## Justificativa e correção da decisão anterior

O pedido de adapt exigia controlar animações automáticas prolongadas, respeitar movimento reduzido e evitar trabalho fora da área visível. Tornar a órbita estática eliminava movimento concorrente com a lista de serviços e o trabalho de animação contínua. Essa era uma forma de atender à exigência, mas não a única.

Não havia benchmark ou falha de desempenho comprovada que justificasse eliminar o efeito aprovado. A remoção também enfraquecia a metáfora visual dos serviços orbitando o site. Portanto, a decisão foi mais ampla do que o necessário. É possível conviver com o comportamento anterior e oferecer controle.

A WCAG 2.2, critério 2.2.2, trata movimento iniciado automaticamente, com mais de cinco segundos e apresentado ao lado de outro conteúdo: deve existir mecanismo de pausa, parada ou ocultação, salvo movimento essencial. A órbita contínua ao lado de texto se enquadra nessa preocupação. O critério não exige apagar a animação. Movimento reduzido também não substitui, para todos os visitantes, um controle de pausa na página.

## Comportamento entregue

- Giro de 90 s e onda de 3,2 s originais, mantendo cores e orientação dos rótulos.
- Botão visível de pausa/retomada, operável por teclado e com altura mínima de 44px. A pausa permanece mesmo após sair/voltar à seção ou mudar a preferência de movimento.
- Animações suspensas quando o desenho sai da área visível ou a aba é ocultada; retomadas quando aplicável, sem sobrepor a escolha de pausa do visitante.
- Com movimento reduzido no carregamento ou durante a sessão: diagrama completo estático, onda desativada e controle “Animação estática”.
- Sem JavaScript ou IntersectionObserver: diagrama estático completo e controles indisponíveis ocultos. A animação só começa depois de o controle e a observação estarem prontos.
- Cache de CSS/JS atualizado para `v=6`. Nenhuma mudança de paleta, Inter, pesos, estudos, formulário ou condições comerciais.

## Verificações

`tests/orbita-browser.cjs`: **30 verificações aprovadas**, nenhum erro JavaScript não tratado. Chromium emulado em 320×568, 360×640, 390×844, 844×390, 768×1024, 1280×720 e 1440×900. Conferidos movimento real de bolinha entre dois instantes, pausa das seis animações, retomada por teclado, suspensão fora da tela, evento de visibilidade simulado, mudança de movimento reduzido, manutenção da pausa escolhida, movimento reduzido no carregamento e ausência de JS.

`npm run verificar`, `node --check public/assets/js/site.js`, `node --check tests/orbita-browser.cjs` e `git diff --check` aprovados. O dry run não publica produção. O ajuste final de cursor do controle desabilitado e a limpeza de espaços no CSS não modificam a coreografia, as cores ou a geometria medidas na rodada.

Os rótulos couberam nas quatro posições amostradas do giro, sem overflow global; o controle conservou tamanho de toque. Isso não constitui gravação integral dos 90 segundos em dispositivos reais. A aba oculta foi verificada por simulação do evento/propriedade de visibilidade, não pela operação de um navegador nativo em segundo plano. Não houve dispositivo físico, benchmark de bateria/GPU ou nova avaliação de notas.

[Resultado bruto](resultado.json), [órbita desktop](orbita-1440.png) e [órbita celular](orbita-390.png). Capturas mostram uma posição do giro; a confirmação de movimento vem dos registros temporais, não de uma imagem estática. As notas e limitações da crítica anterior continuam vinculadas à entrega anterior.

Para reproduzir, servir `public/` em 8790 e executar `node tests/orbita-browser.cjs` com Playwright e Chromium disponíveis. `UNO_PLAYWRIGHT_PATH` permite selecionar o pacote já instalado no runtime; `UNO_ORBIT_QA_URL` e `UNO_ORBIT_QA_OUTPUT` alteram endereço local e pasta de saída. A comparação de cores exige que o checkout contenha o commit `15cd947`.

## Referências oficiais

- [W3C: pausa, parada e ocultação](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- [MDN: preferência por movimento reduzido](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).
- [MDN: animation-play-state](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-play-state): pausa e retomada sem reiniciar a sequência.
