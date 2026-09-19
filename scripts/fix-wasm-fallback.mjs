// Workaround for machines where a Windows "Application Control" security
// policy blocks Astro's native Rust binaries (satteri / @astrojs/compiler-binding)
// from loading. npm refuses to install the wasm32-wasi optional fallback
// packages automatically because their declared cpu ("wasm32") never matches
// a real machine, so this script fetches and vendors them manually.
//
// Only needed if `npm run dev` / `npm run build` fails with an error like
// "An Application Control policy has blocked this file" pointing at a
// node_modules/@*/*-win32-*.node binary. Safe to run anytime; it skips any
// package that's already present. See README.md for the full explanation.
import { existsSync, mkdtempSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();

const packages = [
  { name: '@bruits/satteri-wasm32-wasi', version: '0.10.5' },
  { name: '@astrojs/compiler-binding-wasm32-wasi', version: '0.4.0' },
];

for (const { name, version } of packages) {
  const dest = join(root, 'node_modules', ...name.split('/'));
  if (existsSync(dest)) {
    console.log(`[fix-wasm-fallback] ${name} already present, skipping.`);
    continue;
  }

  console.log(`[fix-wasm-fallback] vendoring ${name}@${version}...`);
  const work = mkdtempSync(join(tmpdir(), 'fsf-wasm-'));
  try {
    execFileSync('npm', ['pack', `${name}@${version}`], {
      cwd: work,
      stdio: 'inherit',
      shell: true,
    });
    const tarballName = `${name.replace('@', '').replace('/', '-')}-${version}.tgz`;
    execFileSync('tar', ['-xzf', tarballName], { cwd: work, stdio: 'inherit' });
    mkdirSync(dest, { recursive: true });
    cpSync(join(work, 'package'), dest, { recursive: true });
    console.log(`[fix-wasm-fallback] installed ${name} to ${dest}`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

console.log(
  '[fix-wasm-fallback] Done. Run the dev/build/preview scripts with NAPI_RS_FORCE_WASI=true set ' +
    '(see run-dev.cmd) so Astro actually uses these fallback packages instead of the blocked native binaries.',
);
