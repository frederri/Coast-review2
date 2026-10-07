Helpers used for the Mixed-coast review (not part of the generator):

- `render.js <html> <outdir> <prefix> [--only=regex] [--sizes]`: renders the fixed test set (Mixed, Coast mode, 1000/500/200 km, seeds 11, 42, 137, 2024, 5309, 90210, Tilt and Points) with Playwright through the page's URL hash. `--sizes` renders the window-size and fullscreen set instead.
- `measure.py <png...>`: pixel-only measurements of a screenshot: enclosed water bodies (lakes and lagoons), islands, and a per-stretch roughness string.
- `pairs.py <round dir> <round prefix> <outdir>`: before|after side-by-side images.
