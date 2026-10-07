// time stages of one generation: node perf/stages.js <file> <hash> [w h]
const path=require('path');const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const [file,hash,w,h]=process.argv.slice(2);
const p=await b.newPage({viewport:{width:+(w||1280),height:+(h||800)}});
await p.addInitScript(()=>{window.COAST_TIMES=[];});
const t0=Date.now();
await p.goto('file://'+path.resolve(file)+hash,{waitUntil:'commit',timeout:300000});
await p.waitForFunction(()=>document.documentElement.dataset.gen>=1,null,{timeout:300000,polling:100});
const T=await p.evaluate(()=>COAST_TIMES);
let prev=null;const out=[];for(const [k,t] of T){ if(prev) out.push(k+' '+(t-prev).toFixed(0)); prev=t;}
console.log(hash,'total',Date.now()-t0,'ms |',out.join(' | '));await b.close();})();
