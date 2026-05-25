# Action Economy Reference — Implementation Spec

**File:** `runner/reference/actions.html`
**Purpose:** Fast lookup for 3.5e action types with common examples. Prevents rules disputes about what can be done in a round.

---

## UI

Static reference page. Optional: live search/filter. Tabs or accordion by action type.

---

## Content

### Action Types Overview

| Action Type | Per Round | Notes |
|-------------|-----------|-------|
| Standard Action | 1 | Attack, cast most spells, activate items |
| Move Action | 1 | Move up to speed, draw weapon, pick up item |
| Full-Round Action | Replaces all | Full attack, charge, run, coup de grace |
| Free Action | Several | Drop item, speak, cease concentration |
| Swift Action | 1/turn | Like free but limited to 1 per turn |
| Immediate Action | 1/round | Can use out of turn; costs next turn's swift |
| Attack of Opportunity | Varies | Triggered by specific actions in threatened area |

A standard + move action = a round. A full-round action replaces both.

---

### Standard Actions

**Attacks:**
- Attack (single attack at highest BAB)
- Unarmed strike
- Cast a touch spell and touch target (same round)
- Use a special attack (disarm, trip, sunder, feint)

**Spells / Abilities:**
- Cast spell with casting time of 1 standard action
- Activate a spell completion item (scroll)
- Activate a spell trigger item (wand) — but note Use Magic Device requirements
- Use a supernatural ability
- Use an extraordinary ability

**Other:**
- Use an activated magic item (not command word — that's free)
- Administer a potion to another creature
- Ready an action (standard + move — see readied actions)
- Start/complete a full-round action

---

### Move Actions

- Move up to speed
- Draw or sheathe a weapon (if BAB +1 or higher, draw is free during movement)
- Pick up an item from the ground
- Load a hand crossbow or light crossbow
- Open or close a door
- Mount or dismount a steed
- Stand up from prone (provokes AoO)
- Retrieve a stored item
- Move a heavy object (half speed)

---

### Full-Round Actions

- Full attack (all iterative attacks at −5/−10/−15 penalties)
- Charge (move up to 2× speed in straight line, then attack, +2 attack/−2 AC)
- Run (move 4× speed in straight line, −4 AC, must move in straight line)
- Coup de grace (on helpless enemy — auto-crit, Fort DC 10 + damage or die)
- Withdraw (move 2× speed without provoking AoO from starting space)
- Use a skill requiring full-round (some Heal checks, Disable Device, etc.)
- Load a heavy or repeating crossbow
- Cast a spell with casting time of 1 full-round action

---

### Free Actions

- Drop an item (unintentional or intentional)
- Drop prone (intentional — falling is not free)
- Speak (brief — up to Trevor on "too long")
- Cease concentration on a spell
- Use a command word item
- Minor action (close eyes, nod, etc.)

---

### Swift Actions (1 per turn max)

- Cast a spell with casting time of 1 swift action
- Activate a quickened spell (if you have the Quicken metamagic)
- Some class abilities (varies by class/feat)
- Spell-like abilities with swift casting time

---

### Immediate Actions (1 per round, uses next turn's swift)

- Feather Fall (when falling — this is the canonical immediate action spell)
- Some defensive abilities triggered by attack
- If used on your turn, costs your swift action for that turn
- If used between turns (reaction), costs your swift action next turn

---

### Attacks of Opportunity (AoO)

**What provokes:**
- Moving through a threatened square (not from/into)
- Casting a spell in a threatened square (unless Defensive Casting, DC 15 + spell level)
- Using a ranged weapon in a threatened square
- Standing up from prone
- Retrieving a stored item
- Picking up an item
- Loading a crossbow
- Using a skill in a threatened square (most)

**What does NOT provoke:**
- Drawing a weapon (if BAB +1 or higher, free during move)
- Moving out of the first square you move from (only)
- Using a swift action
- Total defense
- 5-foot step

**AoO Limits:**
- 1 AoO per threatening creature per round (unless Combat Reflexes feat)
- Combat Reflexes: Dex modifier additional AoOs per round

---

### 5-Foot Step

Move 5 feet (1 square) without provoking AoO. Can only take one per round. Cannot take if you've already moved this turn.

---

### Readied Actions

Declare: "I ready an action to [attack/cast/move] when [trigger]." Uses your standard action. When triggered, you act immediately before the triggering action. Initiative shifts to just before the triggering creature's.

---

### Delayed Actions

Voluntarily delay your turn. Can act later in the round at any point. Initiative resets to the point where you act.

---

### Common Combat Maneuvers (all provoke AoO unless noted)

| Maneuver | Check | Effect on Success |
|----------|-------|------------------|
| Trip | Melee touch attack, then Str vs Str/Dex | Target prone |
| Disarm | Melee touch, opposed attack roll | Weapon on ground or in your hands |
| Grapple | Melee touch, Grapple check | Target grappled |
| Sunder | Attack vs AC (AoO) | Damage object |
| Feint | Bluff vs Sense Motive | Target loses Dex bonus for 1 attack |
| Bull Rush | Strength check | Push target back |
| Overrun | Strength check | Move through enemy's square |

---

## Implementation Notes

- Static HTML, no JS required except optional search filter.
- Use `<details>/<summary>` for accordion-style sections — clean and works without JS.
- Print-friendly CSS — this is a candidate for a printed reference sheet.
- Consider a second tab: **Common DCs at a glance** (Concentration checks, Tumble vs. AoO, Break DC for doors, etc.)
