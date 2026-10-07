"""Measure a rendered coast screenshot (pixels only).

For each image: enclosed water bodies (lagoons/lakes: water not connected to
the open sea), islands (land not connected to the mainland), and a per-stretch
roughness string along the coast: for each 64 px window, the length of the
mainland's shore (edge pixels) against that of the same shore smoothed by a
Gaussian of 24 px.  ~1.0-1.15 smooth (S), 1.15-1.45 partly (p), >1.45 rugged (R).
usage: python3 tools/measure.py <png> [...]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HEADER = 106


def masks(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(int)
    r = a[..., 0]
    land = r > 110
    land[:HEADER] = True
    lab, n = ndi.label(~land)
    bottom = set(np.unique(lab[-1])) - {0}
    sea = np.isin(lab, list(bottom))
    enclosed = (~land) & ~sea
    elab, en = ndi.label(enclosed)
    esz = ndi.sum(enclosed, elab, range(1, en + 1)) if en else []
    llab, ln = ndi.label(land, structure=np.ones((3, 3)))
    main = llab == llab[0, 0]
    isl = land & ~main
    ilab, inn = ndi.label(isl, structure=np.ones((3, 3)))
    isz = ndi.sum(isl, ilab, range(1, inn + 1)) if inn else []
    return main, sea, [int(s) for s in esz if s >= 6], [int(s) for s in isz if s >= 6]


def edge_count(main):
    m = main
    e = np.zeros_like(m)
    e[:-1] |= m[:-1] != m[1:]
    e[:, :-1] |= m[:, :-1] != m[:, 1:]
    return e


def rough(main, win=64):
    e = edge_count(main)
    sm = ndi.gaussian_filter(main.astype(float), 24) > 0.5
    es = edge_count(sm)
    W = main.shape[1]
    out = []
    for x in range(0, W - win + 1, win):
        a = e[:, x:x + win].sum()
        b = max(1, es[:, x:x + win].sum())
        out.append(a / b)
    return out


def code(v):
    return 'S' if v < 1.15 else ('p' if v < 1.45 else 'R')


if __name__ == '__main__':
    for p in sys.argv[1:]:
        main, sea, lak, isl = masks(p)
        rr = rough(main)
        s = ''.join(code(v) for v in rr)
        frac = {k: s.count(k) / len(s) for k in 'SpR'}
        print(f"{p.split('/')[-1]:60s} rough={s} S{frac['S']:.2f} p{frac['p']:.2f} R{frac['R']:.2f} "
              f"mean={np.mean(rr):.2f} islands={len(isl)} enclosedWater={len(lak)}{(' sizes=' + str(sorted(lak)[-5:])) if lak else ''}")
