# Ptolus SRD

A working reference for **D&D 3.5e + Ptolus** content used by both Trevor (at the table) and the Adventure Runner app (`/runner/`).

This is not a verbatim transcription of the official 3.5 SRD or the Ptolus core book — it's a curated, runner-compatible subset that grows as the campaign needs it. Always check `sources/` for canonical text when accuracy matters.

## Layout

```
srd/
├── README.md                # this file
├── rules/                   # markdown rules reference (combat, conditions, skills, magic)
├── classes/                 # PHB + Ptolus classes
├── races/                   # PHB + Ptolus races
├── monsters/
│   ├── monsters.json        # runner-consumed monster database
│   └── by-environment.md    # human index by region
├── spells/
│   ├── spells.json          # runner-consumed spell database
│   └── by-class.md          # human index by class
├── items/
│   ├── magic-items.json     # wondrous, potions, scrolls, wands, etc.
│   ├── mundane-equipment.json
│   └── ptolus-items.md      # Ptolus-specific magic items
└── ptolus/                  # Ptolus-specific lore (pantheon, districts, factions, Spire, Dungeon)
```

## How the runner consumes this

The Adventure Runner app under `/runner/` loads these JSON files at page start. To keep `file://` CORS happy, JSON is also mirrored into `runner/data/` as inline JS objects when needed.

When you add a new entry to any JSON file, follow the schemas below exactly — fields the runner depends on must be present even if null. The runner's encounter and loot generators filter on `environments`, `cr`, `tier`, and `price_gp`, so those fields are load-bearing.

## JSON schemas

### Monster (`srd/monsters/monsters.json`)

Array of monster objects:

```json
{
  "name": "Goblin",
  "cr": "1/3",
  "cr_value": 0.33,
  "size": "Small",
  "type": "Humanoid",
  "subtype": "Goblinoid",
  "alignment": "Usually NE",
  "hd": "1d8+1",
  "hp": 5,
  "initiative": 1,
  "speed": "30 ft.",
  "ac": { "total": 15, "touch": 12, "flat_footed": 14, "notes": "+1 size, +1 Dex, +2 leather, +1 shield" },
  "bab": 1,
  "grapple": -3,
  "attacks": {
    "melee": "Morningstar +2 (1d6)",
    "ranged": "Javelin +3 (1d4)",
    "full_attack": "Morningstar +2 (1d6)"
  },
  "space_reach": "5 ft./5 ft.",
  "special_attacks": [],
  "special_qualities": ["darkvision 60 ft."],
  "saves": { "fort": 3, "ref": 1, "will": -1 },
  "abilities": { "str": 11, "dex": 13, "con": 12, "int": 10, "wis": 9, "cha": 6 },
  "skills": ["Hide +5", "Listen +2", "Move Silently +5", "Ride +4", "Spot +2"],
  "feats": ["Alertness"],
  "environments": ["dungeon", "sewer", "wilderness_temperate", "ptolus_undercity"],
  "organization": "Gang (4-9), band (10-100)",
  "treasure": "Standard",
  "languages": ["Goblin", "Common"],
  "source": "MM 133",
  "tags": ["humanoid", "evil", "common"]
}
```

`cr_value` is the CR as a number (1/8 → 0.125, 1/2 → 0.5) so the runner can sort and filter numerically. `environments` is the most important field for the encounter generator — see the environment vocabulary below.

### Magic item (`srd/items/magic-items.json`)

```json
{
  "name": "Cloak of Resistance +1",
  "category": "Wondrous Item",
  "tier": "minor",
  "subtier": "lesser",
  "price_gp": 1000,
  "body_slot": "shoulders",
  "caster_level": 5,
  "aura": "faint abjuration",
  "description": "Wearer gains +1 resistance bonus on all saves.",
  "source": "DMG 252",
  "tags": ["defensive", "saves", "common"]
}
```

`tier` is `trivial` | `minor` | `medium` | `major` (`trivial` = sub-minor consumables/throwaways; the rest map to DMG Table 7-4). `subtier` is `lesser` | `greater` (used for finer-grained rolls).

### Mundane equipment (`srd/items/mundane-equipment.json`)

```json
{
  "name": "Longsword",
  "category": "Martial Weapon",
  "subcategory": "one-handed melee",
  "price_gp": 15,
  "weight_lb": 4,
  "damage": { "small": "1d6", "medium": "1d8" },
  "critical": "19-20/×2",
  "damage_type": "slashing",
  "range_ft": null,
  "source": "PHB 116"
}
```

### Spell (`srd/spells/spells.json`)

```json
{
  "name": "Magic Missile",
  "school": "Evocation",
  "subschool": null,
  "descriptors": ["force"],
  "level": { "sor": 1, "wiz": 1 },
  "components": ["V", "S"],
  "casting_time": "1 standard action",
  "range": "Medium (100 ft. + 10 ft./level)",
  "target": "Up to five creatures, no two of which can be more than 15 ft. apart",
  "duration": "Instantaneous",
  "saving_throw": "None",
  "spell_resistance": "Yes",
  "description": "...",
  "source": "PHB 251",
  "tags": ["damage", "force", "ranged"]
}
```

## Environment vocabulary

Use these tags on monsters and dungeon-dressing tables. The encounter generator UI exposes them as filters:

- `ptolus_streets` — generic city streets at night, day
- `ptolus_undercity` — sewers, drains, sub-streets under the city
- `ptolus_necropolis` — the walled city of the dead
- `ptolus_dungeon` — the great Dungeon under the Spire
- `ptolus_spire` — the Spire itself, exterior and interior
- `ptolus_docks` — wharves, ships, river slums
- `dungeon` — generic dungeon (use when not Ptolus-specific)
- `sewer` — generic sewer
- `wilderness_temperate` — forest, plains, hills
- `wilderness_cold` — tundra, mountains
- `wilderness_warm` — desert, jungle
- `wilderness_coastal` — beach, cliff, marsh
- `underground` — caves and Underdark
- `planar_lower` — Abyss, Hell, Hades
- `planar_upper` — celestial planes
- `planar_elemental` — elemental planes
- `urban` — generic city (use when not Ptolus)
- `any` — meta-tag: the creature can appear in every region (use sparingly — summoned/ubiquitous creatures). The encounter generator includes `any`-tagged creatures in every region's pool.

A monster can have multiple environment tags. The encounter generator picks the active region, then samples from monsters tagged with it.

## Source citations

For Ptolus content, cite the core book by page: `(Ptolus p. 142)`. For 3.5e core, cite by book and page: `(MM 28)`, `(DMG 252)`, `(PHB 116)`.

## Growing this over time

When the campaign needs a new monster, spell, or item that isn't here:

1. Look it up in the appropriate source PDF.
2. Add a new entry to the relevant JSON file matching the schema above.
3. Update the human-readable index file if there is one (`by-environment.md`, `by-class.md`).
4. Cite the source.

The runner's encounter and loot generators will pick up new entries on the next page load — no code changes needed.
