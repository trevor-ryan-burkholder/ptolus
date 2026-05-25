# Runner Architecture

The Adventure Runner is a collection of **self-contained local HTML+JS pages**. No build step, no server, no npm. Trevor double-clicks a file and it works.

---

## File Layout

```
runner/
├── index.html              # launcher — links to every generator
├── docs/                   # this folder — implementation specs
├── shared/
│   ├── dice.js             # core dice library (see below)
│   ├── tables.js           # weighted-pick, d% roller, EL math
│   └── data.js             # inline JSON mirrors (avoids file:// CORS)
├── data/                   # JSON data tables (encounter tables, name lists, etc.)
├── encounters/
│   └── index.html          # encounter roller
├── dungeons/
│   └── index.html          # dungeon room generator
├── npcs/
│   └── index.html          # NPC generator
├── loot/
│   └── index.html          # treasure roller
├── weather/
│   └── index.html          # weather + ambience roller
└── names/
    └── index.html          # name generator (culture-keyed)
```

---

## shared/dice.js

All generators include this file. It must expose:

```js
const Dice = {
  seed(n),              // set RNG seed (integer)
  roll(sides),          // roll 1dN, return integer
  rollN(count, sides),  // roll NdS, return integer
  d(expr),              // parse "2d6+3" → integer
  pick(array),          // uniform random pick from array
  weightedPick(array),  // array of {value, weight} → value
  percent(),            // 1–100
  coinFlip(),           // true/false
};
```

Use a seedable PRNG (mulberry32 or sfc32 are 10-line implementations). Seed control is exposed in the UI on every generator — a number input + "Apply Seed" button. Seeded re-rolls must be deterministic.

---

## shared/tables.js

```js
const Tables = {
  elFromCRs(crValues),              // array of cr_value floats → EL integer
  treasureValueByEL(el),            // EL → {coins_gp, goods_gp, items_gp} per DMG Table 7-4
  rollOnTable(table, dice),         // d% table roller: array of {min,max,result} → result
};
```

DMG Table 7-4 average values (hardcode):

| EL | Coins (gp) | Goods (gp) | Items (gp) |
|----|-----------|-----------|-----------|
| 1  | 170       | 0         | 0         |
| 2  | 170       | 170       | 0         |
| 3  | 340       | 170       | 170       |
| 4  | 340       | 340       | 340       |
| 5  | 680       | 340       | 340       |
| 6  | 680       | 680       | 680       |
| 7  | 1360      | 680       | 680       |
| 8  | 1360      | 1360      | 1360      |
| 9  | 2720      | 1360      | 1360      |
| 10 | 2720      | 2720      | 2720      |
| 11 | 5450      | 2720      | 2720      |
| 12 | 5450      | 5450      | 5450      |
| 13 | 10900     | 5450      | 5450      |
| 14 | 10900     | 10900     | 10900     |
| 15 | 21800     | 10900     | 10900     |
| 16 | 21800     | 21800     | 21800     |
| 17 | 43500     | 21800     | 21800     |
| 18 | 43500     | 43500     | 43500     |
| 19 | 87000     | 43500     | 43500     |
| 20 | 87000     | 87000     | 87000     |

---

## shared/data.js

Mirrors the SRD JSON files as inline JS objects to avoid `file://` CORS errors:

```js
const DATA = {
  monsters: [ /* contents of srd/monsters/monsters.json */ ],
  magicItems: [ /* contents of srd/items/magic-items.json */ ],
  mundaneItems: [ /* contents of srd/items/mundane-equipment.json */ ],
  spells: [ /* contents of srd/spells/spells.json */ ],
};
```

When the SRD JSON is updated, copy-paste into `data.js`. Keep both in sync. Generators load `data.js`, not the SRD files directly.

---

## UI Conventions (all generators)

- **Dark background** (`#1a1a1a`), off-white text (`#e8e0d0`), gold accent (`#c8a84b`)
- **Big readable text.** Minimum 16px body. Output in 18–20px monospace or serif.
- **Layout:** narrow left column (controls) + wide right column (scrollable output log)
- **Every roll appends to the log** — older rolls scroll up, newest at bottom
- **"Clear Log" button** always present
- **Seed control** always present: number input + "Apply Seed" button + "Random Seed" button
- **Output is plain text** — no inner HTML formatting that breaks copy-paste
- Show roll math inline: e.g. `Goblin ×4 + Goblin Boss ×1 — EL 3 — avg loot: 340 gp`

---

## index.html

Simple launcher. Card grid linking to each generator. Matches the dark UI style. No JS logic needed — just styled links.
