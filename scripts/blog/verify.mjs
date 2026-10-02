#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import assert from 'node:assert/strict';

/* ==========================================================================
   UNO Labs — Validador Editorial e Estrutural do Blog
   Valida hub + artigos gerados: metadados únicos, JSON-LD, acessibilidade,
   resolução de links e âncoras, dimensões de imagens e integridade editorial.
   Compatível com Node.js nativo sem dependências externas.
   ========================================================================== */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Utilitários de extração e parsing leve de HTML via regex restrito.
 */
export const htmlUtils = {
  getLang(html) {
    const match = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
    return match ? match[1] : null;
  },

  getTitle(html) {
    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return match ? match[1].trim() : null;
  },

  getCanonical(html) {
    const match = html.match(/<link[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i) ||
                  html.match(/<link[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["']/i);
    return match ? match[1] : null;
  },

  getMetaDescription(html) {
    const match = html.match(/<meta[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]*\bcontent=["']([^"']+)["'][^>]*\bname=["']description["']/i);
    return match ? match[1] : null;
  },

  getMetaProperty(html, property) {
    const p = property.replace(':', '\\:');
    const match = html.match(new RegExp(`<meta[^>]*\\bproperty=["']${p}["'][^>]*\\bcontent=["']([^"']+)["']`, 'i')) ||
                  html.match(new RegExp(`<meta[^>]*\\bcontent=["']([^"']+)["'][^>]*\\bproperty=["']${p}["']`, 'i'));
    return match ? match[1] : null;
  },

  getMetaName(html, name) {
    const n = name.replace(':', '\\:');
    const match = html.match(new RegExp(`<meta[^>]*\\bname=["']${n}["'][^>]*\\bcontent=["']([^"']+)["']`, 'i')) ||
                  html.match(new RegExp(`<meta[^>]*\\bcontent=["']([^"']+)["'][^>]*\\bname=["']${n}["']`, 'i'));
    return match ? match[1] : null;
  },

  getAllH1s(html) {
    const matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    return matches.map(m => m.replace(/<[^>]+>/g, '').trim());
  },

  getJsonLdScripts(html) {
    const regex = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const scripts = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      scripts.push(match[1]);
    }
    return scripts;
  },

  getAllScriptsNonJsonLd(html) {
    const regex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    const scripts = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      const attrs = match[1];
      if (!/type=["']application\/ld\+json["']/i.test(attrs)) {
        scripts.push(match[0]);
      }
    }
    return scripts;
  },

  getAllImages(html) {
    const regex = /<img\b([^>]*)>/gi;
    const images = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      const tag = match[0];
      const attrs = match[1];
      const src = attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1];
      const alt = attrs.match(/\balt=["']([^"']*)["']/i)?.[1];
      const width = attrs.match(/\bwidth=["']([^"']+)["']/i)?.[1];
      const height = attrs.match(/\bheight=["']([^"']+)["']/i)?.[1];
      const srcset = attrs.match(/\bsrcset=["']([^"']+)["']/i)?.[1];
      const sizes = attrs.match(/\bsizes=["']([^"']+)["']/i)?.[1];
      const loading = attrs.match(/\bloading=["']([^"']+)["']/i)?.[1];
      const fetchpriority = attrs.match(/\bfetchpriority=["']([^"']+)["']/i)?.[1];
      images.push({ tag, src, alt, width, height, srcset, sizes, loading, fetchpriority });
    }
    return images;
  },

  getAllIds(html) {
    const regex = /\bid=["']([^"']+)["']/gi;
    const ids = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
      ids.add(match[1]);
    }
    return ids;
  },

  getAllAnchorHrefs(html) {
    const regex = /<a\b[^>]*\bhref=["']([^"']+)["']/gi;
    const hrefs = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      hrefs.push(match[1]);
    }
    return hrefs;
  }
};

/**
 * Validador principal do blog.
 */
export async function verifyBlog({ articlesPath, blogDir } = {}) {
  const rootDir = process.cwd();
  const targetArticlesPath = articlesPath ? resolve(rootDir, articlesPath) : resolve(rootDir, 'docs/blog/articles.json');
  const targetBlogDir = blogDir ? resolve(rootDir, blogDir) : resolve(rootDir, 'public/blog');

  console.log(`[blog:verify] Verificando dados em: ${targetArticlesPath}`);
  console.log(`[blog:verify] Verificando HTML em: ${targetBlogDir}`);

  // 1. Verificação de dados ausentes -> Deve dar exit 1 conforme especificado
  const articlesExist = existsSync(targetArticlesPath);
  const hubHtmlPath = join(targetBlogDir, 'index.html');
  const hubExists = existsSync(hubHtmlPath);

  if (!articlesExist || !hubExists) {
    console.error('[blog:verify] Erro: Dados ausentes detectados.');
    if (!articlesExist) {
      console.error(`  - Arquivo de artigos não encontrado: ${targetArticlesPath}`);
    }
    if (!hubExists) {
      console.error(`  - Hub gerado não encontrado: ${hubHtmlPath}`);
    }
    console.error('[blog:verify] Execute scripts/blog/build.mjs após o fornecimento de docs/blog/articles.json pelo orquestrador.');
    return { success: false, reason: 'missing_data', verified: 0 };
  }

  // 2. Carrega artigos
  const rawArticles = readFileSync(targetArticlesPath, 'utf8');
  const articles = JSON.parse(rawArticles);
  assert.ok(Array.isArray(articles), 'articles.json deve conter um array de artigos');
  assert.ok(articles.length >= 1, 'articles.json deve conter pelo menos 1 artigo');
  if (articles.length < 6) {
    console.warn(`[blog:verify] Aviso: artigos fornecidos: ${articles.length} (esperado 6 em produção)`);
  }

  // Validação estrita dos artigos no JSON
  const validSlugs = new Set();
  for (const [idx, art] of articles.entries()) {
    assert.ok(art.slug && SLUG_REGEX.test(art.slug), `Artigo #${idx + 1}: slug '${art.slug}' inválido. Deve ser minúsculo com hífens.`);
    assert.ok(!validSlugs.has(art.slug), `Artigo #${idx + 1}: slug '${art.slug}' duplicado.`);
    validSlugs.add(art.slug);

    assert.ok(art.dateModified && DATA_REGEX.test(art.dateModified), `Artigo #${idx + 1} (${art.slug}): dateModified ausente ou inválida (formato AAAA-MM-DD exigido).`);

    assert.ok(Array.isArray(art.sections) && art.sections.length > 0, `Artigo #${idx + 1} (${art.slug}): sections deve ser array não vazio.`);
    const secIds = new Set();
    for (const sec of art.sections) {
      assert.ok(sec.id && typeof sec.id === 'string', `Artigo #${idx + 1} (${art.slug}): seção sem id válido.`);
      assert.ok(!secIds.has(sec.id), `Artigo #${idx + 1} (${art.slug}): id de seção duplicado '${sec.id}'.`);
      secIds.add(sec.id);
    }
  }

  const titlesSeen = new Map();
  const canonicalsSeen = new Map();
  const descriptionsSeen = new Map();
  const ogTitlesSeen = new Map();
  const ogUrlsSeen = new Map();

  // 3. Validação do Hub (public/blog/index.html)
  console.log('[blog:verify] Validando Hub (public/blog/index.html)...');
  const hubHtml = readFileSync(hubHtmlPath, 'utf8');

  // Lang pt-BR
  assert.equal(htmlUtils.getLang(hubHtml), 'pt-BR', 'Hub deve ter lang="pt-BR"');

  // H1 único
  const hubH1s = htmlUtils.getAllH1s(hubHtml);
  assert.equal(hubH1s.length, 1, `Hub deve ter exatamente um <h1>. Encontrados: ${hubH1s.length}`);
  assert.match(hubH1s[0], /Um site melhor começa com a pergunta certa/i, 'H1 do Hub deve ter o título editorial');

  // Kicker decorativo não permitido no hub
  assert.doesNotMatch(hubHtml, /<p[^>]*class=["'][^"']*hub__rotulo[^"']*["']/i, 'Hub não deve conter kicker decorativo (.hub__rotulo)');
  assert.doesNotMatch(hubHtml, /Visão editorial/i, 'Hub não deve conter kicker "Visão editorial"');

  // Skip-link
  const hubIds = htmlUtils.getAllIds(hubHtml);
  assert.ok(hubIds.has('conteudo'), 'Hub deve conter elemento com id="conteudo" para o skip-link');
  const hubHrefs = htmlUtils.getAllAnchorHrefs(hubHtml);
  assert.ok(hubHrefs.includes('#conteudo'), 'Hub deve conter link para #conteudo');

  // Logo aponta para https://unolabs.com.br/
  assert.match(hubHtml, /<a[^>]*class=["'][^"']*topo__marca[^"']*["'][^>]*href=["']https:\/\/unolabs\.com\.br\/["']/i, 'Logo do Hub deve apontar para https://unolabs.com.br/');

  // Assinatura e atendimento no rodapé
  assert.match(hubHtml, /Presença digital que gera oportunidades\./i, 'Hub deve usar assinatura confirmada no rodapé');
  assert.match(hubHtml, /Vitória · Vila Velha · Serra · Cariacica \(ES\)/i, 'Hub deve conter atendimento no rodapé');

  // Sem JS não autorizado
  const hubNonJsonScripts = htmlUtils.getAllScriptsNonJsonLd(hubHtml);
  assert.equal(hubNonJsonScripts.length, 0, 'Hub não deve conter tags <script> de JavaScript');

  // Ausência de placeholders
  assert.doesNotMatch(hubHtml, /lorem\s+ipsum/i, 'Hub não deve conter texto placeholder lorem ipsum');
  assert.doesNotMatch(hubHtml, /\[TODO\]/i, 'Hub não deve conter marcadores [TODO]');
  assert.doesNotMatch(hubHtml, /\bundefined\b|\bNaN\b/, 'Hub não deve conter valores indefinidos');

  // Metadados do Hub
  const hubTitle = htmlUtils.getTitle(hubHtml);
  assert.ok(hubTitle, 'Hub deve conter <title>');
  titlesSeen.set(hubTitle, 'hub');

  const hubCanonical = htmlUtils.getCanonical(hubHtml);
  assert.equal(hubCanonical, 'https://unolabs.com.br/blog/', 'Canonical do Hub incorreto');
  canonicalsSeen.set(hubCanonical, 'hub');

  const hubDesc = htmlUtils.getMetaDescription(hubHtml);
  assert.ok(hubDesc, 'Hub deve conter meta description');
  descriptionsSeen.set(hubDesc, 'hub');

  const hubOgTitle = htmlUtils.getMetaProperty(hubHtml, 'og:title');
  assert.ok(hubOgTitle, 'Hub deve conter og:title');
  ogTitlesSeen.set(hubOgTitle, 'hub');

  const hubOgUrl = htmlUtils.getMetaProperty(hubHtml, 'og:url');
  assert.equal(hubOgUrl, 'https://unolabs.com.br/blog/', 'Hub og:url incorreto');
  ogUrlsSeen.set(hubOgUrl, 'hub');

  // JSON-LD do Hub com escape seguro
  const hubJsonLdList = htmlUtils.getJsonLdScripts(hubHtml);
  assert.ok(hubJsonLdList.length >= 1, 'Hub deve conter bloco JSON-LD');
  for (const rawJson of hubJsonLdList) {
    assert.ok(!rawJson.includes('</script>'), 'JSON-LD do Hub não deve conter tag de fechamento </script>');
    const data = JSON.parse(rawJson);
    const graph = data['@graph'] || [data];
    const types = graph.map(item => item['@type']);
    if (types.includes('CollectionPage') && types.includes('ItemList')) {
      const itemList = graph.find(i => i['@type'] === 'ItemList');
      assert.ok(itemList.itemListElement.length > 0, 'ItemList do Hub não deve estar vazio');
      const org = graph.find(i => i['@type'] === 'Organization');
      assert.equal(org?.name, 'UNO Labs', 'Organization name deve ser UNO Labs');
    }
  }

  // Âncoras do Hub
  for (const href of hubHrefs) {
    if (href.startsWith('#') && href.length > 1) {
      const fragment = href.slice(1);
      assert.ok(hubIds.has(fragment), `Hub contém link para fragmento inexistente: #${fragment}`);
    }
  }

  // Links para artigos no Hub
  for (const art of articles) {
    const expectedRelLink = `./${art.slug}/index.html`;
    assert.ok(
      hubHrefs.includes(expectedRelLink),
      `Hub deve conter link relativo para artigo: ${expectedRelLink}`
    );
  }

  // Imagens do Hub (largura, altura, alt, srcset)
  const hubImages = htmlUtils.getAllImages(hubHtml);
  for (const img of hubImages) {
    assert.ok(img.width && !isNaN(Number(img.width)), `Imagem no Hub sem largura válida: ${img.tag}`);
    assert.ok(img.height && !isNaN(Number(img.height)), `Imagem no Hub sem altura válida: ${img.tag}`);
    assert.ok(img.alt !== undefined && img.alt !== null, `Imagem no Hub sem alt: ${img.tag}`);
    if (img.src && img.src.includes('/imagens/capa.webp')) {
      assert.ok(img.srcset, `Imagem de artigo no Hub deve ter srcset: ${img.tag}`);
      assert.match(img.srcset, /capa-768\.webp\s+768w/, 'srcset da imagem no Hub deve incluir capa-768.webp 768w');
      assert.match(img.srcset, /capa\.webp\s+1536w/, 'srcset da imagem no Hub deve incluir capa.webp 1536w');
      assert.ok(img.sizes, `Imagem com srcset no Hub deve possuir sizes: ${img.tag}`);
    }
  }

  // 4. Validação de cada artigo individual
  console.log(`[blog:verify] Validando ${articles.length} artigos individuais...`);
  for (const [idx, art] of articles.entries()) {
    const artDir = join(targetBlogDir, art.slug);
    const artHtmlPath = join(artDir, 'index.html');
    assert.ok(existsSync(artHtmlPath), `Arquivo HTML do artigo não encontrado: ${artHtmlPath}`);

    const artHtml = readFileSync(artHtmlPath, 'utf8');

    // Lang
    assert.equal(htmlUtils.getLang(artHtml), 'pt-BR', `Artigo ${art.slug} deve ter lang="pt-BR"`);

    // H1 único
    const artH1s = htmlUtils.getAllH1s(artHtml);
    assert.equal(artH1s.length, 1, `Artigo ${art.slug} deve ter exatamente um <h1>. Encontrados: ${artH1s.length}`);

    // Categoria não pode estar como sobrancelha acima do h1
    const idxH1 = artHtml.indexOf('<h1');
    const idxCat = artHtml.indexOf('artigo__categoria');
    assert.ok(idxCat > idxH1, `Artigo ${art.slug}: categoria deve estar posicionada abaixo do <h1> nos metadados.`);

    // Skip-link
    const artIds = htmlUtils.getAllIds(artHtml);
    assert.ok(artIds.has('conteudo'), `Artigo ${art.slug} deve conter id="conteudo"`);
    const artHrefs = htmlUtils.getAllAnchorHrefs(artHtml);
    assert.ok(artHrefs.includes('#conteudo'), `Artigo ${art.slug} deve ter link para #conteudo`);

    // Logo aponta para https://unolabs.com.br/
    assert.match(artHtml, /<a[^>]*class=["'][^"']*topo__marca[^"']*["'][^>]*href=["']https:\/\/unolabs\.com\.br\/["']/i, `Artigo ${art.slug}: logo deve apontar para https://unolabs.com.br/`);

    // Assinatura e atendimento no rodapé
    assert.match(artHtml, /Presença digital que gera oportunidades\./i, `Artigo ${art.slug} deve usar assinatura confirmada no rodapé`);
    assert.match(artHtml, /Vitória · Vila Velha · Serra · Cariacica \(ES\)/i, `Artigo ${art.slug} deve conter atendimento no rodapé`);

    // Sem JS não autorizado
    const artNonJsonScripts = htmlUtils.getAllScriptsNonJsonLd(artHtml);
    assert.equal(artNonJsonScripts.length, 0, `Artigo ${art.slug} não deve conter tags <script> de JavaScript`);

    // Ausência de placeholders
    assert.doesNotMatch(artHtml, /lorem\s+ipsum/i, `Artigo ${art.slug} contém lorem ipsum`);
    assert.doesNotMatch(artHtml, /\[TODO\]/i, `Artigo ${art.slug} contém [TODO]`);
    assert.doesNotMatch(artHtml, /\bundefined\b|\bNaN\b/, `Artigo ${art.slug} contém undefined ou NaN`);

    // Metadados únicos
    const title = htmlUtils.getTitle(artHtml);
    assert.ok(title, `Artigo ${art.slug} deve conter <title>`);
    assert.ok(!titlesSeen.has(title), `Título duplicado detectado: "${title}" (já visto em ${titlesSeen.get(title)})`);
    titlesSeen.set(title, art.slug);

    const canonical = htmlUtils.getCanonical(artHtml);
    assert.equal(canonical, `https://unolabs.com.br/blog/${art.slug}/`, `Canonical do artigo ${art.slug} incorreto`);
    assert.ok(!canonicalsSeen.has(canonical), `Canonical duplicado: ${canonical}`);
    canonicalsSeen.set(canonical, art.slug);

    const desc = htmlUtils.getMetaDescription(artHtml);
    assert.ok(desc, `Artigo ${art.slug} deve ter meta description`);
    assert.ok(!descriptionsSeen.has(desc), `Meta description duplicada: "${desc}"`);
    descriptionsSeen.set(desc, art.slug);

    const ogTitle = htmlUtils.getMetaProperty(artHtml, 'og:title');
    assert.ok(ogTitle, `Artigo ${art.slug} deve ter og:title`);
    assert.ok(!ogTitlesSeen.has(ogTitle), `og:title duplicado: "${ogTitle}"`);
    ogTitlesSeen.set(ogTitle, art.slug);

    const ogUrl = htmlUtils.getMetaProperty(artHtml, 'og:url');
    assert.equal(ogUrl, `https://unolabs.com.br/blog/${art.slug}/`, `og:url incorreto em ${art.slug}`);
    assert.ok(!ogUrlsSeen.has(ogUrl), `og:url duplicado: ${ogUrl}`);
    ogUrlsSeen.set(ogUrl, art.slug);

    const ogImage = htmlUtils.getMetaProperty(artHtml, 'og:image');
    assert.equal(ogImage, `https://unolabs.com.br/blog/${art.slug}/imagens/capa.webp`, `og:image incorreto em ${art.slug}`);

    // Data da versão visível
    assert.match(
      artHtml,
      /Data da vers[aã]o:/i,
      `Artigo ${art.slug} deve exibir textualmente "Data da versão"`
    );
    assert.ok(
      artHtml.includes(art.dateModified),
      `Artigo ${art.slug} deve exibir a data dateModified no HTML`
    );

    // JSON-LD do Artigo seguro
    const artJsonLdList = htmlUtils.getJsonLdScripts(artHtml);
    assert.ok(artJsonLdList.length >= 1, `Artigo ${art.slug} deve conter JSON-LD`);
    for (const rawJson of artJsonLdList) {
      assert.ok(!rawJson.includes('</script>'), `Artigo ${art.slug}: JSON-LD não deve conter </script>`);
      const data = JSON.parse(rawJson);
      const graph = data['@graph'] || [data];
      const blogPosting = graph.find(i => i['@type'] === 'BlogPosting');
      if (blogPosting) {
        assert.equal(blogPosting.url, `https://unolabs.com.br/blog/${art.slug}/`);
        assert.equal(blogPosting.image, `https://unolabs.com.br/blog/${art.slug}/imagens/capa.webp`);
        assert.equal(blogPosting.author?.name, 'UNO Labs', 'BlogPosting author name deve ser UNO Labs');
        assert.equal(blogPosting.author?.['@type'], 'Organization', 'BlogPosting author type deve ser Organization');
        assert.ok(blogPosting.dateModified, 'BlogPosting deve conter dateModified');
        assert.equal(blogPosting.datePublished, undefined, 'BlogPosting não deve conter datePublished fictícia');

        const breadcrumbs = graph.find(i => i['@type'] === 'BreadcrumbList');
        assert.ok(breadcrumbs, `Artigo ${art.slug} deve conter BreadcrumbList no JSON-LD`);
        assert.equal(breadcrumbs.itemListElement.length, 3, 'BreadcrumbList deve ter 3 níveis (Início, Blog, Artigo)');
      }
    }

    // Imagens e srcset do Artigo
    const artImages = htmlUtils.getAllImages(artHtml);
    assert.ok(artImages.length >= 1, `Artigo ${art.slug} deve ter pelo menos uma imagem`);
    const heroImg = artImages.find(img => img.src === './imagens/capa.webp');
    assert.ok(heroImg, `Artigo ${art.slug} deve conter imagem com src="./imagens/capa.webp"`);
    assert.ok(heroImg.srcset, `Imagem hero do artigo ${art.slug} deve conter srcset`);
    assert.match(heroImg.srcset, /capa-768\.webp\s+768w/, 'srcset deve conter capa-768.webp 768w');
    assert.match(heroImg.srcset, /capa\.webp\s+1536w/, 'srcset deve conter capa.webp 1536w');
    assert.equal(heroImg.loading, 'eager', 'Imagem hero deve ter loading="eager"');
    assert.equal(heroImg.fetchpriority, 'high', 'Imagem hero deve ter fetchpriority="high"');
    assert.match(heroImg.sizes || '', /900px/, `Hero detalhe em ${art.slug} deve ter sizes com max 900px`);

    for (const img of artImages) {
      assert.ok(img.width && !isNaN(Number(img.width)), `Imagem no artigo ${art.slug} sem largura válida`);
      assert.ok(img.height && !isNaN(Number(img.height)), `Imagem no artigo ${art.slug} sem altura válida`);
      assert.ok(img.alt !== undefined && img.alt !== null, `Imagem no artigo ${art.slug} sem alt`);
    }

    // Legenda da imagem explicita IA sem duplicar
    assert.match(
      artHtml,
      /Ilustra[cç][aã]o conceitual gerada por IA/i,
      `Artigo ${art.slug} deve explicitar na legenda "Ilustração conceitual gerada por IA"`
    );
    assert.doesNotMatch(
      artHtml,
      /Ilustra[cç][aã]o conceitual gerada por IA[\s\S]*?Ilustra[cç][aã]o conceitual gerada por IA/i,
      `Artigo ${art.slug}: legenda duplicou menção a IA!`
    );

    // Âncoras internas do artigo
    for (const href of artHrefs) {
      if (href.startsWith('#') && href.length > 1) {
        const fragment = href.slice(1);
        assert.ok(artIds.has(fragment), `Artigo ${art.slug} possui link para fragmento inexistente: #${fragment}`);
      }
    }

    // Validação de links para artigos relacionados
    if (art.related && art.related.length > 0) {
      for (const relSlug of art.related) {
        assert.ok(validSlugs.has(relSlug), `Artigo ${art.slug} referencia slug inexistente em related: ${relSlug}`);
        const expectedLink = `../${relSlug}/index.html`;
        assert.ok(artHrefs.includes(expectedLink), `Artigo ${art.slug} não contém link para relacionado: ${expectedLink}`);
      }
    }

    // Validação de fontes
    if (art.sources && art.sources.length > 0) {
      for (const src of art.sources) {
        assert.ok(src.title && src.title.trim().length > 0, `Artigo ${art.slug} possui fonte sem título`);
        assert.ok(/^https?:\/\//i.test(src.url), `Artigo ${art.slug} possui URL de fonte inválida: ${src.url}`);
      }
    }

    // FAQ nativo (<details> e <summary>)
    if (art.faq && art.faq.length > 0) {
      assert.match(artHtml, /<details\b/i, `Artigo ${art.slug} com FAQ deve usar tag <details> nativa`);
      assert.match(artHtml, /<summary\b/i, `Artigo ${art.slug} com FAQ deve usar tag <summary> nativa`);
    }

    // Tabelas: verificar wrapper acessível se houver table-wrap
    if (artHtml.includes('table-wrap')) {
      assert.match(artHtml, /<div[^>]*\btable-wrap\b[^>]*\brole=["']region["']/i, `Artigo ${art.slug}: table-wrap deve ter role="region"`);
      assert.match(artHtml, /<div[^>]*\btable-wrap\b[^>]*\btabindex=["']0["']/i, `Artigo ${art.slug}: table-wrap deve ter tabindex="0"`);
      assert.match(artHtml, /<div[^>]*\btable-wrap\b[^>]*\baria-label=/i, `Artigo ${art.slug}: table-wrap deve ter aria-label`);
    }
  }

  console.log(`[blog:verify] Validação concluída com sucesso: Hub e ${articles.length} artigos íntegros e em conformidade!`);
  return { success: true, verified: articles.length + 1 };
}

// Execução direta via CLI
const isDirectCall = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isDirectCall) {
  const { values } = parseArgs({
    options: {
      articles: { type: 'string', short: 'a' },
      blogDir: { type: 'string', short: 'b' }
    },
    strict: false
  });

  try {
    const res = await verifyBlog({
      articlesPath: values.articles,
      blogDir: values.blogDir
    });
    if (!res.success) {
      process.exit(1);
    }
  } catch (err) {
    console.error(`[blog:verify] Falha na validação: ${err.message}`);
    process.exit(1);
  }
}
