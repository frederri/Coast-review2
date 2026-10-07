"""Before|after side-by-sides for one round.
usage: python3 tools/pairs.py <round dir> <round prefix, e.g. r2> <out dir>"""
import sys, glob, os
from PIL import Image, ImageDraw
d, r, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
for f in sorted(glob.glob(f'{d}/{r}_*_before.png')):
    g = f[:-len('_before.png')] + '_after.png'
    if not os.path.exists(g): continue
    name = os.path.basename(f)[:-len('_before.png')]
    im = Image.new('RGB', (1290, 420), (255, 255, 255))
    im.paste(Image.open(f).resize((640, 400)), (0, 20)); im.paste(Image.open(g).resize((640, 400)), (650, 20))
    dr = ImageDraw.Draw(im); dr.text((5, 4), 'BEFORE  ' + name, fill=(0, 0, 0)); dr.text((655, 4), 'AFTER  ' + name, fill=(0, 0, 0))
    im.save(f'{out}/{name}_before-after.png')
