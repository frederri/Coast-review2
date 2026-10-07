// Render the Mixed coast (Coast mode only) at 1000, 500 and 200 km for a
// fixed set of seeds and dot positions, so every round renders the same set.
// usage: node tools/render.js <html file> <out dir> <prefix> [--only=regex] [--sizes]
const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node-tools/node_modules/playwright');

const [file, outDir, prefix] = process.argv.slice(2);
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
const sizes = process.argv.includes('--sizes');
fs.mkdirSync(outDir, { recursive: true });

const SEEDS = [11, 42, 137, 2024, 5309, 90210];
const WIDTHS = [1000, 500, 200];
// tilt handles (fractions of the view height, l and r), one set per seed
const TILT = [[0, 0], [-0.2, 0.15], [0.25, -0.1], [0.1, 0.3], [-0.3, -0.05], [0.15, -0.25]];
// points: free dot (mx as fraction of width, mu as fraction of view height;
// negative is up/landward), plus end dots; one per seed
const PTS = [
  { name: 'edgeL', mx: 0.08, mu: 0.0, l: 0.05, r: -0.05 },
  { name: 'centre', mx: 0.5, mu: 0.0, l: 0.0, r: 0.0 },
  { name: 'high', mx: 0.45, mu: -0.32, l: 0.1, r: 0.05 },
  { name: 'low', mx: 0.55, mu: 0.32, l: -0.05, r: -0.1 },
  { name: 'edgeR', mx: 0.92, mu: 0.15, l: 0.0, r: 0.1 },
  { name: 'midHighL', mx: 0.3, mu: -0.2, l: 0.2, r: -0.15 },
];
const VW = 1280, VH = 800;

function hashFor(seed, km, ctrl, i, H){
  const Hkm = km*H/VW;
  if (ctrl === 'tilt'){
    const [l, r] = TILT[i];
    return `#seed=${seed}&km=${km}&chr=mix&mode=plain&ctrl=tilt&l=${(l*Hkm).toFixed(1)}&r=${(r*Hkm).toFixed(1)}`;
  }
  const p = PTS[i];
  return `#seed=${seed}&km=${km}&chr=mix&mode=plain&ctrl=points&l=${(p.l*Hkm).toFixed(1)}&r=${(p.r*Hkm).toFixed(1)}&mx=${(p.mx*km).toFixed(1)}&mu=${(p.mu*Hkm).toFixed(1)}`;
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const url = 'file://' + path.resolve(file);
  const errors = [];
  async function shot(hash, w, h, out){
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${out}: [${m.type()}] ${m.text()}`); });
    page.on('pageerror', e => errors.push(`${out}: [pageerror] ${e.message}`));
    await page.goto(url + hash, { waitUntil: 'commit', timeout: 300000 });
    await page.waitForFunction(() => document.documentElement.dataset.gen >= 1, null, { timeout: 300000, polling: 500 });
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(outDir, out) });
    await page.close();
  }
  const jobs = [];
  if (!sizes){
    for (const km of WIDTHS) SEEDS.forEach((seed, i) => {
      jobs.push([hashFor(seed, km, 'tilt', i, VH), VW, VH, `${prefix}_${km}km_seed${seed}_tilt.png`]);
      jobs.push([hashFor(seed, km, 'points', i, VH), VW, VH, `${prefix}_${km}km_seed${seed}_points-${PTS[i].name}.png`]);
    });
  } else {
    // window-size / fullscreen stability: same coast, different windows
    for (const [w, h, tag] of [[1280, 800, 'w1280x800'], [1920, 1080, 'fullscreen1920x1080'], [1000, 1000, 'w1000x1000'], [1600, 700, 'w1600x700']])
      for (const km of [1000, 200])
        jobs.push([`#seed=42&km=${km}&chr=mix&mode=plain&ctrl=tilt&l=0&r=0`, w, h, `${prefix}_${km}km_seed42_tilt_${tag}.png`]);
  }
  const re = only ? new RegExp(only) : null;
  const todo = jobs.filter(j => !re || re.test(j[3]));
  const N = 3;
  let k = 0;
  await Promise.all(Array.from({ length: N }, async () => {
    while (k < todo.length){ const j = todo[k++]; const t = Date.now(); await shot(...j); console.log(j[3], Date.now() - t, 'ms'); }
  }));
  await browser.close();
  fs.writeFileSync(path.join(outDir, `${prefix}_console.txt`), errors.join('\n') || 'no console errors or warnings');
  console.log(errors.length ? errors.join('\n') : 'no console errors or warnings');
})();
