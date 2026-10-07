const path=require('path');const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1280,height:800}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(process.argv[2])+process.argv[3],{waitUntil:'commit'});
await p.waitForFunction(()=>document.documentElement.dataset.gen>=1,null,{timeout:300000,polling:100});
console.log(JSON.stringify(await p.evaluate(()=>Object.fromEntries(Object.entries(self.EVT).map(([k,v])=>[k,Math.round(v)])))));await b.close();})();
