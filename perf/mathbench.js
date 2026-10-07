const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage();
const r=await p.evaluate(()=>{
  const N=1e7, X=new Float64Array(4096), Y=new Float64Array(4096);
  for(let i=0;i<4096;i++){X[i]=Math.random()*2-1;Y[i]=Math.random()*2-1;}
  const T={};
  const run=(name,f)=>{let s=0;const t=performance.now();for(let i=0;i<N;i++){s+=f(X[i&4095],Y[i&4095]);}T[name]=((performance.now()-t)/N*1e6).toFixed(1)+'ns';return s;};
  run('add',(a,b)=>a+b); run('atan2',(a,b)=>Math.atan2(a,b)); run('cos',(a)=>Math.cos(a*3)); run('sin',(a)=>Math.sin(a*3));
  run('pow1.2',(a)=>Math.pow(Math.abs(a),1.2)); run('exp',(a)=>Math.exp(a)); run('round',(a)=>Math.round(a*7)); run('hypot',(a,b)=>Math.hypot(a,b)); run('sqrt',(a,b)=>Math.sqrt(a*a+b*b)); run('log',(a)=>Math.log(Math.abs(a)+1e-9)); run('floor',(a)=>Math.floor(a*100));
  return T;});
console.log(JSON.stringify(r));await b.close();})();
