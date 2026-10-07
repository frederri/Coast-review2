# copy with a timing marker before every top-level loop/block statement of generate()
import re,sys
src,dst=sys.argv[1:3]
L=open(src).read().split('\n')
out=[];fn=None
for i,l in enumerate(L):
    if re.match(r'^function generate\(',l): fn='generate'
    elif re.match(r'^function ',l) or l.startswith('(function'): fn=None
    if fn and re.match(r'^  (for \(|\{|if \(|const |let )',l) and not re.match(r'^  (const|let) \w+ = (\(|[a-zA-Z_]+ =>)',l):
        j=len(out)-1
        while j>=0 and out[j].strip()=='' : j-=1
        prev=out[j].rstrip() if j>=0 else ''
        if prev.endswith(';') or prev.endswith('}') or prev.endswith('{') or prev.startswith('  //'):
            out.append("  if (typeof COAST_TIMES !== 'undefined') COAST_TIMES.push(['L%d %s', performance.now()]);" % (i+1, l.strip()[:60].replace("'","").replace('\\','')))
    out.append(l)
open(dst,'w').write('\n'.join(out))
