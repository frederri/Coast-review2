// Timings, median of 5, per character and width, for every user action.
// usage: node perf/timing.js <html> <out.json> [--only=regex] [--par=2]
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const args = process.argv.slice(2);
const file = args[0], outFile = args[1];
const opt = k => (args.find(a => a.startsWith('--' + k + '=')) || '').slice(k.length + 3);
const only = opt('only'), PAR = +(opt('par') || 2), REP = +(opt('rep') || 5);
const CHARS = ['div', 'jag', 'grd', 'mix'], WIDTHS = [1000, 500, 200];
const NEXTW = { 1000: 500, 500: 200, 200: 1000 };
const VW = 1280, VH = 800;
const INIT = () => {
  let a = 777;
  Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0)/4294967296; };
  // time every animation-frame callback: a Tilt drag paints its preview there
  const raf = window.requestAnimationFrame.bind(window);
  window.FRAMES = [];
  window.requestAnimationFrame = cb => raf(t => { const s = performance.now(); cb(t); window.FRAMES.push(performance.now() - s); });
};
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[(s.length - 1) >> 1] + (s.length % 2 ? 0 : (s[s.length >> 1] - s[(s.length - 1) >> 1])/2) : null; };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const url = 'file://' + path.resolve(file);
  const res = {};
  const combos = [];
  for (const chr of CHARS) for (const km of WIDTHS) combos.push({ chr, km });
  const re = only ? new RegExp(only) : null;
  const todo = combos.filter(c => !re || re.test(`${c.chr}_${c.km}`));
  let k = 0;
  await Promise.all(Array.from({ length: PAR }, async () => {
    while (k < todo.length){
      const { chr, km } = todo[k++];
      const T = {}; const add = (n, v) => (T[n] = T[n] || []).push(v);
      const hash = `#seed=42&km=${km}&chr=${chr}&mode=plain&ctrl=tilt&l=0&r=0`;
      const gen = p => p.evaluate(() => +document.documentElement.dataset.gen);
      const until = async (p, n) => p.waitForFunction(n => +document.documentElement.dataset.gen >= n, n, { timeout: 600000, polling: 5 });
      const timed = async (p, name, act) => { const n = await gen(p) + 1; const t = Date.now(); await act(); await until(p, n); add(name, Date.now() - t); };
      // first load: fresh pages
      let p = null;
      for (let r = 0; r < REP; r++){
        if (p) await p.close();
        p = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
        await p.addInitScript(INIT);
        const t = Date.now();
        await p.goto(url + hash, { waitUntil: 'commit' });
        await until(p, 1);
        add('first load', Date.now() - t);
      }
      const click = sel => () => p.click(sel);
      for (let r = 0; r < REP; r++) await timed(p, 'New coast', click('#reroll'));
      for (let r = 0; r < REP; r++) await timed(p, 'Random dots (Tilt)', click('#dots'));
      // Tilt drag: preview frames (time inside each animation frame), then release
      for (let r = 0; r < REP; r++){
        const st = await p.evaluate(() => window.coastDebug.state);
        const y0 = (0.5 + st.offL/st.Hkm)*VH;
        await p.mouse.move(12, y0); await p.mouse.down();
        await p.evaluate(() => { window.FRAMES.length = 0; });
        for (let s = 1; s <= 6; s++){ await p.mouse.move(12, y0 + (r % 2 ? 1 : -1)*12*s); await p.evaluate(() => new Promise(res => requestAnimationFrame(() => res()))); }
        const fr = await p.evaluate(() => window.FRAMES.slice());
        for (const f of fr) if (f > 0.5) add('Tilt drag preview frame', f);
        await timed(p, 'release dot (Tilt)', () => p.mouse.up());
      }
      for (let r = 0; r < REP; r++){
        await timed(p, 'switch to Points', click('#ctrl button[data-ctrl=points]'));
        await timed(p, 'Random dots (Points)', click('#dots'));
        let st = await p.evaluate(() => window.coastDebug.state);
        // (a free dot drawn under the controls at the top cannot be grabbed: draw again)
        while ((0.5 + st.pMu/st.Hkm)*VH < 130){ await timed(p, 'Random dots (Points)', click('#dots')); st = await p.evaluate(() => window.coastDebug.state); }
        const x0 = st.pMx/st.Wkm*VW, y0 = (0.5 + st.pMu/st.Hkm)*VH;
        await p.mouse.move(x0, y0); await p.mouse.down();
        for (let s = 1; s <= 3; s++) await p.mouse.move(x0 + (x0 < 640 ? 20 : -20)*s, y0 + (y0 < 400 ? 10 : -10)*s);
        await timed(p, 'release dot (Points)', () => p.mouse.up());
        await timed(p, 'switch to Tilt', click('#ctrl button[data-ctrl=tilt]'));
      }
      for (let r = 0; r < REP; r++){
        await timed(p, 'mode: Peninsula', click('#mode button[data-mode=pen]'));
        await timed(p, 'mode: Inland sea', click('#mode button[data-mode=sea]'));
        await timed(p, 'mode: Coast', click('#mode button[data-mode=plain]'));
      }
      const other = { div: 'jag', jag: 'div', grd: 'div', mix: 'div' }[chr];
      for (let r = 0; r < REP; r++){
        await timed(p, 'other char (not recorded)', click(`#char button[data-char=${other}]`));
        await timed(p, 'switch character to this', click(`#char button[data-char=${chr}]`));
      }
      for (let r = 0; r < REP; r++){
        await timed(p, 'width away (not recorded)', async () => { await p.fill('#km', String(NEXTW[km])); await p.dispatchEvent('#km', 'change'); });
        await timed(p, 'change width to this', async () => { await p.fill('#km', String(km)); await p.dispatchEvent('#km', 'change'); });
      }
      for (let r = 0; r < REP; r++)
        await timed(p, 'window resize (incl. 150 ms debounce)', () => p.setViewportSize(r % 2 ? { width: VW, height: VH } : { width: VW + 40, height: VH + 30 }));
      await p.close();
      const M = {};
      for (const [n, v] of Object.entries(T)) if (!n.includes('not recorded')) M[n] = { median: +med(v).toFixed(1), n: v.length, samples: v.map(x => +x.toFixed(1)) };
      res[`${chr}_${km}`] = M;
      fs.writeFileSync(outFile, JSON.stringify(res, null, 1));
      console.log(chr, km, JSON.stringify(Object.fromEntries(Object.entries(M).map(([n, v]) => [n, v.median]))));
    }
  }));
  await browser.close();
  fs.writeFileSync(outFile, JSON.stringify(res, null, 1));
})();
