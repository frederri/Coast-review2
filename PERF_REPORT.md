# Coast generator: optimization run

- **Original (untouched):** `coast_generator2_mixed.html`, the current generator from the previous run. No new file was attached to this request, so this is the file I took as "the current coast generator".
- **Optimized:** `coast_generator2_fast.html`, next to it. It is still one self-contained local HTML file with no libraries, no build step and no server, and it works when opened from disk.
- **Harnesses and raw data:** `perf/`. Reproduce with `node perf/golden.js`, `node perf/timing.js`, `node perf/profile.js`, `perf/instrument.py` + `node perf/stages2.js`, `node perf/memtest.js` and `node perf/respon.js`.

## Short version

| | Result |
|---|---|
| **Output** | Identical. All 500 golden records match the original: terrain/field data hashes and the exact canvas pixels of every combination. All 500 screenshots are pixel-identical outside the header strip; see "Proof" for why the strip is excluded. Nothing differs. |
| **Generating a coast that has not been generated before** (first load, New coast, Random dots, a released dot in a new place, a first switch) | **About 4% faster on average.** Divergent about 8%, Jagged about 7%, Graded about 3%, Mixed 0–8%. That is small. The cost is the arithmetic of the geology and shoreline simulation itself, which cannot get cheaper without changing the result; see "Big costs still left". |
| **Going back to a coast already shown** (a character, mode or width switched back, Tilt and Points toggled back, a dot dragged back) | **About 0.05–0.1 s instead of 4–20 s.** These are 40–370× faster: the last 3 coasts are kept, exactly. |
| **Window resize / fullscreen, Graded and Mixed** | **About 0.22 s instead of 11–19 s.** Their field never depended on the window, so the kept coast is reused. For Divergent and Jagged a new window size still needs a new coast. |
| **Page responsiveness while a coast is worked out** | The longest main-thread freeze during a New coast drops from **4.7 s to 0.05 s** (Divergent, 500 km) and from **14–15 s to 0.04–0.09 s** (Mixed). Generation now runs in a Web Worker. |
| **Tilt drag preview frame** | **About 15% faster.** 29–36 ms falls to 25–32 ms. |
| **Memory over 50 coasts in a row** | Bounded. The renderer levels off at about 600 MB, against about 480 MB for the original. The extra is the 3 kept coasts plus the worker's heap. |

## Step 1. Baseline

### A) Golden output: `perf/golden.js` → `perf/golden/orig.json`

For every record I hashed every typed array and number on the generated field (`coastDebug.field`: phi, E, sea, shade, elev, rough, gdir, S, bar, lag, str and the scalars), together with the exact canvas pixels (`getImageData`). I also saved a screenshot of each.

The records cover:
- **Static:** 4 characters (Divergent, Jagged, Graded, Mixed) × 3 modes (Coast, Peninsula, Inland sea) × Tilt and Points × widths 200 (also the smallest allowed), 500, 1000 and 20000 km (the largest) × 4 seeds (11, 42, 2024, 90210). That is 384 records.
  - Tilt uses 4 handle settings.
  - Points puts the free dot near the left edge, at the centre, high and low.
- **Window sizes:** 1920×1080 (fullscreen), 1000×1000, 800×1200 and 1600×700 for every character and mode. That is 48 records.
- **Interaction sequences:** 4 sequences of 17 steps each, 68 records in total, run with `Math.random` seeded so New coast and Random handles are reproducible. Each sequence covers New coast, Random handles in Tilt, a Tilt drag (preview frame and release), switching to Points, Random handles in Points, a Points drag of the free dot (preview and release), width 500, Peninsula, Inland sea, switching to Tilt, Coast, width 200, the next character, a window resize, and Space.

Total: **500 records**, all at a render size of 1280×800 except the window-size records. The original is deterministic: a second full run (`orig_run2.json`) is identical in all 500.

### B) Timings: `perf/timing.js` → `perf/timing_before.json` and `perf/timing_after.json`

Each figure is the median of 5, for every character at 1000, 500 and 200 km, covering every action in the brief. The two files were measured in the same session under the same load (two pages each in parallel), so the comparison is fair, but the absolute numbers carry a few percent of noise.

The drag preview frame is measured as the time spent inside each animation-frame callback (`requestAnimationFrame` is wrapped the same way for both files). The full table is in section "Timings".

## Step 2. Where the time went (before)

The profile used the Chrome DevTools sampling profiler, plus a copy of the file with a timing marker before every section of `generate()`, `gradeMix()`, `gradeShore()` and `coastWork()` (`perf/instrument.py`). Inlining hides most of `generate()` from the profiler, so the per-section markers gave the reliable numbers.

Ranked, Mixed at 1000 km (15.6 s in total):

| # | Cost | Time | Share |
|---|---|---|---|
| 1 | `gradeMix`, "the work": the shoreline model's rounds. Within it, `evolve` (24,300 wave steps × about 500 shore points) 4.0 s, and bay sealing (25 `seal` calls, each with distance transforms) 1.4 s. | 6.0 s | 39% |
| 2 | Stage 2: the landscape cut into it (grain angle, rock bands, mountain belts) + setup | 2.6 s | 17% |
| 3 | The sea's front through the rock (stage 1) | 0.9 + 0.5 s | 9% |
| 4 | The shore's unevenness warp | 0.6 s | 4% |
| 5 | The sea floor | 0.5 s | 3% |
| 6 | The handles as a tilt of the ground; rock strata; fault mosaic | 0.5 + 0.5 + 0.35 s | 9% |
| 7 | All the rest: about 40 smaller sections of 0.05–0.3 s each | | ~19% |

Across all sections, the shared building blocks cost:
- distance transform `sdf`: 66 calls, 1.5–1.7 s;
- box blur `blur3`: 38 calls, 0.8–1.0 s;
- noise (`fbm`/`hsh`/`hmix`/`fade`): about 1.2 s;
- priority flood: 0.2 s;
- garbage collection: 0.5–0.6 s.

Graded at 1000 km (11.7 s): `gradeShore` "the work" 4.4 s (38%; `evolve` about 2.1 s), stage 2 2.4 s, the sea front 0.8 s, the sea floor 0.6 s, …

Divergent at 1000 km (4.6 s): the equalised coast in `coastWork` 0.6 s, stage 2 0.9 s, the sea front 0.6 s, …

Per action:
- First load, New coast, Random dots, releasing a dot, and switching character, mode, width or Tilt/Points are each one full `generate()` plus one render (0.1–0.15 s), so the ranking above applies to all of them.
- The Tilt drag preview is one `remap` + `paint` per frame: about 13 ms + 19 ms.
- Window resize is a full `generate()` after a 150 ms debounce.

The raw profiles are in `perf/profile_before.txt`, `perf/profile_mix_noinline.txt` and `perf/blocks_before_after.txt`.

## Step 3. What was changed, biggest cost first

Every change was checked against the golden output before moving on. Each one keeps every arithmetic operation, its order, and every float32 rounding exactly as before.

1. **The shoreline model (`evolve`, #1).**
   - **What was slow:** every wave step runs `atan2`, `cos`, `sin`, `pow`, `exp` and `hypot` for every shore point, 24,300 steps × about 500 points per round.
   - **What changed:**
     - A stretch in the wave shadow now skips the angle, `atan2` and `cos` it never used.
     - Mixed's rock wear skips `exp` where its value is exactly 1 (no beach) or is multiplied by 0 (no wave power).
     - A per-step array literal in the river code is hoisted.
   - **Gain:** about 10% of `evolve`. Mixed's "the work" went from 6.0 s to 5.3 s, Graded's from 4.4 s to 4.1 s.
   - **Why not more:** a per-loop timing of `evolve` shows the cost spread evenly over 18 loops, each bound by floating-point divisions and V8's libm calls. Under bit-identical output their number and order cannot change.
2. **`Math.hypot` (all 75 calls, inside #1 and many others).**
   - **What was slow:** V8's built-in collects its arguments into an array on every call and runs a Kahan sum, about 2.5× the cost of the same arithmetic written out.
   - **What changed:** it is replaced by `hyp()`, which is V8's own algorithm written out (the larger argument taken out, the sum of squares rooted and scaled back).
   - **Exactness:** checked bit-for-bit against `Math.hypot` in this Chromium on 20 million inputs, including random bit patterns, ±0, subnormals, the largest double, ±Infinity and NaN. There were 0 differences.
3. **Distance transform `sdf` (66 calls).**
   - **What changed:** each cell's best-so-far is held in locals while its neighbours are checked, and written once instead of once per improvement. It is held rounded with `Math.fround`, exactly as the Float32 store rounds it, so every comparison sees the value it would have read back. The separate `sdfRelax` function is gone.
   - **Gain:** small, about 3%. The sweeps are at about 1 ns per neighbour, already near what JS can do.
4. **Column blurs (`blurHoldCols`, inside `blur3`).**
   - **What changed:** the blur now walks the grid along its rows, with one running sum per column. Before, it walked down each column with a stride of a whole row, which was cache-hostile. Each column's sums and their order are the same.
   - **Gain:** `blur3` went from 0.79 s to 0.62 s on a Mixed coast (−21%).
5. **`remap` (drag preview and final render).**
   - **What changed:** each column's sampling values are worked out once by the identical expressions. The screen grid is then filled row by row instead of column by column, so its four output grids are written sequentially. Each cell's value depends only on its own column and row, so the order cannot change it.
   - **Gain:** `remap` time per preview frame went from about 15 ms to about 10 ms (−33%).
6. **`paint`.**
   - **What changed:** each pixel's water tone and land elevation are interpolated only on the branch that paints them.
   - **Gain:** marginal, a few percent.
7. **Generation in a Web Worker.**
   - **What changed:** the page's generation script is now its own `<script id="coast-gen">`. The worker is built from its text through a Blob, so it works from disk. The worker hands its grids over instead of copying them.
   - **Request handling:** requests are serialized, and a newer request supersedes an older queued one. A result is shown only if no newer one is already shown, which is the same final coast as before.
   - **Fallback:** the page falls back to the old in-page generation if workers are unavailable, or if a script studying the generator has set one of its hooks (`COAST_TIMES`, `COAST_OFF`, `COAST_DUMP`). Those hooks therefore keep working exactly as before.
   - **Gain:** the main thread is never blocked for a coast. The longest freeze went from 4.7–15 s to about 0.05 s. Generation time itself is unchanged by this.
8. **Exact result cache (the last 3 coasts).**
   - **What changed:** the key is every input `generate()` reads: seed, width, field columns, mode, character, the view height where the field is laid out for the window, the dots and the whole baseline. I checked that `generate()` reads no other state: no `Math.random`, no clock, no DOM, and it does not change its inputs.
   - **Graded/Mixed and the window:** in Coast mode their field is laid out for a fixed 16:10 view with 760 columns, and their `generate()` never reads the window height. So a resize reuses their coast.
   - **Why it is exact:** the grids came over from the worker and belong to the page alone, so a kept coast cannot be overwritten. The in-page fallback does not keep coasts, because its grids are reused by the next generation.
   - **Gain:** every return to a recent state takes about 50–100 ms (render only) instead of 4–20 s.

### Tried and undone, or not kept

- **Aliasing `evolve`'s closure-captured arrays to per-step locals.** No measurable change: the loops are bound by arithmetic, not by context loads. Not kept.
- **Fusing `evolve`'s loops.** Rejected before writing it. Fusing the curvature, update and position loops is exact only with a lag of two points, and the river loop that sits between them would change the order of floating-point additions where two river mouths overlap. Since the loops work on about 500 points that fit in L1 cache, the gain would be negligible anyway.
- **Replacing `Math.round`, `cos`, `sin`, `atan2`, `pow` or `exp` with cheaper forms.** Not allowed: algebraically equal forms (e.g. `cos(a−b)` expanded) are not bit-identical. None was used.
- **Nothing was undone for changing the output.** Every change above was exact on its first check (164-record quick runs after each step, then the full 500).

## Behaviour notes (no output changes)

- **While a coast is worked out, the page stays live and the old coast stays visible.** Before, the page froze for that time. The busy cursor shows as before and clears when the new coast is in.
- **After a window resize or fullscreen change, the old coast is drawn for the new window until the new one is ready.** Before, the page froze and then showed the new one. The canvas is cleared by its new size, so without this it would be blank. This is a preview of the *previous* coast, not a rough version of the new one, and the final coast is identical. For Graded and Mixed the kept coast is used at once, so there is no preview.
- **Before the very first coast is in, the controls are already usable.** Before, the whole page was blocked until the first coast was generated.
- **The New coast / Space / Random handles semantics, and all `Math.random` use, are unchanged.**

## Step 4. Proof of identical output

- **Golden comparison** (`node perf/compare.js perf/golden/orig.json perf/golden/fast_full.json` → `perf/golden/fast_full.cmp`): **compared 500, identical 500, different 0, console errors 0.**
  - That covers the field data hashes (every array) and the exact canvas pixels of every record: all characters × all modes × Tilt/Points × 200/500/1000/20000 km × 4 seeds × 4 dot settings, all window sizes including fullscreen, and every interaction step of the 4 sequences.
  - The interaction steps include New coast, both Random handles, Tilt and Points drag previews and releases, width changes, mode, control and character switches, resize and Space.
- **Screenshots** (`python3 perf/shotdiff.py perf/golden/orig_shots perf/golden/fast_shots --top=200`): **500 of 500 pixel-identical** below the top 200 rows.
  - The top strip holds only the HTML controls. Their text antialiasing in this headless Chromium varies by 1–2 colour levels from run to run *even for the original file against itself*: re-shooting 23 original screenshots gave 16 such differences in that strip and none below it.
  - The map itself, including the part under the controls, is compared in full and exactly by the canvas-pixel hash above.
- **Determinism:** the original matched itself in 500/500 across two runs. The interaction sequences run from the same seeded `Math.random` and match step for step.
- **Features:** every character, mode, Tilt/Points, all dots, dragging and releasing, Random handles, New coast, Space, width changes, window resize and fullscreen were exercised by the sequences and window-size records above. The same seed gives the same coast.
- **Memory** (`perf/memory.txt`): 50 New coasts in a row. Renderer memory levels off: original 476–506 MB, optimized 553–622 MB, flat after about 15 coasts. The main JS heap after GC stays at 2–4 MB.
- **Console:** no errors or warnings in any of the 500 records.

## Timings (median of 5)

Read the columns as follows:
- **"After" with "(1st: …)":** the median is a return to a kept coast, and the 1st figure is the first, uncached attempt.
- **"Change width to this" and "switch character to this":** these always return to the coast shown just before, so they are kept-coast times. Switching to a width or character never shown before costs a full generation, like New coast.
- **"Window resize":** for Divergent and Jagged the first resize to a new window size is uncached (the 1st figure). The others go back to an earlier size. Graded and Mixed are always kept, because their field does not depend on the window.

#### Divergent

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 6.21 s | 5.51 s | 1.13× | 6.91 s | 5.69 s | 1.21× | 5.94 s | 5.68 s | 1.05× |
| New coast | 6.19 s | 4.96 s | 1.25× | 5.37 s | 4.77 s | 1.13× | 5.21 s | 4.82 s | 1.08× |
| change width to this | 4.15 s | 56.0 ms | 74.07× | 4.46 s | 52.0 ms | 85.75× | 4.83 s | 55.0 ms | 87.89× |
| switch character to this | 4.26 s | 87.0 ms | 48.99× | 4.75 s | 84.0 ms | 56.52× | 4.59 s | 102 ms | 45.04× |
| mode: Peninsula | 4.18 s | 96.0 ms (1st: 3.77 s) | 43.54× | 4.85 s | 90.0 ms (1st: 4.37 s) | 53.90× | 4.86 s | 93.0 ms (1st: 4.64 s) | 52.20× |
| mode: Inland sea | 5.27 s | 84.0 ms (1st: 5.58 s) | 62.79× | 5.61 s | 90.0 ms (1st: 6.31 s) | 62.28× | 5.84 s | 76.0 ms (1st: 5.97 s) | 76.80× |
| mode: Coast | 4.51 s | 105 ms | 42.95× | 4.76 s | 80.0 ms | 59.49× | 4.99 s | 82.0 ms | 60.90× |
| switch to Points | 4.88 s | 4.26 s | 1.15× | 4.54 s | 4.74 s | 0.96× | 4.53 s | 4.07 s | 1.11× |
| switch to Tilt | 4.78 s | 4.98 s | 0.96× | 4.84 s | 4.40 s | 1.10× | 4.27 s | 4.27 s | 1.00× |
| Tilt drag preview frame | 30.9 ms | 24.9 ms | 1.24× | 31.9 ms | 27.0 ms | 1.18× | 29.6 ms | 27.1 ms | 1.09× |
| release dot (Tilt) | 4.71 s | 88.0 ms (1st: 4.93 s) | 53.47× | 4.99 s | 89.0 ms (1st: 5.01 s) | 56.11× | 4.86 s | 83.0 ms (1st: 4.59 s) | 58.55× |
| release dot (Points) | 4.46 s | 4.47 s | 1.00× | 4.68 s | 4.33 s | 1.08× | 4.58 s | 4.14 s | 1.11× |
| Random dots (Tilt) | 4.96 s | 4.47 s | 1.11× | 5.14 s | 4.54 s | 1.13× | 4.61 s | 4.63 s | 1.00× |
| Random dots (Points) | 4.41 s | 4.35 s | 1.01× | 4.73 s | 4.37 s | 1.08× | 4.32 s | 4.05 s | 1.07× |
| window resize (incl. 150 ms debounce) | 4.67 s | 223 ms (1st: 5.61 s) | 20.96× | 5.10 s | 225 ms (1st: 4.99 s) | 22.65× | 5.51 s | 229 ms (1st: 5.71 s) | 24.04× |

#### Jagged

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 5.83 s | 5.17 s | 1.13× | 5.76 s | 5.33 s | 1.08× | 5.85 s | 5.52 s | 1.06× |
| New coast | 4.85 s | 4.12 s | 1.18× | 5.44 s | 5.29 s | 1.03× | 5.10 s | 4.38 s | 1.17× |
| change width to this | 4.18 s | 49.0 ms | 85.27× | 4.12 s | 50.0 ms | 82.44× | 4.32 s | 63.0 ms | 68.63× |
| switch character to this | 4.34 s | 89.0 ms | 48.74× | 4.67 s | 84.0 ms | 55.63× | 4.90 s | 90.0 ms | 54.49× |
| mode: Peninsula | 4.37 s | 87.0 ms (1st: 4.16 s) | 50.25× | 4.36 s | 88.0 ms (1st: 4.06 s) | 49.50× | 4.81 s | 85.0 ms (1st: 4.29 s) | 56.59× |
| mode: Inland sea | 4.63 s | 81.0 ms (1st: 5.11 s) | 57.22× | 5.02 s | 90.0 ms (1st: 5.40 s) | 55.74× | 5.17 s | 85.0 ms (1st: 5.89 s) | 60.84× |
| mode: Coast | 4.46 s | 81.0 ms | 55.01× | 4.33 s | 82.0 ms | 52.85× | 4.58 s | 79.0 ms | 57.97× |
| switch to Points | 4.21 s | 3.79 s | 1.11× | 4.40 s | 4.17 s | 1.05× | 4.33 s | 4.31 s | 1.00× |
| switch to Tilt | 4.16 s | 3.92 s | 1.06× | 4.36 s | 4.13 s | 1.06× | 4.32 s | 4.21 s | 1.03× |
| Tilt drag preview frame | 30.5 ms | 27.8 ms | 1.10× | 36.1 ms | 29.5 ms | 1.22× | 35.4 ms | 32.2 ms | 1.10× |
| release dot (Tilt) | 4.29 s | 106 ms (1st: 4.17 s) | 40.52× | 4.48 s | 87.0 ms (1st: 4.06 s) | 51.49× | 2.65 s | 92.0 ms (1st: 4.20 s) | 28.86× |
| release dot (Points) | 4.00 s | 3.81 s | 1.05× | 4.14 s | 4.40 s | 0.94× | 4.42 s | 4.12 s | 1.07× |
| Random dots (Tilt) | 4.36 s | 3.92 s | 1.11× | 4.45 s | 4.25 s | 1.04× | 4.72 s | 4.35 s | 1.09× |
| Random dots (Points) | 4.33 s | 3.79 s | 1.14× | 4.30 s | 4.24 s | 1.02× | 4.45 s | 4.33 s | 1.03× |
| window resize (incl. 150 ms debounce) | 4.71 s | 239 ms (1st: 5.07 s) | 19.70× | 4.87 s | 292 ms (1st: 5.59 s) | 16.68× | 4.74 s | 240 ms (1st: 6.02 s) | 19.76× |

#### Graded shoreline

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 13.67 s | 13.29 s | 1.03× | 13.29 s | 12.32 s | 1.08× | 12.40 s | 12.14 s | 1.02× |
| New coast | 12.52 s | 12.04 s | 1.04× | 12.39 s | 12.13 s | 1.02× | 11.77 s | 11.54 s | 1.02× |
| change width to this | 11.37 s | 49.0 ms | 231.98× | 11.99 s | 47.0 ms | 255.09× | 11.72 s | 54.0 ms | 217.04× |
| switch character to this | 12.01 s | 73.0 ms | 164.55× | 12.69 s | 78.0 ms | 162.67× | 12.05 s | 91.0 ms | 132.43× |
| mode: Peninsula | 4.93 s | 85.0 ms (1st: 4.87 s) | 58.02× | 5.22 s | 88.0 ms (1st: 5.15 s) | 59.28× | 5.24 s | 78.0 ms (1st: 5.00 s) | 67.12× |
| mode: Inland sea | 5.87 s | 92.0 ms (1st: 6.08 s) | 63.82× | 5.98 s | 110 ms (1st: 5.62 s) | 54.36× | 5.34 s | 91.0 ms (1st: 5.66 s) | 58.64× |
| mode: Coast | 12.14 s | 81.0 ms | 149.91× | 12.92 s | 83.0 ms | 155.71× | 12.32 s | 90.0 ms | 136.89× |
| switch to Points | 11.24 s | 11.51 s | 0.98× | 12.68 s | 11.76 s | 1.08× | 11.85 s | 12.11 s | 0.98× |
| switch to Tilt | 11.35 s | 11.38 s | 1.00× | 12.52 s | 12.52 s | 1.00× | 11.88 s | 11.32 s | 1.05× |
| Tilt drag preview frame | 29.8 ms | 26.5 ms | 1.12× | 30.2 ms | 27.1 ms | 1.11× | 31.1 ms | 26.0 ms | 1.20× |
| release dot (Tilt) | 11.17 s | 91.0 ms (1st: 11.09 s) | 122.77× | 12.81 s | 100 ms (1st: 12.30 s) | 128.13× | 11.92 s | 82.0 ms (1st: 10.87 s) | 145.33× |
| release dot (Points) | 11.56 s | 11.46 s | 1.01× | 12.44 s | 12.44 s | 1.00× | 11.98 s | 11.43 s | 1.05× |
| Random dots (Tilt) | 11.44 s | 11.27 s | 1.01× | 13.22 s | 12.26 s | 1.08× | 11.92 s | 11.66 s | 1.02× |
| Random dots (Points) | 12.03 s | 11.41 s | 1.05× | 12.87 s | 12.57 s | 1.02× | 12.25 s | 11.44 s | 1.07× |
| window resize (incl. 150 ms debounce) | 11.33 s | 225 ms | 50.37× | 12.84 s | 226 ms | 56.80× | 11.50 s | 222 ms | 51.82× |

#### Mixed

| Action | 1000 km before | 1000 km after | speed-up | 500 km before | 500 km after | speed-up | 200 km before | 200 km after | speed-up |
|---|---|---|---|---|---|---|---|---|---|
| first load | 17.34 s | 16.19 s | 1.07× | 15.05 s | 15.36 s | 0.98× | 15.50 s | 16.42 s | 0.94× |
| New coast | 15.04 s | 15.06 s | 1.00× | 14.13 s | 14.93 s | 0.95× | 15.33 s | 15.68 s | 0.98× |
| change width to this | 13.69 s | 47.0 ms | 291.17× | 15.84 s | 50.0 ms | 316.76× | 19.29 s | 52.0 ms | 370.92× |
| switch character to this | 13.58 s | 77.0 ms | 176.39× | 16.04 s | 83.0 ms | 193.29× | 19.79 s | 80.0 ms | 247.36× |
| mode: Peninsula | 4.94 s | 83.0 ms (1st: 4.99 s) | 59.49× | 4.77 s | 99.0 ms (1st: 4.83 s) | 48.18× | 4.61 s | 99.0 ms (1st: 4.68 s) | 46.61× |
| mode: Inland sea | 5.67 s | 83.0 ms (1st: 5.73 s) | 68.28× | 5.41 s | 80.0 ms (1st: 5.78 s) | 67.65× | 5.33 s | 83.0 ms (1st: 5.24 s) | 64.18× |
| mode: Coast | 14.51 s | 76.0 ms | 190.97× | 15.98 s | 82.0 ms | 194.84× | 19.58 s | 79.0 ms | 247.89× |
| switch to Points | 13.79 s | 13.71 s | 1.01× | 15.83 s | 15.42 s | 1.03× | 18.37 s | 18.43 s | 1.00× |
| switch to Tilt | 13.47 s | 13.54 s | 0.99× | 15.27 s | 15.67 s | 0.97× | 18.37 s | 17.30 s | 1.06× |
| Tilt drag preview frame | 28.6 ms | 25.2 ms | 1.13× | 28.5 ms | 25.6 ms | 1.11× | 28.8 ms | 25.5 ms | 1.13× |
| release dot (Tilt) | 14.22 s | 81.0 ms (1st: 13.80 s) | 175.62× | 15.78 s | 90.0 ms (1st: 16.24 s) | 175.30× | 19.95 s | 85.0 ms (1st: 19.74 s) | 234.72× |
| release dot (Points) | 14.96 s | 14.24 s | 1.05× | 15.52 s | 15.96 s | 0.97× | 18.95 s | 17.85 s | 1.06× |
| Random dots (Tilt) | 13.98 s | 13.62 s | 1.03× | 15.29 s | 15.77 s | 0.97× | 18.14 s | 18.18 s | 1.00× |
| Random dots (Points) | 14.90 s | 14.76 s | 1.01× | 15.40 s | 15.31 s | 1.01× | 17.95 s | 17.62 s | 1.02× |
| window resize (incl. 150 ms debounce) | 13.77 s | 221 ms | 62.31× | 15.18 s | 236 ms | 64.34× | 19.36 s | 221 ms | 87.59× |

**Reading the uncached rows.** Figures between 0.94× and 1.06× are within the measurement noise of running two harnesses at once. On an idle machine, the per-section timing (`perf/blocks_before_after.txt`, Mixed at 1000 km) shows 15.59 s → 14.44 s (−7%), Graded 11.69 s → 11.29 s (−3%) and Divergent 4.58 s → 4.32 s (−6%).

**Main-thread freeze during a New coast** (`perf/responsiveness.txt`, longest gap between 10 ms timer ticks):

| | Before | After |
|---|---|---|
| Divergent, 500 km | 4.73–4.81 s | 45–60 ms |
| Mixed, 500 km | 14.4–15.2 s | 42–92 ms |

## Ranked costs after (idle machine, per section, 1000 km)

| # | Mixed (14.4 s) | Graded (11.3 s) | Divergent (4.3 s) |
|---|---|---|---|
| 1 | `gradeMix`, the work: 5.26 s (was 6.02) | `gradeShore`, the work: 4.09 s (was 4.41) | Landscape cut: 0.59 s (was 0.59) |
| 2 | Stage 2 setup: 1.23 s (was 1.23) | Stage 2 setup: 1.23 s (was 1.22) | Equalised coast: 0.52 s (was 0.62) |
| 3 | Landscape cut: 0.98 s (was 1.38) | Landscape cut: 1.18 s (was 1.21) | Sea front: 0.34 s (was 0.35) |
| 4 | Sea front: 0.87 s (was 0.88) | Sea front: 0.82 s (was 0.82) | Sea floor: 0.31 s (was 0.25) |
| 5 | Shore unevenness: 0.61 s (was 0.63) | Sea floor: 0.55 s (was 0.60) | Front: 0.27 s (was 0.25) |

The order is the same as before: the shoreline model, then stage 2, then the sea's front.

## Big costs still left, and why

1. **The shoreline model's wave steps** (`evolve`, 4 s on Mixed and 2 s on Graded at 1000 km).
   - **What I measured:** per-loop timing shows 18 loops of 20–90 ns per point per step. The heaviest, the drift loop at 1 s, is `atan2` (about 30 ns), `cos`, `sin`, `pow` (about 20 ns) and a chain of divisions.
   - **What I tried:** skipping unused work (done), an exact `hypot` (done), and local aliases (no effect). Loop fusion is not exact where river mouths overlap.
   - **Why it stops there:** the number of steps and points is fixed by the brief. The libm calls cannot be swapped for cheaper forms without changing bits.
   - **Next steps I would try:**
     - **Bit-exact JS ports of V8's libm** (its fdlibm-derived `atan2`, `sin`, `cos`, `pow`, `exp`). These would let TurboFan inline them, perhaps 2× on this loop. They need exhaustive verification against the built-ins, and which trig implementation V8 uses depends on the build, so the risk to "identical" is real.
     - **Running the whole model in WebAssembly.** This needs the same bit-exact libm.
2. **Stage 2, the sea's front and the sea floor** (about 4 s on Mixed and Graded).
   - **Why it stays:** about 40 sections of per-cell noise, `exp`/`atan2`/smoothstep arithmetic, a priority flood and random-access river routing (4 passes over a million cells in flow order). No section dominates, and no duplicated work was found: only 51 ms of repeated inputs across all `sdf`, blur and flood calls.
   - **Next step I would try:** splitting the per-cell passes over several workers. That needs `SharedArrayBuffer`, which a page opened from disk cannot have (it requires cross-origin isolation headers). Without it, shipping the grids to and from each worker costs about as much as the passes save, and it would mean restructuring the 3,000-line `generate()` into stages.
3. **Uncached actions in general.**
   - **The one big lever left is speculative work:** working out the other characters, modes or the Tilt/Points toggle for the current dots in background workers while the user looks at the coast. That would make those first switches instant on a multi-core machine.
   - **Why I left it out:** it is not "work whose inputs have not changed". It costs CPU and battery whenever the page is open, plus about 30–40 MB per prepared coast.
   - **Why I didn't do the same for New coast and Random dots:** they would need their `Math.random` draws made in advance, which changes the order of draws. I kept the draws exactly as before.
