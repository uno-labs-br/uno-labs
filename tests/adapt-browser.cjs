const {chromium}=require(process.env.UNO_PLAYWRIGHT_PATH || 'playwright');
const fs=require('fs');
const path=require('path');
const round=process.argv[2]||'round1';
const url=process.env.UNO_QA_URL || 'http://127.0.0.1:4321/';
const output=path.join(process.env.UNO_QA_OUTPUT || require('os').tmpdir(), 'uno-adapt', round);
fs.mkdirSync(output,{recursive:true});
const report={viewports:[],checks:[],errors:[]};
function check(name,ok,details){report.checks.push({name,ok:!!ok,details});if(!ok)console.log('FAIL '+name+' '+JSON.stringify(details));}
async function scroll(page,selector){await page.evaluate(sel=>{let e=document.querySelector(sel);window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-document.querySelector('.topo__in').offsetHeight-12,behavior:'instant'});},selector);await page.waitForTimeout(300);}
async function screenshot(page,name){await page.screenshot({path:path.join(output,name+'.png')});}
function finish(){fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));process.exitCode=report.errors.length || report.checks.some(c=>!c.ok) ? 1 : 0;console.log(JSON.stringify({checks:report.checks.length,failures:report.checks.filter(c=>!c.ok),errors:report.errors,viewports:report.viewports.map(v=>({viewport:v.viewport,mode:v.mode,height:v.height,cut:v.cut})),output}));}
let browser;
(async()=>{
 browser=await chromium.launch({headless:true});
 for(const [width,height] of (process.env.UNO_QA_INTERACTIONS_ONLY ? [] : [[320,568],[360,640],[390,844],[844,390],[768,1024],[1280,720],[1440,900]])){
  const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>report.errors.push(`${width}: ${e.message}`));
  await page.goto(url);await page.waitForTimeout(4500);
  await screenshot(page,`hero-${width}`);
  await scroll(page,'.jornada');
  const geometry=await page.evaluate(()=>{
   let j=document.querySelector('.jornada'),f=j.querySelector('.jornada__fixo'),h=document.querySelector('.topo__in').offsetHeight;
   const root={viewport:[innerWidth,innerHeight],mode:j.classList.contains('is-sticky')?'sticky':'linear',height:j.offsetHeight,stickyHeight:f.offsetHeight};
   const active=Array.from(j.querySelectorAll('.j-esq,.jm-texto')).filter(e=>e.getBoundingClientRect().width&&getComputedStyle(e).visibility==='visible'&&getComputedStyle(e).opacity!=='0');
   root.texts=active.map(e=>({text:e.innerText,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}));
   root.cut=root.mode==='sticky'&&root.texts.some(e=>e.top<h-1||e.bottom>innerHeight+1);
   root.overflow=document.documentElement.scrollWidth>innerWidth;
   return root;
  });report.viewports.push(geometry);
  check(`journey fit ${width}`,!geometry.cut,geometry);check(`overflow ${width}`,!geometry.overflow);
  await screenshot(page,`journey-${width}`);
  if(geometry.mode==='sticky'){
   for(let i=0;i<4;i++){
    await page.evaluate(k=>{let j=document.querySelector('.jornada'),f=j.querySelector('.jornada__fixo');scrollTo({top:scrollY+j.getBoundingClientRect().top-parseFloat(getComputedStyle(f).top)+(j.offsetHeight-f.offsetHeight)*(k+.15)/4,behavior:'instant'});},i);await page.waitForTimeout(250);
    check(`step ${width}/${i}`,await page.locator('.jornada').getAttribute('data-passo')===String(i));
   }
  }else check(`linear all stages ${width}`,await page.locator('.jm-texto[aria-hidden="false"]').count()===4);
  for(const [sel,name] of [['.capitulo--atria','study'],['.investimento','investment'],['#contato','contact']]){
   await scroll(page,sel);await page.waitForTimeout(name==='study'?4300:300);await screenshot(page,`${name}-${width}`);
  }
  const button=await page.locator('.invest-cartao .btn').evaluate(el=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color,height:el.offsetHeight}));
  check(`mint CTA ${width}`,button.background==='rgb(125, 211, 168)'&&button.color==='rgb(14, 43, 36)'&&button.height>=44,button);
  await page.locator('.invest-cartao .btn').hover();
  const colors=await page.locator('.invest-cartao .btn').evaluate(el=>{
   const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
   const lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
   const c=getComputedStyle(el),a=lum(rgb(c.color)),b=lum(rgb(c.backgroundColor));
   return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  });check(`CTA hover contrast ${width}`,colors>=4.5,colors);
  await page.close();console.log('viewport '+width+' done');
 }
 if(process.env.UNO_QA_VIEWPORTS_ONLY){await browser.close();finish();return;}
 // Isola as emulações de mídia da rodada longa de tamanhos, sem suprimir verificações.
 if(!process.env.UNO_QA_INTERACTIONS_ONLY){await browser.close();browser=await chromium.launch({headless:true});}
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>report.errors.push(e.message));await page.goto(url);
 await page.locator('.menu-botao').focus();await page.keyboard.press('Enter');check('menu keyboard open',await page.locator('.menu-botao').getAttribute('aria-expanded')==='true');await page.keyboard.press('Escape');check('menu Escape focus',await page.locator('.menu-botao').evaluate(e=>e===document.activeElement));
 await scroll(page,'.duvidas');const faq=page.locator('.faq details').nth(1);await faq.locator('summary').focus();await page.keyboard.press('Enter');check('FAQ Enter',await faq.getAttribute('open')!==null);
 await scroll(page,'.capitulo--atria');const opener=page.locator('[data-ampliar="atria"]');await opener.focus();await page.keyboard.press('Enter');check('viewer keyboard opens',await page.locator('#visualizador').evaluate(e=>e.open));
 await screenshot(page,'viewer-mobile');
 for(let i=0;i<12;i++){await page.keyboard.press('Tab');check('viewer focus contained '+i,await page.evaluate(()=>!!document.activeElement.closest('#visualizador')));}
 await page.locator('[data-formato="desk"]').click();check('viewer desktop choice',await page.locator('[data-formato="desk"]').getAttribute('aria-pressed')==='true');await page.keyboard.press('Escape');check('viewer Escape returns',await opener.evaluate(e=>e===document.activeElement));
 await scroll(page,'.capitulo--modulo .comp--mob');await page.waitForTimeout(4300);
 const study=page.locator('.capitulo--modulo .comp--mob [data-estudo]');check('study finite completed',await study.getAttribute('data-anim-concluida')==='1');
 await page.locator('[data-replay="modulo"]').click();await page.waitForTimeout(150);
 check('replay starts actual visible model',await study.evaluate(e=>e.classList.contains('anim-play')));
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(250);check('study pauses offscreen',await study.evaluate(e=>e.classList.contains('is-pausado')));
 await scroll(page,'.capitulo--modulo .comp--mob');await page.waitForTimeout(150);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.classList.contains('rm'));await page.waitForTimeout(250);
 check('mid animation reduce is static',await study.evaluate(e=>!e.classList.contains('anim-play')&&getComputedStyle(e.querySelector('img')).opacity==='1'));
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!document.documentElement.classList.contains('rm'));
 await page.setViewportSize({width:844,height:390});check('orientation linear',!(await page.locator('.jornada').evaluate(e=>e.classList.contains('is-sticky'))));await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.classList.contains('rm')).catch(async error=>{console.log('motion-debug',await page.evaluate(()=>({rm:document.documentElement.className,media:matchMedia('(prefers-reduced-motion: reduce)').matches,visibility:document.visibilityState})));throw error;});check('motion changed live',await page.evaluate(()=>document.documentElement.classList.contains('rm')));check('motion journey full',await page.locator('.jm-texto[aria-hidden="false"]').count()===4);
 await scroll(page,'.capitulo--atria');check('motion study visible',await page.locator('.capitulo--atria .comp--mob .estudo').evaluate(e=>getComputedStyle(e).opacity==='1'&&e.querySelector('img')?.complete));
 await screenshot(page,'reduced-mobile');await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!document.documentElement.classList.contains('rm'));await page.waitForTimeout(250);check('motion restored live',!(await page.evaluate(()=>document.documentElement.classList.contains('rm'))));
 // Backend failures and successes are exclusively mocked in the browser.
 await scroll(page,'#contato');const submit=page.locator('#form-contato button[type="submit"]');await submit.click();check('empty validation',await page.locator('#f-nome').getAttribute('aria-invalid')==='true');
 async function fill(){await page.locator('#f-nome').fill('Pessoa fictícia');await page.locator('#f-empresa').fill('Empresa de teste');await page.locator('#f-canal').fill('teste@example.com');await page.locator('#f-contexto').fill('Teste fictício sem mensagens externas.');}
 await fill();await page.route('**/api/contato',r=>r.fulfill({status:422,contentType:'application/json',body:JSON.stringify({ok:false,erro:'validacao',campos:['canal']})}));await submit.click();await page.waitForTimeout(200);
 check('422 specific field',await page.locator('#f-canal').getAttribute('aria-invalid')==='true');check('422 retained data',await page.locator('#f-contexto').inputValue()==='Teste fictício sem mensagens externas.');await screenshot(page,'form-422');await page.unroute('**/api/contato');
 await page.route('**/api/contato',r=>r.abort('failed'));await submit.click();await page.waitForTimeout(200);check('network error alternative',await page.locator('.form-recuperacao').isVisible());check('network retains data',await page.locator('#f-nome').inputValue()==='Pessoa fictícia');await page.unroute('**/api/contato');
 // Indisponibilidade simulada: jamais enviar ao receptor real.
 await page.route('**/api/contato',r=>r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,erro:'indisponivel'})}));
 await submit.click();await page.waitForTimeout(200);check('simulated 503',await page.locator('#form-aviso').innerText().then(t=>t.includes('temporariamente indisponível')));await screenshot(page,'form-503');await page.unroute('**/api/contato');
 let requests=0;await page.route('**/api/contato',async r=>{requests++;await new Promise(ok=>setTimeout(ok,700));await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,encaminhamento:'smtp_aceito'})});});
 await submit.click();check('loading disabled',await submit.isDisabled());check('loading accessible',await page.locator('#form-contato').getAttribute('aria-busy')==='true');await page.evaluate(()=>document.getElementById('form-contato').dispatchEvent(new Event('submit',{cancelable:true})));await page.waitForTimeout(900);
 check('duplicate prevented',requests===1,requests);check('simulated success',await page.locator('#form-sucesso').isVisible());check('success focus',await page.locator('#form-sucesso h3').evaluate(e=>e===document.activeElement));await screenshot(page,'form-success');await page.close();
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto(url);check('motion at load',await reduced.evaluate(()=>document.documentElement.classList.contains('rm')));await reduced.close();
 const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await touch.goto(url);await touch.locator('[data-ampliar="modulo"]').tap();check('emulated touch viewer',await touch.locator('#visualizador').evaluate(e=>e.open));await touch.locator('[data-fechar]').tap();await touch.close();
 const nojs=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});await nojs.goto(url);check('no JS menu navigable',await nojs.locator('#menu-movel a[href="#contato"]').first().isVisible());await nojs.locator('#menu-movel a[href="#projetos"]').click();check('no JS useful study',await nojs.locator('.capitulo--modulo .estudo-estatico img').isVisible());check('no JS explicit alternatives',await nojs.locator('.form-requer-js').isVisible());check('no JS POST safe',await nojs.locator('#form-contato').getAttribute('method')==='post'&&await nojs.locator('#form-contato button[type=submit]').isDisabled());await nojs.screenshot({path:path.join(output,'nojs-mobile.png')});await nojs.close();
 const zoom=await browser.newPage({viewport:{width:640,height:360},screen:{width:1280,height:720},deviceScaleFactor:2});await zoom.goto(url);check('200% logical reflow',await zoom.evaluate(()=>document.documentElement.scrollWidth===innerWidth&&!document.querySelector('.jornada').classList.contains('is-sticky')));await screenshot(zoom,'zoom-200-reflow');await zoom.close();
 await browser.close();finish();
})().catch(async error=>{await browser?.close();report.errors.push(error.stack || String(error));finish();process.exitCode=1;});
