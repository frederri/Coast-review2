"""Pixel-compare two screenshot folders: python3 perf/shotdiff.py <dirA> <dirB> [--top=200]
With --top=N the top N rows (the HTML controls over the map, whose text the
browser does not antialias the same way from one run to the next, even for the
same file) are left out; the map is compared everywhere else. The canvas
itself is compared in full, exactly, by the golden hashes."""
import sys, os
import numpy as np
from PIL import Image
a, b = sys.argv[1:3]
top = int(next((x[6:] for x in sys.argv if x.startswith('--top=')), 0))
names = sorted(f for f in os.listdir(b) if f.endswith('.png'))
same = diff = 0
for n in names:
    pa, pb = os.path.join(a, n), os.path.join(b, n)
    if not os.path.exists(pa):
        print('missing in reference', n); continue
    A = np.asarray(Image.open(pa))[top:]; B = np.asarray(Image.open(pb))[top:]
    if A.shape == B.shape and np.array_equal(A, B): same += 1
    else:
        diff += 1; print('DIFF', n, A.shape, B.shape, int((A != B).any(-1).sum()) if A.shape == B.shape else '')
print(f'screenshots compared {same + diff}: pixel-identical {same}, different {diff}')
