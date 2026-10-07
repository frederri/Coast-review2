const path=require('path');const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const all=new Set();
for (const h of process.argv.slice(3)){
const p=await b.newPage({viewport:{width:1280,height:800}});
await p.goto('file://'+path.resolve(process.argv[2])+h,{waitUntil:'commit'});
await p.waitForFunction(()=>document.documentElement.dataset.gen>=1,null,{timeout:300000,polling:100});
for (const t of await p.evaluate(()=>[...(window.__T||[]), ...(window.__B||[])])) all.add(t);
await p.close();}
console.log([...all]);await b.close();})();
