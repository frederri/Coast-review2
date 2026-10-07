const path=require('path');const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const [file,hash]=process.argv.slice(2);
const p=await b.newPage({viewport:{width:1280,height:800}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.addInitScript(()=>{window.COAST_TIMES=[];});
await p.goto('file://'+path.resolve(file)+hash,{waitUntil:'commit',timeout:300000});
await p.waitForFunction(()=>document.documentElement.dataset.gen>=1,null,{timeout:300000,polling:100});
const T=await p.evaluate(()=>COAST_TIMES);
const acc=new Map();for(let i=1;i<T.length;i++){const k=T[i-1][0];acc.set(k,(acc.get(k)||0)+T[i][1]-T[i-1][1]);}
const tot=T[T.length-1][1]-T[0][1];
console.log(hash,'total',tot.toFixed(0));
for(const [k,v] of [...acc.entries()].sort((a,b)=>b[1]-a[1]).slice(0,+(process.argv[4]||35))) console.log(v.toFixed(0).padStart(7),(100*v/tot).toFixed(1).padStart(5)+'%',k);
await b.close();})();
