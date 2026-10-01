/* ==========================================================================
   UNO Labs — site.js
   Sem dependências. Carregado com "defer".
   1. Escala proporcional das composições (.escala)
   2. Estudos conceituais clonados de <template> sob demanda
   3. Luz do hero que segue o ponteiro
   4. Jornada presa na tela (rolagem nativa)
   5. Terminal "por baixo do capô"
   6. Menu do celular
   7. Formulário de contato (validação + envio honesto)
   8. Ano do rodapé
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var raiz = doc.documentElement;
  var movimentoReduzido = raiz.classList.contains('rm');
  var mqlMovimentoEstudos = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var motivoReplayEstatico = '';
  var controleMovimentoEstudosIniciado = false;

  function movimentoEstudosReduzido() {
    return raiz.classList.contains('rm') || !!(mqlMovimentoEstudos && mqlMovimentoEstudos.matches);
  }

  function obterTopoUtil() {
    var header = doc.querySelector('.topo');
    if (!header) return 0;
    var r = header.getBoundingClientRect();
    return (r.bottom > 0 && r.top <= 0) ? Math.max(0, r.bottom) : 0;
  }

  function copiaElegivel(el) {
    if (!el || !el.isConnected || doc.hidden) return false;
    var etapa = el.closest('[data-etapa]');
    if (etapa && !etapa.classList.contains('is-ativo')) return false;

    var r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;

    // Considera o clipping de todos os ancestrais com overflow oculto/scroll/clip
    var x1 = r.left;
    var y1 = r.top;
    var x2 = r.right;
    var y2 = r.bottom;

    var p = el.parentElement;
    while (p && p !== doc.body) {
      var style = window.getComputedStyle(p);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      var ox = style.overflowX;
      var oy = style.overflowY;
      if (ox === 'hidden' || ox === 'clip' || ox === 'scroll' || ox === 'auto' ||
          oy === 'hidden' || oy === 'clip' || oy === 'scroll' || oy === 'auto') {
        var pr = p.getBoundingClientRect();
        x1 = Math.max(x1, pr.left);
        y1 = Math.max(y1, pr.top);
        x2 = Math.min(x2, pr.right);
        y2 = Math.min(y2, pr.bottom);
        if (x2 <= x1 || y2 <= y1) return false;
      }
      p = p.parentElement;
    }

    // Área útil da viewport, descontando o cabeçalho fixo no topo
    var topoUtil = obterTopoUtil();
    var baseUtil = window.innerHeight;
    var esqUtil = 0;
    var dirUtil = window.innerWidth;

    var vx1 = Math.max(x1, esqUtil);
    var vy1 = Math.max(y1, topoUtil);
    var vx2 = Math.min(x2, dirUtil);
    var vy2 = Math.min(y2, baseUtil);

    if (vx2 <= vx1 || vy2 <= vy1) return false;

    var larguraVis = vx2 - vx1;
    var alturaVis = vy2 - vy1;
    var areaVis = larguraVis * alturaVis;

    var larguraModelo = Math.max(0, x2 - x1);
    var alturaModelo = Math.max(0, y2 - y1);
    if (larguraModelo <= 0 || alturaModelo <= 0) return false;

    var alturaUtil = Math.max(0, baseUtil - topoUtil);
    var larguraUtil = Math.max(0, dirUtil - esqUtil);
    if (alturaUtil <= 0 || larguraUtil <= 0) return false;

    // Em telas normais, exige pelo menos 50% da área do modelo.
    // Em telas baixas ou estreitas em que o modelo excede a área útil,
    // adapta para a porção máxima atingível na área útil (sem bloqueá-lo).
    var areaReferencia = Math.min(alturaModelo, alturaUtil) * Math.min(larguraModelo, larguraUtil);
    return areaVis >= 0.5 * areaReferencia;
  }

  /* ---------- 1. Escala proporcional ----------
     Cada .escala tem --bw/--bh (tamanho-base em px). O filho .escala__in é
     desenhado nesse tamanho fixo e reduzido/ampliado com transform: scale(--s). */
  function iniciarEscalas() {
    var caixas = doc.querySelectorAll('.escala');
    if (!caixas.length) return;
    function aplicar(el, largura) {
      var bw = parseFloat(getComputedStyle(el).getPropertyValue('--bw')) || 1;
      if (largura > 0) el.style.setProperty('--s', (largura / bw).toFixed(4));
    }
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function (entradas) {
        entradas.forEach(function (e) { aplicar(e.target, e.contentRect.width); });
      });
      caixas.forEach(function (el) { ro.observe(el); });
    } else {
      var todas = function () { caixas.forEach(function (el) { aplicar(el, el.clientWidth); }); };
      todas();
      window.addEventListener('resize', todas);
    }
  }

  /* ---------- 2. Estudos conceituais ----------
     O markup de cada estudo mora em <template id="tpl-NOME">. Só é clonado quando
     o espaço reservado chega perto da tela, e nunca se estiver oculto
     (display:none) — por isso o celular não carrega o que só aparece no desktop.
     Os ids internos dos SVGs recebem sufixo para não colidirem entre cópias.
     Cada negócio possui a composição final aprovada (Módulo: Projeto,
     Atria: Detalhe, Casa Noma: Imersivo), refletida em todas as cópias
     (home, jornada, desktop e celular). */
  var contadorClone = 0;

  function obterNegocio(el) {
    var attr = el.getAttribute('data-estudo') || '';
    return attr.split('-')[0];
  }

  function clonarEstudo(nome) {
    var tpl = doc.getElementById('tpl-' + nome);
    if (!tpl || !tpl.content) return null;
    var frag = tpl.content.cloneNode(true);
    var sufixo = '-c' + (++contadorClone);
    var mapa = {};
    var temIds = false;
    frag.querySelectorAll('[id]').forEach(function (el) {
      mapa[el.id] = el.id + sufixo;
      el.id = el.id + sufixo;
      temIds = true;
    });
    if (temIds) {
      frag.querySelectorAll('*').forEach(function (el) {
        for (var i = 0; i < el.attributes.length; i++) {
          var at = el.attributes[i];
          var v = at.value;
          if (v.indexOf('url(#') === -1 && !(v.charAt(0) === '#' && v.length > 1)) continue;
          var novo = v.replace(/url\(#([^)]+)\)/g, function (m, id) { return mapa[id] ? 'url(#' + mapa[id] + ')' : m; });
          if (novo.charAt(0) === '#' && mapa[novo.slice(1)]) novo = '#' + mapa[novo.slice(1)];
          if (novo !== v) el.setAttribute(at.name, novo);
        }
      });
    }
    return frag;
  }

  function montarEstudo(el) {
    if (el.getAttribute('data-montado')) return;
    var frag = clonarEstudo(el.getAttribute('data-estudo'));
    if (!frag) return;
    el.appendChild(frag);
    el.setAttribute('data-montado', '1');
    el.setAttribute('aria-hidden', 'true');
    el.inert = true;
  }

  function estadoAnimacao(el) {
    if (!el._unoAnimacaoEstudo) el._unoAnimacaoEstudo = { geracao: 0 };
    return el._unoAnimacaoEstudo;
  }

  function concluirAnimacao(el, geracao) {
    var estado = estadoAnimacao(el);
    if (estado.geracao !== geracao || !el.classList.contains('anim-play')) return;
    el.setAttribute('data-anim-concluida', '1');
    el.classList.remove('anim-play', 'is-pausado');
  }

  function iniciarEfeitosAnimacao(el) {
    var estado = estadoAnimacao(el);
    var geracao = ++estado.geracao;
    el.removeAttribute('data-anim-concluida');
    el.classList.remove('is-pausado');
    el.classList.add('anim-play');

    // A conclusão acompanha os efeitos CSS finitos ativos, inclusive os de pseudo-elementos.
    var animacoes = el.getAnimations({ subtree: true });
    var finitas = animacoes.filter(function (animacao) {
      var efeito = animacao.effect;
      var tempo = efeito && efeito.getComputedTiming ? efeito.getComputedTiming() : null;
      return tempo && isFinite(tempo.endTime) && tempo.endTime > 0;
    });
    Promise.all(finitas.map(function (animacao) {
      return animacao.finished.then(function () {}, function () {});
    })).then(function () { concluirAnimacao(el, geracao); });
  }

  function dispararAnimacao(el) {
    if (motivoReplayEstatico || movimentoEstudosReduzido() || !el || !copiaElegivel(el) || typeof el.getAnimations !== 'function') return;
    if (el.getAttribute('data-animou')) return;
    if (!el.getAttribute('data-montado')) {
      montarEstudo(el);
    }
    el.setAttribute('data-animou', '1');
    iniciarEfeitosAnimacao(el);
  }

  function pausarAnimacao(el) {
    if (!el || el.getAttribute('data-anim-concluida') || !el.classList.contains('anim-play')) return;
    el.classList.add('is-pausado');
  }

  function retomarAnimacao(el) {
    if (!el || !el.classList.contains('anim-play')) return;
    if (movimentoEstudosReduzido()) {
      cancelarAnimacaoEstudo(el);
      return;
    }
    if (!copiaElegivel(el)) {
      pausarAnimacao(el);
      return;
    }
    if (el.getAttribute('data-anim-concluida')) return;
    el.classList.remove('is-pausado');
  }

  function reiniciarAnimacao(el) {
    if (movimentoEstudosReduzido() || !el || !copiaElegivel(el) || typeof el.getAnimations !== 'function') return;
    if (!el.getAttribute('data-montado')) {
      montarEstudo(el);
    }
    var estado = estadoAnimacao(el);
    estado.geracao++;
    el.classList.remove('anim-play', 'is-pausado');
    void el.offsetWidth;
    el.setAttribute('data-animou', '1');
    iniciarEfeitosAnimacao(el);
  }

  function cancelarAnimacaoEstudo(el) {
    if (!el) return;
    estadoAnimacao(el).geracao++;
    el.classList.remove('anim-play', 'is-pausado');
    el.setAttribute('data-anim-concluida', '1');
  }

  function sincronizarPreferenciaEstudos() {
    if (!movimentoEstudosReduzido()) return;
    doc.querySelectorAll('.anim-play[data-estudo]').forEach(cancelarAnimacaoEstudo);
  }

  function iniciarControleMovimentoEstudos() {
    if (controleMovimentoEstudosIniciado) return;
    controleMovimentoEstudosIniciado = true;
    if (mqlMovimentoEstudos) {
      if (mqlMovimentoEstudos.addEventListener) mqlMovimentoEstudos.addEventListener('change', sincronizarPreferenciaEstudos);
      else if (mqlMovimentoEstudos.addListener) mqlMovimentoEstudos.addListener(sincronizarPreferenciaEstudos);
    }
    if ('MutationObserver' in window) {
      var observerRm = new MutationObserver(sincronizarPreferenciaEstudos);
      observerRm.observe(raiz, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function iniciarEstudos() {
    var alvos = doc.querySelectorAll('[data-estudo]');
    if (!alvos.length) return;

    if (!('IntersectionObserver' in window)) {
      motivoReplayEstatico = 'Este navegador não oferece suporte à observação de visibilidade; os estudos permanecem estáticos.';
      alvos.forEach(montarEstudo);
      iniciarBotoesReplay();
      return;
    }

    // 1. Pré-carregamento/montagem do DOM 800px antes
    var ioMontagem = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          montarEstudo(e.target);
          ioMontagem.unobserve(e.target);
        }
      });
    }, { rootMargin: '800px 0px' });
    alvos.forEach(function (el) { ioMontagem.observe(el); });

    // 2. Disparo quando a cópia aparece na tela; as cenas da jornada também exigem etapa ativa.
    if (!window.Element || typeof window.Element.prototype.getAnimations !== 'function') {
      motivoReplayEstatico = 'Este navegador não oferece suporte à sincronização das animações; os estudos permanecem estáticos.';
      iniciarBotoesReplay();
      return;
    }
    iniciarControleMovimentoEstudos();

    var thresholds = [];
    for (var i = 0; i <= 20; i++) {
      thresholds.push(i / 20);
    }

    var ioVisivel = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        sincronizarCopiaEstudo(e.target);
      });
    }, { threshold: thresholds });

    alvos.forEach(function (el) { ioVisivel.observe(el); });

    var agendadoScrollEstudos = false;
    function aoMudarScrollOuJanela() {
      if (agendadoScrollEstudos) return;
      agendadoScrollEstudos = true;
      requestAnimationFrame(function () {
        agendadoScrollEstudos = false;
        alvos.forEach(sincronizarCopiaEstudo);
      });
    }

    window.addEventListener('scroll', aoMudarScrollOuJanela, { passive: true });
    window.addEventListener('resize', aoMudarScrollOuJanela, { passive: true });

    // 3. Pausar movimento se aba ficar oculta; retomar quando voltar
    doc.addEventListener('visibilitychange', function () {
      var oculta = doc.hidden;
      var emCurso = doc.querySelectorAll('.anim-play[data-estudo]:not([data-anim-concluida])');
      emCurso.forEach(function (el) {
        if (oculta || !copiaElegivel(el)) {
          pausarAnimacao(el);
        } else {
          retomarAnimacao(el);
        }
      });
    });

    iniciarBotoesReplay();
  }

  function iniciarBotoesReplay() {
    var botoes = doc.querySelectorAll('[data-replay]');
    if (!botoes.length) return;

    var nomes = {
      modulo: 'Módulo Engenharia',
      atria: 'Atria Clinic',
      casanoma: 'Casa Noma'
    };

    botoes.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cod = btn.getAttribute('data-replay');
        var capitulo = btn.closest('.capitulo');
        var live = capitulo ? capitulo.querySelector('.live-replay') : null;
        var nome = nomes[cod] || 'estudo';

        if (motivoReplayEstatico) {
          if (live) live.textContent = motivoReplayEstatico;
          return;
        }

        if (movimentoEstudosReduzido()) {
          if (live) {
            live.textContent = 'Preferência de movimento reduzido ativa. Nenhuma animação espacial executada para ' + nome + '.';
          }
          var txtOriginal = btn.querySelector('span');
          if (txtOriginal && !btn.getAttribute('data-notificando')) {
            btn.setAttribute('data-notificando', '1');
            var textoAntigo = txtOriginal.textContent;
            txtOriginal.textContent = 'Movimento reduzido ativo';
            setTimeout(function () {
              txtOriginal.textContent = textoAntigo;
              btn.removeAttribute('data-notificando');
            }, 2200);
          }
          return;
        }

        if (!capitulo) return;

        // Reinicia apenas cópias do capítulo que têm exposição significativa na tela.
        var copias = capitulo.querySelectorAll('[data-estudo]');
        var reiniciadas = 0;
        copias.forEach(function (el) {
          if (copiaElegivel(el)) {
            reiniciarAnimacao(el);
            reiniciadas++;
          }
        });

        if (live) {
          if (reiniciadas > 0) {
            live.textContent = 'Animação de ' + nome + ' reiniciada.';
          } else {
            live.textContent = 'Role a página para visualizar o modelo de ' + nome + ' antes de reiniciar a animação.';
          }
        }
      });
    });
  }

  function sincronizarCopiaEstudo(el) {
    if (!el) return;
    if (movimentoEstudosReduzido()) {
      if (el.classList.contains('anim-play')) cancelarAnimacaoEstudo(el);
      return;
    }
    if (!copiaElegivel(el)) {
      pausarAnimacao(el);
      return;
    }
    if (!el.getAttribute('data-animou')) {
      dispararAnimacao(el);
    } else {
      retomarAnimacao(el);
    }
  }

  /* ---------- 3. Luz do hero ---------- */
  function iniciarLuz() {
    var hero = doc.querySelector('.hero');
    if (!hero || !window.matchMedia('(hover: hover)').matches) return;
    var ultimo = null;
    var agendadoLuz = false;
    hero.addEventListener('pointermove', function (ev) {
      if (movimentoEstudosReduzido()) return;
      ultimo = ev;
      if (agendadoLuz) return;
      agendadoLuz = true;
      requestAnimationFrame(function () {
        agendadoLuz = false;
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (ultimo.clientX - r.left) + 'px');
        hero.style.setProperty('--my', (ultimo.clientY - r.top) + 'px');
      });
    }, { passive: true });
  }

  /* ---------- 4. Jornada: três alturas estáveis de tela, ou quatro etapas lineares. ---------- */
  function iniciarJornada() {
    var secao = doc.querySelector('.jornada');
    if (!secao) return;
    var fixo = secao.querySelector('.jornada__fixo');
    var grade = secao.querySelector('.j-grade');
    var mob = secao.querySelector('.jornada__mob');
    var comp = secao.querySelector('.jm-comp');
    var etapas = secao.querySelectorAll('[data-etapa]');
    var botoes = secao.querySelectorAll('[data-ir]');
    var contador = secao.querySelector('[data-contador]');
    var atual = -1, agendado = false, sticky = false;
    var probe = doc.createElement('div');
    probe.style.cssText = 'position:absolute;width:0;height:100svh;visibility:hidden;pointer-events:none';
    probe.setAttribute('aria-hidden', 'true');
    secao.appendChild(probe);

    function aplicar(passo, sub) {
      var mudou = passo !== atual;
      secao.setAttribute('data-passo', String(passo));
      etapas.forEach(function (el) {
        var k = +el.getAttribute('data-etapa'), ativo = k === passo;
        el.classList.toggle('is-ativo', ativo);
        el.style.setProperty('--sub', ativo ? sub : 0);
        if (el.classList.contains('j-item') || el.classList.contains('jm-aba')) el.classList.toggle('is-feito', k < passo);
        if (el.classList.contains('jm-texto')) el.setAttribute('aria-hidden', !sticky || ativo ? 'false' : 'true');
        if (el.classList.contains('j-item')) {
          var det = el.querySelector('.j-det');
          if (det) det.setAttribute('aria-hidden', ativo ? 'false' : 'true');
        }
      });
      botoes.forEach(function (b) {
        if (sticky && +b.getAttribute('data-ir') === passo) b.setAttribute('aria-current', 'step');
        else b.removeAttribute('aria-current');
      });
      if (contador) contador.textContent = '0' + (passo + 1);
      atual = passo;
      if (mudou) secao.querySelectorAll('[data-estudo]').forEach(sincronizarCopiaEstudo);
    }

    function medir() {
      agendado = false;
      if (!sticky) return;
      var topo = parseFloat(getComputedStyle(fixo).top) || 0;
      var faixa = Math.max(1, secao.offsetHeight - fixo.offsetHeight);
      var p = Math.min(1, Math.max(0, (topo - secao.getBoundingClientRect().top) / faixa));
      // Quatro intervalos iguais dentro do percurso disponível das três telas.
      var passo = Math.min(3, Math.floor(p * 4));
      aplicar(passo, Math.min(1, Math.max(0, p * 4 - passo)));
    }
    function agendar() {
      if (agendado || !sticky) return;
      agendado = true;
      requestAnimationFrame(medir);
    }

    function adaptar() {
      var topo = doc.querySelector('.topo__in').offsetHeight;
      raiz.style.setProperty('--topo', topo + 'px');
      var tela = probe.offsetHeight || window.innerHeight;
      var altura = Math.min(tela, window.visualViewport ? window.visualViewport.height : window.innerHeight);
      var util = altura - topo;
      secao.style.setProperty('--j-tela', tela + 'px');
      secao.style.setProperty('--j-util', util + 'px');
      // Medimos as versões sem escalonar texto para compensar uma tela baixa.
      secao.classList.add('is-sticky');
      sticky = true;
      aplicar(Math.max(0, atual), 1);
      var cabe = false;
      if (window.innerWidth >= 1100) {
        var escala = Math.min(1, (window.innerWidth - 64) / 1296);
        grade.style.setProperty('--je', escala.toFixed(3));
        var detalhes = Array.from(secao.querySelectorAll('.j-det'));
        var extra = Math.max.apply(null, detalhes.map(function (e) { return e.scrollHeight; })) - (detalhes[atual] ? detalhes[atual].scrollHeight : 0);
        cabe = escala >= 0.88 && (grade.offsetHeight + Math.max(0, extra)) * escala + 48 <= util;
      } else {
        var textos = Array.from(secao.querySelectorAll('.jm-texto'));
        var textoAltura = Math.max.apply(null, textos.map(function (e) { return e.scrollHeight; }));
        secao.style.setProperty('--j-texto', textoAltura + 'px');
        comp.style.setProperty('--jm', '1');
        var semImagem = mob.offsetHeight - comp.offsetHeight;
        var tamanho = Math.min(1.1, (util - semImagem - 36) / 404, (window.innerWidth - 40) / 350);
        comp.style.setProperty('--jm', Math.max(0.8, tamanho).toFixed(3));
        cabe = tamanho >= 0.8 && mob.offsetHeight + 24 <= util;
      }
      sticky = cabe && !movimentoEstudosReduzido();
      secao.classList.toggle('is-sticky', sticky);
      if (sticky) medir();
      else aplicar(1, 1); // Uma imagem ilustrativa, com as quatro explicações completas abaixo.
    }
    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        if (!sticky) return;
        var k = +b.getAttribute('data-ir');
        var topoSecao = window.scrollY + secao.getBoundingClientRect().top;
        var topo = parseFloat(getComputedStyle(fixo).top) || 0;
        var faixa = secao.offsetHeight - fixo.offsetHeight;
        window.scrollTo({ top: topoSecao - topo + faixa * ((k + 0.25) / 4), behavior: movimentoEstudosReduzido() ? 'auto' : 'smooth' });
      });
    });
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', adaptar);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', adaptar);
    if (mqlMovimentoEstudos) {
      if (mqlMovimentoEstudos.addEventListener) mqlMovimentoEstudos.addEventListener('change', adaptar);
      else mqlMovimentoEstudos.addListener(adaptar);
    }
    if (doc.fonts) doc.fonts.ready.then(adaptar);
    adaptar();
  }

  /* ---------- 5. Terminal ---------- */
  function iniciarTerminal() {
    var t = doc.querySelector('.terminal');
    if (!t) return;
    if (!('IntersectionObserver' in window)) { t.classList.add('is-visivel'); return; }
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { t.classList.add('is-visivel'); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(t);
  }

  /* ---------- 6. Menu do celular ---------- */
  function iniciarMenu() {
    var botao = doc.querySelector('.menu-botao');
    var menu = doc.getElementById('menu-movel');
    if (!botao || !menu) return;
    function definir(aberto) {
      menu.classList.toggle('aberto', aberto);
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    }
    botao.addEventListener('click', function () { definir(!menu.classList.contains('aberto')); });
    menu.addEventListener('click', function (ev) { if (ev.target.closest('a')) definir(false); });
    doc.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && menu.classList.contains('aberto')) { definir(false); botao.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1100) definir(false); });
  }

  /* ---------- 7. Formulário ----------
     Sucesso só aparece quando o servidor responde 2xx com {"ok": true}.
     Qualquer outra resposta mantém os dados preenchidos e mostra erro recuperável. */
  function iniciarFormulario() {
    var form = doc.getElementById('form-contato');
    if (!form) return;
    var sucesso = doc.getElementById('form-sucesso');
    var aviso = doc.getElementById('form-aviso');
    var botao = form.querySelector('button[type="submit"]');
    var textoBotao = botao.textContent;
    form.closest('.form-cartao').classList.add('is-ready');
    botao.disabled = false;
    var recuperacao = form.querySelector('.form-recuperacao');
    var endpoint = form.getAttribute('data-endpoint') || '/api/contato';
    var chaveTurnstile = (form.getAttribute('data-turnstile') || '').trim();
    var tokenTurnstile = '';
    var enviando = false;

    function valor(nome) { var c = form.elements[nome]; return c ? String(c.value || '').trim() : ''; }
    function canalValido(v) {
      if (/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)) return true;
      return /^[+()\d\s.-]+$/.test(v) && v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 15;
    }
    var regras = {
      nome: function (v) { return v.length >= 2; },
      empresa: function (v) { return v.length >= 2; },
      canal: canalValido,
      contexto: function (v) { return v.length >= 10; }
    };

    function marcar(nome, ok) {
      var campo = form.elements[nome];
      var caixa = campo && campo.closest('.campo');
      if (!caixa) return;
      caixa.classList.toggle('tem-erro', !ok);
      campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
    }
    function mostrarAviso(msg, carregando) {
      aviso.textContent = msg || '';
      aviso.classList.toggle('erro', !!msg && !carregando);
      aviso.classList.toggle('carregando', !!carregando);
      if (recuperacao) recuperacao.hidden = !msg || !!carregando;
    }

    Object.keys(regras).forEach(function (nome) {
      var campo = form.elements[nome];
      if (!campo) return;
      campo.addEventListener('input', function () {
        if (campo.closest('.campo').classList.contains('tem-erro')) marcar(nome, regras[nome](valor(nome)));
      });
      campo.addEventListener('blur', function () {
        if (valor(nome)) marcar(nome, regras[nome](valor(nome)));
      });
    });

    /* Turnstile (anti-spam da Cloudflare), carregado só quando o formulário se aproxima. */
    if (chaveTurnstile) {
      var alvo = form.querySelector('.form__turnstile');
      var carregar = function () {
        if (carregar.feito) return;
        carregar.feito = true;
        window.unoTurnstilePronto = function () {
          alvo.hidden = false;
          window.turnstile.render(alvo, {
            sitekey: chaveTurnstile,
            language: 'pt-BR',
            callback: function (t) { tokenTurnstile = t; },
            'expired-callback': function () { tokenTurnstile = ''; },
            'error-callback': function () { tokenTurnstile = ''; }
          });
        };
        var s = doc.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=unoTurnstilePronto';
        s.async = true;
        s.defer = true;
        doc.head.appendChild(s);
      };
      if ('IntersectionObserver' in window) {
        var ioT = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { carregar(); ioT.disconnect(); } }, { rootMargin: '600px 0px' });
        ioT.observe(form);
      } else { carregar(); }
      form.addEventListener('focusin', carregar);
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (enviando) return;
      var primeiroErro = null;
      Object.keys(regras).forEach(function (nome) {
        var ok = regras[nome](valor(nome));
        marcar(nome, ok);
        if (!ok && !primeiroErro) primeiroErro = form.elements[nome];
      });
      if (primeiroErro) {
        mostrarAviso('Revise os campos destacados para enviar.');
        primeiroErro.focus();
        return;
      }
      if (chaveTurnstile && !tokenTurnstile) {
        mostrarAviso('Aguarde a verificação anti-spam terminar e envie de novo.');
        return;
      }
      mostrarAviso('');

      var servicos = [];
      form.querySelectorAll('input[name="servicos"]:checked').forEach(function (c) { servicos.push(c.value); });
      var dados = {
        nome: valor('nome'),
        empresa: valor('empresa'),
        canal: valor('canal'),
        site: valor('site'),
        servicos: servicos,
        contexto: valor('contexto'),
        invest: valor('invest'),
        website: valor('website'),
        turnstile: tokenTurnstile,
        pagina: location.pathname
      };

      enviando = true;
      botao.disabled = true;
      botao.textContent = 'Enviando…';
      form.setAttribute('aria-busy', 'true');
      mostrarAviso('Enviando seu contexto. Aguarde a confirmação.', true);
      var controle = 'AbortController' in window ? new AbortController() : null;
      var limite = controle ? setTimeout(function () { controle.abort(); }, 15000) : null;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(dados),
        signal: controle ? controle.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (res.ok && json && json.ok === true && json.encaminhamento === 'smtp_aceito') return true;
          var erro = new Error((json && json.erro) || ('http_' + res.status));
          erro.status = res.status;
          erro.campos = Array.isArray(json.campos) ? json.campos : [];
          throw erro;
        });
      }).then(function () {
        form.hidden = true;
        sucesso.classList.add('visivel');
        var titulo = sucesso.querySelector('h3');
        sucesso.scrollIntoView({ block: 'center', behavior: movimentoReduzido ? 'auto' : 'smooth' });
        if (titulo) titulo.focus({ preventScroll: true });
      }).catch(function (erro) {
        if (erro.status === 422 && erro.campos.length) {
          var primeiro = null;
          erro.campos.forEach(function (nome) {
            if (!Object.hasOwn(regras, nome)) return;
            marcar(nome, false);
            if (!primeiro) primeiro = form.elements[nome];
          });
          mostrarAviso('O envio precisa de uma correção. Revise os campos indicados; seus dados continuam aqui.');
          if (primeiro) primeiro.focus();
        } else {
          var mensagem = erro.status === 503 ? 'O formulário está temporariamente indisponível.' : erro.status === 403 ? 'A verificação de segurança não foi concluída. Tente novamente.' : erro.name === 'AbortError' ? 'A confirmação demorou mais que o esperado. O envio pode ter sido encaminhado; confira com a equipe antes de repetir.' : 'Não foi possível confirmar o envio.';
          mostrarAviso(mensagem + ' Seus dados continuam aqui. Você pode tentar novamente ou usar um dos canais abaixo.');
        }
        if (chaveTurnstile && window.turnstile) { try { window.turnstile.reset(form.querySelector('.form__turnstile')); } catch (e) {} tokenTurnstile = ''; }
      }).then(function () {
        if (limite) clearTimeout(limite);
        enviando = false;
        botao.disabled = false;
        form.setAttribute('aria-busy', 'false');
        botao.textContent = textoBotao;
      });
    });

    var reiniciar = sucesso && sucesso.querySelector('[data-reiniciar]');
    if (reiniciar) {
      reiniciar.addEventListener('click', function () {
        form.reset();
        Object.keys(regras).forEach(function (nome) { marcar(nome, true); });
        mostrarAviso('');
        sucesso.classList.remove('visivel');
        form.hidden = false;
        if (chaveTurnstile && window.turnstile) { try { window.turnstile.reset(form.querySelector('.form__turnstile')); } catch (e) {} tokenTurnstile = ''; }
        form.elements.nome.focus();
      });
    }
  }

  /* Controles reais ficam fora das maquetes ilustrativas e inertes. */
  function iniciarVisualizador() {
    var modal = doc.getElementById('visualizador');
    if (!modal || typeof modal.showModal !== 'function') return;
    var acionador, estudo, formato;
    var canvas = modal.querySelector('.visualizador__canvas');
    function mostrar(tipo) {
      formato = tipo;
      var tpl = doc.getElementById('tpl-' + estudo + '-' + tipo);
      if (!tpl) return;
      canvas.replaceChildren(tpl.content.cloneNode(true));
      modal.querySelectorAll('[data-formato]').forEach(function (b) {
        var selecionado = b.dataset.formato === tipo;
        b.setAttribute('aria-pressed', String(selecionado));
        b.classList.toggle('btn--escuro', selecionado);
        b.classList.toggle('btn--contorno', !selecionado);
      });
      modal.querySelector('.visualizador__rolagem').scrollTo(0, 0);
    }
    doc.querySelectorAll('[data-ampliar]').forEach(function (b) {
      b.hidden = false;
      b.addEventListener('click', function () {
        acionador = b;
        estudo = b.dataset.ampliar;
        var texto = b.closest('.capitulo__texto');
        modal.querySelector('h2').textContent = texto.querySelector('h3').textContent;
        modal.querySelector('[data-decisao]').textContent = Array.from(texto.querySelectorAll('dd')).map(function (e) { return e.textContent; }).join(' ');
        mostrar(window.innerWidth < 700 ? 'mob' : 'desk');
        modal.showModal();
        doc.body.style.overflow = 'hidden';
        modal.querySelector('[data-fechar]').focus();
      });
    });
    modal.querySelector('[data-fechar]').addEventListener('click', function () { modal.close(); });
    modal.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Tab') return;
      var controles = Array.from(modal.querySelectorAll('button:not([disabled]), [tabindex="0"]'));
      var primeiro = controles[0], ultimo = controles[controles.length - 1];
      if (ev.shiftKey && doc.activeElement === primeiro) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && doc.activeElement === ultimo) { ev.preventDefault(); primeiro.focus(); }
    });
    modal.querySelectorAll('[data-formato]').forEach(function (b) {
      b.addEventListener('click', function () { mostrar(b.dataset.formato); });
    });
    modal.addEventListener('close', function () {
      doc.body.style.overflow = '';
      canvas.replaceChildren();
      if (acionador) acionador.focus({ preventScroll: true });
    });
  }

  function iniciarPreferencias() {
    function atualizar() {
      movimentoReduzido = !!(mqlMovimentoEstudos && mqlMovimentoEstudos.matches);
      raiz.classList.toggle('rm', movimentoReduzido);
    }
    atualizar();
    if (mqlMovimentoEstudos) {
      if (mqlMovimentoEstudos.addEventListener) mqlMovimentoEstudos.addEventListener('change', atualizar);
      else mqlMovimentoEstudos.addListener(atualizar);
    }
    function visibilidade() { raiz.classList.toggle('page-hidden', doc.hidden); }
    doc.addEventListener('visibilitychange', visibilidade);
    visibilidade();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { e.target.classList.toggle('motion-paused', !e.isIntersecting); });
      });
      doc.querySelectorAll('.hero-palco').forEach(function (e) { io.observe(e); });
    }
  }

  /* ---------- 8. Ano do rodapé ---------- */
  function iniciarAno() {
    doc.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  function iniciar() {
    iniciarPreferencias();
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

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
