# Chaositech Generator — Implementation Spec

**File:** `runner/chaositech/index.html`
**Purpose:** Generate a random chaositech item found in the Dungeon or black market — function, instability rating, glitch effect, and flavor. Ptolus-specific treasure type.

---

## Canonical Source Data (from Ptolus)

### What Is Chaositech?

"The evil twin of technology, chaositech offers amazing devices fueled by raw chaos itself. The creations of the ancient Galchutt, chaositech items are coveted today by dark forces." Chaositech is not technology and it is not magic — it is a third category entirely. It is "corruption and destruction given form." *(Ptolus p. 566)*

Most chaositech items are made of steel, glass, and inorganic substances, often designed with organic-looking embellishments (actual skulls, bones, fleshlike coverings, membranous sacs). These are called **"bones of steel"** — a secret code phrase used by chaos cultists. A rarer, wholly organic type of chaositech exists but is extremely uncommon. *(Ptolus p. 566–567)*

When held, bones-of-steel items feel cold and produce a tingling sensation. Users report headaches and muscle aches. When activated, they make strange unearthly noises, flare with arcing energy, and emit powerful metallic or acrid chemical odors. *(Ptolus p. 567)*

### Who Made It and Where Does It Come From?

Chaositech was created by the **Galchutt**, the ancient Lords of Chaos who sleep beneath Ptolus. Most chaositech has lain dormant in subterranean caches around the Spire until recently, when underground activity has increased. *(Ptolus p. 567)*

The Galchutt's servants — primarily the **rhodintor** (earthbound demons awakening now in the Vaults of the Rhodintor, deep in the Caverns) — are spreading chaositech and uniting the chaos cults. The Vaults of the Rhodintor are the greatest accumulation of chaositech in the world. *(Ptolus p. 453)*

The demon lord **Baalhazor, Demon God of Technology** (originally one of the Vested of the Galchutt) is the patron deity of chaositech. Chaos cultists and followers of Baalhazor are natural allies for chaositech enthusiasts. *(Ptolus p. 568)*

Chaositech caches are scattered throughout the natural caverns beneath Ptolus. Each cache contains 3d4 random items (total value ~10d10 × 1,000 gp). Caches are hidden behind secret doors (Search DC 20) and protected by a *forbiddance* effect (Will DC 25, cast by a chaotic evil caster). *(Ptolus p. 452)*

### Legal Status in Ptolus

Chaositech is illegal above-ground in Ptolus. The Holy Emperor himself has stated it is among the greatest threats to the world. The **Conciliators** (a group within the Church of Lothian) lead the effort to root it out and destroy all chaositech they find. The **Commissariat** confiscates it on sight. *(Ptolus p. 566, 568)*

Using a chaositech item inside Jabel Shammar earns a character 1 corruption point. *(Ptolus p. 572)*

Most people in the Empire — even those in authority — don't know chaositech exists. The Church of Lothian actively suppresses word of its presence. Those who see it firsthand typically assume it is magic; even *detect magic* fails to reveal an aura, which is what tips off a knowledgeable observer. *(Ptolus p. 566, 570)*

### Who Uses or Possesses Chaositech?

- **Chaos cultists** — covet and use it; code phrase "bones of steel" among Plagueborn and similar cults *(Ptolus p. 567)*
- **Dark elves (drakkath)** — call it *avalashax* ("impossibles"); House Vrama's leader Alevolenz actively seeks caches in the subterranean realms *(Ptolus p. 568, 456)*
- **Adventurers and dungeon delvers** — may find single items *(Ptolus p. 572)*
- **Goblins near the Prison** — tribes led by bugbears are armed with a few discovered remnants of ancient chaositech *(Ptolus p. 438)*
- **Zaug** (deep in the Caverns) — have been using chaositech created by the Galchutt, their former masters *(Ptolus p. 453)*
- **Shilukar** — dark elf chaositechnician operating a secret lab beneath the Guildsman District *(Ptolus p. 597, 617)*
- **Malkeen Balacazar** — pays the Surgeon in the Shadows to implant chaositech in his elite bodyguards *(Ptolus p. 571)*
- **The Shuul** — the Shuul have a "counterpart" (Doctor Feegus) who has created the Prajdall specifically to find and destroy chaositech, which Shilukar fears *(Ptolus p. 598)*; the Shuul are allied with chaos cults and study technology broadly *(Ptolus p. 132)*

### How It Interacts with Magic

Chaositech is not magic. *Detect magic* does not reveal a magical aura on a chaositech device. *Identify* technically reveals only magical properties and does not identify chaositech items (though a generous DM may allow it). The canonical spell to identify a chaositech item is **identify device**. *(Ptolus p. 570)*

To figure out an unknown chaositech item without the spell, a character makes an Intelligence check (DC 20) with various modifiers. *(Ptolus p. 570)*

### Mechanics: Failure and Backlash

**Chaotic Failure:** When making a check to use a non-intrinsic chaositech device, a natural 1 drains the item of power regardless of prior uses. Devices with no roll associated with activation require a 1d20 roll each use (natural 1 = failure). Items that are continuously active (armor, etc.) require at least one daily check. Unused items sitting on a shelf require no check. Most devices have effectively **twenty uses** before failure. *(Ptolus p. 568)*

**Chaotic Backlash:** If a device fails, roll 1d20 again. On another natural 1, the device explodes: 3d6 damage to everyone within 10 feet (Reflex DC 18 for half; no save for anyone touching the item). The device is destroyed. *(Ptolus p. 568)*

**Mutation:** Prolonged proximity to chaositech causes physical and sometimes mental mutation, permanently marking the user with chaos. *(Ptolus p. 567)*

**Corruption:** Using chaositech opens the user to influence by the Galchutt. Without caution, users become slaves of the Lords of Chaos. *(Ptolus p. 567)*

### Craft (Chaositech) and Chaos Surgery

Chaositech requires a specialized **Craft (chaositech)** skill. Unusually, both Intelligence and an **inverted** Wisdom modifier apply (a Wisdom bonus is a penalty; a Wisdom penalty is a bonus — reflecting how rationality hinders chaos-work). *(Ptolus p. 569)*

**Chaos Surgery** is a separate trained skill (Intelligence + inverted Wisdom modifier) for implanting chaositech into living bodies. Failed procedures inflict 5d10 damage and 2d6 temporary Constitution damage on the subject. You cannot perform Chaos Surgery on yourself. *(Ptolus p. 569–570)*

The **Surgeon in the Shadows** is a notorious, unnamed chaositech surgeon operating in Ptolus's underworld, known for rebuilding people into monstrous creatures and implanting devices in the willing and unwilling. *(Ptolus p. 571)*

### Power Source: Raw Chaos

All chaositech is powered by **raw chaos** — a viscous fluid appearing simultaneously dull grey and scintillating with every color. It is stored in featureless grey **chaos storage cubes** (3 feet to a side, hardness 10, 50 hp, break DC 30). Only a **siphon** device or the **siphon spell** can safely remove raw chaos from the cube. Puncturing or destroying the cube releases raw chaos, which destroys everything it touches. *(Ptolus p. 568)*

### Canonical Named Chaositech Items (with Stats)

All items below are from Ptolus p. 571–573 (DM's Companion / PT6).

**Attack Sphere** — Steel sphere 10 inches across. When activated, floats and grows blades; for 10 rounds, any creature the activator attacks in melee is also attacked by the sphere (+10 attack, 2d6 piercing/slashing). Sphere: AC 24, hardness 20, 60 hp. Lever activation; Craft DC 40; Price 45,000 gp; Weight 10 lbs. *(Ptolus p. 571)*

**Bomb, Docility** — Silent white flash; all within 20 ft. make Will DC 17 or become docile (can only move at half speed and speak, cannot attack; lasts 2d10+5 rounds or until attacked). Switch activation; Craft DC 33; Price 800 gp; Weight 1 lb. *(Ptolus p. 571)*

**Bomb, Infestation** — Releases 100 tiny metal insect constructs in a 10-ft. radius for 1 round (–2 circumstance on all rolls). Spreads to 20-ft. radius for 2 more rounds (–1 penalty). No save. Each construct has 1 hp. Switch activation; Craft DC 34; Price 1,000 gp; Weight 3 lbs. *(Ptolus p. 571)*

**Bomb, Madness** — Greasy dark grey vapor, 10-ft. radius. Will DC 18 or become confused; roll d% each round for behavior (table in book). Madness lasts 1d10+10 rounds. Switch activation; Craft DC 35; Price 2,500 gp; Weight 1 lb. *(Ptolus p. 572)*

**Bomb, Void** — Creates a 10-ft.-diameter sphere of utter blackness. Reflex DC 22 to escape; Fortitude DC 22 or disintegrated (success still deals 6d6 damage). Void lasts 1d6 rounds; items within 20 ft. must make Strength DC 25 or be drawn in. Switch activation; Craft DC 40; Price 9,000 gp; Weight 3 lbs. *(Ptolus p. 572)*

**Chaos Storage Cube** — Power source for all chaositech. Hardness 10, 50 hp, break DC 30. No activation; Craft DC 50; Price 20,000 gp; Weight 100 lbs. *(Ptolus p. 572)*

**Device Destabilizer** — Long rectangular device with cone-shaped dish. Emits 30-ft. cone; roll 2d20 — if total exceeds a trap's disable DC or lock's Open Lock DC, it is disabled/opened. Against clockwork creatures: Fortitude save or 3d6 damage as mechanisms seize. Damage is permanent until repaired. Lever activation; Craft DC 38; Price 8,000 gp; Weight 10 lbs. *(Ptolus p. 572)*

**Disease Incubator Implant** — Implant in host's chest; host becomes immune to disease; after one month can inflict diseases via touch attack (1/2 days, random disease from DMG table). If host is slain, all within 10 ft. make Fortitude DC 18 or contract a random disease. Chaos Surgery DC 28; Procedure time 10 hours; Recovery 1 week; Price 60,000 gp. *(Ptolus p. 573)*

**Drilling Spear** — Resembles a shortspear with a drill-tip head. When switched on, tip rapidly rotates. Damage 1d10; as a full-round action against an object, ignores up to 6 points of hardness. Martial weapon. Switch activation; Craft DC 27; Price 4,650 gp. *(Ptolus p. 573)*

**Emitter, Disruption Ray** — Long metallic two-handed weapon. Fires a ray, ranged touch attack, 200-ft. range (50-ft. increments). Deals 3d6 damage to living creatures only; Fortitude DC 14 or –4 penalty to attacks/saves/checks for 1d6+4 rounds. Some fitted with bayonets. Lever activation; Craft DC 40; Price 7,500 gp; Weight 5 lbs. *(Ptolus p. 573)*

**Emotion Reader** — Rectangular wrist-worn device (3×2.5×0.5 inches). Analyzes posture, heart rate, perspiration, brain activity; grants +4 competence bonus to Sense Motive checks against target within 30 ft. Checks for chaotic failure each Sense Motive attempt. Headclamp activation; Craft DC 31; Price 1,700 gp; Weight 1 lb. *(Ptolus p. 573)*

**Harrower** — Fires a stream of razor-sharp metal shards in a 100-ft. line; Reflex DC 20 or 6d6 slashing (success = no damage). Can be reset to a 60-ft. cone (standard action) for 4d6 slashing to all within (Reflex DC 16, half). Switch activation; Craft DC 32; Price 23,000 gp; Weight 6 lbs. *(Ptolus p. 573)*

**Siphon** — Black tube; one end inserts into any chaositech device, other end fits into a chaos storage cube to refuel. Never checks for chaotic failure. Use activation; Craft DC 28; Price 6,000 gp; Weight 1 lb. *(Ptolus p. 573)*

**Spidery Walker** — Vehicle (5 ft. × 3 ft., 8 spider-like legs). Speed 30, can move on walls and ceilings. Carries up to 900 lbs. (light/medium/heavy like heavy warhorse). AC 18, hardness 10, 100 hp. Chaotic failure check no more than once per week. Lever activation (special); Craft DC 35; Price 28,000 gp; Weight 2,000 lbs. *(Ptolus p. 573)*

---

## What is Chaositech?

Chaositech is technology powered by chaos energy — neither arcane nor divine. It is illegal to possess in most of Ptolus above-ground. It is found throughout the Dungeon. It does not work reliably. It is always interesting.

Source: See canonical data above. For additional items and rules, see the *Chaositech* sourcebook (Malhavoc Press, 2004), referenced throughout PT6.

---

## UI

**Controls:**
- Power Level (dropdown): Weak (party lvl 1–4) / Moderate (5–10) / Strong (11–16) / Apex (17+)
- Type filter (optional): Weapon / Utility / Defensive / Sensory / Communication / Unknown
- "Generate Item" button
- Seed control

**Output:**
```
[CHAOSITECH ITEM — Moderate]

NAME: Resonance Gauntlet (left hand only — right hand version unknown)
TYPE: Weapon / Utility

FUNCTION: When activated (standard action, touch target), deals 2d6 electricity damage and
          pushes the target 10 ft. (Fort DC 14 negates push). 3 charges. Recharges in chaos
          energy fields (Dungeon Level 3+).

INSTABILITY RATING: ██████░░░░ (3/5 — Unstable)

GLITCH TABLE (roll d6 when a natural 1 is rolled on an attack, or when Trevor decides):
  1 — Discharges into wielder (1d6 electricity, no save)
  2 — Locks on for 1 round — cannot remove without Disable Device DC 18
  3 — Overcharges: next hit deals double damage, then item is inert for 24 hrs
  4 — Emits a pulse: everyone within 10 ft. takes 1d4 electricity, no save
  5 — Attracts chaos energy: glowing faintly for 1 hour (–4 Hide)
  6 — Explodes. 3d6 electricity, 15 ft. radius, Ref DC 16 half. Item destroyed.

APPEARANCE: A tarnished bronze gauntlet with glass vials of glowing fluid along the fingers.
            One vial is cracked. The fluid is the wrong color — it should be blue.

MARKET VALUE: 800–1,200 gp (black market only; illegal above-ground)
FACTION INTEREST: Inverted Pyramid would pay double to study it. Commissariat would confiscate it.

LORE NOTE: The asymmetry (left hand only) suggests it was part of a paired set.
           The right-hand version has never been documented.
```

---

## Item Tables

### Functions by Power Level

**Weak:**
- Deals 1d4 typed damage (acid/cold/electricity/fire/sonic) on touch, 1/day
- Grants darkvision 60 ft. for 10 min, 1/day — painful headache after
- Detects chaos energy within 30 ft. (glows, hums) — always on, can't be turned off
- Allows one-way communication with another attuned device within 100 ft.
- Slows fall speed (feather fall effect, 1/day) — unpredictably activates 1 round late
- Produces an irritating noise on command — or randomly

**Moderate:**
- Ranged damage effect (2d6, 3 charges, recharges in chaos fields)
- Provides limited flight (10 ft./round, clumsy, 1 minute) — roll instability each round
- Emits a fear effect in a 15 ft. cone (DC 14 Will) — activates when user is frightened
- Creates a 10-ft. force barrier for 1 round, 2/day — sometimes activates facing the wrong direction
- Translates one language in real time (earpiece) — 30% chance of mistranslation per sentence
- Records and replays one conversation up to 10 minutes

**Strong:**
- Replicates a 3rd–5th level spell effect (limited uses)
- Provides true seeing for 1 minute (1/day) — accompanied by 1d4 Wisdom damage
- Teleports user 30 ft. in any direction (1/day) — 10% chance of 1d6×5 ft. deviation
- Summons a chaositech construct (CR 4, 2 rounds, then goes rogue)
- Generates a chaos field (20 ft. radius, 1 round) — spell failure 20% for all inside

**Apex:**
- Replicates a 6th–8th level spell (very limited uses, high instability)
- Generates a contained portal (destination unstable — roll on planar table)
- Emits an antimagic field (30 ft., 1 min) — also suppresses the item itself
- Chaos bomb: 6d6 damage of random type, 30 ft. radius — single use

---

## Instability Rating (1–5)

| Rating | Label | Glitch Trigger |
|--------|-------|---------------|
| 1 | Stable | Natural 1 only |
| 2 | Slightly Unstable | Natural 1–2 on activation roll |
| 3 | Unstable | Natural 1, or roll d20 each use — on 1–3, glitch |
| 4 | Volatile | Every use requires a DC 12 Use Device check or glitch |
| 5 | Critical | 30% chance of glitch per use; 5% chance of catastrophic failure |

### Universal Glitch Effects (per instability level)

Each item has its own 1d6 glitch table (generated with item). Universal fallbacks:
1. Partial function — effect is halved
2. Delayed — activates 1d4 rounds later
3. Misdirected — affects random target in range
4. Overloaded — double effect this time, then 1 charge depleted
5. Feedback — user takes 1d6 damage of item's damage type
6. Critical glitch — roll on catastrophic table (explosion, burnout, dimensional hiccup)

---

## Appearance Table

**Materials:** bronze / blackened steel / glass vials / copper wire / crystal / bone inlay / leather-wrapped / nothing visible (effect seems to come from nowhere)

**Condition:** pristine / tarnished / cracked / repaired badly / one component missing / clearly salvaged from something larger

**Tells:** glowing fluid / faint hum / warm to the touch / cold despite ambient temp / smells of ozone / smells wrong / leaves residue / vibrates when chaos energy is near

---

## Notes

- Chaositech is illegal above-ground in Ptolus. Commissariat will confiscate. Inverted Pyramid is interested. Chaos Cults covet it.
- Not all chaositech is from the same source — some is manufactured, some is grown, some appears to be older than the Dungeon itself.
- Check Ptolus core book before inventing apex-tier items — some canonical chaositech exists and should be honored.
