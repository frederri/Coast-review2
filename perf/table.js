// before/after timing table (markdown): node perf/table.js before.json after.json
const fs = require('fs');
const A = JSON.parse(fs.readFileSync(process.argv[2])), B = JSON.parse(fs.readFileSync(process.argv[3]));
const NAMES = { div: 'Divergent', jag: 'Jagged', grd: 'Graded shoreline', mix: 'Mixed' };
const acts = ['first load', 'New coast', 'change width to this', 'switch character to this', 'mode: Peninsula', 'mode: Inland sea', 'mode: Coast', 'switch to Points', 'switch to Tilt', 'Tilt drag preview frame', 'release dot (Tilt)', 'release dot (Points)', 'Random dots (Tilt)', 'Random dots (Points)', 'window resize (incl. 150 ms debounce)'];
const f = v => v >= 1000 ? (v/1000).toFixed(2) + ' s' : v.toFixed(v < 100 ? 1 : 0) + ' ms';
for (const chr of ['div', 'jag', 'grd', 'mix']){
  console.log(`\n#### ${NAMES[chr]}\n`);
  console.log('| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');
  for (const a of acts){
    const cells = [];
    for (const km of [1000, 500, 200]){
      const x = A[`${chr}_${km}`] && A[`${chr}_${km}`][a], y = B[`${chr}_${km}`] && B[`${chr}_${km}`][a];
      if (!x || !y){ cells.push('–', '–', '–'); continue; }
      // (after: median, and the first, uncached attempt where the median is a kept coast)
      const first = y.samples && y.samples[0], showFirst = first && first > 3*y.median && a !== 'first load';
      cells.push(f(x.median), f(y.median) + (showFirst ? ` (1st: ${f(first)})` : ''), (x.median/y.median).toFixed(2) + '×');
    }
    console.log(`| ${a} | ${cells.join(' | ')} |`);
  }
}
