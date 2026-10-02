# Verificações do blog
Data: 02/10/2026. Estado: preparado para revisão humana em PR; sem deploy.

## Executado
- Geração de seis artigos e central por `npm run blog:build`.
- `npm run blog:verify`: HTML, um h1, pt-BR, metadados únicos, canonical, JSON-LD, fontes, FAQ e links relacionados; caminhos locais em href/src/srcset existentes e fragmentos HTML resolvidos.
- Validação repetida sobre a cópia em `05 - BLOG`.
- Navegador Chromium: sete páginas em 1440, 390 e 360 pixels. HTTP 200, imagens carregadas, ausência de overflow do documento, âncoras existentes, um h1, sem erros de página. FAQ aberto por Enter. Um artigo também validado com JavaScript desativado.
- `wrangler deploy --dry-run` com a configuração da branch: 96 arquivos estáticos reconhecidos, Worker empacotado; nenhuma publicação.
- `git diff --check`.
- Trecho do blog na home conferido em 1440px e 390px, com os quatro destinos locais e sem overflow do documento.
- Imagens: 1536×1024 e 768×512, sem recorte ou alteração criativa na otimização. Arquivos maiores entre 66.932 e 130.568 bytes.

## Evidência visual
Capturas em `05 - BLOG/_producao/revisao/final/`: central, artigo de visitas e artigo de formulário, em desktop e celular, além de recortes das tabelas. Todas as imagens foram decodificadas antes das capturas finais. As capturas iniciais em `revisao/` tiveram áreas lazy não carregadas e não devem fundamentar aprovação visual.

O detector estático foi executado uma vez. Reportou valores inconsistentes com estilos computados (h1 de 192px, texto preto em CTA e padding ausente). A leitura do navegador confirmou títulos de 54px/32px nos artigos e 60px/34px na central, texto Mint claro em Pine e padding de 48px/32px nos CTAs. Inter é a tipografia confirmada da marca, mantida. Não se declara ausência de alertas no detector.

## Confirmação dos ajustes da revisão independente
O revisor retornou `pass` para os quatro achados corrigidos em lote: foco visível no CTA escuro, orientação de rolagem móvel associada à tabela, respeito a movimento reduzido e ícones SVG decorativos no FAQ. Essa conclusão abrange esses estados; não representa aprovação integral de acessibilidade.

Capturas e estilos computados em `05 - BLOG/_producao/revisao/correcoes/`: desktop de 1440px e celular de 390px. O teclado deslocou a tabela horizontalmente; Enter abriu o FAQ; Tab mostrou contorno Mint no CTA. Com movimento reduzido, a rolagem computada é `auto`, as transições duram `0s` e as setas não se deslocam. O gerador e o verificador passaram novamente após o lote. A navegação por arquivo local também foi verificada com imagem e fonte carregadas.

## Limitações
Não são testes de produção, homologação de envio de contato, auditoria completa de acessibilidade ou medição de Core Web Vitals em usuários reais. Nenhum dado de Search Console ou histórico de conversão foi usado. O Teste de pesquisa aprimorada e a inspeção das URLs públicas ficam para depois da publicação autorizada.

A autoria nominal e a edição humana exigidas pelas regras do blog ainda precisam ser confirmadas. O autor institucional nesta versão não simula aprovação de membro da equipe.
