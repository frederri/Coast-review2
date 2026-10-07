// CPU profile of one page load + generation: self time per function.
// usage: node perf/profile.js <html> <hash> [top=30]
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const [file, hash, topN] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: process.env.NOINLINE ? ['--js-flags=--no-turbo-inlining'] : [] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
  await cdp.send('Profiler.start');
  const t0 = Date.now();
  await p.goto('file://' + path.resolve(file) + hash, { waitUntil: 'commit' });
  await p.waitForFunction(() => document.documentElement.dataset.gen >= 1, null, { timeout: 600000, polling: 100 });
  const total = Date.now() - t0;
  const { profile } = await cdp.send('Profiler.stop');
  const byId = new Map(profile.nodes.map(n => [n.id, n]));
  const self = new Map();
  const dt = profile.timeDeltas;
  for (let i = 0; i < profile.samples.length; i++){
    const n = byId.get(profile.samples[i]), cf = n.callFrame;
    const key = (cf.functionName || '(anon)') + ':' + (cf.lineNumber + 1);
    self.set(key, (self.get(key) || 0) + (dt[i] || 0));
  }
  const tot = [...self.values()].reduce((a, b) => a + b, 0);
  console.log(hash, 'wall', total, 'ms, sampled', (tot/1000).toFixed(0), 'ms');
  for (const [k, v] of [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, +(topN || 30)))
    console.log(((v/1000).toFixed(0) + ' ms').padStart(9), (100*v/tot).toFixed(1).padStart(5) + '%', k);
  // line-level: hit counts per source line, for the functions that cost most
  const lines = new Map();
  for (const n of profile.nodes) for (const t of (n.positionTicks || [])) lines.set(t.line, (lines.get(t.line) || 0) + t.ticks);
  const ticksTot = [...lines.values()].reduce((a, b) => a + b, 0) || 1;
  console.log('-- hottest lines (share of line ticks) --');
  for (const [l, v] of [...lines.entries()].sort((a, b) => b[1] - a[1]).slice(0, +(process.argv[5] || 40)))
    console.log(String(l).padStart(6), (100*v/ticksTot).toFixed(1).padStart(5) + '%');
  await b.close();
})();
