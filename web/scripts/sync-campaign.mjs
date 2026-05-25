/* sync-campaign.mjs — bridge the prep pillar into the runner.
 *
 * Mirrors ../campaign/ markdown into src/content/campaign/, which the Library
 * (and any tool globbing src/content) then picks up automatically.
 *
 * PRIVACY: campaign/ holds GM secrets (plot threads, NPC secrets). A GitHub
 * Pages site can be world-readable even for a private repo, so we DO NOT bundle
 * campaign notes into a production build by default. Bundling happens only when:
 *   - run with --force        (the `predev` hook → local table use), or
 *   - VITE_BUNDLE_CAMPAIGN=1   (opt-in for a deploy you've confirmed is private).
 * Otherwise this script STRIPS src/content/campaign so nothing private ships.
 */
import { readdirSync, statSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../../campaign');
const DEST = resolve(here, '../src/content/campaign');

const force = process.argv.includes('--force');
const bundle = force || process.env.VITE_BUNDLE_CAMPAIGN === '1';

function rmrf(p) { if (existsSync(p)) rmSync(p, { recursive: true, force: true }); }

if (!bundle) {
  rmrf(DEST);
  console.log('[sync-campaign] OFF — campaign notes excluded from build (default). '
    + 'Use `npm run dev` (auto), or set VITE_BUNDLE_CAMPAIGN=1 to opt in.');
  process.exit(0);
}

if (!existsSync(SRC)) {
  console.log('[sync-campaign] no ../campaign directory found; nothing to sync.');
  process.exit(0);
}

rmrf(DEST); // clean mirror each run
let count = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.md')) {
      const target = join(DEST, relative(SRC, full));
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(full, target);
      count++;
    }
  }
})(SRC);

console.log(`[sync-campaign] bundled ${count} campaign file(s) into the Library. `
  + 'LOCAL/opt-in — do not publish private notes to a public Pages site.');
