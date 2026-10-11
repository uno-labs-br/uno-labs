export const site = {
  name: 'UNO Labs',
  origin: 'https://unolabs.com.br',
  email: 'contato@unolabs.com.br',
  telephone: '+5527936185141',
  whatsapp: 'https://wa.me/5527936185141',
  shareImage: '/assets/img/og-unolabs.png',
} as const;

const target: unknown = import.meta.env.UNO_DEPLOY_TARGET ?? 'preview';
if (target !== 'preview' && target !== 'production') {
  throw new Error('UNO_DEPLOY_TARGET deve ser preview ou production.');
}
export const isPreview = target === 'preview';

export const productOrigins = {
  sites: 'https://sites.unolabs.com.br',
  chat: 'https://chat.unolabs.com.br',
  mail: 'https://mail.unolabs.com.br',
} as const;

export const productDomainsReady = import.meta.env.UNO_PRODUCT_DOMAINS_READY === 'true';

export function canonicalURL(path: string): string {
  if (productDomainsReady && path === '/whatsapp/') return `${productOrigins.chat}/`;
  if (productDomainsReady && path === '/email-marketing/') return `${productOrigins.mail}/`;
  return new URL(path, site.origin).href;
}

export function productHref(path: '/whatsapp/' | '/email-marketing/'): string {
  return productDomainsReady ? canonicalURL(path) : path;
}
