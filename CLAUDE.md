# Ptolus Campaign — Project Instructions

This project supports Trevor running a tabletop campaign set in **Ptolus, City by the Spire**. Two things happen here:

1. **Campaign prep** — session notes, NPC/faction tracking, dungeon and location design, player-facing handouts.
2. **Adventure Runner app** — a suite of self-contained HTML+JS tools used at the table for random encounters, dungeon generation, NPC generation, loot, weather, and similar GM aids.

---

## System

The campaign uses **D&D 3.5e** mechanics — the original d20 system Ptolus was written for. When generating stat blocks, encounters, or rules content:

- Use 3.5e stat block format (HD, BAB, saves as Fort/Ref/Will, full attack with iteratives, AC broken into touch/flat-footed).
- Encounter Level math: EL = CR of a single creature; 2× CR n ≈ EL n+2; 4× ≈ EL n+4 (DMG table).
- Treasure follows DMG Table 7-4 (hardcoded in `runner/shared/tables.js`).
- Prefer 3.5e Core (PHB/DMG/MM) over PF1e, but PF1e is acceptable as fallback.
- All 3.5e sourcebooks in `sources/` are in scope — nothing is off-limits.

---

## Campaign Setting

Ptolus sits on the **Nelanthir Peninsula** on the eastern coast of Faerûn (Forgotten Realms). The Ptolus pantheon is locally dominant; the FR pantheon dominates elsewhere.

Key setting decisions (locked in):
- Peninsula: **Nelanthir** — see `campaign/setting/ptolus-in-forgotten-realms.md`
- Pantheon coexistence: see `campaign/setting/pantheon-coexistence.md`
- Monster Grade system (homebrew): Grade 4–Special Grade, governs legal status and City Watch response — see `runner/docs/08-monster-grades.md`
- Chaositech: third category (not magic, not technology), illegal above-ground, Galchutt-created — see `runner/docs/18-chaositech.md`
- Dungeon structure: zone-based (Sewers → Undercity → Ghul's Labyrinth → Banewarrens → Caverns → Dwarvenhearth → Caverns of the Galchutt) — not numbered levels

---

## Source Material

All files under `sources/` are canonical references. Read them before inventing content. Cite page numbers.

### Ptolus books
- `epdf.pub_ptolus-city-by-the-spire-d20-system.pdf` — 672-page core book. Canonical for all districts, NPCs, factions, the Spire, the Dungeon, deities, and city lore.
- `epdf.pub_ptolus-the-night-of-dissolution-d20-system.pdf` — Night of Dissolution adventure arc (Cults of Chaos).
- `epdf.pub_queen-of-lies-d20-system-ptolus-setting.pdf` — drow-focused Ptolus adventure.

### D&D 3.5e library (`sources/D&D Books 3.5/`)

**Core Books:** Player's Handbook I & II, Dungeon Master's Guide I & II, Monster Manual I–IV

**Classes:** Complete Adventurer, Complete Arcane, Complete Divine, Complete Psionic, Complete Scoundrel, Complete Warrior, Defenders of the Faith, Expanded Psionics Handbook, Libris Mortis, Masters of the Wild

**Races:** Races of Destiny, Races of Stone, Races of the Dragon, Races of the Wild, Savage Species

**Other:** Arms & Equipment Guide, Book of Exalted Deeds, Book of Vile Darkness, Draconomicon, Epic Level Handbook, Frostburn, Ghostwalk, Heroes of Horror, Magic Item Compendium, Planar Handbook, Sandstorm, Stormwrack, Unearthed Arcana

**Settings:** Forgotten Realms Campaign Setting, Faiths & Pantheons, Races of Faerûn, and others in the Settings subfolder.

---

## Working SRD (`srd/`)

A curated, runner-compatible reference built from the source PDFs above. **All of it is in scope.** Key files:

### Rules (`srd/rules/`)
- `combat.md` — actions, attack rolls, full attack, AoO
- `skills.md` — all 36 skills with DCs and synergies
- `saves.md` — save progressions, common DCs
- `conditions.md` — all conditions with mechanical effects
- `psionics.md` — manifesting, power points, psionic focus, augmentation, transparency
- `skill-tricks.md` — Complete Scoundrel skill tricks
- `invocations.md` — Warlock invocations by grade
- `undead-mechanics.md` — turning, rebuking, creating undead, incorporeal rules
- `taint.md` — Heroes of Horror taint system (Corruption + Depravity); ties into chaositech exposure
- `epic-levels.md` — epic attack/save tables, epic spell system
- `epic-class-progressions.md` — epic progression for all 11 PHB classes
- `class-variants.md` — Unearthed Arcana variants, gestalt rules, bloodlines, action points
- `exalted-feats.md` — all exalted feats + Vow of Poverty progression
- `environment.md` — darkness, falling, drowning, fire, cold, poison, disease
- `mounted-combat.md` — mounted combat rules and Ride DCs
- `carry-wealth.md` — carrying capacity, coin weights

### Classes (`srd/classes/`)
- `index.md` — all PHB base classes + Complete series (Warlock, Warmage, Wu Jen, Ninja, Scout, Spellthief, Beguiler, Dragon Shaman, Duskblade, Knight, Hexblade, Samurai, Swashbuckler, Favored Soul, Shugenja, Spirit Shaman, Archivist, Dread Necromancer) + Ptolus context for each
- `prestige-classes.md` — 130+ PrCs across Complete Warrior, Complete Divine, Complete Arcane, Complete Adventurer, Complete Scoundrel, PHB II, Libris Mortis, Epic Level Handbook, Book of Exalted Deeds, Heroes of Horror, all four Races books

### Races (`srd/races/`)
- `index.md` — PHB races + Ptolus-specific (Litorian, Aram, Cherubim, Harrow elf) + Races of Destiny/Stone/Dragon/Wild (Illumian, Goliath, Dragonborn, Spellscale, Raptoran, Killoren, etc.) — 30+ races total
- `monster-pcs.md` — Savage Species: LA system, ECL formula, 17 monster entries with Ptolus notes

### Monsters (`srd/monsters/`)
- `monsters.json` — 114 entries. Schema: `name`, `cr_value` (number), `type`, `size`, `hd`, `hp`, `ac`, `attack`, `saves`, `special_abilities`, `environments` (array), `description`. Tagged by environment for encounter generator.

### Items (`srd/items/`)
- `magic-items.json` — 231 entries. Schema: `name`, `type`, `subtype`, `tier` (minor/medium/major), `price_gp` (number), `description`, `source`.
- `mundane-equipment.json` — 98 entries. Schema: `name`, `category`, `price_gp`, `weight_lb`, `description`.

### Spells (`srd/spells/`)
- `spells.json` — 115 entries. Schema: `name`, `school`, `level` (object by class), `casting_time`, `range`, `duration`, `saving_throw`, `spell_resistance`, `description`.

### Powers (`srd/powers/`)
- `powers.json` — 40+ psionic powers. Schema: `name`, `discipline`, `level` (object), `pp_cost`, `display`, `manifesting_time`, `range`, `area_or_target`, `duration`, `saving_throw`, `power_resistance`, `description`, `augment`.

### Ptolus-specific (`srd/ptolus/`)
- `districts.md` — all 11 canonical districts
- `factions.md` — all factions with goals, leadership, disposition to party
- `the-spire.md` — 3,000 ft tall (canon), Jabel Shammar, no-magic zone
- `banewarrens.md` — history, three-tier structure, warding generators
- `domains.md` — 34 domains (PHB + Complete Divine + Defenders of the Faith) with Ptolus deity cross-reference
- `imperial-calendar.md` — 12 months, 7-day week, year 721 IA, holy days, session-to-IC-date math
- `gazetteer.md` — 50+ named locations across all 11 districts (addresses, hours, prices, hooks)
- `encounter-tables.md` — canonical d% city encounter matrix (11 districts) + zone tables
- `covenant-mechanical.md` — Covenant of the Third Thought: initiation, ranks, signature powers, psionic items

**When adding new monsters, items, or spells, follow the JSON schemas above exactly** — the runner depends on specific field names. Read a few existing entries before writing.

---

## Folder Layout

```
Ptolus/
├── CLAUDE.md
├── sources/                     # source PDFs (read-only)
├── srd/                         # working SRD (all in scope)
│   ├── rules/                   # markdown rule references
│   ├── classes/                 # class summaries + prestige classes
│   ├── races/                   # race summaries + monster PCs
│   ├── monsters/                # monsters.json
│   ├── items/                   # magic-items.json, mundane-equipment.json
│   ├── spells/                  # spells.json
│   ├── powers/                  # powers.json (psionics)
│   └── ptolus/                  # Ptolus lore, domains, gazetteer, calendar
├── campaign/
│   ├── sessions/                # YYYY-MM-DD-session-NN.md
│   ├── npcs/                    # one file per recurring NPC
│   ├── factions/                # one file per faction
│   ├── locations/               # districts, dungeons, encounter sites
│   ├── setting/                 # ptolus-in-forgotten-realms.md, pantheon-coexistence.md
│   ├── plot-threads.md
│   └── timeline.md
├── handouts/                    # player-facing: letters, rumors, maps
├── web/                         # Adventure Runner — Vite + React app (CANONICAL, deploys to GitHub Pages)
│   ├── src/
│   │   ├── pages/               # one .jsx per tool (auto-routed from catalog.js)
│   │   ├── components/ui.jsx    # Layout, ContextBar, SeedControl, DiceTray, Log
│   │   ├── lib/                 # dice.js, tables.js, grades.js
│   │   ├── state/ctx.jsx        # shared campaign Ctx (React context)
│   │   ├── data/                # bundled JSON + canon ES modules (divine, whoswho, …)
│   │   ├── content/             # markdown for the Library (docs + srd)
│   │   └── catalog.js           # tool registry → routes + launcher cards
│   └── (vite.config.js, package.json)
└── runner/                      # LEGACY vanilla HTML+JS app (kept for reference; specs in runner/docs/)
    ├── docs/                    # implementation specs (00–26) — still the design source of truth
    └── [tool folders]/          # original file:// versions
```

---

## Adventure Runner App

The canonical app is a **Vite + React** single-page app in `web/`, deployed to **GitHub Pages** (HashRouter, `base: './'`). All 41 tools are ported there. The original vanilla `runner/` (self-contained `file://` HTML pages) is kept as legacy/reference — the `runner/docs/` specs remain the design source of truth.

- **Dev/build:** `cd web && npm run dev` (local) · `npm run build` (→ `web/dist`) · `npm test` (vitest render-smoke).
- **Deploy:** push to `main` → `.github/workflows/deploy.yml` builds and publishes to Pages.
- **Add a tool:** create `web/src/pages/<Component>.jsx` (default export) and add one entry to `web/src/catalog.js` (`{ path, name, desc, cat, component }`) — routes + launcher cards are generated automatically.
- **Copyright:** `sources/` (the PDFs) is `.gitignore`d and must never be published. The built site bundles SRD-derived data; keep the repo **private** if that matters.

### Implementation specs (`runner/docs/`)

All 26 tools are fully specced. Read the relevant doc before building:

| # | File | Tool |
|---|------|------|
| 00 | `00-architecture.md` | Shared utilities, dice API, data loading, UI conventions |
| 01 | `01-encounters.md` | Random encounter roller by region |
| 02 | `02-dungeon.md` | Dungeon room generator |
| 03 | `03-npcs.md` | NPC generator |
| 04 | `04-loot.md` | Treasure roller by EL |
| 05 | `05-weather.md` | Weather + ambience by season/location |
| 06 | `06-names.md` | Name generator (8 cultures) |
| 07 | `07-tavern.md` | Tavern/shop generator by district |
| 08 | `08-monster-grades.md` | Monster grade system + permit rules |
| 09 | `09-build-order.md` | Build phases and data sync checklist |
| 10 | `10-combat-tracker.md` | Initiative + HP + conditions |
| 11 | `11-xp-calculator.md` | XP by EL + party size |
| 12 | `12-effect-tracker.md` | Duration countdown, concentration flags |
| 13 | `13-commissariat-timer.md` | City Watch response countdown |
| 14 | `14-job-board.md` | Delver's Guild job board generator |
| 15 | `15-city-events.md` | Weekly city event generator |
| 16 | `16-faction-tracker.md` | Faction disposition tracker |
| 17 | `17-street-scenes.md` | Street texture generator |
| 18 | `18-chaositech.md` | Chaositech malfunction + item tables |
| 19 | `19-crime-scene.md` | Investigation seed generator |
| 20 | `20-noble-scheme.md` | Noble house scheme generator |
| 21 | `21-condition-reference.md` | Live-search condition reference |
| 22 | `22-action-economy.md` | Action type reference + AoO rules |
| 23 | `23-dungeon-level-reference.md` | Zone-by-zone dungeon reference |
| 24 | `24-rumor-generator.md` | Rumor generator by NPC profession |
| 25 | `25-pits-of-insanity.md` | Chaos exposure effects table |
| 26 | `26-permits-reference.md` | City permit system quick reference |

### Conventions (React app in `web/`)

- **One `.jsx` page per tool** in `web/src/pages/`; register it in `web/src/catalog.js` (routes + cards auto-generate).
- **Shared chrome** from `web/src/components/ui.jsx`: `Layout`, `ContextBar`, `SeedControl`, `DiceTray`, `Log`/`useLog`. **Shared libs** in `web/src/lib/` (`dice`, `tables`, `grades`). **Campaign context** via `useCtx()` (`web/src/state/ctx.jsx`); per-tool persistence via `useLocalStorage` (keep the legacy `ptolus-*-v1` keys for interop).
- **Data** imported from `web/src/data/` (JSON bundled natively by Vite — no more `file://` inlining). Canon datasets (`divine`, `whoswho`, `ptolus-encounters`, `districts`) are ES modules there.
- **UI is utilitarian.** Big readable text, minimal controls, scrollable output log. This runs at the table.
- **Output is copy-pasteable plain text.** Show roll math. **Seed control** on every generator.
- Pure generators may keep the string-building → `log.append(html)` pattern; interactive trackers use real React state + JSX.
- Each new page must pass the vitest render-smoke (`web/src/test/smoke.test.jsx` renders + clicks every page).
- The `runner/docs/NN-*.md` specs still describe each tool's intended behavior — read the relevant one before changing a tool.

---

## Campaign Prep Workflows

### Session prep & recaps

Files in `campaign/sessions/` named `YYYY-MM-DD-session-NN.md`. Sections: prep notes (scenes, NPCs, set-pieces, fail-forward branches) and post-session recap (what happened, decisions, threads opened/closed, XP). Always read the previous 1–2 session files and `campaign/plot-threads.md` before prepping. After a session, update `plot-threads.md` and `timeline.md`.

### NPC & faction tracking

One file per NPC in `campaign/npcs/` — identity, stat block (or "unstatted — peaceful only"), what they know, what they want, relationships, session notes. One file per faction in `campaign/factions/` — goals, current activities, leadership, disposition to party.

When introducing a new NPC mid-session, create the file immediately with at minimum: name, one-line description, session appeared. Fill stat block later if needed.

### Location/dungeon design

Files in `campaign/locations/`. Include: read-aloud description, key features, inhabitants (link to NPC files), keyed encounters (one paragraph per room — terse, skimmable). Use Ptolus canon as ground truth; mark invented content `[homebrew]`.

### Player-facing handouts

`handouts/` — letters, journal pages, maps, rumor sheets. Prefer `.md` for text, `.html` for visual. Name descriptively (`letter-from-jevicca-2026-05-23.md`). Use Imperial Calendar dates and in-world language.

---

## Working Style

- Be terse in session prep and at-the-table content. Trevor reads this live.
- Cite Ptolus page numbers for lore claims.
- When asked to create content, produce the actual file — don't just output text in chat.
- Ask before inventing canonical lore. Surface what the books say first.
- Nothing in the 3.5e library is out of scope. If a sourcebook exists in `sources/`, its content can go in the SRD.
