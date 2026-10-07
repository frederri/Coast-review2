// Golden output: field hashes + canvas pixel hashes (+ screenshots) for every
// combination, so an optimized file can be proven identical.
// usage: node perf/golden.js <html> <out.json> [--shots=dir] [--only=regex] [--par=4]
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const args = process.argv.slice(2);
const file = args[0], outFile = args[1];
const opt = k => (args.find(a => a.startsWith('--' + k + '=')) || '').slice(k.length + 3);
const shots = opt('shots'), only = opt('only'), PAR = +(opt('par') || 4);
if (shots) fs.mkdirSync(shots, { recursive: true });

const CHARS = ['div', 'jag', 'grd', 'mix'], MODES = ['plain', 'pen', 'sea'], WIDTHS = [200, 500, 1000, 20000];
const SEEDS = [11, 42, 2024, 90210];
const TILT = [[0, 0], [-0.2, 0.15], [0.25, -0.1], [0.1, 0.3]];
const PTS = [['edge', 0.06, 0.05, 0.05, -0.05], ['centre', 0.5, 0, 0, 0], ['high', 0.45, -0.35, 0.1, 0.05], ['low', 0.55, 0.35, -0.05, -0.1]];
const VW = 1280, VH = 800;
function hashFor(seed, km, chr, mode, ctrl, i){
  const Hkm = km*VH/VW, f = v => (v*Hkm).toFixed(2);
  if (ctrl === 'tilt') return `#seed=${seed}&km=${km}&chr=${chr}&mode=${mode}&ctrl=tilt&l=${f(TILT[i][0])}&r=${f(TILT[i][1])}`;
  const p = PTS[i];
  return `#seed=${seed}&km=${km}&chr=${chr}&mode=${mode}&ctrl=points&l=${f(p[3])}&r=${f(p[4])}&mx=${(p[1]*km).toFixed(2)}&mu=${f(p[2])}`;
}

// in-page: hash every typed array and number on the field, and the canvas pixels
const PAGE_HASH = () => {
  const fnv = (u8, h) => { for (let i = 0; i < u8.length; i++){ h ^= u8[i]; h = Math.imul(h, 16777619); } return h >>> 0; };
  const F = window.coastDebug.field, parts = {};
  for (const k of Object.keys(F).sort()){
    const v = F[k];
    if (ArrayBuffer.isView(v)) parts[k] = fnv(new Uint8Array(v.buffer, v.byteOffset, v.byteLength), 2166136261).toString(16) + ':' + v.length;
    else if (typeof v === 'number' || typeof v === 'boolean') parts[k] = String(v);
  }
  const c = document.getElementById('c'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  const field = fnv(new TextEncoder().encode(JSON.stringify(parts)), 2166136261).toString(16);
  return { field, pixels: fnv(d, 2166136261).toString(16) + ':' + c.width + 'x' + c.height, parts, state: window.coastDebug.state };
};
const SEED_RANDOM = () => {
  let a = 12345;
  Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0)/4294967296; };
};

const jobs = [];
for (const chr of CHARS) for (const mode of MODES) for (const ctrl of ['tilt', 'points']) for (const km of WIDTHS)
  SEEDS.forEach((seed, i) => jobs.push({ kind: 'static', name: `${chr}_${mode}_${ctrl}_${km}km_s${seed}_${ctrl === 'tilt' ? 'd' + i : PTS[i][0]}`, hash: hashFor(seed, km, chr, mode, ctrl, i), w: VW, h: VH }));
// window sizes and fullscreen
for (const chr of CHARS) for (const mode of MODES) for (const [w, h] of [[1920, 1080], [1000, 1000], [800, 1200], [1600, 700]])
  jobs.push({ kind: 'static', name: `${chr}_${mode}_tilt_1000km_s42_win${w}x${h}`, hash: `#seed=42&km=1000&chr=${chr}&mode=${mode}&ctrl=tilt&l=0&r=0`, w, h });
// interaction sequences: every button, the width box, drags, resize
for (const chr of CHARS) jobs.push({ kind: 'seq', name: `seq_${chr}`, chr });

async function waitGen(p, n){ await p.waitForFunction(n => +document.documentElement.dataset.gen >= n, n, { timeout: 600000, polling: 50 }); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => r()))); }
async function rec(p, name, out){
  const h = await p.evaluate(PAGE_HASH);
  out[name] = { field: h.field, pixels: h.pixels, parts: h.parts, state: h.state };
  if (shots) await p.screenshot({ path: path.join(shots, name + '.png') });
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const url = 'file://' + path.resolve(file);
  const out = {}, errors = [];
  const re = only ? new RegExp(only) : null;
  const todo = jobs.filter(j => !re || re.test(j.name));
  let k = 0, done = 0;
  const t0 = Date.now();
  await Promise.all(Array.from({ length: PAR }, async () => {
    while (k < todo.length){
      const j = todo[k++];
      const p = await browser.newPage({ viewport: { width: j.w || VW, height: j.h || VH }, deviceScaleFactor: 1 });
      p.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().includes('willReadFrequently')) errors.push(`${j.name}: [${m.type()}] ${m.text()}`); });
      p.on('pageerror', e => errors.push(`${j.name}: [pageerror] ${e.message}`));
      await p.addInitScript(SEED_RANDOM);
      if (j.kind === 'static'){
        await p.goto(url + j.hash, { waitUntil: 'commit', timeout: 600000 });
        await waitGen(p, 1);
        await rec(p, j.name, out);
      } else {
        await p.goto(url + `#seed=7&km=1000&chr=${j.chr}&mode=plain&ctrl=tilt&l=0&r=0`, { waitUntil: 'commit', timeout: 600000 });
        let g = 1; await waitGen(p, g);
        const step = async (label, act) => { await act(); await waitGen(p, ++g); await rec(p, `${j.name}_${String(g).padStart(2, '0')}_${label}`, out); };
        const click = sel => () => p.click(sel);
        await step('newcoast', click('#reroll'));
        await step('dots_tilt', click('#dots'));
        // drag the left handle in Tilt: preview frames, then release
        {
          const st = await p.evaluate(() => window.coastDebug.state);
          const y0 = (0.5 + st.offL/st.Hkm)*VH;
          await p.mouse.move(12, y0); await p.mouse.down();
          for (let s = 1; s <= 4; s++){ await p.mouse.move(12, y0 - 25*s); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); }
          await rec(p, `${j.name}_${String(g).padStart(2, '0')}_tiltdrag_preview`, out);
          await p.mouse.up(); await waitGen(p, ++g);
          await rec(p, `${j.name}_${String(g).padStart(2, '0')}_tiltdrag_release`, out);
        }
        await step('to_points', click('#ctrl button[data-ctrl=points]'));
        await step('dots_points', click('#dots'));
        // drag the free dot in Points, then release
        {
          const st = await p.evaluate(() => window.coastDebug.state);
          const x0 = st.pMx/st.Wkm*VW, y0 = (0.5 + st.pMu/st.Hkm)*VH;
          await p.mouse.move(x0, y0); await p.mouse.down();
          for (let s = 1; s <= 4; s++) await p.mouse.move(x0 + 30*s, y0 + 15*s);
          await p.evaluate(() => new Promise(r => requestAnimationFrame(r)));
          await rec(p, `${j.name}_${String(g).padStart(2, '0')}_pointsdrag_preview`, out);
          await p.mouse.up(); await waitGen(p, ++g);
          await rec(p, `${j.name}_${String(g).padStart(2, '0')}_pointsdrag_release`, out);
        }
        await step('width500', async () => { await p.fill('#km', '500'); await p.dispatchEvent('#km', 'change'); });
        await step('mode_pen', click('#mode button[data-mode=pen]'));
        await step('mode_sea', click('#mode button[data-mode=sea]'));
        await step('to_tilt', click('#ctrl button[data-ctrl=tilt]'));
        await step('mode_plain', click('#mode button[data-mode=plain]'));
        await step('width200', async () => { await p.fill('#km', '200'); await p.dispatchEvent('#km', 'change'); });
        const next = { div: 'jag', jag: 'grd', grd: 'mix', mix: 'div' }[j.chr];
        await step('char_' + next, click(`#char button[data-char=${next}]`));
        await step('resize', () => p.setViewportSize({ width: 1500, height: 900 }));
        await step('space', async () => { await p.mouse.click(640, 700); await p.keyboard.press('Space'); });
      }
      await p.close();
      done++;
      if (done % 10 === 0) console.log(done, '/', todo.length, Math.round((Date.now() - t0)/1000) + 's');
    }
  }));
  await browser.close();
  fs.writeFileSync(outFile, JSON.stringify({ out, errors }, null, 0));
  console.log('done', Object.keys(out).length, 'records', errors.length, 'console errors/warnings', Math.round((Date.now() - t0)/1000) + 's');
})();
