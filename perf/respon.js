// longest main-thread freeze while a New coast is worked out
// usage: node perf/respon.js <html> <chr> <km>
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const [file, chr, km] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.addInitScript(() => { let a = 5; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0)/4294967296; }; });
  await p.goto('file://' + path.resolve(file) + `#seed=1&km=${km}&chr=${chr}&mode=plain&ctrl=tilt&l=0&r=0`, { waitUntil: 'commit' });
  await p.waitForFunction(() => document.documentElement.dataset.gen >= 1, null, { timeout: 600000 });
  const res = [];
  for (let k = 0; k < 3; k++){
    await p.evaluate(() => { window.__gap = 0; window.__last = performance.now(); window.__iv = setInterval(() => { const t = performance.now(); window.__gap = Math.max(window.__gap, t - window.__last); window.__last = t; }, 10); });
    const g = await p.evaluate(() => +document.documentElement.dataset.gen), t0 = Date.now();
    await p.click('#reroll');
    await p.waitForFunction(n => +document.documentElement.dataset.gen > n, g, { timeout: 600000, polling: 50 });
    const total = Date.now() - t0;
    const gap = await p.evaluate(() => { clearInterval(window.__iv); return window.__gap; });
    res.push({ total, longestFreeze: Math.round(gap) });
  }
  console.log(path.basename(file), chr, km, JSON.stringify(res));
  await b.close();
})();
