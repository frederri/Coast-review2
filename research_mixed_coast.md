# Mixed coasts in plan view: research summary

Purpose: give reference facts for judging rendered sea/land boundaries from a procedural "mixed coast" generator at map widths of 1000, 500 and 200 km.

Method note: the facts below come from web searches of peer-reviewed papers, textbooks and agency reports. Full-text fetching was blocked in this environment, so most numbers were checked against search-indexed abstracts and excerpts, not the full papers. Items marked **[unverified]** could not be confirmed from a source. Items marked **[derived]** are my own arithmetic from cited numbers.

---

## 1. Headland-bay (crenulate, zeta, half-heart) beaches

**What they are.** These are sandy beaches between resistant headlands that refraction and diffraction have shaped into an asymmetric curve. In 1906 Halligan named them "zeta-curve" bays. They are also called crenulate-shaped bays, log-spiral bays and half-heart bays. Engineering literature often claims they make up about **50% of the world's coastline** (Silvester & Hsu; often attributed to Inman & Nordstrom 1971). **[secondary claim, original not checked]**

**Plan shape.** Each bay has three parts in order downdrift:
- a **tightly curved shadow zone** just behind the updrift headland (the diffraction point);
- a **gently curving middle section**;
- a **near-straight tangent section** downcoast, roughly parallel to the dominant wave crests.

The downcoast headland usually bounds the bay less sharply. The curved part always lies on the updrift side, facing the dominant swell (Silvester, ICCE 1970). A chain of such bays gives a sawtooth or "fish-scale" coastline. Every bay has its tight curl at the same end. Between bays, the headlands make **seaward-pointing cusps**.

**Equations.**
- **Logarithmic spiral** (Yasso 1965, *J. Geology* 73:702–714): r = r₀·exp(θ·cot α). The spiral angle α is the constant angle between the radius vector and the tangent. Yasso fitted four California bays, including Half Moon Bay. Secondary sources report that α ranged from **≈41° to ≈86°** across the bays tested. A larger α gives a more circular, tighter curl. **[range from secondary source]** The spiral's origin is not the diffraction point, which makes it awkward for engineering.
- **Parabolic Bay Shape Equation, PBSE** (Hsu & Evans 1989, *Proc. ICE* Part 2, 87): R/R₀ = C₀ + C₁(β/θ) + C₂(β/θ)².
  - R₀ is the control line from the updrift diffraction point to the downcoast point where the beach becomes parallel to the wave crests.
  - β is the angle between the wave crest (the downcoast tangent) and R₀.
  - R is the radius at angle θ measured from the crest line.
  - The fit used 27 prototype and model bays in **static equilibrium**, meaning no net littoral drift passes through. It was originally valid for **β ≈ 22.5°–72°**. Coefficients are tabulated in 2° steps for β = 20°–80° (Silvester & Hsu 1993/1997).
  - C₁ is close to 1, C₀ and C₂ are small corrections, and C₀ + C₁ + C₂ ≈ 1 because R = R₀ at θ = β. Approximate polynomial fits in β (degrees) circulate online, for example C₁ ≈ 0.955 + 0.0077β − … These are rounding-sensitive. **[unverified]**
  - Large β gives a deep, strongly curved bay. Small β gives a shallow, almost straight bay.
- **Hyperbolic tangent shape** (Moreno & Kraus 1999, Coastal Sediments '99, ASCE, pp. 860–875): y = ±a·tanh^m(b·x), with x alongshore and y cross-shore. It was fitted to **46 beaches in Spain and North America**, from regional to project scale. It also fits bays that are not in static equilibrium. A modified form exists (Kemp et al., ICCE 2018).

**Indentation (bay depth / headland spacing).**
- Silvester & Ho (1972) proposed the indentation ratio a/b as a test for equilibrium, where a is the maximum indentation and b is the chord between headlands.
- Silvester & Hsu (1993) predict a/b ≈ **0.15 at 10° obliquity rising to ≈0.65 at 90°**.
- Engineered headland bays in Chesapeake Bay average **0.34 ± 0.13**.
- Semi-exposed natural bays fall around 0.37–0.49.
- A natural chain of zeta bays should therefore mostly show **depth/width ≈ 0.1–0.5**. Very deep bays (>0.6) are pocket beaches or rias, not wave-graded bays.

**Stability.** In 212 SE-Asian headland-bay beaches, 36% were static and 64% dynamic (with sediment supply); 69% were stable and 31% unstable (Manakul et al. 2022, *JMSE* 10:1363). Fellowes et al. (2019, *Mar. Geol.* 411:78–87) classed 168 swell-dominated embayed beaches by indentation and embayment area.

**Sizes.**
- Pocket beaches: 0.1–2 km.
- NSW (Australia): **755 open-coast beaches covering 990 km of sand** (Short 2007), so the mean beach is ≈1.3 km **[derived]**.
- Australia overall: **10,685 beaches occupying about half of the ~30,000 km mainland coast** (Short 2006, *JCR* 22:11–27), so the mean is ≈1.4 km **[derived]**.
- Large examples:
  - Half Moon Bay, CA: a classic log-spiral bay of about 6–10 km before the 1959–61 breakwaters (USGS) **[length approximate]**.
  - Monterey Bay: a ≈40 km (25 mi) arc between Santa Cruz and Point Pinos, and ~24 mi across the mouth.
  - Algoa Bay, South Africa: ≈60 km chord between Cape Recife and Cape Padrone, with ~90 km of shoreline (Bremner 1983).
  - Troia–Sines arc, Portugal: a **65 km** continuous sandy arc ending at Cape Sines.
  - Zeta bays of the Eastern Cape (St Francis, Jeffreys, Algoa) are tens of km.
- **The same shape repeats over two or three orders of magnitude, from about 0.1 km to about 100 km.**

## 2. Differential erosion

- **Refraction.** Wave crests slow and bend over shallower water off headlands. Energy converges on headlands and diverges in bays. Headlands erode and bays fill, so the coast straightens over time (Earle, *Physical Geology*, ch. 17). Coastal straightening needs either near-uniform lithology or enough sediment to fill the bays.
- **Lithology controls complexity.** Across the Australian margin, at the 1–100 km mesoscale, geological inheritance is the main control on coastal complexity. Homogeneous lithology gives straighter coasts and mixed lithology gives complex ones (Porter-Smith & McKinlay 2012, *Mar. Geol.*).
- **Discordant vs concordant structure.** The Isle of Purbeck, Dorset, shows both:
  - The east coast is **discordant**: bands strike perpendicular to the shore. Hard chalk and Purbeck/Portland limestone form the headlands (Handfast Point, Peveril/Durlston). Soft Wealden clays and sands erode back into **Swanage and Studland Bays**.
  - The south coast is **concordant**: bands run parallel to the shore. A resistant limestone wall is breached locally, and the sea scoops out the soft clay behind it to form **Lulworth Cove**. (Sources here are educational, consistent with the JNCC GCR vol. 28.)
  - Expected plan view: **discordant structure → regular alternation of headlands and bays at the band spacing (km). Concordant structure → straight coast with rare round coves.**
- **Rates.**
  - Soft-rock cliffs retreat at **10⁻²–10⁰ m/yr**, one to two orders of magnitude faster than hard-rock cliffs (Sunamura 2015, *Proc. Japan Acad. B* 91:481–500).
  - A global synthesis gives median retreat of **≈2.9 cm/yr for hard rock** (granite etc.) and **≈23 cm/yr for weak rock/till** (Prémaillon et al. 2018, *Earth Surf. Dynam.* 6:651–668).
  - Holderness till retreats **0.95–1.83 m/yr** (1852–2011).
  - Chalk retreats ≈0.1–0.3 m/yr.
  - Hard-rock headlands are therefore effectively fixed on Holocene (~7 kyr) timescales. Soft rock between them can retreat hundreds of metres to kilometres.

## 3. Sediment supply and littoral cells

- **Littoral cells** were defined by Inman & Frautschy (1966). Each cell has sources (rivers, cliff erosion, the shelf, onshore transport) and sinks (submarine canyons, dunes, estuaries, offshore loss).
- **Cell lengths.**
  - California: Oceanside cell **≈80 km** (Dana Point to La Jolla; sink in the La Jolla and Scripps canyons). Santa Barbara cell **≈150 km** (Pt Conception to Pt Mugu/Mugu Canyon; up to ~230 km by other definitions) (Patsch & Griggs 2006; USGS OFR 2007-1412).
  - Oregon (~590 km): **18–22 cells and sub-cells**, mostly pocket-beach cells between basalt headlands. They range from ≈16 km (Cannon Beach) to ≈185 km (Columbia River cell) (DOGAMI).
  - England and Wales: **11 primary cells**, bounded at major headlands (Portland Bill, Land's End, St David's Head, Great Orme, Flamborough Head…) or estuaries (Wash, Thames, Severn, Solway). Mean ≈300–400 km **[derived]**.
  - NSW: **9 primary and 47 secondary compartments**, mostly split at headlands (Thom et al.).
- **Supply decides what gets graded.** River sand in NSW is largely trapped in estuaries, so open-coast bays depend on reworked shelf sand.
- **Glaciated Gulf of Maine:** bedrock controls the shape of the coast. Surficial sand covers only **~7%** of the region and sits at a few river-mouth embayments (Saco, Wells, Kennebec) (USGS OF 2005-1293). Sand-starved coasts stay rugged.
- **Rule for the generator:**
  - sand-rich cell → smooth arcs, barriers, sealed bays;
  - sand-poor cell → bare rock with ragged inlets;
  - mixed cell → sand pooled in the updrift shadow of each headland.
- **Swash-aligned vs drift-aligned** (Davies 1980; Orford et al. 1991):
  - Swash-aligned beaches face the dominant wave crests. They are curved, have near-zero net drift and are closed systems, which is the log-spiral bay case.
  - Drift-aligned beaches meet waves obliquely. They are longer and straighter, have net longshore transport, and build **spits, bars and tombolos**.
- **High-angle wave instability** (Ashton, Murray & Arnault 2001, *Nature* 414:296–300): waves arriving at high angle to the shore can grow cuspate capes and spits with spacing up to **hundreds of km**, as on the Carolina capes. This is a second, non-geological way to make seaward cusps.

## 4. Johnson's (1919) cycle for shorelines of submergence

Johnson (1919), *Shore Processes and Shoreline Development*; see also Woodroffe 2002, ch. 1.
- **Initial:** drowning gives a highly irregular **ria or fjord** coast of drowned valleys, headlands and islands. Rias are dendritic and funnel-shaped (Galicia; Richthofen 1886).
- **Youth:** headlands are cliffed and benched. Sediment collects as bayhead beaches, spits and bars. In **late youth**, bars, spits, hooks, loops and **tombolos** close bays into lagoons. Stacks and islands remain.
- **Sub-maturity / early maturity:** **bays nearly shut off by bars and spits**, headlands markedly cut back.
- **Maturity:** headlands are trimmed back to the line of the bay barriers, giving a **straight, simple, regular** shoreline.
- **A partly graded (mixed) coast looks like:** cliffed headlands with stacks; some bays open with only a bayhead beach; others half closed by a spit from one side (drift-aligned); others fully sealed by a baymouth barrier with a lagoon behind. Sealed stretches read as smooth arcs from headland to headland.
- Caveat: the cycle is a historical, largely qualitative model. Modern work explains these forms by sea-level history, sediment supply and inheritance rather than by "age".

## 5. Proportions

- **≈31% of ice-free shoreline is sandy** (Luijendijk et al. 2018, *Sci. Rep.* 8:6641).
- **≥52% of global shoreline is rocky or cliffed**, and cliffs are present in 93% of 213 coastal states and regions (Young & Carilli 2019, *ESPL* 44:1309–1316).
- **~80% of ocean coasts have sea cliffs** (Emery & Kuhn 1982, *GSA Bull.* 93:644–654). This figure is older and counts cliffs backing beaches.
- Australia: beaches occupy ~50% of the coast (Short 2006).
- These figures overlap because a beach can sit at the foot of a cliff. A realistic mixed coast is therefore **roughly 30–60% graded sandy arcs by length**, interspersed with rocky stretches.
- **Length of homogeneous stretches** varies widely:
  - Aquitaine: **230 km** of nearly straight sand (Gironde to Adour), then **~40 km** of rocky Basque coast.
  - Troia–Sines: 65 km of sand.
  - NSW: the sandy/rocky alternation is at the **1–10 km** scale.

## 6. Scale and fractal dimension

- **Richardson/Mandelbrot** (Mandelbrot 1967, *Science* 156:636–638): L(ε) ∝ ε^(1−D).
  - West coast of Britain **D ≈ 1.25**; Australia **1.13**; South Africa **1.02**, among the smoothest in the dataset and dominated by zeta bays.
  - Norway **≈1.52**, an often-quoted figure from later work (Feder 1988). **[not from Mandelbrot]**
- **Rocky vs sandy coasts.** Sedimentary shores have D ≈ 1.0–1.1. Rocky shores have D ≈ 1.2–1.33.
  - China: sandy Luanhe plain **1.109**, rocky SE Fujian **1.293** (Su et al. 2011, *J. Geogr. Sci.*).
  - Theory and observation suggest **D ≈ 4/3** for eroding rocky coasts (Sapoval et al. 2004, *PRL* 93:098501; Boffetta et al. 2008, *GRL*).
  - US Pacific coast D = 1.00–1.27; Atlantic 1.00–1.70, rising southward because barrier and estuary shorelines are included (Jiang & Plotnick 1998, *Math. Geol.* 30:535–546). D depends strongly on how estuaries are treated.
- **Not self-similar.** Complexity "varies not only with scale but with position along the coastline" (Andrle 1996, *ESPL* 21:955–962; Andrle 1994 introduced the angle-measure technique). A mixed coast should **not** have a single D. It should show **D ≈ 1.0–1.05 along graded arcs and ≈1.2–1.3 along rugged reaches.**
- **Length gain per decade of resolution** is 10^(D−1) **[derived]**:
  - D = 1.02 → ×1.05;
  - D = 1.13 → ×1.35;
  - D = 1.25 → ×1.78;
  - D = 1.3 → ×2.0.
  - A graded arc therefore barely lengthens when zooming in, while a rugged reach nearly doubles per 10× zoom.

## 7. Real-world mixed coasts

- **NSW, Australia:** E–SE-facing headland-bound embayments under persistent SE swell. Hundreds of 1–10 km log-spiral beaches between resistant headlands. Larger compartments contain barrier-sealed estuaries and lagoons (sealed bays).
- **Eastern Cape, South Africa:** large zeta bays (St Francis, Jeffreys, Algoa; tens of km) between sandstone and quartzite capes, open to the dominant SW swell. The overall coast is very smooth (D ≈ 1.02).
- **California:** Big Sur is steep, rocky and sediment-starved. Monterey Bay is a ≈40 km graded crenulate arc. Half Moon Bay is a log spiral behind Pillar Point. Littoral cells of 50–150 km run between headlands and canyons.
- **Oregon:** 18–22 sand cells between basalt headlands. Long beaches with dunes alternate with rocky headlands and stacks.
- **Portugal:** cliffed capes (Espichel, Sines, São Vicente) separate long sandy arcs such as Troia–Sines (65 km). The SW (Alentejo/Vicentina) coast is rocky with small embayed beaches.
- **Galicia vs Landes:** Galicia is a ria coast (drowned dendritic valleys, ~1,720 km of indented shoreline). Aquitaine/Landes is 230 km almost straight. Together they show the youth and maturity end-members side by side.
- **Brittany, Cornwall and Devon:** granite and slate headlands, rias (the Fal, Dart, Aber Wrac'h), small pocket beaches, a few larger sand-filled bays. **[qualitative; no measured data gathered]**
- **Maine → Cape Cod:** a rugged glaciated bedrock coast (Maine) passes into sandy barriers and spits (southern Maine embayments, Cape Cod).
- **Southern Brazil (Santa Catarina):** a headland-bay coast with many log-spiral beaches between granite headlands (Klein 2004).
- **Baja California, New Zealand:** both contain headland-bay chains. **[not checked in detail]**
- **What they share:**
  1. Resistant rock fixes the headland positions, often at structurally controlled spacing.
  2. A dominant swell direction gives every bay the same handedness.
  3. Sediment supply and cell boundaries decide which reaches are filled into smooth arcs and which stay rocky.
  4. Graded and rugged reaches alternate at several nested scales.
- **Seaward cusps:** headland tips between bays; cuspate forelands; **salients behind offshore islands, which become tombolos when the island is large relative to its distance offshore** (breakwater analogues: Hsu & Silvester 1990, *J. Waterway Port Coastal Ocean Eng.* 116:362). The exact threshold ratio is **[unverified]**.

---

## Visual checklist derived from the research

**General (all widths)**
- Bays are **asymmetric**: a tight curl at the updrift headland, straightening downcoast. **All bays in a reach share the same handedness.**
- Bay depth/chord (indentation) is mostly **0.1–0.5**. Ratios above about 0.6 should appear only in rugged or ria reaches.
- Headlands form **seaward-pointing cusps**. Smooth arcs meet at cusps and do not blend into wiggles.
- The coastline shows **at least two distinct roughness regimes**: graded reaches nearly smooth (D ≈ 1.0–1.05, sinuosity close to 1), rugged reaches irregular (D ≈ 1.2–1.3, with inlets, islands and stacks).
- Graded share is **roughly 30–60% of coast length**. It should be neither all rugged nor all smooth.
- Partly sealed features are present: spits growing from the updrift side, baymouth bars with lagoons behind, tombolos to near-shore islands.

**1000 km width** (1 px ≈ 0.5–1 km on a 1–2k px image)
- Expect about **4–15 major arcs or cells of 30–250 km** each (Santa Barbara 150 km, Aquitaine 230 km, Troia–Sines 65 km, Oregon 16–185 km).
- Major capes are spaced tens to hundreds of km apart.
- Long graded reaches look nearly straight or gently arcuate over 100+ km.
- Rugged reaches look fractal (ria or fjord-like indentations 5–50 km deep), not smooth.
- Sub-km pocket beaches are not resolvable. Rugged reaches should still read as textured, not as smooth noise.

**500 km width** (1 px ≈ 0.25–0.5 km)
- Expect about **5–20 zeta bays or arcs of 10–60 km**, with crenulate asymmetry clearly visible (cf. Algoa ≈60 km chord, Monterey ≈40 km arc).
- Headland spacing is ~10–50 km.
- Spits and baymouth barriers should be visible as thin bars closing some bays.
- Rugged reaches should show resolvable drowned-valley inlets and offshore islands.

**200 km width** (1 px ≈ 0.1–0.2 km)
- Expect about **10–40 bays of 2–20 km** (NSW-type chains; Half Moon Bay ~6–10 km). Individual log-spiral shadow zones should be clear.
- Distinct features should be visible: tombolos and salients behind islands, stacks off cliffed headlands, lagoon-backed barriers, bayhead beaches in unfilled inlets.
- Rugged reaches gain length roughly ×1.8–2 per 10× zoom. Graded arcs gain less than ×1.1 and should remain smooth curves at this scale.

---

## Sources

- Yasso, W.E. (1965). Plan geometry of headland-bay beaches. *Journal of Geology* 73(5):702–714. https://www.journals.uchicago.edu/doi/abs/10.1086/627111
- Hsu, J.R.C. & Evans, C. (1989). Parabolic bay shapes and applications. *Proc. Instn Civ. Engrs* Part 2, 87:557–570. https://www.researchgate.net/publication/245547005_Parabolic_bay_shapes_and_applications
- Silvester, R. (1970). Growth of crenulate shaped bays to equilibrium; Use of crenulate shaped bays to stabilize coasts (ICCE). https://icce-ojs-tamu.tdl.org/icce/article/view/2817
- Silvester, R. & Hsu, J.R.C. (1993/1997). *Coastal Stabilization: Innovative Concepts*. Prentice Hall / World Scientific. (Indentation ratios cited via https://www.researchgate.net/publication/245219716_Design_and_performance_of_headland_bays_in_Chesapeake_Bay_USA)
- Moreno, L.J. & Kraus, N.C. (1999). Equilibrium shape of headland-bay beaches for engineering design. Coastal Sediments '99, ASCE, 860–875. https://apps.dtic.mil/sti/tr/pdf/ADA483142.pdf
- Kemp, J. et al. (2018). A modified hyperbolic tangent equation… ICCE. https://discovery.ucl.ac.uk/id/eprint/10086045/
- Manakul, K. et al. (2022). Classifying headland-bay beaches and dynamic coastal stabilization. *JMSE* 10:1363. https://doi.org/10.3390/jmse10101363
- Fellowes, T.E., Vila-Concejo, A. & Gallop, S.L. (2019). Morphometric classification of swell-dominated embayed beaches. *Marine Geology* 411:78–87. https://doi.org/10.1016/j.margeo.2019.02.004
- Short, A.D. & Masselink, G. (1999). Embayed and structurally controlled beaches. In *Handbook of Beach and Shoreface Morphodynamics*, Wiley, 230–250. https://researchportal.plymouth.ac.uk/en/publications/embayed-and-structurally-controlled-beaches/
- Short, A.D. (2006). Australian beach systems—nature and distribution. *J. Coastal Research* 22(1):11–27. https://ozcoasts.org.au/wp-content/uploads/2018/05/ShortJCR06.pdf
- Short, A.D. (2007). *Beaches of the New South Wales Coast*, 2nd ed. Sydney Univ. Press. https://sydneyuniversitypress.com/products/9781920898151
- NSW compartments (9 primary / 47 secondary). https://link.springer.com/article/10.1007/s12237-020-00756-7 ; Carvalho & Woodroffe (2023) https://researchonline.jcu.edu.au/89271/1/Carvalho_Woodroffe_2023_s11852-023-00984-6.pdf
- Bremner, J.M. (1983). Properties of logarithmic spiral beaches with particular reference to Algoa Bay. In McLachlan & Erasmus (eds) *Sandy Beaches as Ecosystems*. https://link.springer.com/chapter/10.1007/978-94-017-2938-3_6
- USGS, Offshore of Half Moon Bay geology metadata. https://pubs.usgs.gov/ds/781/OffshoreHalfMoonBay/metadata/Geology_OffshoreHalfMoonBay_metadata_faq.html
- Earle, S. *Physical Geology*, 17.2 Landforms and coastal erosion (open textbook). https://geo.libretexts.org/Bookshelves/Geology/Physical_Geology_(Earle)/17:_Shorelines/17.02:_Landforms_and_Coastal_Erosion
- Porter-Smith, R. & McKinlay, J. (2012). Mesoscale coastal complexity and its relationship to structure and forcing from marine processes. *Marine Geology*. https://www.sciencedirect.com/science/article/abs/pii/S0025322712001624
- JNCC, *Coastal Geomorphology of Great Britain* (GCR vol. 28). https://data.jncc.gov.uk/data/118b87ed-d7dd-4ea0-99ad-36ed62d2eab0/gcr-v28-coastal-geomorphology-c2.pdf ; Dorset summary: https://www.internetgeography.net/geotopics/coasts/dorset-coast/ (educational)
- Sunamura, T. (2015). Rocky coast processes: with special reference to the recession of soft rock cliffs. *Proc. Japan Acad. B* 91(9). https://www.jstage.jst.go.jp/article/pjab/91/9/91_PJA9109B-04/_html
- Prémaillon, M., Regard, V., Dewez, T. & Auda, Y. (2018). How to explain variations in sea cliff erosion rates? *Earth Surface Dynamics* 6:651–668. https://www.researchgate.net/publication/323496175
- Holderness recession. https://www.researchgate.net/publication/245378226
- Patsch, K. & Griggs, G. (2006). *Littoral Cells, Sand Budgets, and Beaches: Understanding California's Shoreline*. https://coastal.ca.gov/coastalvoices/resources/2006-LittoralCells.pdf ; sand budgets: https://demo2.parks.ca.gov/pages/28702/files/Sand_Budgets_Major_Littoral_Cells.pdf
- USGS OFR 2007-1412 (Santa Barbara cell). https://pubs.usgs.gov/of/2007/1412 ; Oceanside cell: https://geo.libretexts.org/Bookshelves/Oceanography/Oceanography_101_(Miracosta)/12%3A_Coasts/12.12%3A_Coastal_Littoral_Cells
- DOGAMI, Oregon coastal geomorphology. https://www.oregon.gov/dogami/coastal/pages/coastal-geomorphology.aspx
- UK sediment cells / SMPs. https://www.coastalwiki.org/wiki/Shoreline_Management_Plans,_UK ; HR Wallingford SR328: https://eprints.hrwallingford.com/339/1/SR328.pdf
- USGS OF 2005-1293 (Gulf of Maine). https://pubs.usgs.gov/of/2005/1293/html/interp.html
- Davies, J.L. (1980). *Geographical Variation in Coastal Development*, 2nd ed. Longman. (Swash- vs drift-aligned; cited via secondary sources.)
- Ashton, A., Murray, A.B. & Arnault, O. (2001). Formation of coastline features by large-scale instabilities induced by high-angle waves. *Nature* 414:296–300. https://www.nature.com/articles/35104541
- Johnson, D.W. (1919). *Shore Processes and Shoreline Development*. Wiley. https://www.loc.gov/item/19008228 ; summary in Woodroffe, C.D. (2002) *Coasts: Form, Process and Evolution*, CUP. https://catdir.loc.gov/catdir/samples/cam033/2002017418.pdf
- Luijendijk, A. et al. (2018). The state of the world's beaches. *Scientific Reports* 8:6641. https://pmc.ncbi.nlm.nih.gov/articles/PMC5923213
- Young, A.P. & Carilli, J.E. (2019). Global distribution of coastal cliffs. *ESPL* 44(6):1309–1316. https://openpolar.no/Record/crwiley:10.1002%2Fesp.4574
- Emery, K.O. & Kuhn, G.G. (1982). Sea cliffs: their processes, profiles, and classification. *GSA Bulletin* 93:644–654. (80% figure cited via https://www2.mdpi.com/2077-1312/8/1/20)
- Mandelbrot, B. (1967). How long is the coast of Britain? *Science* 156:636–638. https://gsp.humboldt.edu/olm_2021/Courses/GSP_510/Articles/Mandelbrot1967.pdf
- Jiang, J. & Plotnick, R.E. (1998). Fractal analysis of the complexity of United States coastlines. *Math. Geology* 30:535–546. https://link.springer.com/article/10.1023/A:1021790111404
- Andrle, R. (1996). The west coast of Britain: statistical self-similarity vs characteristic scales in the landscape. *ESPL* 21:955–962. (Cited via https://www.sciencedirect.com/science/article/abs/pii/S1385110101000739)
- Su, F. et al. (2011). Scale effects of the continental coastline of China. *J. Geogr. Sci.* https://link.springer.com/article/10.1007/s11442-011-0903-0
- Sapoval, B., Baldassarri, A. & Gabrielli, A. (2004). Self-stabilized fractality of sea coasts through damped erosion. *PRL* 93:098501. https://arxiv.org/pdf/cond-mat/0311509
- Boffetta, G. et al. (2008). How winding is the coast of Britain? Conformal invariance of rocky shorelines. *GRL*. https://arxiv.org/pdf/0712.3076
- Aquitaine coast. https://webissimo.developpement-durable.gouv.fr/IMG/pdf/5_18_l_evolution_du_trait_de_cote_cle04d1d3.pdf ; Troia–Sines arc: https://marineinfo.org/doc/publication/12611
- Klein, A.H.F. (2004). *Morphodynamics of Headland-Bay Beaches: Examples from Santa Catarina, Brazil*. PhD thesis, Univ. Algarve. https://sapientia.ualg.pt/bitstream/10400.1/12277/4/Klein%20-%20Morphodynamics.pdf
- Hsu, J.R.C. & Silvester, R. (1990). Accretion behind single offshore breakwater. *J. Waterway, Port, Coastal, Ocean Eng.* 116(3):362. https://ascelibrary.com/doi/10.1061/%28ASCE%290733-950X%281990%29116%3A3%28362%29
