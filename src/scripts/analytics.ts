import { aoDOMPronto } from './comum';

export const GA_MEASUREMENT_ID = 'G-ZKM57KG6V9';
export const STORAGE_KEY = 'uno_consent_v1';
export const CONSENT_VALIDITY_MS = 180 * 24 * 60 * 60 * 1000; // 180 dias

export type ConsentStatus = 'granted' | 'denied';

export interface ConsentRecord {
  v: 1;
  status: ConsentStatus;
  timestamp: number;
  expiresAt: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let dataLayerIniciada = false;
let scriptInjetado = false;
let sdkCarregado = false;
let configEnviado = false;
let pageviewEnviada = false;
let listenersContatoIniciados = false;
let consentimentoInicializado = false;
let timerExpiracao: ReturnType<typeof setTimeout> | null = null;
let elementoAnteriorAoAbrir: HTMLElement | null = null;

const TAXONOMIA_PERMITIDA = new Set(['page_view', 'form_start', 'generate_lead', 'contact_click']);

const PARAMETROS_PERMITIDOS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'gclsrc',
  'dclid',
  'fbclid',
  'msclkid',
  'ttclid',
]);

const CANAIS_PERMITIDOS = new Set(['whatsapp', 'email']);
const CTAS_PERMITIDOS = new Set([
  'whatsapp_contato',
  'email_contato',
  'whatsapp_recuperacao',
  'email_recuperacao',
  'whatsapp_nojs',
  'email_nojs',
  'whatsapp_canal_topo',
  'whatsapp_canal_hero',
  'whatsapp_canal_teste',
  'whatsapp_canal_plano',
  'whatsapp_canal_contato',
]);
const POSICOES_PERMITIDAS = new Set(['contato', 'form_recuperacao', 'form_nojs', 'canal_topo', 'canal_hero', 'canal_teste', 'canal_planos', 'canal_contato']);

/** Verifica se a execução está no ambiente oficial de produção (HTTPS e hostname permitido). */
export function isAmbientePermitido(): boolean {
  if (typeof window === 'undefined') return false;
  const banner = document.getElementById('banner-consentimento');
  const target = banner?.getAttribute('data-deploy-target') ?? (import.meta.env.UNO_DEPLOY_TARGET as string | undefined);
  if (target !== 'production') return false;
  const proto = window.location.protocol;
  const host = window.location.hostname;
  return proto === 'https:' && (host === 'unolabs.com.br' || host === 'www.unolabs.com.br');
}

/** Verifica se um valor de parâmetro parece conter e-mail ou telefone. */
function contemDadosPessoais(valor: string): boolean {
  if (valor.includes('@')) return true;
  return /(?:^|[^a-z0-9])\+?\d[\d\s().-]{7,}\d(?:$|[^a-z0-9])/i.test(valor);
}

function ehPagina404(): boolean {
  if (typeof document === 'undefined') return false;
  const h1 = document.querySelector('h1');
  if (h1 && h1.textContent && h1.textContent.includes('Esta página não existe')) return true;
  const rotuloErro = document.querySelector('.pagina.hero .rotulo');
  if (rotuloErro && rotuloErro.textContent && rotuloErro.textContent.includes('404')) return true;
  return false;
}

/** Sanitiza a URL de localização da página omitindo fragmentos, credenciais e query params não homologados. */
export function sanitizarPageLocation(urlBruta = window.location.href): string {
  try {
    // 404 estático: evita ecoar URLs arbitrárias contendo e-mails ou telefones digitados no pathname
    if (ehPagina404()) {
      return new URL('/404', window.location.origin).href;
    }

    const entrada = new URL(urlBruta, window.location.origin);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
    const parsed = new URL(canonical || window.location.origin);
    parsed.username = '';
    parsed.password = '';
    parsed.hash = '';

    const novosParams = new URLSearchParams();
    entrada.searchParams.forEach((valor, chave) => {
      const chaveLower = chave.toLowerCase();
      if (PARAMETROS_PERMITIDOS.has(chaveLower) && !contemDadosPessoais(valor)) {
        novosParams.set(chaveLower, valor);
      }
    });
    parsed.search = novosParams.toString();
    return parsed.href;
  } catch {
    return '';
  }
}

/** Sanitiza o referrer: para origens externas preserva apenas origem; interno, caminho limpo. */
export function sanitizarPageReferrer(referrerBruto = document.referrer): string {
  if (!referrerBruto) return '';
  try {
    const parsed = new URL(referrerBruto);
    parsed.username = '';
    parsed.password = '';
    parsed.hash = '';
    parsed.search = '';

    if (parsed.origin !== window.location.origin) {
      return `${parsed.origin}/`;
    }
    const caminhosPublicos = new Set(['/', '/blog/', '/politica-de-privacidade/', '/whatsapp/']);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
    if (canonical) caminhosPublicos.add(new URL(canonical).pathname);
    return caminhosPublicos.has(parsed.pathname) ? `${parsed.origin}${parsed.pathname}` : `${parsed.origin}/`;
  } catch {
    return '';
  }
}

/** Valida rigorosamente e lê o registro de consentimento armazenado. */
export function obterConsentimentoArmazenado(): ConsentStatus | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const record = JSON.parse(raw) as Partial<ConsentRecord>;
    const agora = Date.now();

    if (
      typeof record === 'object' &&
      record !== null &&
      record.v === 1 &&
      (record.status === 'granted' || record.status === 'denied') &&
      typeof record.timestamp === 'number' &&
      Number.isFinite(record.timestamp) &&
      typeof record.expiresAt === 'number' &&
      Number.isFinite(record.expiresAt) &&
      record.timestamp <= agora + 60000 &&
      record.expiresAt > agora &&
      record.timestamp >= 0 &&
      record.expiresAt > record.timestamp &&
      record.expiresAt - record.timestamp <= CONSENT_VALIDITY_MS
    ) {
      programarTimerExpiracao(record.expiresAt);
      return record.status;
    }

    // Registro inválido ou expirado
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage inacessível
  }
  return null;
}

/** Persiste a decisão do visitante; retorna false em caso de falha de storage. */
export function salvarConsentimentoArmazenado(status: ConsentStatus): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const agora = Date.now();
    const record: ConsentRecord = {
      v: 1,
      status,
      timestamp: agora,
      expiresAt: agora + CONSENT_VALIDITY_MS,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    programarTimerExpiracao(record.expiresAt);
    return true;
  } catch {
    return false;
  }
}

const MAX_TIMEOUT_MS = 2147483647; // Máximo para setTimeout seguro (32-bit int)

/** Programa o timer para expirar a decisão na aba ativa. */
function programarTimerExpiracao(expiresAt: number): void {
  if (timerExpiracao !== null) {
    clearTimeout(timerExpiracao);
    timerExpiracao = null;
  }
  const restante = expiresAt - Date.now();
  if (restante <= 0) {
    desativarMedicaoGA();
    return;
  }
  timerExpiracao = setTimeout(() => {
    timerExpiracao = null;
    if (obterConsentimentoArmazenado() !== 'granted') {
      desativarMedicaoGA();
    }
  }, Math.min(restante, MAX_TIMEOUT_MS));
}

/** Define a flag nativa do Google para opt-out / desativação do GA4. */
export function aplicarOptOutGA(desativar: boolean): void {
  if (typeof window === 'undefined') return;
  const chave = `ga-disable-${GA_MEASUREMENT_ID}` as const;
  if (desativar) {
    window[chave] = true;
  } else {
    delete window[chave];
  }
}

/** Remove cookies de análise do escopo atual (_ga e _ga_*). */
export function removerCookiesGA(): void {
  if (typeof document === 'undefined') return;
  try {
    const cookies = document.cookie.split(';');
    const hostname = window.location.hostname;
    const dominios = ['', hostname, `.${hostname}`];
    const partes = hostname.split('.');
    for (let i = 0; i < partes.length - 1; i++) {
      const dominioPai = partes.slice(i).join('.');
      dominios.push(dominioPai, `.${dominioPai}`);
    }
    const dominiosUnicos = Array.from(new Set(dominios));
    const paths = ['/', window.location.pathname];

    for (const cookieStr of cookies) {
      const nome = cookieStr.split('=')[0].trim();
      if (nome === '_ga' || nome.startsWith('_ga_')) {
        for (const dom of dominiosUnicos) {
          for (const p of paths) {
            const domAttr = dom ? `; domain=${dom}` : '';
            document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}${domAttr}; SameSite=Lax`;
            document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}${domAttr}`;
          }
        }
      }
    }
  } catch {
    // Falha silenciosa
  }
}

/** Inicializa dataLayer, gtag com arguments e consent default exatamente uma vez. */
function prepararDataLayer(): void {
  if (typeof window === 'undefined' || !isAmbientePermitido() || dataLayerIniciada) return;
  dataLayerIniciada = true;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(): void {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }

  // 1. Consent default denied
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  // 2. Set de contexto e restrições de privacidade
  window.gtag('set', {
    restricted_data_processing: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: sanitizarPageLocation(),
    page_referrer: sanitizarPageReferrer(),
  });

  // 3. gtag('js', new Date()) oficial
  window.gtag('js', new Date());
}

/** Injeta a tag gtag.js uma única vez quando consentido. */
function carregarScriptGtag(): void {
  if (scriptInjetado || typeof document === 'undefined') return;
  scriptInjetado = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.addEventListener('load', () => {
    sdkCarregado = true;
    configurarMedicaoGA();
  }, { once: true });
  document.head.appendChild(script);
}

/** Ativa a medição do GA4 mantendo os parâmetros de publicidade desativados. */
function ativarMedicaoGA(): void {
  if (!isAmbientePermitido()) return;
  prepararDataLayer();
  aplicarOptOutGA(false);

  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  carregarScriptGtag();
  configurarMedicaoGA();
}

/** Só configura a biblioteca pronta, com a decisão revalidada após o download. */
function configurarMedicaoGA(): void {
  if (!sdkCarregado || !isAmbientePermitido()) return;
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`] || obterConsentimentoArmazenado() !== 'granted') return;
  if (!configEnviado) {
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      restricted_data_processing: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: sanitizarPageLocation(),
      page_referrer: sanitizarPageReferrer(),
    });
    configEnviado = true;
  }

  if (!pageviewEnviada) {
    window.gtag?.('event', 'page_view', {
      page_location: sanitizarPageLocation(),
      page_referrer: sanitizarPageReferrer(),
    });
    pageviewEnviada = true;
  }
}

/** Executa a revogação imediata da medição do GA4. */
function desativarMedicaoGA(): void {
  aplicarOptOutGA(true);
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
  removerCookiesGA();
  if (timerExpiracao !== null) {
    clearTimeout(timerExpiracao);
    timerExpiracao = null;
  }
}

/** Envia um evento de tracking com verificação estrita de taxonomia e consentimento. */
export function trackEvento(nomeEvento: string, parametros: Record<string, string | number | boolean> = {}): boolean {
  if (!sdkCarregado || !configEnviado || !isAmbientePermitido()) return false;
  if (!TAXONOMIA_PERMITIDA.has(nomeEvento)) return false;
  if (obterConsentimentoArmazenado() !== 'granted') { desativarMedicaoGA(); return false; }
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return false;

  const metadados: Record<string, string> = {};
  if (nomeEvento === 'form_start') {
    if (parametros.form_id !== 'form-contato' || parametros.form_name !== 'contato') return false;
    metadados.form_id = 'form-contato'; metadados.form_name = 'contato';
  } else if (nomeEvento === 'generate_lead') {
    if (parametros.lead_channel !== 'form_contato') return false;
    metadados.lead_channel = 'form_contato';
  } else if (nomeEvento === 'contact_click') {
    if (typeof parametros.contact_channel !== 'string' || !CANAIS_PERMITIDOS.has(parametros.contact_channel) ||
        typeof parametros.cta_id !== 'string' || !CTAS_PERMITIDOS.has(parametros.cta_id) ||
        typeof parametros.cta_position !== 'string' || !POSICOES_PERMITIDAS.has(parametros.cta_position)) return false;
    metadados.contact_channel = parametros.contact_channel;
    metadados.cta_id = parametros.cta_id; metadados.cta_position = parametros.cta_position;
  }

  try {
    const payload = {
      page_location: sanitizarPageLocation(),
      page_referrer: sanitizarPageReferrer(),
      ...metadados,
    };
    window.gtag?.('event', nomeEvento, payload);
    return true;
  } catch {
    // Falha do tracker nunca quebra interações
    return false;
  }
}

/** Registra início de preenchimento real do formulário de contato. */
let formStartEnviado = false;
export function registrarInicioFormulario(): void {
  if (formStartEnviado) return;
  if (obterConsentimentoArmazenado() !== 'granted') return;
  formStartEnviado = trackEvento('form_start', {
    form_id: 'form-contato',
    form_name: 'contato',
  });
}

/** Permite redefinir o estado de form_start se o formulário for reiniciado com sucesso. */
export function redefinirInicioFormulario(): void {
  formStartEnviado = false;
}

/** Registra confirmação válida de encaminhamento pelo serviço de e-mail. */
export function registrarLead(): void {
  trackEvento('generate_lead', {
    lead_channel: 'form_contato',
  });
}

/** Registra clique comercial real (WhatsApp ou e-mail com data-* explícitos). */
export function registrarCliqueContato(dados: {
  contact_channel: string;
  cta_id: string;
  cta_position: string;
}): void {
  const channel = dados.contact_channel.toLowerCase();
  const ctaId = dados.cta_id.toLowerCase();
  const position = dados.cta_position.toLowerCase();

  if (!CANAIS_PERMITIDOS.has(channel) || !CTAS_PERMITIDOS.has(ctaId) || !POSICOES_PERMITIDAS.has(position)) {
    return;
  }

  trackEvento('contact_click', {
    contact_channel: channel,
    cta_id: ctaId,
    cta_position: position,
  });
}

/** Aplica a decisão de consentimento (granted ou denied) atualizando estado e persistência. */
export function aplicarDecisaoConsentimento(status: ConsentStatus): void {
  const salvo = salvarConsentimentoArmazenado(status);
  if (!salvo) {
    // Fail-closed: storage indisponível não concede acesso nem deixa estado inconsistente
    desativarMedicaoGA();
    fecharPreferenciasConsentimento('Não foi possível salvar sua preferência neste navegador.');
    return;
  }

  if (status === 'granted') {
    ativarMedicaoGA();
    fecharPreferenciasConsentimento('Preferência salva: medição autorizada.');
  } else {
    desativarMedicaoGA();
    fecharPreferenciasConsentimento('Preferência salva: medição recusada.');
  }
}

/** Atualiza a UI do banner e o anúncio acessível para leitores de tela. */
function atualizarUIBanner(aberto: boolean, statusAviso = ''): void {
  const banner = document.getElementById('banner-consentimento');
  const aviso = document.getElementById('banner-consentimento-status');
  if (banner) {
    banner.hidden = !aberto;
  }
  if (aviso && statusAviso) {
    aviso.textContent = statusAviso;
  }
}

/** Abre a região de consentimento e move o foco para o primeiro botão. */
export function abrirPreferenciasConsentimento(): void {
  elementoAnteriorAoAbrir = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  atualizarUIBanner(true);
  const primeiroBotao = document.querySelector<HTMLButtonElement>('.banner-consentimento [data-consentimento]');
  primeiroBotao?.focus({ preventScroll: true });
}

/** Fecha o banner e devolve o foco com preventScroll ao elemento anterior. */
export function fecharPreferenciasConsentimento(statusAviso = ''): void {
  atualizarUIBanner(false, statusAviso);
  if (elementoAnteriorAoAbrir) {
    elementoAnteriorAoAbrir.focus({ preventScroll: true });
    elementoAnteriorAoAbrir = null;
  }
}

/** Inicializa listeners dos links comerciais para contact_click. */
function iniciarListenersContato(): void {
  if (listenersContatoIniciados || typeof document === 'undefined') return;
  listenersContatoIniciados = true;

  document.addEventListener('click', (evento) => {
    const alvo = (evento.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[data-contact-channel]');
    if (!alvo) return;
    const channel = alvo.getAttribute('data-contact-channel');
    const ctaId = alvo.getAttribute('data-cta-id');
    const ctaPosition = alvo.getAttribute('data-cta-position');
    if (channel && ctaId && ctaPosition) {
      registrarCliqueContato({
        contact_channel: channel,
        cta_id: ctaId,
        cta_position: ctaPosition,
      });
    }
  });
}

/** Inicializa a interface de consentimento de forma idempotente. */
export function iniciarConsentimento(): void {
  if (consentimentoInicializado || typeof window === 'undefined') return;
  consentimentoInicializado = true;

  iniciarListenersContato();

  const decisaoSalva = obterConsentimentoArmazenado();
  if (decisaoSalva === 'granted') {
    atualizarUIBanner(false);
    ativarMedicaoGA();
  } else if (decisaoSalva === 'denied') {
    atualizarUIBanner(false);
    desativarMedicaoGA();
  } else {
    // Pendente: exibe o banner e inicializa a dataLayer com default denied
    prepararDataLayer();
    atualizarUIBanner(true);
  }

  // Sincronização multi-aba: clear(), remoção ou alteração
  window.addEventListener('storage', (evento) => {
    if (evento.key === null || evento.key === STORAGE_KEY) {
      const statusAtual = obterConsentimentoArmazenado();
      if (statusAtual === 'granted') {
        atualizarUIBanner(false);
        ativarMedicaoGA();
      } else {
        atualizarUIBanner(false);
        desativarMedicaoGA();
      }
    }
  });

  // Revalidação em retorno à aba (visibilitychange / focus) para tratar expiração
  const checarExpiracaoAba = (): void => {
    const status = obterConsentimentoArmazenado();
    if (status !== 'granted') {
      desativarMedicaoGA();
    }
  };
  document.addEventListener('visibilitychange', checarExpiracaoAba);
  window.addEventListener('visibilitychange', checarExpiracaoAba);
  window.addEventListener('focus', checarExpiracaoAba);

  // Botões de Aceitar, Recusar e Fechar no banner
  const botaoAceitar = document.querySelector<HTMLButtonElement>('[data-consentimento="aceitar"]');
  const botaoRecusar = document.querySelector<HTMLButtonElement>('[data-consentimento="recusar"]');
  const botaoFechar = document.querySelector<HTMLButtonElement>('[data-consentimento="fechar"]');

  botaoAceitar?.addEventListener('click', () => {
    aplicarDecisaoConsentimento('granted');
  });

  botaoRecusar?.addEventListener('click', () => {
    aplicarDecisaoConsentimento('denied');
  });

  botaoFechar?.addEventListener('click', () => {
    // Fechar sem salvar: mantém pendente e GA bloqueado
    fecharPreferenciasConsentimento();
  });

  // Botões permanentes de reabertura ("Preferências de cookies")
  document.addEventListener('click', (evento) => {
    const alvo = (evento.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-abrir-cookies]');
    if (alvo) {
      evento.preventDefault();
      abrirPreferenciasConsentimento();
    }
  });

  // Teclado: Escape fecha o banner
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      const banner = document.getElementById('banner-consentimento');
      if (banner && !banner.hidden) {
        fecharPreferenciasConsentimento();
      }
    }
  });
}

aoDOMPronto(iniciarConsentimento);
