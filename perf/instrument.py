# copy of the file with a COAST_TIMES marker before every section header
import re,sys
src,dst=sys.argv[1:3]
L=open(src).read().split('\n')
out=[];fn=None;depth=None
def mark(label): return "if (typeof COAST_TIMES !== 'undefined') COAST_TIMES.push([%r, performance.now()]);" % label
for i,l in enumerate(L):
    m=re.match(r'^function (generate|gradeMix|gradeShore|coastWork)\(',l)
    if m: fn=m.group(1)
    elif re.match(r'^function |^\(function',l): fn=None
    if fn and re.match(r'^  // --',l):
        # only at statement level of the function: previous non-blank line ends with ; or } or {
        j=len(out)-1
        while j>=0 and out[j].strip()=='' : j-=1
        prev=out[j].rstrip() if j>=0 else ''
        if prev.endswith(';') or prev.endswith('}') or prev.endswith('{'):
            out.append('  '+mark(f'{fn}@{i+1} '+l.strip()[:50]))
    out.append(l)
open(dst,'w').write('\n'.join(out))
