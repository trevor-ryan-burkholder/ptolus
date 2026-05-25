# NPC Generator — Implementation Spec

**File:** `runner/npcs/index.html`
**Purpose:** Generate an on-the-spot NPC with race, class, personality, quirk, secret, and motivation. At-table-ready in under 3 seconds.

---

## Data Source

Inline JS tables. No external JSON needed.

---

## UI

**Controls (left column):**
- NPC Type (dropdown):
  - Random
  - Commoner / Street
  - Criminal / Underworld
  - Guild Member / Merchant
  - City Guard / Soldier
  - Priest / Temple
  - Delver / Adventurer
  - Noble / Political
  - Monster (use Monster Grade system)
- Race filter (dropdown): Random / Human / Elf / Dwarf / Halfling / Gnome / Half-orc / Ptolus-exotic (Shoal elf, etc.)
- Approximate Level (dropdown): 1–3 / 4–6 / 7–10 / 11+ / Don't stat
- "Generate NPC" button
- "Quick NPC" button (name + one line only — for mid-session use)
- Seed control

**Output (full):**
```
[NPC — Guild Member — Human]

NAME: Vorcan Thessaly
CLASS/LEVEL: Expert 4 (fence, appraises stolen goods)
APPEARANCE: heavyset, shaved head, ink-stained fingers, always chewing something

PERSONALITY: blunt, transactional — skips pleasantries entirely
QUIRK: taps the table three times before any deal, won't say why
SECRET: owes a significant debt to the Balacazars; feeds them information to pay it down
MOTIVATION: wants out of the criminal economy but doesn't know how to exit safely

WHAT THEY KNOW:
- Has heard about a cache of chaositech moving through the Docks this week
- Knows a fence who specializes in Dungeon relics (name on request)
WHAT THEY WANT:
- Buyers for a set of unusual gems (stolen, provenance unclear)
- Someone to run a message to a contact they can't safely visit

[Unstatted — use Expert 4: HP 14, BAB +3, saves Fort +1/Ref +1/Will +4, skills: Appraise +11, Bluff +8, Sense Motive +8, Knowledge(local) +8]
```

**Output (quick):**
```
Mira Cault — female halfling, nervous energy, works the fish market, owes someone a favor
```

---

## Tables

### Names (by culture — see also `06-names.md`)
For the NPC generator, pull from name lists by race. Full culture-keyed name generation is in the names generator.

### Race (Random weights for Ptolus)
| Race | Weight |
|------|--------|
| Human | 55 |
| Elf (various) | 10 |
| Dwarf | 10 |
| Halfling | 8 |
| Gnome | 5 |
| Half-orc | 5 |
| Other (Shoal elf, Assari, etc.) | 7 |

### Class by NPC Type
Each NPC type maps to a weighted list of classes/roles:
- **Commoner:** Commoner, Expert (laborer, vendor)
- **Criminal:** Rogue, Fighter, Expert (fence, information broker)
- **Guild Member:** Expert, Aristocrat (merchant), Warrior
- **City Guard:** Warrior, Fighter
- **Priest:** Cleric (roll Ptolus deity), Adept
- **Delver:** Fighter, Rogue, Wizard, Cleric, Ranger — equal weight
- **Noble:** Aristocrat, Fighter (knight), Wizard
- **Monster:** Roll from grade-appropriate monster list

### Personality (pick 1–2)
- blunt / cheerful under pressure / paranoid / overly formal / world-weary / ambitious / deferential / bitter / genuinely kind / calculating / sentimental / jaded

### Quirk (pick 1)
- won't make eye contact / touches a specific item when nervous / always bargaining / quotes scripture unprompted / laughs at the wrong moments / excessively punctual / counts things quietly / refuses to use names / always has food / speaks in a regional accent when stressed

### Secret (pick 1 by NPC type — partial list)
- Criminal: informant for the Commissariat / owes Balacazar debt / actually a Delver in disguise
- Guild: skimming from accounts / has evidence of noble crime / is a plant for a rival guild
- Priest: crisis of faith / knows something the church wants buried / has been bribed
- Guard: on the take / covering up a killing / sympathizes with monster rights movement
- Noble: blood debt / bastard lineage / secret Inverted Pyramid member
- Delver: knows where a body is buried (literally) / has stolen Dungeon artifact / is being followed

### Motivation (pick 1)
- money, straightforwardly / getting out of a bad situation / protecting someone / revenge / ambition / survival / curiosity / loyalty to a faction

---

## Stat Block Note

For levels 1–3, provide a one-line parenthetical. For levels 4+, omit unless specifically requested — keep the generator fast. The CLAUDE.md notes stat blocks can be filled in later.
