#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

/* ==========================================================================
   UNO Labs — Gerador de HTML Estático do Blog
   Lê docs/blog/articles.json e gera public/blog/index.html e public/blog/<slug>/index.html.
   Compatível com Node.js nativo (sem dependências externas) e funcional via file://.
   ========================================================================== */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Escapa caracteres especiais de HTML para prevenir injeções em campos não autorais.
 * @param {string|number} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Serializa objeto para bloco JSON-LD com caractere < escapado como \u003c
 * para segurança total contra quebra de script no HTML.
 * @param {object} obj
 * @returns {string}
 */
export function serializarJsonLd(obj) {
  return JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');
}

/**
 * Formata data no formato AAAA-MM-DD para texto legível em português.
 * @param {string} dateIso
 * @returns {string}
 */
export function formatarData(dateIso) {
  if (!dateIso) return '';
  const partes = String(dateIso).split('-');
  if (partes.length !== 3) return dateIso;
  const [ano, mes, dia] = partes;
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const mesIdx = parseInt(mes, 10) - 1;
  if (mesIdx >= 0 && mesIdx < 12) {
    return `${parseInt(dia, 10)} de ${meses[mesIdx]} de ${ano}`;
  }
  return `${dia}/${mes}/${ano}`;
}

/**
 * Normaliza o HTML das seções para garantir que qualquer tabela ou div.table-wrap
 * seja focável por teclado (tabindex="0"), tenha role="region" e aria-label obtido do caption.
 * @param {string} html
 * @returns {string}
 */
export function normalizarHtmlSecao(html) {
  if (!html) return '';

  // 1. Processa <div class="...table-wrap..."> existente
  let processado = html.replace(/<div\b([^>]*\bclass=["'][^"']*\btable-wrap\b[^"']*["'][^>]*)>([\s\S]*?)<\/div>/gi, (match, attrs, content) => {
    const captionMatch = content.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i);
    let label = 'Tabela de dados';
    if (captionMatch) {
      label = captionMatch[1].replace(/<[^>]+>/g, '').trim();
    }

    let novosAttrs = attrs;
    if (!/\brole=/i.test(novosAttrs)) novosAttrs += ' role="region"';
    if (!/\btabindex=/i.test(novosAttrs)) novosAttrs += ' tabindex="0"';
    if (!/\baria-label=/i.test(novosAttrs)) novosAttrs += ` aria-label="${escapeHtml(label)}"`;

    return `<div${novosAttrs}>${content}</div>`;
  });

  // 2. Se houver <table> que não esteja contida em div.table-wrap, envolve de forma acessível
  processado = processado.replace(/(<div\b[^>]*\btable-wrap\b[^>]*>[\s\S]*?<\/div>)|(<table\b[\s\S]*?<\/table>)/gi, (match, jaEnvolvido, tabelaSolta) => {
    if (jaEnvolvido) return jaEnvolvido;
    const captionMatch = tabelaSolta.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i);
    let label = 'Tabela de dados';
    if (captionMatch) {
      label = captionMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    return `<div class="table-wrap" role="region" tabindex="0" aria-label="${escapeHtml(label)}">${tabelaSolta}</div>`;
  });

  return processado;
}

/**
 * Valida os campos obrigatórios do schema do artigo, unicidade e regras estritas.
 * @param {object} art
 * @param {number} idx
 * @param {Set<string>} slugsVistos
 */
export function validarArtigo(art, idx, slugsVistos) {
  const prefixo = `Artigo #${idx + 1} (${art?.slug || 'sem slug'})`;
  if (!art || typeof art !== 'object') {
    throw new Error(`${prefixo}: Dados inválidos.`);
  }

  // Validação estrita de slug
  if (!art.slug || typeof art.slug !== 'string' || !SLUG_REGEX.test(art.slug)) {
    throw new Error(`${prefixo}: 'slug' inválido: '${art.slug}'. Deve conter apenas caracteres minúsculos, números e hífens.`);
  }
  if (slugsVistos.has(art.slug)) {
    throw new Error(`${prefixo}: 'slug' duplicado detectado: '${art.slug}'.`);
  }
  slugsVistos.add(art.slug);

  // Validação estrita de dateModified (sem fallback silencioso)
  if (!art.dateModified || typeof art.dateModified !== 'string' || !DATA_REGEX.test(art.dateModified)) {
    throw new Error(`${prefixo}: 'dateModified' ausente ou inválida: '${art.dateModified}'. Esperado formato AAAA-MM-DD.`);
  }

  const obrigatorios = [
    'title', 'seoTitle', 'description', 'category',
    'question', 'summary', 'lede', 'sections'
  ];
  for (const campo of obrigatorios) {
    if (!art[campo]) {
      throw new Error(`${prefixo}: Campo obrigatório ausente: '${campo}'.`);
    }
  }

  if (!Array.isArray(art.lede) || art.lede.length === 0) {
    throw new Error(`${prefixo}: 'lede' deve ser um array não vazio de parágrafos HTML.`);
  }
  if (!Array.isArray(art.sections) || art.sections.length === 0) {
    throw new Error(`${prefixo}: 'sections' deve ser um array não vazio.`);
  }

  const idsSecoes = new Set();
  const idsReservados = new Set([
    'conteudo', 'topo', 'perguntas-frequentes', 'faq-titulo',
    'fontes-referencias', 'fontes-titulo', 'cta-titulo', 'relacionados-titulo'
  ]);

  for (const [sIdx, sec] of art.sections.entries()) {
    if (!sec.id || !sec.title || sec.html === undefined) {
      throw new Error(`${prefixo}: Seção #${sIdx + 1} deve conter 'id', 'title' e 'html'.`);
    }
    if (idsSecoes.has(sec.id)) {
      throw new Error(`${prefixo}: ID de seção duplicado: '${sec.id}'.`);
    }
    if (idsReservados.has(sec.id)) {
      throw new Error(`${prefixo}: ID de seção colide com ID reservado: '${sec.id}'.`);
    }
    idsSecoes.add(sec.id);
  }
}

/**
 * Renderiza o Hub Editorial (index.html).
 * @param {Array<object>} articles
 * @returns {string}
 */
export function renderHubHtml(articles) {
  const primeiroArtigo = articles[0] || {};
  const outrosArtigos = articles.slice(1);

  const itemList = articles.map((art, idx) => ({
    '@type': 'ListItem',
    'position': idx + 1,
    'url': `https://unolabs.com.br/blog/${art.slug}/`,
    'name': art.title,
    'description': art.description
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://unolabs.com.br/#organizacao',
        'name': 'UNO Labs',
        'url': 'https://unolabs.com.br/',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://unolabs.com.br/assets/icons/android-chrome-512x512.png'
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://unolabs.com.br/#site',
        'url': 'https://unolabs.com.br/',
        'name': 'UNO Labs',
        'inLanguage': 'pt-BR',
        'publisher': { '@id': 'https://unolabs.com.br/#organizacao' }
      },
      {
        '@type': 'CollectionPage',
        '@id': 'https://unolabs.com.br/blog/#pagina',
        'url': 'https://unolabs.com.br/blog/',
        'name': 'Blog UNO Labs — Estratégia, Criação de Sites e Conversão',
        'isPartOf': { '@id': 'https://unolabs.com.br/#site' },
        'inLanguage': 'pt-BR',
        'description': 'Artigos práticos sobre criação de sites, SEO local e decisões digitais para empresas de serviços transformarem visitas em contatos reais.'
      },
      {
        '@type': 'ItemList',
        '@id': 'https://unolabs.com.br/blog/#artigos',
        'numberOfItems': articles.length,
        'itemListElement': itemList
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://unolabs.com.br/blog/#breadcrumb',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Início',
            'item': 'https://unolabs.com.br/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Blog',
            'item': 'https://unolabs.com.br/blog/'
          }
        ]
      }
    ]
  };

  const ogImage = primeiroArtigo.slug
    ? `https://unolabs.com.br/blog/${primeiroArtigo.slug}/imagens/capa.webp`
    : 'https://unolabs.com.br/assets/img/og-unolabs.png';

  const outrosArtigosHtml = outrosArtigos.map((art) => {
    const thumbWidth = art.image?.width || 1536;
    const thumbHeight = art.image?.height || 1024;
    return `        <article class="linha-editorial">
          <a class="linha-editorial__link" href="./${art.slug}/index.html">
            <figure class="linha-editorial__figura">
              <img src="./${art.slug}/imagens/capa.webp" srcset="./${art.slug}/imagens/capa-768.webp 768w, ./${art.slug}/imagens/capa.webp 1536w" sizes="(max-width: 768px) 100vw, 280px" alt="${escapeHtml(art.image?.alt || art.title)}" width="${thumbWidth}" height="${thumbHeight}" loading="lazy" decoding="async">
            </figure>
            <div class="linha-editorial__corpo">
              <h3 class="linha-editorial__titulo">${escapeHtml(art.title)}</h3>
              <div class="linha-editorial__meta">
                <span class="linha-editorial__categoria">${escapeHtml(art.category)}</span>
                <span aria-hidden="true">·</span>
                <time datetime="${escapeHtml(art.dateModified)}">${formatarData(art.dateModified)}</time>
              </div>
              <p class="linha-editorial__resumo">${escapeHtml(art.summary || art.description)}</p>
              <span class="linha-editorial__chamada">Ler diagnóstico completo <svg class="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </div>
          </a>
        </article>`;
  }).join('\n');

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog UNO Labs — Estratégia, Criação de Sites e Conversão</title>
<meta name="description" content="Artigos práticos sobre criação de sites, SEO local e decisões digitais para empresas de serviços transformarem visitas em contatos reais.">
<link rel="canonical" href="https://unolabs.com.br/blog/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#F3F7F3">

<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="UNO Labs">
<meta property="og:title" content="Blog UNO Labs — Estratégia, Criação de Sites e Conversão">
<meta property="og:description" content="Artigos práticos sobre criação de sites, SEO local e decisões digitais para empresas de serviços transformarem visitas em contatos reais.">
<meta property="og:url" content="https://unolabs.com.br/blog/">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1536">
<meta property="og:image:height" content="1024">
<meta property="og:image:alt" content="Blog UNO Labs — Estratégia, Criação de Sites e Conversão">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Blog UNO Labs — Estratégia, Criação de Sites e Conversão">
<meta name="twitter:description" content="Artigos práticos sobre criação de sites, SEO local e decisões digitais para empresas de serviços transformarem visitas em contatos reais.">
<meta name="twitter:image" content="${ogImage}">

<link rel="stylesheet" href="./assets/blog.css">

<script type="application/ld+json">
${serializarJsonLd(jsonLd)}
</script>
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>

<header class="topo" role="banner">
  <div class="container topo__in">
    <a class="topo__marca" href="https://unolabs.com.br/" aria-label="UNO Labs — início">
      <img src="./assets/logo.svg" alt="UNO Labs" width="187" height="52">
    </a>
    <nav class="topo__nav" aria-label="Principal">
      <a class="topo__link" href="./index.html" aria-current="page">Blog</a>
      <a class="topo__link" href="https://unolabs.com.br/#servicos">Serviços</a>
      <a class="btn btn--escuro topo__cta" href="https://unolabs.com.br/#contato">Conversar sobre seu projeto <svg class="seta" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
    </nav>
  </div>
</header>

<main id="conteudo" class="hub container">
  <header class="hub__cabecalho">
    <h1 class="hub__titulo">Um site melhor começa com a pergunta certa.</h1>
    <p class="hub__intro">Artigos aprofundados sobre estrutura técnica, clareza editorial e conversão real para empresas de serviços. Decisões pensadas para transformar confiança em contatos qualificados.</p>
  </header>

  <section class="hub__destaque" aria-label="Artigo em destaque">
    <a class="destaque__link" href="./${primeiroArtigo.slug}/index.html">
      <div class="destaque__corpo">
        <h2 class="destaque__titulo">${escapeHtml(primeiroArtigo.title)}</h2>
        <div class="destaque__meta">
          <span class="destaque__categoria">${escapeHtml(primeiroArtigo.category)}</span>
          <span aria-hidden="true">·</span>
          <time datetime="${escapeHtml(primeiroArtigo.dateModified)}">${formatarData(primeiroArtigo.dateModified)}</time>
        </div>
        <p class="destaque__resumo">${escapeHtml(primeiroArtigo.summary || primeiroArtigo.description)}</p>
        <span class="destaque__chamada">Ler diagnóstico em destaque <svg class="seta" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </div>
      <figure class="destaque__figura">
        <img src="./${primeiroArtigo.slug}/imagens/capa.webp" srcset="./${primeiroArtigo.slug}/imagens/capa-768.webp 768w, ./${primeiroArtigo.slug}/imagens/capa.webp 1536w" sizes="(max-width: 900px) 100vw, 560px" alt="${escapeHtml(primeiroArtigo.image?.alt || primeiroArtigo.title)}" width="${primeiroArtigo.image?.width || 1536}" height="${primeiroArtigo.image?.height || 1024}" fetchpriority="high" loading="eager">
      </figure>
    </a>
  </section>

  <section class="hub__secao-linhas" aria-labelledby="linhas-titulo">
    <h2 id="linhas-titulo" class="hub__secao-titulo">Diagnósticos e decisões técnicas</h2>
    <div class="hub__linhas">
${outrosArtigosHtml}
    </div>
  </section>
</main>

<footer class="rodape" role="contentinfo">
  <div class="container">
    <div class="rodape__grade">
      <div class="rodape__marca">
        <a href="https://unolabs.com.br/" aria-label="UNO Labs — início">
          <img src="./assets/logo.svg" alt="UNO Labs" width="187" height="52" loading="lazy">
        </a>
        <p>Presença digital que gera oportunidades.</p>
      </div>
      <div class="rodape__col">
        <span class="rodape__tit">Navegação</span>
        <a href="./index.html">Blog editorial</a>
        <a href="https://unolabs.com.br/#servicos">Criação de sites e serviços</a>
        <a href="https://unolabs.com.br/#contato">Conversar sobre seu projeto</a>
      </div>
      <div class="rodape__col">
        <span class="rodape__tit">Atendimento</span>
        <span>Vitória · Vila Velha · Serra · Cariacica (ES)</span>
        <span>Curitiba (PR)</span>
        <span>Todo o Brasil, de forma remota</span>
      </div>
    </div>
    <div class="rodape__base">
      <span>© 2026 UNO Labs · unolabs.com.br</span>
      <a href="https://unolabs.com.br/politica-de-privacidade/">Política de privacidade</a>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

/**
 * Renderiza uma Página de Artigo individual (<slug>/index.html).
 * @param {object} artigo
 * @param {Array<object>} allArticles
 * @returns {string}
 */
export function renderArtigoHtml(artigo, allArticles) {
  const articlesMap = Object.fromEntries(allArticles.map(a => [a.slug, a]));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://unolabs.com.br/#organizacao',
        'name': 'UNO Labs',
        'url': 'https://unolabs.com.br/',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://unolabs.com.br/assets/icons/android-chrome-512x512.png'
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://unolabs.com.br/#site',
        'url': 'https://unolabs.com.br/',
        'name': 'UNO Labs',
        'inLanguage': 'pt-BR',
        'publisher': { '@id': 'https://unolabs.com.br/#organizacao' }
      },
      {
        '@type': 'BlogPosting',
        '@id': `https://unolabs.com.br/blog/${artigo.slug}/#artigo`,
        'isPartOf': { '@id': 'https://unolabs.com.br/#site' },
        'headline': artigo.seoTitle || artigo.title,
        'description': artigo.description,
        'inLanguage': 'pt-BR',
        'mainEntityOfPage': `https://unolabs.com.br/blog/${artigo.slug}/`,
        'url': `https://unolabs.com.br/blog/${artigo.slug}/`,
        'dateModified': artigo.dateModified,
        'image': `https://unolabs.com.br/blog/${artigo.slug}/imagens/capa.webp`,
        'author': {
          '@type': 'Organization',
          'name': 'UNO Labs',
          'url': 'https://unolabs.com.br/#organizacao'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'UNO Labs',
          'url': 'https://unolabs.com.br/#organizacao',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://unolabs.com.br/assets/icons/android-chrome-512x512.png'
          }
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://unolabs.com.br/blog/${artigo.slug}/#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Início',
            'item': 'https://unolabs.com.br/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Blog',
            'item': 'https://unolabs.com.br/blog/'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': artigo.title,
            'item': `https://unolabs.com.br/blog/${artigo.slug}/`
          }
        ]
      }
    ]
  };

  // Sumário ancorado
  const itensSumario = artigo.sections.map(sec => (
    `          <li><a href="#${sec.id}">${escapeHtml(sec.title)}</a></li>`
  ));
  if (artigo.faq && artigo.faq.length > 0) {
    itensSumario.push('          <li><a href="#perguntas-frequentes">Perguntas frequentes</a></li>');
  }
  if (artigo.sources && artigo.sources.length > 0) {
    itensSumario.push('          <li><a href="#fontes-referencias">Fontes e referências</a></li>');
  }
  if (artigo.related && artigo.related.length > 0) {
    itensSumario.push('          <li><a href="#relacionados-titulo">Próximos guias</a></li>');
  }

  // Parágrafos de lede (confiáveis)
  const ledeHtml = artigo.lede.map(paragrafo => (
    `<p class="artigo__lead">${paragrafo}</p>`
  )).join('\n');

  // Seções (normaliza table-wrap acessível e preserva html autoral)
  const secoesHtml = artigo.sections.map(sec => `
        <section id="${sec.id}" class="artigo__secao">
          <h2>${escapeHtml(sec.title)}</h2>
          ${normalizarHtmlSecao(sec.html)}
        </section>`
  ).join('\n');

  // FAQ
  let faqHtml = '';
  if (artigo.faq && artigo.faq.length > 0) {
    const faqItens = artigo.faq.map(item => `
          <details class="faq__item">
            <summary class="faq__pergunta">${escapeHtml(item.q)}</summary>
            <div class="faq__resposta">
              <p>${escapeHtml(item.a)}</p>
            </div>
          </details>`
    ).join('\n');

    faqHtml = `
        <section id="perguntas-frequentes" class="artigo__faq" aria-labelledby="faq-titulo">
          <h2 id="faq-titulo">Perguntas frequentes</h2>
${faqItens}
        </section>`;
  }

  // Fontes
  let fontesHtml = '';
  if (artigo.sources && artigo.sources.length > 0) {
    const fontesItens = artigo.sources.map(src => (
      `            <li><a href="${escapeHtml(src.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(src.title)}</a></li>`
    )).join('\n');

    fontesHtml = `
        <section id="fontes-referencias" class="artigo__fontes" aria-labelledby="fontes-titulo">
          <h2 id="fontes-titulo">Fontes e referências</h2>
          <ul>
${fontesItens}
          </ul>
        </section>`;
  }

  // CTA institucional sem promessas inventadas
  const ctaTitle = artigo.cta?.title || 'Quer conversar sobre o próximo passo do seu site?';
  const ctaText = artigo.cta?.text || 'Converse sobre seu projeto com a UNO Labs e conheça nossas soluções em sites, SEO e anúncios.';
  const ctaLabel = artigo.cta?.label || 'Conversar sobre meu projeto';

  // Artigos Relacionados
  let relacionadosHtml = '';
  if (artigo.related && artigo.related.length > 0) {
    const cardsRel = artigo.related.map(relSlug => {
      const relArt = articlesMap[relSlug];
      if (!relArt) return '';
      return `        <article class="card-relacionado">
          <a class="card-relacionado__link" href="../${relSlug}/index.html">
            <figure class="card-relacionado__figura">
              <img src="../${relSlug}/imagens/capa.webp" srcset="../${relSlug}/imagens/capa-768.webp 768w, ../${relSlug}/imagens/capa.webp 1536w" sizes="(max-width: 640px) 100vw, 420px" alt="${escapeHtml(relArt.image?.alt || relArt.title)}" width="${relArt.image?.width || 1536}" height="${relArt.image?.height || 1024}" loading="lazy" decoding="async">
            </figure>
            <div class="card-relacionado__corpo">
              <h3 class="card-relacionado__titulo">${escapeHtml(relArt.title)}</h3>
              <div class="card-relacionado__meta">
                <span class="card-relacionado__categoria">${escapeHtml(relArt.category)}</span>
              </div>
              <span class="card-relacionado__chamada">Ler diagnóstico <svg class="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </div>
          </a>
        </article>`;
    }).filter(Boolean).join('\n');

    if (cardsRel) {
      relacionadosHtml = `
        <section class="artigo__relacionados" aria-labelledby="relacionados-titulo">
          <h2 id="relacionados-titulo">Próximos guias recomendados</h2>
          <div class="relacionados__grade">
${cardsRel}
          </div>
        </section>`;
    }
  }

  const imgWidth = artigo.image?.width || 1536;
  const imgHeight = artigo.image?.height || 1024;
  const imgAlt = escapeHtml(artigo.image?.alt || artigo.title);

  // Evita duplicar menção a IA se a legenda já contiver
  const rawCaption = artigo.image?.caption || '';
  const jaTemIa = /ilustra[cç][aã]o conceitual gerada por ia/i.test(rawCaption);
  const imgCaption = jaTemIa
    ? escapeHtml(rawCaption)
    : (rawCaption ? `${escapeHtml(rawCaption)} · Ilustração conceitual gerada por IA` : 'Ilustração conceitual gerada por IA');

  const autorNome = escapeHtml(artigo.author || 'UNO Labs');
  const dataModificada = escapeHtml(artigo.dateModified);
  const dataFormatada = formatarData(dataModificada);

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(artigo.seoTitle || artigo.title)} | UNO Labs</title>
<meta name="description" content="${escapeHtml(artigo.description)}">
<link rel="canonical" href="https://unolabs.com.br/blog/${artigo.slug}/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#F3F7F3">

<meta property="og:type" content="article">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="UNO Labs">
<meta property="og:title" content="${escapeHtml(artigo.seoTitle || artigo.title)} | UNO Labs">
<meta property="og:description" content="${escapeHtml(artigo.description)}">
<meta property="og:url" content="https://unolabs.com.br/blog/${artigo.slug}/">
<meta property="og:image" content="https://unolabs.com.br/blog/${artigo.slug}/imagens/capa.webp">
<meta property="og:image:width" content="${imgWidth}">
<meta property="og:image:height" content="${imgHeight}">
<meta property="og:image:alt" content="${imgAlt}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(artigo.seoTitle || artigo.title)} | UNO Labs">
<meta name="twitter:description" content="${escapeHtml(artigo.description)}">
<meta name="twitter:image" content="https://unolabs.com.br/blog/${artigo.slug}/imagens/capa.webp">

<link rel="stylesheet" href="../assets/blog.css">

<script type="application/ld+json">
${serializarJsonLd(jsonLd)}
</script>
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>

<header class="topo" role="banner">
  <div class="container topo__in">
    <a class="topo__marca" href="https://unolabs.com.br/" aria-label="UNO Labs — início">
      <img src="../assets/logo.svg" alt="UNO Labs" width="187" height="52">
    </a>
    <nav class="topo__nav" aria-label="Principal">
      <a class="topo__link" href="../index.html">Blog</a>
      <a class="topo__link" href="https://unolabs.com.br/#servicos">Serviços</a>
      <a class="btn btn--escuro topo__cta" href="https://unolabs.com.br/#contato">Conversar sobre seu projeto <svg class="seta" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
    </nav>
  </div>
</header>

<main id="conteudo" class="artigo-pagina container">
  <nav class="breadcrumb" aria-label="Você está em">
    <ol>
      <li><a href="https://unolabs.com.br/">Início</a></li>
      <li><a href="../index.html">Blog</a></li>
      <li aria-current="page">${escapeHtml(artigo.title)}</li>
    </ol>
  </nav>

  <header class="artigo__cabecalho">
    <h1 class="artigo__titulo">${escapeHtml(artigo.title)}</h1>
    <div class="artigo__meta">
      <span class="artigo__categoria">${escapeHtml(artigo.category)}</span>
      <span aria-hidden="true">·</span>
      <span class="artigo__autor">Por <strong>${autorNome}</strong></span>
      <span aria-hidden="true">·</span>
      <span class="artigo__data">Data da versão: <time datetime="${dataModificada}">${dataFormatada}</time></span>
    </div>

    <aside class="artigo__resumo-bloco" aria-label="Resposta direta e resumo">
      <p class="artigo__pergunta"><strong>${escapeHtml(artigo.question)}</strong></p>
      <p class="artigo__resposta">${escapeHtml(artigo.summary)}</p>
    </aside>

    <figure class="artigo__hero-figura">
      <img src="./imagens/capa.webp" srcset="./imagens/capa-768.webp 768w, ./imagens/capa.webp 1536w" sizes="(max-width: 900px) 100vw, 900px" alt="${imgAlt}" width="${imgWidth}" height="${imgHeight}" fetchpriority="high" loading="eager">
      <figcaption>${imgCaption}</figcaption>
    </figure>
  </header>

  <div class="artigo__layout">
    <aside class="artigo__sumario" aria-label="Índice do artigo">
      <nav class="sumario__nav">
        <p class="sumario__titulo">Neste guia</p>
        <ol>
${itensSumario.join('\n')}
        </ol>
      </nav>
    </aside>

    <div class="artigo__corpo">
${ledeHtml}
${secoesHtml}
${faqHtml}
${fontesHtml}

      <section class="artigo__cta" aria-labelledby="cta-titulo">
        <h2 id="cta-titulo">${escapeHtml(ctaTitle)}</h2>
        <p>${escapeHtml(ctaText)}</p>
        <a class="btn btn--mint" href="https://unolabs.com.br/#contato">${escapeHtml(ctaLabel)} <svg class="seta" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      </section>

${relacionadosHtml}
    </div>
  </div>
</main>

<footer class="rodape" role="contentinfo">
  <div class="container">
    <div class="rodape__grade">
      <div class="rodape__marca">
        <a href="https://unolabs.com.br/" aria-label="UNO Labs — início">
          <img src="../assets/logo.svg" alt="UNO Labs" width="187" height="52" loading="lazy">
        </a>
        <p>Presença digital que gera oportunidades.</p>
      </div>
      <div class="rodape__col">
        <span class="rodape__tit">Navegação</span>
        <a href="../index.html">Blog editorial</a>
        <a href="https://unolabs.com.br/#servicos">Criação de sites e serviços</a>
        <a href="https://unolabs.com.br/#contato">Conversar sobre seu projeto</a>
      </div>
      <div class="rodape__col">
        <span class="rodape__tit">Atendimento</span>
        <span>Vitória · Vila Velha · Serra · Cariacica (ES)</span>
        <span>Curitiba (PR)</span>
        <span>Todo o Brasil, de forma remota</span>
      </div>
    </div>
    <div class="rodape__base">
      <span>© 2026 UNO Labs · unolabs.com.br</span>
      <a href="https://unolabs.com.br/politica-de-privacidade/">Política de privacidade</a>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

/**
 * Função principal de build do blog.
 */
export async function buildBlog({ articlesPath, outputDir, dryRun = false } = {}) {
  const rootDir = process.cwd();
  const jsonPath = articlesPath ? resolve(rootDir, articlesPath) : resolve(rootDir, 'docs/blog/articles.json');
  const targetDir = outputDir ? resolve(rootDir, outputDir) : resolve(rootDir, 'public/blog');

  if (!existsSync(jsonPath)) {
    console.log(`[blog:build] Arquivo de dados '${jsonPath}' não encontrado.`);
    console.log('[blog:build] Aguardando fornecimento de docs/blog/articles.json pelo orquestrador.');
    return { success: false, reason: 'missing_data' };
  }

  let rawData;
  try {
    rawData = readFileSync(jsonPath, 'utf8');
  } catch (err) {
    throw new Error(`[blog:build] Erro ao ler arquivo '${jsonPath}': ${err.message}`);
  }

  let articles;
  try {
    articles = JSON.parse(rawData);
  } catch (err) {
    throw new Error(`[blog:build] JSON inválido em '${jsonPath}': ${err.message}`);
  }

  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error(`[blog:build] O arquivo '${jsonPath}' deve conter um array não vazio de artigos.`);
  }

  // Validação estrita do schema de cada artigo
  const slugsVistos = new Set();
  for (const [idx, art] of articles.entries()) {
    validarArtigo(art, idx, slugsVistos);
  }

  if (dryRun) {
    console.log(`[blog:build] Validação de schema concluída com sucesso para ${articles.length} artigos (dry-run).`);
    return { success: true, count: articles.length };
  }

  mkdirSync(targetDir, { recursive: true });

  // 1. Gerar Hub (index.html)
  const hubHtml = renderHubHtml(articles);
  const hubOutPath = join(targetDir, 'index.html');
  writeFileSync(hubOutPath, hubHtml, 'utf8');
  console.log(`[blog:build] Hub gerado: ${hubOutPath}`);

  // 2. Gerar cada página de artigo (<slug>/index.html)
  for (const artigo of articles) {
    const artDir = join(targetDir, artigo.slug);
    mkdirSync(artDir, { recursive: true });
    const artHtml = renderArtigoHtml(artigo, articles);
    const artOutPath = join(artDir, 'index.html');
    writeFileSync(artOutPath, artHtml, 'utf8');
    console.log(`[blog:build] Artigo gerado: ${artOutPath}`);
  }

  console.log(`[blog:build] Build estático concluído com sucesso: ${articles.length} artigos + hub gerados.`);
  return { success: true, count: articles.length };
}

// Execução direta via CLI
const isDirectCall = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isDirectCall) {
  const { values } = parseArgs({
    options: {
      articles: { type: 'string', short: 'a' },
      output: { type: 'string', short: 'o' },
      dryRun: { type: 'boolean', default: false }
    },
    strict: false
  });

  try {
    const res = await buildBlog({
      articlesPath: values.articles,
      outputDir: values.output,
      dryRun: values.dryRun
    });
    if (res.reason === 'missing_data') {
      process.exit(0);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
