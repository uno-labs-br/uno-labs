import { execSync } from 'node:child_process';

// O ambiente real da Vercel decide; variáveis locais de prévia não liberam PRs.
const target = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview';
execSync('npm run build', {
  stdio: 'inherit',
  env: { ...process.env, UNO_DEPLOY_TARGET: target },
});
