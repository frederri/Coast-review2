// 50 coasts in a row: renderer RSS (main + worker threads) and main JS heap.
// usage: node perf/memtest.js <html> [chr] [km]
const path = require('path'), { execSync } = require('child_process');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const [file, chr = 'div', km = '500'] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.addInitScript(() => { let a = 99; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0)/4294967296; }; });
  const cdp = await p.context().newCDPSession(p);
  await p.goto('file://' + path.resolve(file) + `#seed=1&km=${km}&chr=${chr}&mode=plain&ctrl=tilt&l=0&r=0`, { waitUntil: 'commit' });
  await p.waitForFunction(() => document.documentElement.dataset.gen >= 1, null, { timeout: 600000 });
  const rss = () => { const out = execSync("ps -eo rss,args | grep -- '--type=renderer' | grep -v grep | awk '{s+=$1} END {print s}'").toString().trim(); return Math.round(+out/1024); };
  const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); const m = await cdp.send('Runtime.getHeapUsage'); return Math.round(m.usedSize/1048576); };
  const rows = [];
  for (let k = 1; k <= 50; k++){
    const g = await p.evaluate(() => +document.documentElement.dataset.gen);
    await p.click('#reroll');
    await p.waitForFunction(n => +document.documentElement.dataset.gen > n, g, { timeout: 600000, polling: 50 });
    if (k % 5 === 0) rows.push([k, rss(), await heap()]);
  }
  console.log(file, chr, km, 'after N coasts: [N, renderer RSS MB, main JS heap MB]');
  console.log(JSON.stringify(rows));
  await b.close();
})();
