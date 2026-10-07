// profile Tilt drag preview frames: node perf/dragprof.js <html> <hash>
const path=require('path');const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1280,height:800}});
await p.addInitScript(()=>{const raf=window.requestAnimationFrame.bind(window);window.FRAMES=[];window.requestAnimationFrame=cb=>raf(t=>{const s=performance.now();cb(t);window.FRAMES.push(performance.now()-s);});});
await p.goto('file://'+path.resolve(process.argv[2])+process.argv[3],{waitUntil:'commit'});
await p.waitForFunction(()=>document.documentElement.dataset.gen>=1,null,{timeout:300000,polling:100});
const cdp=await p.context().newCDPSession(p);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:100});
const st=await p.evaluate(()=>window.coastDebug.state);const y0=(0.5+st.offL/st.Hkm)*800;
await p.mouse.move(12,y0);await p.mouse.down();await p.evaluate(()=>{window.FRAMES.length=0;});
await cdp.send('Profiler.start');
for(let s=1;s<=40;s++){await p.mouse.move(12,y0+(s%2?-1:1)*(4+s));await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>r())));}
const {profile}=await cdp.send('Profiler.stop');
const fr=await p.evaluate(()=>window.FRAMES.filter(f=>f>0.5));fr.sort((a,b)=>a-b);
console.log('frames',fr.length,'median',fr[fr.length>>1].toFixed(1),'ms');
const byId=new Map(profile.nodes.map(n=>[n.id,n]));const self=new Map();
for(let i=0;i<profile.samples.length;i++){const cf=byId.get(profile.samples[i]).callFrame;const k=(cf.functionName||'(anon)')+':'+(cf.lineNumber+1);self.set(k,(self.get(k)||0)+(profile.timeDeltas[i]||0));}
const tot=[...self.values()].reduce((a,b)=>a+b,0);
for(const [k,v] of [...self.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12)) console.log((v/1000).toFixed(0).padStart(6),'ms',(100*v/tot).toFixed(1).padStart(5)+'%',k);
await b.close();})();
