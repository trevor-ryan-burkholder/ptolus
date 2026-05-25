# Dungeon Room Generator — Implementation Spec

**File:** `runner/dungeons/index.html`
**Purpose:** Generate a keyed dungeon room — shape, exits, contents, dressing, and optional encounter — for instant use at the table.

---

## Data Source

Inline JS tables (no external JSON needed for v1). See tables section below.
`shared/data.js` → `DATA.monsters` (for optional encounter).

---

## UI

**Controls (left column):**
- Dungeon Region (dropdown):
  - The Dungeon (Ptolus) → uses `ptolus_dungeon` monster filter
  - Undercity → `ptolus_undercity`
  - Necropolis → `ptolus_necropolis`
  - Generic Dungeon → `dungeon`
  - Underground (caves) → `underground`
- Party Level (1–20)
- Contents mode (dropdown):
  - Random (full roll)
  - Empty + Dressing
  - Monster + Treasure
  - Trap
  - Special/Puzzle
- "Generate Room" button
- Seed control

**Output:**
```
[ROOM — The Dungeon — Party Lvl 5]

SHAPE: Rectangular (30×40 ft), 12 ft ceiling
EXITS: N (door, iron, locked), S (passage, 10 ft wide), W (secret door — Perception DC 22)

CONTENTS: Monster
  Ghoul (CR 1) ×3 + Ghast (CR 3) ×1 — EL 5
  Tactics: ghouls rush, ghast holds back and targets spellcasters
  Treasure: EL 5 avg (680 gp coins | 340 gp goods | 340 gp items)

DRESSING:
  Smell: decay and old stone
  Sound: dripping water, distant scraping
  Feature: collapsed section of east wall, rubble
  Detail: crude symbols carved into the floor — Orcus cult markings
```

---

## Tables

All tables are weighted arrays for `Dice.weightedPick()`.

### Room Shape
| Shape | Weight |
|-------|--------|
| Rectangular (10×20 to 40×60) | 40 |
| Square (20×20 to 40×40) | 20 |
| L-shaped | 10 |
| Irregular/cavern | 15 |
| Circular (r 15–30 ft) | 10 |
| Corridor intersection | 5 |

Ceiling height: 1d4+1 × 2 ft (min 8, dungeon standard), or 1d6+2 × 5 for cavern.

### Exits (roll 1d4 for count, then direction and type per exit)
Direction: N/S/E/W/diagonal — exclude direction entered from.

| Exit Type | Weight |
|-----------|--------|
| Open passage (10 ft) | 30 |
| Open passage (5 ft) | 20 |
| Wooden door | 20 |
| Iron door | 10 |
| Portcullis | 5 |
| Secret door (DC 20+1d4) | 10 |
| Collapsed/rubble (DC 18 Athletics to clear) | 5 |

Door states: open / closed / locked (padlock DC 20, good lock DC 25) / stuck (DC 15 Strength).

### Contents (weighted by mode)

| Contents | Random Weight |
|----------|--------------|
| Empty | 25 |
| Empty + Special Dressing | 10 |
| Monster only | 15 |
| Monster + Treasure | 25 |
| Treasure only (hidden, DC 20 Search) | 10 |
| Trap | 10 |
| Special/Puzzle | 5 |

### Dressing

**Smell:**
- Decay / rot / blood / damp stone / sulfur / nothing / old ash / incense / mold / stagnant water

**Sound:**
- Dripping water / distant scraping / silence / wind through cracks / faint chanting / water rushing / skittering / nothing

**Floor Feature:**
- Cracked stone / rubble pile / old campfire / chains embedded in wall / dried blood / mosaic (partially destroyed) / nothing / pit (DC 15 Perception, 1d6×5 ft deep) / iron rings in floor / arrow slits

**Detail (Ptolus-flavored when region = Dungeon):**
- Chaositech component embedded in wall
- Brass plate with rune (trap discharge, already sprung)
- Coin from ancient empire (worthless, but fascinating)
- Monster den markings (species varies by region)
- Broken delver equipment — pack, lantern, rope
- Old campsite (weeks old)
- Alchemical residue stains
- Cult symbol (roll d6: 1–2 Orcus, 3 chaos cults, 4 Forsaken, 5 drow, 6 unknown)

---

## Trap Table (when Contents = Trap)

| Trap | CR | Save | Damage/Effect |
|------|----|------|--------------|
| Pit trap (10 ft) | 1 | Reflex DC 15 | 1d6 fall |
| Pit trap (20 ft) | 2 | Reflex DC 20 | 2d6 fall |
| Swinging blade | 2 | Reflex DC 20 | 1d8+3 |
| Poison dart | 2 | Fort DC 14 | 1d4 + Str damage |
| Collapsing ceiling | 3 | Reflex DC 20 | 8d6 |
| Glyph of Warding (Blast) | 4 | Reflex DC 14 | 5d8 (energy type varies) |
| Symbol of Pain | 5 | Fort DC 17 | –4 penalty to attack/skills 1 hour |
| Flooding Room | 3 | — | 1 min to full, Swim DC 15/round |

---

## Notes

- Do not narrate. Output is at-table-ready key text.
- Always show the EL and loot math when a monster is present.
- Ptolus dungeon-specific dressing should appear more often when region = "The Dungeon."
