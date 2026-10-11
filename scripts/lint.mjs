import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function checkDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) checkDirectory(path);
    else if (/\.(?:js|mjs|cjs)$/.test(entry.name)) execFileSync(process.execPath, ['--check', path], { stdio: 'inherit' });
  }
}

for (const directory of ['worker', 'scripts', 'tests']) checkDirectory(directory);
execFileSync('git', ['diff', '--check'], { stdio: 'inherit' });
