# Mixed coast: critic + fix run, 3 rounds (Coast mode, 1000 / 500 / 200 km)

- Original file (untouched): `coast_generator2.html`
- Final file: `coast_generator2_mixed.html`
- Research summary with sources: `research_mixed_coast.md`
- Screenshots: `shots/r1`, `shots/r2`, `shots/r3`. Files are named `r<round>_<width>km_seed<seed>_<control>_<before|after>.png`, e.g. `r2_500km_seed42_points-centre_after.png`. Here `before` is the fresh render at the start of the round and `after` is the render after that round's changes. Window-size renders carry the window in the name, e.g. `r3_200km_seed42_tilt_fullscreen1920x1080_after.png`. Each `pairs/` folder holds the before|after side-by-sides, one per render, and `*_console.txt` holds the console output for each run.
- Original vs final at 1000 / 500 / 200 km: `shots/compare/`
- Harness: `tools/render.js` renders through the page's own URL hash (`chr=mix&mode=plain`). It never selects any other character or mode, and only uses widths of 1000, 500 and 200 km.
  - **Test set:** seeds 11, 42, 137, 2024, 5309 and 90210 at each width.
    - Tilt: each seed has its own handle offsets. These are fixed fractions of the view height (in effect, fixed "Random handles" draws).
    - Points: the free dot is near the left edge (seed 11), at the centre (42), high (137), low (2024), near the right edge and low (5309), or left of centre and high (90210).
  - That gives 12 renders per width and 36 per round. All are 1280×800.
  - **Window sizes:** 1280×800, 1920×1080 (fullscreen), 1000×1000 and 1600×700, at 1000 and 200 km (seed 42, Tilt).
- `tools/measure.py` is a pixel-only helper used alongside looking at the images. For each render it counts enclosed water (lakes and lagoons), islands, and a per-64 px roughness code along the shore: S = smooth, p = partly, R = rugged.

Round sections follow, then the closing summary.

---

## Round 1

### Problems found in the original file (ranked by severity)

I looked at all 36 renders and the 8 window-size renders one by one (`shots/r1/r1_*_before.png`), then went through them a second time and then compared them as a set.

| # | Problem | Where (examples) | How often | Severity |
|---|---|---|---|---|
| 1 | **Inland water.** Lakes and lagoons stand behind the coast, some 50–150 km inland. Several are boxy: rectangular or trapezoid, with ruler-straight sides, and one is cut into parallel stripes. The research and the brief allow no lagoons, lakes or rivers. In Johnson's sequence a sealed bay fills (washover, flood-tide deltas, marsh); it is not left as open water. | 200 km: seed42 tilt (two large ones, one striped), seed42 points-centre (oval lake), seed137 tilt (striped lagoons at the left), seed2024 tilt and points-low, seed5309 tilt. 500 km: seed42 tilt and points-centre (square lake), seed137 tilt, seed90210 tilt. 1000 km: seed42 tilt (a sliver). | 21 of 36 renders (measured: 1–6 enclosed water bodies each) | major |
| 2 | **Rugged stretches are not rugged.** Rock coast comes out as soft, rounded lobes with a fine fuzz along the edge, not coves cut along weak bands with points of sound rock between. Real rocky coasts have D ≈ 1.2–1.3: rias, coves set by structure, stacks. | 1000 km seed5309 tilt, seed90210 tilt, seed11 tilt (lumpy and puffy). 500 km seed11 tilt (rounded lobes with flat tops). | almost all | major |
| 3 | **It reads as an average of two coasts.** At 1000 and 500 km the whole coast is one moderately smooth, puffy line. The rock stretches look like a softened copy of the drowned coast (the grading line at its coarse step with the small-scale detail faded in), so neither regime is clear. The research says a mixed coast shows two distinct roughness regimes (Andrle 1996; Su et al. 2011: sandy 1.11 vs rocky 1.29). Measured mean roughness at 1000 km is 1.13–1.33, mostly "S"/"p", with almost no "R". | 1000 km: all 12. 500 km: seed11, seed137 points-high, seed42 tilt. | most renders | major |
| 4 | **Ruler-straight lids and right-angled bays.** Sealed or half-filled bays are drawn as straight lids, with square corners where the lid meets the bay walls. The rock walls come down to the lid at 90°. The research says bay beaches are log-spiral or parabolic curves (Yasso; Hsu & Evans), tangent to the headland they hang from. | 500 km seed11 tilt (a rectangular inlet with a flat top). 1000 km seed2024 tilt (flat-topped bay). 1000 km seed42 tilt (box bay at the top right). 200 km seed137 tilt (a vertical wall meeting a flat run at a right angle). | about a third | major |
| 5 | **No structure at map scale at 1000 km.** The coast is a string of similar 50–100 km lobes, with no clear headland-bounded cells (the research expects 4–15 arcs/cells of 30–250 km). | 1000 km seed11, seed5309, seed90210 | most at 1000 km | medium |
| 6 | **Artificial islets.** Parallel slivers and comb-like rows of islets stand off a smooth graded run. | 200 km seed42 points-centre (right), 200 km seed2024 points-low | some | medium |
| 7 | **Window-dependent water.** Fullscreen (1920×1080) at 1000 km has a lagoon wedge that the 1280×800 render lacks. The coast itself is the same at every size, so this is a side effect of #1. | `r1_1000km_seed42_tilt_fullscreen1920x1080_before.png` | 1 of 8 | minor |
| 8 | **Partly graded forms are rare.** There are few bays half closed by a spit and few headlands half cut back. Bays are mostly either untouched or lidded. | all widths | most | medium |

**Already right at the start:**
- The coast reaches every dot. There are no spikes or kinks at the free dot in any Points render.
- The coast does not change with window size, apart from #7.
- No flat slices at the map edges.
- 200 km seed42 tilt and seed90210 tilt already show what the research describes: long smooth arcs with sharp seaward cusps between them.
- Seeds give clearly different coasts.

### What changed in the method (all inside `gradeMix`, the Mixed-only grading stage)

**A. Bays the drift closes are filled, not kept as lagoons** (problems #1, #7, part of #4).
- Before: a closed-off bay was kept as a "lagoon" of open water, with the drowned valley's shores, and drawn as such.
- Now that whole branch is removed: the LAG/W0 tracking, the lagoon carving at the end, and passing `lag` back to the shared code. A bay the drift seals is filled.
- A water channel only a few cells wide left between a beach and the rock behind it is closed too, by a morphological closing of the land, applied only where a beach is involved. A narrow inlet between two rock walls with no sand stays open.
- Basis: Johnson's sequence ends with bays sealed and filled. Back-barrier basins fill with washover fans, flood-tide deltas and marsh. The brief allows no lagoons, lakes or rivers.

**B. A differential-erosion stage cuts the rock coast before any grading** (problems #2, #3, #5).
- How far the rock goes back now depends on the rock: `retreat = d50 · exposure · exp(−6·(resistance − 0.5))`, capped. This is an exponential law, because cliff retreat spans orders of magnitude with rock strength (Sunamura 2015; Prémaillon et al. 2018: hard rock about 3 cm/yr, weak rock tens of cm/yr, till metres per year).
- Resistance is the ground's own hardness plus two structural fields read along the coast's own direction:
  - **bedding bands** running across the coast (`grainAt`), whose amplitude grows where the structure is broken up (`RG`);
  - **joint/fault zones**: narrow lines where a second stretched noise crosses zero, which weaken the rock.
- The sea cuts only rock it can reach from open water. A hard knob it goes round is left standing as a stack or skerry (Sapoval et al. 2004).
- This gives a discordant-coast pattern of coves along weak bands, with sound points between them (the Purbeck/Swanage example), and leaves soft ground smooth.

**C. Closed littoral cells** (problems #3, #8).
- Cell ends were already placed at capes. They now prefer resistant rock: the reach of a cape plus a bonus for hard ground (Portland Bill, Point Conception).
- The cells are now actually closed:
  - the sand budget that seals bays resets at each cell end;
  - the longshore drift in the shoreline model is zero across a cell boundary.
- So a fed cell grades and a starved cell stays rocky, with no sand leaking across. Basis: Inman & Frautschy 1966; Patsch & Griggs 2006; the NSW compartments.

**D. Rock and sand are combined, not blended** (problem #3, the core of "not a crossfade").
- Before: the final coast was `line + w·(rock detail − line-at-start)`, a weighted mix of the graded line and the drowned coast's shape. Where `w` was in between, that is literally an average.
- Now the coast is the **union of two physical surfaces**:
  - **the rock** where it still stands, worn back by as much as the shoreline model recorded at that place;
  - **the sand** only where the model left a beach, plus whole bays the beach closes.
- A bay the line crossed is filled or left open as one body, depending on whether most of its mouth carries a beach. Deciding cell by cell had cut straight edges across half-filled bays.
- Result:
  - a starved stretch is exactly as rugged as its rock;
  - a fed stretch is the graded line, with any rock that still stands out of it as headlands.
- Basis: rocky and sandy reaches are distinct regimes, not a mean (Andrle 1996; Su et al. 2011).

All changes are confined to `gradeMix()` and to the one line in `generate()` that copied Mixed's lagoons into the shared `work.lag` (removed). `gradeShore()` (Graded shoreline) and all shared helpers are byte-identical to the original; this was checked with `diff`.

### Verification (before | after, same seeds, widths, handles and dots: `shots/r1/pairs/`)

I looked at every pair. The page loads without console errors or warnings in all 44 after-renders (`shots/r1/r1_after_console.txt`).

| # | Status | Evidence |
|---|---|---|
| 1 Inland water | **Improved, almost fixed** | Every large lake and lagoon is gone, including the striped and boxy ones. The measured count of enclosed water falls from 21 renders with 1–6 bodies (sizes up to 15,000 px) to 6 renders with one small pool each (11–362 px), for example 500 km seed137 tilt and 200 km seed2024 tilt. Those pools are carried into Round 2. |
| 2 Rugged stretches | **Fixed** | Rock stretches now have coves cut along weak bands, sound points between them, drowned inlets, and stacks/skerries off them. Examples: 1000 km seed5309 tilt, seed90210 tilt; 500 km seed2024, seed5309; 200 km seed137 tilt. The share of "R" windows at 1000 km rises from 0–0.30 to 0.25–0.60. |
| 3 Average of two coasts | **Improved** | Two regimes are now visible side by side: smooth graded arcs (1000 km seed42 points-centre, the right-hand bay; 500 km seed137 tilt, the left arc) next to rocky reaches. The puffy in-between line is gone. However, the balance has now tipped towards rugged (see R3). |
| 4 Ruler lids / right-angled bays | **Still there** | 500 km seed11 tilt (rectangular inlet, now with rough walls); 1000 km seed2024 tilt and 500 km seed90210 tilt (flat lid with square ends); 500 km seed42 tilt (a box bay at the top). This is the main problem for Round 2. |
| 5 Structure at 1000 km | **Improved** | Headland-bounded reaches of 100–300 km now read clearly (1000 km seed42, seed137, seed2024). |
| 6 Artificial islets | **Partly fixed** | The slivers off 200 km seed42 are gone. New ones appear at 200 km seed11 (both renders): spiky prongs on an island and a fan of thin slivers offshore. |
| 7 Window-dependent water | **Fixed** | The fullscreen render no longer has the lagoon. All four window sizes show the same coast at 1000 and 200 km. |
| 8 Partly graded forms | **Slightly improved** | A few spits now reach part way across a bay (1000 km seed42 tilt, seed2024 tilt), but they are still rare. |

**Regressions and new issues found in the after-renders:**
- R1: A ruler-straight graded run about 250 km long (500 km seed90210 points-midHighL, the left side). A drift-aligned beach can be almost straight, but this one is perfectly straight. Medium.
- R2: The prong islets at 200 km seed11 (see #6). Medium.
- R3: The graded share has dropped, mostly at 200 km. seed2024 tilt is about 85% rugged, and seed137 points-high and seed5309 points-edgeR about 60–65%. The research expects about 30–60% graded on most seeds. Major for Round 2.
- R4: Small enclosed pools remain (see #1). Medium.

---

## Round 2

### Problems found (fresh renders `shots/r2/r2_*_before.png`, the file as Round 1 left it)

I looked at all 36 renders and the window-size set one by one, then went through them a second time, then compared them as a set. Ranked by severity:

| # | Problem | Where (examples) | How often | Severity |
|---|---|---|---|---|
| 1 | **A river.** A winding channel about 1–2 km wide runs some 40 km inland as an S-curve between a sand fill and the rock. It reads as a river, which is not allowed. It is water that lies behind sand but outside any sealed bay, so the Round 1 "fill the bay as one body" rule left it open because no beach ran along the line next to it. | 200 km seed2024 tilt (right side) | 1 render, but very conspicuous | major |
| 2 | **Flat lids with square ends.** Bay heads are filled as straight bars across the bay, meeting the walls at right angles. At its worst a bay becomes a rectangle. The research says the bay beach is the parabolic or log-spiral planform, curled in the lee of the updrift point and running out along the crests, never a straight lid. Debugging showed the cause: the planform was scaled out from the updrift tip, so in any bay deeper than its mouth is wide the curl lay inside the rock, and only the shape's straight downdrift run cut the bay. That run is the lid. | 500 km seed11 tilt (rectangular inlet), 500 km seed11 points-edgeL, 1000 km seed2024 tilt (flat-topped bay), 500 km seed2024 points-low (flat run with a square step), 500 km seed42 tilt (box bay at the top) | about a third of renders | major |
| 3 | **Combs of slivers.** Narrow parallel islets, and an island with parallel prongs, stand off the coast. The Round 1 erosion cut every weak band wherever it lay, so on a narrow island all the soft bands were cut through at once. Real differential erosion works inward from the open sea: a soft band behind sound rock is safe until the sea breaks through. | 200 km seed11 both (centre slivers, prongs off the left island), 200 km seed5309 tilt (needle islets), 500 km seed2024 points-low (diagonal slivers) | some | medium |
| 4 | **Rugged share too high on some seeds.** In R3 from Round 1, rugged stretches cover 60–85% of the coast. | 200 km seed2024 tilt (R 0.85), 500 km seed5309 tilt (R 0.70), 200 km seed137 points-high (0.65) | some | medium |
| 5 | **A ruler-straight run.** A graded run about 250 km long is perfectly straight, with a sharp kink at the top. | 500 km seed90210 points-midHighL | 1 | medium |
| 6 | **Small enclosed pools.** 11–360 px of water with no outlet (lakes). | 500 km seed137 tilt, 200 km seed2024 both, 200 km seed5309 points-edgeR, 1000 km seed5309 tilt | 6 renders | medium |
| 7 | **Flat-topped "mesas"**: straight-sided, flat-topped lobes of land at 1000 km. | 1000 km seed2024 tilt (left) | 1–2 | minor |

**Regressions from Round 1:** #3 (slivers) and #4 (rugged share) are partly Round 1 side effects of the erosion stage. #1 came from Round 1's bay-fill rule.

**Still right:** every dot is reached with no spike at the free dot, the coast is the same at every window size, nothing is cut off at the edges, and seeds differ clearly.

### What changed in the method (all in `gradeMix`)

**E. The bay-head beach is the bay's own equilibrium planform** (problem #2). Basis: Hsu & Evans 1989, Silvester & Hsu 1993, Short & Masselink 1999 (pocket beaches).
- Before: the parabolic bay shape was scaled k× outward from the updrift tip until the fill matched the sand. That works for an open embayment. In a drowned valley deeper than it is wide, though, the scaled curl lies inside the rock and only the shape's straight run cuts the water, which gave the flat lids.
- Now the parabolic bay shape (R/R₀ = C₀ + C₁(β/θ) + C₂(β/θ)²) is evaluated once for the actual mouth. That gives a depth profile y(t) across the mouth, from the updrift tip to the downdrift tip: a deep curl near the updrift side, running out along the crests to the downdrift point.
- The sand is laid in order of (distance in from the mouth, measured through the bay's water) − y(t), so the beach stands back by the planform's depth along its whole width.
- In a steep-sided bay the beach therefore still runs wall to wall, bowed and asymmetric, never a straight bar.
- The old "pocket beach vs open bay" branch and the k-scaled `pastBay` are gone; one rule now covers both.

**F. Back-barrier water is filled; only bare inlets stay open** (problems #1, #6).
- Water the shoreline line has passed over is now kept open only when it is an inlet the line merely stepped across: bare of sand where the line meets it, with no laid sand against it.
- Any water that touches sand the drift laid (a barrier, spit or bayhead beach) is filled, as back-barrier basins fill (washover fans, flood-tide deltas, marsh).
- Basis: Johnson's late-youth to maturity sequence.

**G. Erosion advances as a front from the open sea** (problems #3, #4).
- Before: each cell was cut back by its own rate.
- Now the sea's arrival time at each place is computed with a Dijkstra fast-marching front through the rock, at a local speed `exp(−6·(resistance − 0.5))`. The cut at each place is how far the front would have carried on past it in the time left.
- So a soft band behind sound rock stays land until the sea breaks through. When it does, it is scooped out behind a narrow mouth (Lulworth Cove / Stair Hole), and an inlet along a weak band reaches only as far as its time allows.
- Islands are no longer sliced into combs.
- Basis: differential erosion as a process that propagates from the shore (Sunamura 2015; damped erosion, Sapoval et al. 2004).

### Verification (`shots/r2/pairs/`)

I looked at every pair. There are no console errors or warnings (`shots/r2/r2_after_console.txt`).

| # | Status | Evidence |
|---|---|---|
| 1 River | **Fixed** | 200 km seed2024 tilt: the S-channel is gone. A sealed bay-head plain now stands at its place, and no channels remain anywhere. |
| 2 Flat lids | **Improved** | Lids now bow, and their ends meet the walls in curves (500 km seed11 tilt, the U inlet has a rounded head; 1000 km seed2024 tilt, the bay is now an asymmetric curve; 500 km seed2024 tilt, a large arc from a curl in the lee of the left point). One case is still open: wide, shallow bay heads with near-parallel walls stay flat across the middle (200 km seed42 window-size set, the box bay at the right; 500 km seed90210 points, the centre U). Carried into Round 3. |
| 3 Slivers | **Fixed** | 200 km seed11: the centre slivers and the prongs are gone, and the islands are now compact, worn rock islands with ragged edges. 500 km seed2024 points: the diagonal slivers are gone. |
| 4 Rugged share | **Improved** | Measured graded ("S") share now runs 0.10–0.60, with most renders at 0.30–0.50, inside the research range of 30–60%. The worst case, 200 km seed2024 tilt, went from R 0.85 to 0.50. |
| 5 Ruler-straight run | **Fixed** | 500 km seed90210 points: it is now a long, gently curved arc into the next headland. |
| 6 Pools | **Improved** | Down from 6 renders to 3: a couple of tiny pools in 200 km seed2024 and one in 500 km seed11 points. Carried into Round 3. |
| 7 Mesas | **Fixed** | 1000 km seed2024 tilt: the flat-topped lobe is gone. |

**New issues / regressions seen in the after-renders:**
- R1: A few very round bays, almost semicircular (200 km seed90210 tilt, the left bay; 500 km seed2024 tilt, the large bay). These are full zeta curls; the shape itself is plausible but on the round side. Minor.
- R2: The large island in 500 km seed90210 points was worn away. Its soft rock was cut by the new front and the sand buried what was left. Plausible, but it removes a feature that read well. Minor.

---

## Round 3

### Problems found (fresh renders `shots/r3/r3_*_before.png`, the file as Round 2 left it)

I looked at all 36 renders at full size, every 500 and 200 km render a second time in 2×2 sheets, and the window-size set. Ranked by severity:

| # | Problem | Where (examples) | How often | Severity |
|---|---|---|---|---|
| 1 | **Smooth-walled, round, deep bays.** Drowned valleys come out as round holes with graded, sandy-looking walls. Indentation is about 0.7–0.9. The research says graded bays sit at 0.1–0.5. Deeper bays occur only in rugged or ria reaches, where the walls stay rock and the sand gathers at the head: inside a narrow mouth the swell is diffracted and spent, so it neither drives drift nor grades the walls. | 500 km seed5309 tilt (oval bay at the top), 200 km seed90210 tilt (top-left round bay), 500 km seed2024 tilt (large round bay), 200 km seed2024 tilt (smooth U bay), 200 km seed11 points (smooth inner bay walls), 500 km seed137 points (inlet near the dot) | about a quarter | medium–major |
| 2 | **Partly graded forms still rare.** Few bays are half closed by a spit. | most | most | medium |
| 3 | **Flat or box-like bay heads in wide embayments.** Example: a 150 km bay with a flat top and a vertical wall at 1000 km seed42 (window-size set) and 1000 km seed11 tilt (right bay). I checked these with a field-debug view: they are a straight run along the crests meeting a tight curl at the updrift headland, which is the zeta-bay shape the research describes. The square look at the corner is where the curl meets the cliff. | 1000 km seed11 tilt, 1000 km seed42 points / window set | some | minor (shape is physically consistent, but reads a little boxy) |
| 4 | **Rounded sand corners instead of rocky headlands** where two graded arcs meet on soft ground. Physically fair: where the rock is soft throughout, the headland itself is worn away (Holderness-type). | 500 km seed11 tilt (right), 1000 km seed11 | some | minor |
| 5 | **Tiny leftovers.** One 6 px speck of enclosed water (500 km seed11 points). The other "pools" the measuring script flags are bays that continue past the map edge, not lakes. | 1 | 1 | minor |

**Regressions from Round 2:** none found. The river, slivers and large lakes did not come back.

### What changed in the method (all in `gradeMix`)

**H. Wave sheltering by fetch: the line grades only where the swell reaches** (problems #1, #2).
- For every point of the final shoreline, a **wave-exposure index** is computed the way fetch-based exposure indices are. Nine rays are cast over the water towards where the swell comes from, spread across ±60° of the swell direction. The index is the share of rays that reach open water a tenth of the wave length scale off without meeting land.
- The index is carried to the cells like the beach width and the rock wear.
- Where the shore is sheltered (index < 0.3), as on the walls of a bay behind a narrow mouth:
  - the line's beach no longer counts, so the coast is the worn rock (rugged ria walls);
  - the water the line passed over there is not filled.
- The bay's head still gets the sand that sealing laid there, which is the bayhead beach.
- Exposed and sheltered stretches are decided as separate bodies, so there is no straight edge at the change.
- Basis: Johnson (ria walls rocky, bayhead beaches), Short & Masselink 1999 (embayed beaches, wave sheltering), and wave refraction/diffraction concentrating energy at the mouth.
- (I first tried a simpler "openness" blur as the shelter measure. It found no more sheltered walls than the ray-cast index and is less physical, so I replaced it with the ray-cast index. Before that, a "no thin beach on headlands" rule had almost no visible effect, so I removed it rather than leave dead logic.)

### Verification (`shots/r3/pairs/`)

There are no console errors or warnings (`shots/r3/r3_after_console.txt`). 23 of 44 renders changed; the other 21 are pixel-identical, as expected, because they have no sheltered bays.

| # | Status | Evidence |
|---|---|---|
| 1 Smooth round bays | **Improved** | 500 km seed5309 tilt: the oval bay is now a branching ria with ragged rock walls. 200 km seed2024 tilt: a ria with branches replaces the smooth bay at the right. 200 km seed11 points/tilt: the inner bay walls and the west side of the right peninsula are rocky now. 500 km seed137 points: the inlet by the dot is a ragged ria. **Still open:** 200 km seed90210 tilt and 500 km seed2024 tilt keep one large round bay each. Their walls are formed by the bay-head fill and the worn-back rock, not by the line's beach, so this rule does not reach them. |
| 2 Partly graded forms | **Improved** | A bay half closed by a long spit now appears at 200 km seed90210 points (top centre). There are new partly closed inlets at 500 km seed2024 points (bottom centre) and 200 km seed2024 points (left). Still not frequent. |
| 3 Box-like heads | **Still there (accepted)** | Physically a zeta-bay form (see above). |
| 4 Sand corners | **Still there (accepted)** | As above. |
| 5 Speck | **Still there** | 6 px, not visible at normal viewing. |

**New issues seen in the after-renders:** none. There are no new pools, threads or slivers, and the window-size set is still identical across 1280×800, 1920×1080, 1000×1000 and 1600×700.

---

## Closing summary

### What already looked right at the start, and whether it still does
- **The coast reaches every dot, with no spike, tip or kink at the free dot.** Still true in all 36 final renders, including the edge, high and low dot positions.
- **The coast does not change with window size or fullscreen; no cut-offs or flat slices at the map edges.** Still true: the final window-size set is consistent across all four sizes. The one original difference, a lagoon visible only in fullscreen, is gone.
- **Different seeds give clearly different coasts.** Still true.
- **Some seeds already had long graded arcs with sharp cusps** (200 km seed42 tilt, 200 km seed90210 tilt). Still present (`shots/compare/seed42_tilt_original_vs_final.png`, bottom row).

### Measured shape statistics (pixel-only, `tools/measure.py`, original → final)

| | Original | Final |
|---|---|---|
| Renders with enclosed lakes/lagoons (excluding bays cut by the map edge) | 21 / 36, up to 6 per render, up to ~16,000 px | 0 lakes. One 6 px speck; the remaining flags are bays running off the map edge. |
| Rugged ("R") share of the coast, 1000 km | 0.00–0.30 | 0.15–0.45 |
| Graded ("S") share of the coast, all widths | 0.20–0.80 (mostly a single moderate "p" regime at 1000 km) | 0.10–0.50, most renders 0.30–0.50 (research: 30–60 % graded) |

### Scope check
- Only the Mixed character, in Coast mode, at 1000 / 500 / 200 km, was rendered, inspected or changed.
- All code changes are inside `gradeMix()`, which only Mixed calls, plus the removal of one Mixed-only line in `generate()`: the copy of Mixed's lagoons into `work.lag`, inside the `if (mix && …)` block.
- `diff` confirms that `gradeShore()` (Graded shoreline), the shared helpers (`traceShore`, `rasterShore`, `sdf`, `blur3`, `grainAt`, …) and everything outside the Mixed branches are byte-identical to the original.
- No buttons, sliders or options were added, and the paint and style are unchanged.
