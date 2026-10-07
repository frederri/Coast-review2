// compare golden JSONs: node perf/compare.js <ref.json> <new.json>
const fs = require('fs');
const A = JSON.parse(fs.readFileSync(process.argv[2])).out, Bj = JSON.parse(fs.readFileSync(process.argv[3])), B = Bj.out;
let same = 0, diff = 0, missing = 0;
for (const k of Object.keys(B)){
  if (!A[k]){ missing++; continue; }
  if (A[k].field === B[k].field && A[k].pixels === B[k].pixels) same++;
  else { diff++; const bad = Object.keys(A[k].parts).filter(p => A[k].parts[p] !== B[k].parts[p]); console.log('DIFF', k, A[k].pixels === B[k].pixels ? 'pixels same' : 'pixels differ', 'fields:', bad.join(',')); }
}
console.log(`compared ${same + diff}: identical ${same}, different ${diff}, not in reference ${missing}; console errors in new run: ${Bj.errors.length}`);
if (Bj.errors.length) console.log(Bj.errors.slice(0, 10).join('\n'));
process.exit(diff || Bj.errors.length ? 1 : 0);
