const path=require('path');const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const [file,hash]=process.argv.slice(2);
const p=await b.newPage({viewport:{width:1280,height:800}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(file)+hash,{waitUntil:'commit',timeout:300000});
await p.waitForFunction(()=>document.documentElement.dataset.gen>=1,null,{timeout:300000,polling:100});
const C=await p.evaluate(()=>window.__CALLS);
const agg=new Map(), seen=new Map();let dupMs=0;
for(const [n,k,w,ms] of C){const key=n+'@'+w;const a=agg.get(key)||{n:0,ms:0,dup:0};a.n++;a.ms+=ms;const kk=n+k;if(seen.has(kk)){a.dup++;dupMs+=ms;}else seen.set(kk,w);agg.set(key,a);}
console.log(hash,'calls',C.length,'total ms',C.reduce((s,c)=>s+c[3],0).toFixed(0),'duplicate-input ms',dupMs.toFixed(0));
for(const [k,a] of [...agg.entries()].sort((x,y)=>y[1].ms-x[1].ms).slice(0,40)) console.log(a.ms.toFixed(0).padStart(6),'ms',String(a.n).padStart(4),'calls',a.dup?('DUP '+a.dup):'',k);
await b.close();})();
