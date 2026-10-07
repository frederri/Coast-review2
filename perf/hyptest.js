const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage();
const r=await p.evaluate(()=>{
  function hyp(a, b){
    a = Math.abs(a); b = Math.abs(b);
    if (a === Infinity || b === Infinity) return Infinity;
    if (a !== a || b !== b) return NaN;
    const m = a > b ? a : b;
    if (m === 0) return 0;
    const p = a/m, q = b/m;
    return Math.sqrt(p*p + q*q)*m;
  }
  let bad=0, n=0; const ex=[];
  const vals=[0,-0,1,-1,1e-300,-1e-300,1e300,5e-324,-5e-324,1.7976931348623157e308,Infinity,-Infinity,NaN,3,4,1e-9,0.1,0.2,2.2250738585072014e-308];
  for (const a of vals) for (const c of vals){ n++; const x=Math.hypot(a,c), y=hyp(a,c); if(!Object.is(x,y)){bad++; if(ex.length<5) ex.push(String([a,c,x,y]));} }
  let s=1;const rnd=()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648;};
  const buf=new Float64Array(2), u32=new Uint32Array(buf.buffer);
  for (let i=0;i<2e7;i++){
    let a,c;
    if (i%4===0){ u32[0]=(rnd()*4294967296)>>>0; u32[1]=(rnd()*4294967296)>>>0; a=buf[0]; u32[0]=(rnd()*4294967296)>>>0; u32[1]=(rnd()*4294967296)>>>0; c=buf[0]; }
    else { const sc=Math.pow(10,(rnd()*40-20)|0); a=(rnd()-0.5)*sc*(rnd()<0.1?1e-8:1); c=(rnd()-0.5)*sc; if(i%7===0) c=a; if(i%11===0) c=-a; }
    n++; const x=Math.hypot(a,c), y=hyp(a,c); if(!Object.is(x,y)){bad++; if(ex.length<5) ex.push(String([a,c,x,y]));} }
  return {n,bad,ex};
});
console.log(JSON.stringify(r));await b.close();})();
