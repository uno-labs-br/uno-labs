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
     Cada negócio possui três direções visuais (padrão 1), selecionáveis por botões
     acessíveis nos capítulos da home e refletidas em todas as cópias
     já montadas e futuras (home, jornada, desktop e celular). */
  var contadorClone = 0;
  var variacoesAtivas = {
    modulo: 1,
    atria: 1,
    casanoma: 1
  };

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
    var negocio = obterNegocio(el);
    var v = variacoesAtivas[negocio] || 1;
    el.setAttribute('data-variacao', String(v));
    var frag = clonarEstudo(el.getAttribute('data-estudo'));
    if (!frag) return;
    el.appendChild(frag);
    el.setAttribute('data-montado', '1');
    el.setAttribute('aria-hidden', 'true');
    el.inert = true;
  }

  function selecionarVariacao(negocio, k, nomeVariante) {
    variacoesAtivas[negocio] = k;

    // Atualiza cópias montadas e futuras deste negócio
    var alvos = doc.querySelectorAll('[data-estudo]');
    alvos.forEach(function (el) {
      if (obterNegocio(el) === negocio) {
        el.setAttribute('data-variacao', String(k));
      }
    });

    // Atualiza botões acessíveis e anúncio aria-live
    var seletor = doc.querySelector('[data-seletor-estudo="' + negocio + '"]');
    if (seletor) {
      var botoes = seletor.querySelectorAll('[data-variante-btn]');
      botoes.forEach(function (btn) {
        var ativo = +btn.getAttribute('data-variante-btn') === k;
        btn.setAttribute('aria-pressed', ativo ? 'true' : 'false');
      });
      var regiaoLive = seletor.querySelector('.live-variacao');
      if (regiaoLive) {
        regiaoLive.textContent = 'Direção ativa: ' + (nomeVariante || ('Variação ' + k));
      }
    }
  }

  function iniciarSeletores() {
    var seletores = doc.querySelectorAll('[data-seletor-estudo]');
    seletores.forEach(function (seletor) {
      var negocio = seletor.getAttribute('data-seletor-estudo');
      var botoes = seletor.querySelectorAll('[data-variante-btn]');
      botoes.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var k = +btn.getAttribute('data-variante-btn');
          var nome = btn.textContent.trim();
          selecionarVariacao(negocio, k, nome);
        });
      });
    });
  }

  function iniciarEstudos() {
    var alvos = doc.querySelectorAll('[data-estudo]');
    if (!alvos.length) return;

    // Pré-configura a variação inicial padrão 1 em todos os estudos
    alvos.forEach(function (el) {
      var negocio = obterNegocio(el);
      var v = variacoesAtivas[negocio] || 1;
      el.setAttribute('data-variacao', String(v));
    });

    iniciarSeletores();

    if (!('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { if (el.offsetParent !== null) montarEstudo(el); });
      return;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { montarEstudo(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '800px 0px' });
    alvos.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Luz do hero ---------- */
  function iniciarLuz() {
    var hero = doc.querySelector('.hero');
    if (!hero || movimentoReduzido || !window.matchMedia('(hover: hover)').matches) return;
    var ultimo = null;
    var agendadoLuz = false;
    hero.addEventListener('pointermove', function (ev) {
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

  /* ---------- 4. Jornada presa na tela ----------
     A seção tem 400vh; o bloco interno é sticky. O progresso da rolagem (0–1)
     vira 4 etapas: passo = floor(p × 4); "sub" é o avanço dentro da etapa. */
  function iniciarJornada() {
    var secao = doc.querySelector('.jornada');
    if (!secao) return;
    var fixo = secao.querySelector('.jornada__fixo');
    var grade = secao.querySelector('.j-grade');
    var comp = secao.querySelector('.jm-comp');
    var etapas = secao.querySelectorAll('[data-etapa]');
    var botoes = secao.querySelectorAll('[data-ir]');
    var contador = secao.querySelector('[data-contador]');
    var atual = { passo: -1, sub: -1 };
    var agendado = false;

    function aplicar(passo, sub) {
      if (passo !== atual.passo) {
        secao.setAttribute('data-passo', String(passo));
        etapas.forEach(function (el) {
          var k = +el.getAttribute('data-etapa');
          var ativo = k === passo;
          el.classList.toggle('is-ativo', ativo);
          if (el.classList.contains('j-item') || el.classList.contains('jm-aba')) el.classList.toggle('is-feito', k < passo);
          if (el.classList.contains('jm-texto')) el.setAttribute('aria-hidden', ativo ? 'false' : 'true');
          if (el.classList.contains('j-item')) {
            var det = el.querySelector('.j-det');
            if (det) det.setAttribute('aria-hidden', ativo ? 'false' : 'true');
          }
        });
        botoes.forEach(function (b) {
          if (+b.getAttribute('data-ir') === passo) b.setAttribute('aria-current', 'step');
          else b.removeAttribute('aria-current');
        });
        if (contador) contador.textContent = '0' + (passo + 1);
      }
      if (sub !== atual.sub) {
        etapas.forEach(function (el) {
          if (+el.getAttribute('data-etapa') === passo) el.style.setProperty('--sub', sub);
        });
      }
      atual.passo = passo;
      atual.sub = sub;
    }

    function escalar() {
      var alturaFixo = fixo.clientHeight || window.innerHeight;
      if (grade) {
        var porAltura = Math.max(0.55, (alturaFixo - 40) / 650);
        // 648 = metade da grade (620) + cartão flutuante que passa 28 px da borda direita
        var porLargura = (window.innerWidth / 2 - 12) / 648;
        var je = Math.min(1, porAltura, porLargura);
        grade.style.setProperty('--je', je.toFixed(3));
      }
      if (comp) {
        // No tablet (≥700 px de largura) a composição pode crescer até 1,4×
        var jmMax = window.innerWidth >= 700 ? 1.4 : 1;
        var reserva = window.innerWidth >= 700 ? 400 : 350;
        var jm = movimentoReduzido ? jmMax : Math.min(jmMax, Math.max(0.5, (alturaFixo - reserva) / 404));
        comp.style.setProperty('--jm', jm.toFixed(3));
      }
    }

    function medir() {
      agendado = false;
      var r = secao.getBoundingClientRect();
      var topo = parseFloat(getComputedStyle(fixo).top) || 0;
      var faixa = r.height - fixo.offsetHeight;
      var p = faixa > 0 ? Math.min(1, Math.max(0, (topo - r.top) / faixa)) : 0;
      var passo = Math.min(3, Math.floor(p * 4));
      var sub = Math.round(Math.min(1, Math.max(0, p * 4 - passo)) * 50) / 50;
      aplicar(passo, sub);
    }

    function agendar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    }

    function irPara(k) {
      if (movimentoReduzido) { aplicar(k, 1); return; }
      var topoSecao = window.pageYOffset + secao.getBoundingClientRect().top;
      var topo = parseFloat(getComputedStyle(fixo).top) || 0;
      var faixa = secao.offsetHeight - fixo.offsetHeight;
      window.scrollTo({ top: topoSecao - topo + faixa * (k / 4) + faixa * 0.06, behavior: 'smooth' });
    }

    botoes.forEach(function (b) {
      b.addEventListener('click', function () { irPara(+b.getAttribute('data-ir')); });
    });

    escalar();
    window.addEventListener('resize', function () { escalar(); if (!movimentoReduzido) agendar(); });
    if (movimentoReduzido) {
      aplicar(0, 1);
    } else {
      window.addEventListener('scroll', agendar, { passive: true });
      medir();
    }
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
    var endpoint = form.getAttribute('data-endpoint') || '/api/contato';
    var chaveTurnstile = (form.getAttribute('data-turnstile') || '').trim();
    var tokenTurnstile = '';
    var enviando = false;

    function valor(nome) { var c = form.elements[nome]; return c ? String(c.value || '').trim() : ''; }
    function canalValido(v) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return true;
      return v.replace(/\D/g, '').length >= 10;
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
    function mostrarAviso(msg) {
      aviso.textContent = msg || '';
      aviso.classList.toggle('erro', !!msg);
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
      var controle = 'AbortController' in window ? new AbortController() : null;
      var limite = controle ? setTimeout(function () { controle.abort(); }, 15000) : null;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(dados),
        signal: controle ? controle.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (res.ok && json && json.ok === true) return true;
          throw new Error((json && json.erro) || ('http_' + res.status));
        });
      }).then(function () {
        form.hidden = true;
        sucesso.classList.add('visivel');
        var titulo = sucesso.querySelector('h3');
        sucesso.scrollIntoView({ block: 'center', behavior: movimentoReduzido ? 'auto' : 'smooth' });
        if (titulo) titulo.focus({ preventScroll: true });
      }).catch(function () {
        mostrarAviso('Não conseguimos enviar agora. Seus dados continuam aqui: tente de novo em instantes ou fale com a gente por outro canal.');
        if (chaveTurnstile && window.turnstile) { try { window.turnstile.reset(form.querySelector('.form__turnstile')); } catch (e) {} tokenTurnstile = ''; }
      }).then(function () {
        if (limite) clearTimeout(limite);
        enviando = false;
        botao.disabled = false;
        botao.textContent = textoBotao;
      });
    });

    var reiniciar = sucesso && sucesso.querySelector('[data-reiniciar]');
    if (reiniciar) {
      reiniciar.addEventListener('click', function () {
        form.reset();
        form.querySelectorAll('.tem-erro').forEach(function (c) { c.classList.remove('tem-erro'); });
        mostrarAviso('');
        sucesso.classList.remove('visivel');
        form.hidden = false;
        if (chaveTurnstile && window.turnstile) { try { window.turnstile.reset(form.querySelector('.form__turnstile')); } catch (e) {} tokenTurnstile = ''; }
        form.elements.nome.focus();
      });
    }
  }

  /* ---------- 8. Ano do rodapé ---------- */
  function iniciarAno() {
    doc.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  function iniciar() {
    iniciarEscalas();
    iniciarEstudos();
    iniciarLuz();
    iniciarJornada();
    iniciarTerminal();
    iniciarMenu();
    iniciarFormulario();
    iniciarAno();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
