# Pits of Insanity — Implementation Spec

**File:** `runner/chaos/index.html`
**Purpose:** Generate chaos mutation and warping effects for characters exposed to raw chaos energy — Pits of Insanity, chaositech malfunctions, Caverns of the Galchutt, and Galchutt-touched zones. Two tiers: Minor Effects (frequent, temporary to cosmetic) and Major Effects (rare, lasting or permanent).

---

## Source Material

The Pits of Insanity are a canonical Ptolus phenomenon, described in *Beneath the Streets* (PT7), pp. 416–418 (print). Key facts:

- The Pits are pools of raw chaos spun off from the **Entropy Sphere** inside the Spire.
- They first appeared ~1,300 years ago when Sokalahn the half-demon lich destroyed one of the Sphere's Gates of Delirium.
- Visually: thick, greyish goo shining with all colors at once — a horrible riot of hues.
- They slowly sink through bedrock, can appear in floors, walls, or floating as spheres.
- **Direct contact:** Fort save (DC 20) or 10d6 damage + Will save (DC 20) or 1d4 temp Int/Wis/Cha damage. Repeated contact: save DC increases +1 per consecutive round. After 3 rounds: Will DC 25 or *insanity*.
- **Proximity (within 100 ft.):** Objects and creatures gradually transform on the canonical tables.
- **Spellcasting within 100 ft.:** Caster level check DC 20 + spell level or spell goes wild.

---

## When to Use This Generator

1. **Proximity warping** — Party has spent time near a Pit. Roll at the intervals described above.
2. **Chaositech malfunction** — A chaositech device has failed catastrophically (see `runner/docs/18-chaositech.md`). Treat as proximity exposure.
3. **Caverns of the Galchutt** — Ambient chaos energy in the deep caverns. Roll once per hour of travel in affected zones.
4. **Galchutt-touched zones** — Any area directly marked by Galchutt influence (dark reliquary dungeons, sealed chaos cult ritual sites).
5. **Direct chaos contact** — Use the canonical direct-contact rules above first, then roll on Major Effects.

---

## UI

**Controls:**
- Exposure Type (dropdown):
  - Proximity (within 100 ft.) — roll Minor
  - Extended Proximity (1+ hour) — roll Minor with escalating chance of Major
  - Chaositech Malfunction — roll Minor (1d20); on 19–20, also roll Major
  - Caverns of the Galchutt — roll Minor
  - Direct Contact — always roll Major; also apply canonical damage
- Target: Creature / Object / Both
- Seed control
- "Roll Effect" button

**Output:**
```
[CHAOS EXPOSURE — Proximity — Creature]

MINOR EFFECT TRIGGERED
Effect: CHROMATIC BLEED
"[Character name]'s skin takes on a faint iridescent sheen — every color and none of them,
 shifting with movement. It fades to a lesser shimmer over the next few hours."

Mechanical Effect: None (cosmetic). Creatures with True Seeing or arcane sight can identify
the character as chaos-touched.
Duration: 1d6 hours
Save: None (cosmetic; Fort DC 12 to suppress entirely for 1 minute if desired)

HOOK: The shimmer is visible in low light. It may attract attention in the Warrens or the
Necropolis from creatures sensitive to chaos energy.
```

---

## Minor Effects (1d20)

These are frequent, temporary, or cosmetic. Most resolve within hours or days. Only a few carry mechanical weight. Generate one Minor Effect per exposure interval.

| d20 | Effect Name | Description (read to player) | Mechanical Effect | Duration | Save |
|-----|-------------|------------------------------|-------------------|----------|------|
| 1 | **Chromatic Bleed** | Skin or scales take on an iridescent shimmer — all colors at once, shifting with movement. | None (cosmetic). Visible to True Seeing as chaos-touched. | 1d6 hours | Fort DC 12 to suppress for 1 min |
| 2 | **Sound Static** | A low, tuneless hum fills the character's ears, as if the air itself is vibrating with discordant noise. Comes and goes. | –1 on Listen checks and Concentration checks while active. | 1d4 hours | Fort DC 13; on success, 10 minutes only |
| 3 | **Shadow Smear** | The character's shadow moves a half-second behind them, as if it's slightly delayed. Occasionally it moves when they don't. | None (cosmetic). May unsettle NPCs in dim light (–2 Diplomacy with superstitious types). | 2d6 hours | None |
| 4 | **Flavor Bleed** | Everything the character tastes is wrong — food tastes like copper, water tastes like smoke. Not dangerous, just profoundly unpleasant. | –1 on Fortitude saves against ingested effects (they hesitate to identify by taste). | 1d4 hours | Fort DC 12; success = 30 minutes |
| 5 | **Fractured Temperature** | The character alternates between feeling intensely cold and uncomfortably hot, despite the actual ambient temperature. Others nearby feel nothing unusual. | None. Concentration checks to maintain sustained spells require DC 12 check (internal distraction). | 1d6 hours | Fort DC 13 |
| 6 | **Chromatic Eye** | One eye (roll randomly which) shifts to a color not native to the character's race — brilliant gold, silver, or deep violet. The effect is striking. | None (cosmetic). +2 on Intimidate against creatures unfamiliar with chaos; –2 on Diplomacy with conservative NPCs (Church of Lothian types). | 1d3 days | None; fades naturally |
| 7 | **Echo Skin** | The character's skin briefly echoes the texture and pattern of whatever surface they last touched — stone, wood, cloth. The effect lasts a few seconds each time. | +1 on Hide checks in terrain matching the last-touched surface. | 1d4 hours | Fort DC 12; success = 30 minutes |
| 8 | **Memory Flicker** | A random, irrelevant memory intrudes sharply — someone else's memory. It feels as vivid as the character's own. The content is mundane and meaningless: a meal, a street corner, a face they've never seen. | –1 on Spot and Search for 10 minutes after each occurrence (1d4 occurrences per hour while active). | 1d6 hours | Will DC 14; success = 30 minutes |
| 9 | **Scent Inversion** | The character cannot smell normally — all scents are subtly wrong (roses smell faintly of copper; fire smells like rain). Not dangerous, deeply disorienting. | –2 on Survival checks relying on scent; Scent ability (if possessed) is suppressed. | 1d4 hours | Fort DC 12 |
| 10 | **Weight Shift** | The character briefly weighs significantly less than they should — perhaps 20–30% less. Footsteps are quiet. Motion feels floaty. | +2 on Move Silently for duration; –1 on Bull Rush, Trip, and Grapple checks (reduced mass). | 1d4 hours | Fort DC 13; success = 30 minutes |
| 11 | **Liminal Vision** | The character sees faint, colourless outlines of creatures and objects in the Ethereal Plane within 30 feet. Not true Ethereal sight — just blurry, dreamlike shapes. | Perceive Ethereal creatures as Shadowy (50% miss chance rather than total concealment). | 1d6 hours | Will DC 14 |
| 12 | **Tongue Slip** | Speech occasionally reverses itself — words come out backward, or a second language overlaps what the character intends to say. Doesn't affect casting. | –2 on Bluff and Diplomacy while active (communication is erratic). | 1d4 hours | Will DC 13; success = 30 minutes |
| 13 | **Hair Shift** | Hair, fur, or equivalent changes color dramatically — fire-red, frost-white, deep blue. The change is cosmetically permanent without magical restoration, but fades slowly over 1d6 weeks. | None (cosmetic). Roll a second time if this result occurs again — the color shifts again. | 1d6 weeks (slow fade) | Fort DC 15 to prevent; no save if 2+ hours of exposure |
| 14 | **Touch Echo** | Everything the character touches briefly transmits a sensory impression — not quite a vision, more like an emotional residue of who last touched the object. Overloading and impossible to control. | –1 on all skill checks requiring fine manual dexterity (the impressions distract). +1 on Appraise for objects with strong emotional history. | 1d6 hours | Will DC 14 |
| 15 | **Phase Flicker** | The character flickers briefly transparent 1d4 times during the duration — for just a moment, they're partially there. | 20% chance of not triggering mundane pressure-plate traps (they're briefly insubstantial). May unsettle companions (Will DC 10 or shaken for 1 round, first occurrence only). | 1d4 hours | Fort DC 14 |
| 16 | **Cold Spot** | The character becomes a source of ambient cold — the air within 5 feet drops several degrees. Breath is visible. Frost forms on surfaces they rest hands on. | Fire-based attacks deal –1 damage to character. Cold-based attacks deal +1 damage. Fire-vulnerable creatures are uncomfortable in close contact. | 1d6 hours | Fort DC 13 |
| 17 | **Refracted Light** | Light bends slightly around the character — no invisibility, but their outline blurs at the edge. Lights they carry produce subtly wrong shadows. | +1 on Hide checks (blurred outline). Creatures with Darkvision can still see them normally. | 1d4 hours | Fort DC 12 |
| 18 | **Gravity Seam** | The character's personal gravity briefly disagrees with everyone else's — they stand at a slightly different angle (a few degrees). Others notice it as unnerving. | No mechanical effect. Every NPC who sees the character for the first time must succeed on Will DC 10 or spend their first action staring. | 1d2 hours | Fort DC 14 |
| 19 | **Resonance Mark** | A faint geometric pattern — like a Ghul's-era glyph — appears on the character's skin. Visible but not painful. It hums faintly near other chaos-touched objects or creatures. | Character detects Pits of Insanity and chaositech within 30 ft. as if using Detect Magic (ping only — no school or power level). | 1d3 days (fades) | Fort DC 15 to prevent; becomes permanent on 3rd occurrence |
| 20 | **Roll twice** | The exposure was particularly intense. Roll d20 twice on this table (re-roll additional 20s). Both effects apply simultaneously. | See each result | — | — |

---

## Major Effects (1d6)

Major Effects are rare, session-changing, and often permanent without significant magical intervention (limited wish, wish, miracle, or in some cases regenerate or break enchantment). Roll only on direct chaos contact or per DM discretion for extended exposure.

**Threshold for Major Effects:**
- Direct contact with a Pit: automatic Major Effect roll (after the canonical damage)
- 3+ consecutive rounds of proximity: roll Fort DC 25; failure triggers a Major Effect
- Chaositech catastrophic failure (GM call): roll Major Effect
- Caverns of the Galchutt, extended exposure (DM discretion): roll Major

| d6 | Effect Name | Description | Mechanical Effect | Duration/Permanence | Save |
|----|-------------|-------------|-------------------|---------------------|------|
| 1 | **Limb Alteration** | One limb (roll randomly) is physically transformed — partially or completely. Arm becomes semi-translucent with visible bone-light within; leg changes texture to something resembling bark or obsidian; hand gains an extra (useless) finger of wrong size. The change is visible, permanent, and unsettling. | –1 to one ability score related to the altered limb (Str or Dex, DM choice). Prosthetics don't fit; armor must be customized (+50% to fitting costs). May affect social reactions in conservative districts (–2 Diplomacy in Temple District, Nobles' Quarter). | Permanent without regenerate, wish, or miracle | Fort DC 20 to reduce to cosmetic only (a Minor effect instead) |
| 2 | **Cognitive Fracture** | The character's mind splinters across multiple simultaneous timeframes. They briefly experience multiple possible versions of the current moment — what could have been, what might be — all at once. It's ecstatic and horrifying simultaneously. | 1d4 points of temporary Wisdom damage (lingering disorientation). Additionally: once per session, the DM may 'replay' any choice the character has made in the last minute — the chaos has introduced a fork. The player re-decides. | Temp Wisdom recovers normally (1 point/day). The 'replay' ability is permanent (and cuts both ways — DM chooses when to invoke it, not the player). | Will DC 22 to reduce to 1 point temp Wis damage and no replay ability |
| 3 | **Chaos Sensitivity** | The character's nervous system has been permanently recalibrated to perceive the chaos spectrum. They feel chaos energy as a physical sensation — Pits of Insanity, chaositech, and chaos-touched creatures register as pain/heat/pressure. | Detect chaos-touched objects and creatures within 60 ft. passively (no action required). Pits of Insanity within 100 ft. cause –1 to all rolls (the signal overwhelms). Spells with the [chaotic] descriptor used near the character inflict 1 point of nonlethal damage each. | Permanent. Cannot be dispelled (it's a physical change to the nervous system). | Fort DC 22 to reduce to 30 ft. range only (less overwhelming) |
| 4 | **Partial Materialization** | Part of the character's body begins cycling between states — solid, semi-solid, and briefly insubstantial — in a slow, uncontrolled rhythm. The effect is visible: a hand becomes translucent, a section of torso flickers, an eye goes glass-pale then returns. | For the affected body region (roll randomly): 25% chance per round in combat that an attack targeting that region passes through harmlessly (the character was partially insubstantial). However, 25% chance per round that attacks targeting adjacent regions do 1 extra damage (chaos bleeds through the phase boundary). The character cannot control this. | Permanent without wish or miracle. Break enchantment (DC 30) may suppress for 24 hours. | Fort DC 23 to reduce to a cosmetic flicker only (no mechanical effect) |
| 5 | **Alignment Fracture** | The character's alignment is momentarily pulled toward chaos — not fully, not permanently, but in a way that leaves a mark. Their moral framework is slightly rewritten in one specific area, creating an internal contradiction they will have to reconcile in play. | The character gains one chaotic compulsion (choose or roll): a pathological inability to follow through on plans they've fully explained to others; a tendency to change targets mid-combat on impulse; an urge to unmake or disrupt structures and organizations. The compulsion is subtle at first and becomes more pronounced under stress. Lawful characters may experience alignment shift risk if they repeatedly act on the compulsion without resisting (Will DC 14 per instance). | Indefinite. Atonement spell may address alignment shift consequences. The compulsion itself is a personality alteration — magical intervention can suppress but not remove it without wish or miracle. | Will DC 24 to reduce to a minor quirk with no mechanical effect |
| 6 | **Chaos Manifestation** | The exposure was catastrophic. The character's body has been partially rewritten by chaos. Roll 1d4: (1) the character gains a second face on the back of their head — it blinks and moves but cannot speak; (2) one arm now functions normally but extends an additional 1d4 feet when reaching; (3) the character's eyes change to vertical slits and they gain 60-ft. Darkvision (or +30 ft. to existing Darkvision), but bright light causes -1 to attacks; (4) the character's skin shifts slowly between three colors — one natural, two not — on a cycle of roughly one hour. Choose or roll. | Per result: (1) Rear perception: +2 Spot vs. flankers; enemies cannot flank from directly behind. (2) Extended reach: +5 ft. melee reach with that arm. (3) Enhanced sight with light sensitivity as noted. (4) Cosmetic only but +1 Intimidate, -2 Disguise. | Permanent. Wish or miracle can reverse. Limited wish may address one specific symptom. The character must decide whether to conceal or acknowledge this change in their social identity. | Fort DC 26; success reduces to a single Minor Effect instead |

---

## Spellcasting Wild Surge Table

*(Canonical from Ptolus, pp. 417–418 print; Caster level check DC 20 + spell level to cast normally within 100 ft. of a Pit)*

When a spellcaster fails the caster level check, roll d%:

| d% | Result |
|----|--------|
| 01–20 | Spell target(s) also make an extra Fort save vs. Pit of Insanity proximity alteration (see Minor Effects above, d20) |
| 21–50 | Area spells have random area within range (DM places) |
| 51–70 | Target spells with range > Touch have random targets within range |
| 71–85 | Touch spells affect the caster (treat as Personal, if caster was the intended recipient) |
| 86–88 | Personal spells have random target within 30 ft. (if any exist) |
| 89–91 | Damage-inflicting spells heal instead of harm |
| 92–93 | Effects become their opposites (shield reduces AC by 4, etc.) |
| 94–95 | Effects are transformed if possible (stone to flesh becomes random material change) |
| 96–97 | Spell has no effect |
| 98–99 | Spell energy goes wild — becomes random spell of same level, keeping target if possible |
| 00 | Spell energy surges uncontrollably: 50-ft. spread centered on caster, 12d6 force damage (Reflex half) |

---

## GM Notes

**Reversing Major Effects:**
- Most require *limited wish* (for specific symptom suppression), *wish*, or *miracle* for full reversal.
- Regenerate can address physical alterations to limbs.
- Atonement can address alignment shift consequences (not the compulsion itself).
- Break enchantment is effective only for effects explicitly noted above.
- The Inverted Pyramid in Ptolus studies chaos mutations; they may be able to help — at a price.
- The Delver's Guild Library (PT5: p. 322) has Utgardt Bronzehelm's text "The Pits of Insanity: Chaos Shows Its True Nature" — players who read it get +2 on saves against Minor Effects (they know what's coming).

**Tracking exposure:**
- Keep a running total per character: hours within 100 ft. of a Pit.
- Check intervals: after 1 hour (Minor Effect roll), after 24 hours, after 1 month, then yearly.
- Save DCs for Major Effects increase by +1 per previous save made against any Pit.

**Running it at the table:**
- Minor Effects are flavor and should be described physically — make the player feel it before explaining the mechanics.
- Major Effects should be session events, not random interruptions. Announce that something significant is happening before rolling.
- The horror of the Pits is the slow transformation. Even a cosmetic change should feel like a warning.

---

## Integration Notes

- **Chaositech generator** (`runner/docs/18-chaositech.md`): on a critical malfunction, roll Minor Effects; on catastrophic failure, roll Major Effect.
- **Dungeon generator** (`runner/docs/02-dungeon.md`): tag rooms near Pits with proximity marker; trigger Minor check on entry.
- **Encounter generator** (`runner/docs/01-encounters.md`): chaos-mutated creatures should have 1 Minor Effect applied as a cosmetic + minor mechanical tag.
- **Caverns of the Galchutt** (`srd/ptolus/the-dungeon.md`): treat the entire zone as proximity exposure. Check once per hour.
