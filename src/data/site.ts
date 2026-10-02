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

export function canonicalURL(path: string): string {
  return new URL(path, site.origin).href;
}
