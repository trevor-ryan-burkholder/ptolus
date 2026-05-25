# Build Order & Dependencies

Recommended implementation sequence for the Adventure Runner.

---

## Phase 1 — Foundation (build first)

These are load-bearing. Everything else depends on them.

1. **`shared/dice.js`** — seedable PRNG + all dice methods. No dependencies.
2. **`shared/tables.js`** — EL math, DMG Table 7-4 loot values. Depends on dice.js.
3. **`shared/data.js`** — inline mirrors of all SRD JSON. No logic, just data.
4. **`runner/index.html`** — launcher page. Styled, links to all generators. No logic.

Test: dice.js should be testable in browser console. `Dice.seed(42); Dice.roll(20)` should return the same value every time with the same seed.

---

## Phase 2 — Core Generators (highest at-table value)

Build in this order — each one is independently usable:

5. **`runner/encounters/index.html`** — highest-frequency use. Depends on dice.js, tables.js, data.js.
6. **`runner/loot/index.html`** — second most frequent. Depends on dice.js, tables.js, data.js.
7. **`runner/npcs/index.html`** — third most frequent. Depends on dice.js. Inline tables only.

---

## Phase 3 — Supporting Generators

8. **`runner/names/index.html`** — depends on dice.js. Fast to build (just tables + assembly).
9. **`runner/weather/index.html`** — depends on dice.js. Inline tables only.
10. **`runner/tavern/index.html`** — depends on dice.js, optionally data.js for stock items.

---

## Phase 4 — Combat & Session Tools

11. **`runner/combat/index.html`** — combat tracker. Depends on dice.js, data.js (for "Add Monster" shortcut). Include effect tracker as a collapsible panel.
12. **`runner/xp/index.html`** — XP calculator. Depends on tables.js only. Fast build.
13. **`runner/commissariat/index.html`** — response timer. Depends on dice.js. Inline tables only. Real-time countdown via `setInterval`.

---

## Phase 5 — City Systems

14. **`runner/city-events/index.html`** — city event generator. Depends on dice.js. Inline tables only.
15. **`runner/jobs/index.html`** — delver job board. Depends on dice.js, optionally data.js for monster targets.
16. **`runner/factions/index.html`** — faction disposition tracker. No dice needed. Uses localStorage for persistence.
17. **`runner/street-scenes/index.html`** — street scene generator. Depends on dice.js. Inline tables only.

---

## Phase 6 — Ptolus-Specific Generators

18. **`runner/chaositech/index.html`** — chaositech item generator. Depends on dice.js. Inline tables only.
19. **`runner/investigations/index.html`** — crime scene/investigation seed. Depends on dice.js. Inline tables only.
20. **`runner/noble-schemes/index.html`** — noble scheme generator. Depends on dice.js. Inline tables only.

---

## Phase 7 — Reference Pages (static, no generator logic)

21. **`runner/reference/conditions.html`** — full condition list with live search filter.
22. **`runner/reference/actions.html`** — action economy reference with accordion sections.
23. **`runner/reference/dungeon-levels.html`** — editable dungeon level reference. Uses localStorage for party notes.

---

## Phase 8 — Dungeon Generator

24. **`runner/dungeons/index.html`** — most complex generator. Depends on dice.js, tables.js, data.js. Build last so you can reference all inline tables from other generators for consistency.

---

## Data Sync Checklist

Before each session, verify `shared/data.js` is in sync with:
- `srd/monsters/monsters.json`
- `srd/items/magic-items.json`
- `srd/items/mundane-equipment.json`
- `srd/spells/spells.json`

Any new monsters or items added to the SRD must be mirrored into `data.js` before the runner will see them.

---

## Testing Each Generator

Before first table use:
1. Open the HTML file in a browser (double-click).
2. Set seed to a fixed value (e.g., 12345).
3. Click the generate button 10 times.
4. Verify: output is coherent, no JS errors in console, re-seeding produces identical results.
5. Test edge cases: EL 1, EL 20, empty region (encounter generator with no matching monsters).

---

## Extending the Runner

When adding a new generator:
1. Create `runner/[name]/index.html`.
2. Add a link card to `runner/index.html`.
3. Write a spec doc in `runner/docs/` following the format of these files.
4. If it needs new data tables, add them to `runner/data/` and mirror in `shared/data.js`.
