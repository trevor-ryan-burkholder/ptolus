# Condition Quick Reference — Implementation Spec

**File:** `runner/reference/conditions.html`
**Purpose:** All 3.5e conditions on one page. Instant lookup at the table. No page-flipping.

---

## UI

Single-page reference. No generator logic needed.

**Layout:**
- Search/filter bar at top (live filter by condition name)
- Grid of condition cards (2–3 columns)
- Each card: condition name (large), mechanical effects (concise), source note

**No seed control needed — this is a reference, not a generator.**

---

## Full Condition List

### Blinded
You cannot see. –2 penalty to AC, lose Dexterity bonus to AC. –4 penalty on Search checks and most Strength- and Dexterity-based skill checks. 50% miss chance on attacks. Opponents have total concealment from you.

### Confused
Roll d% each round: 01–10 act normally / 11–20 do nothing but babble incoherently / 21–50 deal 1d8 + Str damage to self / 51–70 attack nearest creature / 71–100 flee from source of confusion. Confused characters cannot make attacks of opportunity.

### Cowering
Overcome with fear and can do nothing. –2 penalty to AC, lose Dex bonus to AC.

### Dazed
Can take no actions. No penalty to AC.

### Dazzled
–1 penalty to attack rolls and Perception checks requiring sight.

### Dead
Hit points at –10 or below (or reduced to 0 Constitution). Dead.

### Disabled
At exactly 0 hit points. Can take one move or standard action per round. Standard action = strenuous = takes 1 damage after acting, becomes dying.

### Dying
Unconscious and losing hit points. –1 HP each round. At –10 HP or lower, dead. Can stabilize with a DC 15 Heal check or magical healing.

### Energy Drained
Each negative level gives –1 to all skill/ability checks, attack rolls, saving throws, and effective level. If negative levels = total levels, dead. Negate with Restoration.

### Entangled
Movement halved. –2 to attack rolls. –4 to Dexterity. Spellcasting requires Concentration check DC 15.

### Exhausted
Move at half speed. –6 penalty to Strength and Dexterity. Cannot run or charge. After 1 hour of rest, becomes fatigued.

### Fascinated
Stands/sits quietly, watching fascinating effect. –4 to Perception checks. Any obvious threat breaks the effect.

### Fatigued
–2 penalty to Strength and Dexterity. Cannot run or charge. Rest for 8 hours to remove.

### Flat-Footed
Before first action in combat. Loses Dexterity bonus to AC. Cannot make attacks of opportunity.

### Frightened
–2 penalty to attack rolls, saving throws, skill checks, and ability checks. Must flee the source of fear if able. Can attack if cornered.

### Grappled
Cannot move freely. –4 to Dexterity. –2 to attack rolls except with light weapons. No ranged attacks except those that work in grapple (crossbow, etc.). Spellcasting requires Concentration DC 20 + spell level.

### Helpless
Dexterity is effectively 0. Attackers get +4 to attack. Can be coup de graced (auto-crit + Fort save DC 10 + damage or die).

### Incorporeal
No physical body. Immune to nonmagical attacks. 50% chance to ignore magic. Can only be harmed by other incorporeal creatures, +1 or better weapons, or spells/effects that affect incorporeal.

### Invisible
Cannot be seen. Attackers have 50% miss chance (not total concealment). +2 to attack rolls vs. opponents who can't see you. Opponents lose Dexterity bonus to AC.

### Nauseated
Can only take move actions. No attacks, spells, or concentration-requiring actions.

### Panicked
–2 to saves and checks. Drops held items. Flees in a random direction. Can't attack; will defend self if cornered.

### Paralyzed
Physical paralysis. Effective Strength and Dexterity of 0. Helpless. Flying creatures fall. Swimming creatures may sink.

### Petrified
Turned to stone. Unconscious. No perception of world. If breaks, may suffer permanent damage.

### Pinned
Held immobile in grapple. Helpless but can attempt to break free.

### Prone
On the ground. –4 penalty to melee attack rolls. +4 AC against ranged attacks. –4 AC against adjacent melee attackers. Stand up provokes AoO.

### Shaken
–2 penalty to attack rolls, saving throws, skill checks, and ability checks.

### Sickened
–2 penalty to attack rolls, weapon damage rolls, saving throws, skill checks, and ability checks.

### Stable
At negative HP but no longer losing HP. Unconscious. Not dying without additional damage.

### Staggered
At exactly 0 hit points (disabled), or from massive damage stunning effect. Can only take a standard or move action each round, not both.

### Stunned
Drops everything held. Can take no actions. –2 penalty to AC. Loses Dexterity bonus to AC. Attackers get +2.

### Turned
Undead affected by a cleric's turning. Must flee for 10 rounds. If cornered, takes –2 penalty to saves and checks.

### Unconscious
Knocked out. Helpless. Falls prone.

---

## Implementation Notes

- This is a static reference page. No JS logic required beyond the live search filter.
- Live search: filter cards in real time as Trevor types — `input` event on the search field, hide/show cards by name match.
- Print-friendly CSS optional — this page might be printed for in-person sessions.
- Source: PHB Appendix / Glossary. No need to cite per-condition — just note "PHB" in the footer.
- Consider a second tab: **Save DCs at a glance** (common spell save DCs by level and school) — a frequent lookup during enemy spellcasting.
