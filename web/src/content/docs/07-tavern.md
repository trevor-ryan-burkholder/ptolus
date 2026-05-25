# Tavern & Shop Generator — Implementation Spec

**File:** `runner/tavern/index.html`
**Purpose:** Generate a named, keyed tavern or shop — owner, atmosphere, menu/stock highlights, rumor — for instant at-table use.

---

## Data Source

Inline JS tables only.

---

## UI

**Controls (left column):**
- Type (dropdown):
  - Tavern / Inn
  - Tavern (no rooms)
  - General Store
  - Weapon/Armor Smith
  - Alchemist / Apothecary
  - Mage's Shop (scrolls, components)
  - Black Market (fence)
  - Exotic / Ptolus-specific (roll for type)
- District (dropdown):
  - Midtown
  - Oldtown
  - Warrens
  - Docks
  - Nobles' Quarter
  - Guildsman's District
  - Temple District
  - Necropolis Gate (just outside)
  - Random
- Quality (dropdown): Squalid / Poor / Modest / Comfortable / Wealthy / Aristocratic
- "Generate" button
- Seed control

**Output:**
```
[TAVERN — Docks — Modest]

NAME: The Bilge Lantern
SIGN: A lantern with a drowned face inside it.
OWNER: Harkon Tull — male human, Ex-sailor, missing two fingers on left hand. Direct. Doesn't ask questions.
         → Knows: which ships are in port, who's hiring muscle, where to fence small cargo.

ATMOSPHERE: Low ceiling, smoke-stained walls, sand on the floor to soak up spills.
            Crowded by evening. Three factions of dock workers drink in separate corners and hate each other.

MENU HIGHLIGHTS:
  Brackwater Ale (2 cp) — cheap and strong
  Salt Fish Stew (3 cp) — edible, barely
  Pickled eggs (1 cp each) — suspicious
  A decent wine (5 sp) — Tull's personal stock, doesn't advertise it

ROOMS: 6 rooms (4 sp/night), double-occupancy if pressed. Lock on door: Broken.

CURRENT RUMOR (1d4 — rolled 3):
  "Someone's moving chaositech through the harbor at night. Not the Balacazars — someone new."

NOTABLE PATRON: Sella Crane — female half-elf, nervous, keeps checking the door. Waiting for someone who isn't coming.
```

---

## Tables

### Name Construction
Format: [Adjective or Noun] + [Noun] — themed by district and quality.

**Adjectives/First Words (by district):**
- Docks: Bilge, Salt, Iron, Harbor, Drowned, Trawl, Anchor, Fog
- Warrens: Broken, Rusty, Hollow, Crooked, Grey, Cracked
- Midtown: Silver, Copper, Red, Three, Old, Crossed, Gilded
- Nobles': Golden, Crown, Marble, First, High, Ivory
- Temple: Blessed, Sacred, Ember, Dawn, Evening, Holy
- Guildsman's: Hammer, Anvil, Wheel, Bronze, Trade, Craft

**Second Words:**
- Barrel, Lantern, Coin, Cup, Gate, Bell, Crown, Helm, Wheel, Flask, Blade, Candle, Ring, Shield, Chain, Key, Tap, Flagon

### Owner
- Race: weighted by district (Docks → human/half-orc/halfling; Nobles' → human/elf; Warrens → human/gnome/halfling)
- Background: ex-soldier / ex-sailor / ex-delver / former guild member / born into it / ran away from something
- Personality: pick 1 from NPC personality table (see `03-npcs.md`)
- What they know: always 1–2 hooks relevant to the district

### Atmosphere
**Crowd:** Empty / A few regulars / Moderate / Packed / Hostile crowd
**Light:** Dark (few candles) / Dim (fireplace) / Well-lit (oil lamps) / Bright (magical)
**Sound:** Quiet / Murmuring / Lively / Loud / Musician (roll instrument: lute / fiddle / drums / bard)
**Notable detail:** 1 from list (fight scar on wall / wanted poster / cage with a something in it / suspicious stain / shrine in corner / chalkboard menu / unusually good quality for district)

### Menus by Quality
| Quality | Ale | Food | Room/night |
|---------|-----|------|-----------|
| Squalid | 1 cp | 1 cp (gruel) | 1 sp (floor) |
| Poor | 2 cp | 2 cp | 2 sp |
| Modest | 4 cp | 3–5 cp | 4–8 sp |
| Comfortable | 5 cp | 1–3 sp | 1–2 gp |
| Wealthy | 2 sp | 3–10 sp | 3–5 gp |
| Aristocratic | 5 sp | 5 sp–2 gp | 5–20 gp |

### Rumors (1d8 per district)

**Docks:**
1. A merchant captain is paying double for guards on a run to [coastal city]. Won't say why.
2. Three delvers drowned in the harbor last week. Commissariat says accident. Nobody believes it.
3. Someone's moving chaositech through the harbor at night. Not the Balacazars — someone new.
4. A ship arrived from the south with something in the hold that the crew won't talk about.
5. There's a Grade 2 monster working as a dockhand. Nobody wants to be the one to report it.
6. A Commissariat officer has been taking bribes from two different factions. Both are about to find out.
7. One of the noble houses is buying up dock warehouse leases quietly and quickly.
8. Someone is recruiting ex-sailors for an expedition — unusual destination, unusual pay.

**Warrens:**
1. A Commissariat sweep is coming — someone tipped them about a hideout.
2. New crime operation moving in — not affiliated with the Balacazars. Yet.
3. A Dungeon entrance nobody officially knows about opened up under a building here.
4. Someone in the Warrens can sell you permits — any permit — if you have the coin.
5. A family disappeared last week. House is still there. Belongings still there.
6. There's a healer here who'll work on anyone, no questions, but they want favors instead of gold.
7. The Balacazars put out a contract on someone in the Warrens. Price is low. That means it's personal.
8. A monster — Grade 3 at least — has been living under a building here for years. The neighbors know.

**Generic (any district):**
1. "The Spire was doing something strange last night. Not moving — just... responding."
2. "Someone with money is looking for a specific delver team. Not for work. For something they found."
3. "The Inverted Pyramid is buying something from the black market. No one knows what."
4. "A noble family just lost their entire street to a debt call. The Balacazars own it now."

### Shops

For non-tavern types, replace menu with **stock highlights**:
- **General Store:** 1d4 mundane items (from `DATA.mundaneItems`), slightly above PHB price
- **Weapon/Armor:** Masterwork available, 1 unusual item (exotic weapon or unusual material)
- **Alchemist:** 1d4 potions from minor magic item list, 1d3 alchemical items, component availability
- **Mage's Shop:** Scrolls (1d6 — roll level and class), 1 wand, components, maybe 1 unusual item
- **Black Market/Fence:** 1 stolen item (roll from loot generator), 2 unusually specific rumors, 30% chance of Balacazar connection

For all shops: include owner, brief atmosphere, and one hook (a job, a rumor, something they want).
