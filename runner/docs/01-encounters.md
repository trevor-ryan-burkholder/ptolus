# Encounter Generator — Implementation Spec

**File:** `runner/encounters/index.html`
**Purpose:** Roll a random encounter for a given region and party level. Show creatures, quantities, EL, and average loot.

---

## Data Source

`shared/data.js` → `DATA.monsters`

Filter by `environments` array tag matching the selected region.
Sort/sample by `cr_value` compatible with the party level (see algorithm below).

---

## UI

**Controls (left column):**
- Region dropdown (maps to environment tags):
  - Ptolus Streets → `ptolus_streets`
  - Ptolus Undercity → `ptolus_undercity`
  - Ptolus Necropolis → `ptolus_necropolis`
  - The Dungeon → `ptolus_dungeon`
  - Ptolus Docks → `ptolus_docks`
  - Generic Dungeon → `dungeon`
  - Sewer → `sewer`
  - Wilderness (Temperate) → `wilderness_temperate`
  - Underground → `underground`
- Party Level (1–20, number input)
- Target EL offset (dropdown: -2, -1, ±0, +1, +2 — relative to party level)
- "Roll Encounter" button
- Seed control

**Output (right column):**
```
[PTOLUS STREETS — Party Lvl 4 — Target EL 4]
Goblin (CR 1/3) ×4
Goblin Boss (CR 2) ×1
→ EL 4
→ Avg loot: 340 gp coins | 340 gp goods | 340 gp items
```

---

## Algorithm

1. Compute target EL = party level + offset.
2. Filter `DATA.monsters` by selected region tag.
3. Build encounter using one of three templates (pick randomly):
   - **Single creature:** Find one monster with `cr_value` ≈ EL (within ±1).
   - **Pair:** Two monsters at EL−2.
   - **Group:** 4–6 monsters at EL−4, optionally with a leader at EL−2.
4. Compute actual EL using `Tables.elFromCRs()`:
   - Start with highest CR creature's EL.
   - Each doubling of creature count adds +2 EL.
   - Formula: `EL = base_EL + floor(log2(count)) * 2`
5. Look up average loot with `Tables.treasureValueByEL(el)`.
6. Append to output log.

### EL math (3.5e DMG)
- 1 creature of CR n → EL n
- 2 creatures of CR n → EL n+2  
- 4 creatures of CR n → EL n+4
- 8 creatures of CR n → EL n+6
- Mixed groups: use the highest-EL creature as base, then add +1 for each additional creature that would add +1 EL (i.e., another creature within 3 CR of the base adds roughly +1 EL)

For simplicity, use the doubling rule and note "approx EL" in output.

---

## Edge Cases

- If no monsters exist for the region + EL combo, output: `[No suitable monsters in database for this region/EL. Add entries to srd/monsters/monsters.json.]`
- If only one monster qualifies, generate a single-creature encounter rather than failing.

---

## Future: Encounter Tables

Eventually, `runner/data/` will hold region-specific weighted encounter tables (d% → encounter type) pulled from Ptolus sourcebook. When those exist, the generator should offer a "Use Table" toggle vs. "Random from Database" mode.
