# Combat Tracker — Implementation Spec

**File:** `runner/combat/index.html`
**Purpose:** Track initiative order, HP, conditions, and round count for 3.5e encounters. Fast to set up, fast to use mid-fight.

---

## UI Layout

**Top bar:** Round counter (large) + "Next Round" button + "Reset Combat" button.

**Initiative list (center, full width):** One row per combatant, sorted by initiative. Rows are reorderable via up/down buttons or drag (optional).

**Each combatant row:**
```
[▲▼] [Name_________] Init:[__] HP: [cur]/[max] [+] [-] [Conditions ▾] [✕]
```
- Name: editable text field
- Init: number (used for sort)
- HP current/max: click `+` or `−` to add/subtract, or type directly
- Conditions dropdown: multi-select (see condition list below)
- Active conditions shown as colored tags on the row
- ✕ removes the combatant

**Add Combatant panel (bottom or sidebar):**
- Name, Init, HP max fields + "Add" button
- "Add Monster" shortcut: dropdown from `DATA.monsters` — pulls name and HP automatically (rolls HD)
- "Add Group" — e.g., "Goblin ×4" adds 4 rows with auto-numbered names (Goblin 1, Goblin 2...)

**Current Turn:** Highlight the active row. "Next Turn" advances highlight. "Previous Turn" steps back.

---

## Conditions

Tag colors: red = severe, orange = moderate, yellow = minor, purple = mental, blue = movement.

| Condition | Color | Reminder (shown on hover) |
|-----------|-------|--------------------------|
| Blinded | Red | –2 AC, loses Dex bonus, –4 attack, 50% miss chance |
| Confused | Purple | Roll d% each round for action |
| Cowering | Red | –2 AC, loses Dex bonus, can't act |
| Dazed | Orange | Can't act, no AC loss |
| Dazzled | Yellow | –1 attack and sight-based Perception |
| Dead | Red | Dead |
| Disabled | Orange | 0 HP, can take one move or standard, strenuous = dying |
| Dying | Red | –1 HP/round, unconscious |
| Entangled | Yellow | –2 attack, –4 Dex, half speed or immobile |
| Exhausted | Orange | Half speed, –6 Str/Dex |
| Fascinated | Purple | Sits quietly, –4 Perception vs other threats |
| Fatigued | Yellow | –2 Str/Dex, can't run/charge |
| Flat-footed | Blue | Loses Dex bonus to AC, can't make AoO |
| Frightened | Orange | –2 attack/saves/checks, must flee |
| Grappled | Blue | –4 Dex, –2 attack (non-light weapons), no move |
| Helpless | Red | Dex 0, coup de grace possible |
| Invisible | Blue | +2 attack, opponents lose Dex bonus to AC |
| Nauseated | Orange | Move only, no attacks or spells |
| Panicked | Red | –2 attack/saves, drops items, flees |
| Paralyzed | Red | Dex/Str 0, helpless |
| Pinned | Red | Helpless, can't move |
| Prone | Yellow | –4 melee attack, +4 AC vs ranged, –4 AC vs melee |
| Shaken | Yellow | –2 attack/saves/checks |
| Sickened | Yellow | –2 attack/damage/saves/checks |
| Stable | Orange | 0 HP, not losing HP, unconscious |
| Staggered | Orange | Standard or move only |
| Stunned | Red | Loses Dex bonus, drops items, can't act |
| Unconscious | Red | Helpless, unaware |

### Custom Conditions
Free text tag field on each row for campaign-specific effects (e.g., "Cursed — –4 saves", "Marked by Covenant").

---

## Duration Tracking

Optional: each condition tag can have a round counter. Click the tag to set duration. Automatically removes when it hits 0 at "Next Round."

---

## Notes

- No server needed — all state in JS variables, lost on refresh. That's fine; combat is ephemeral.
- "Next Round" should: increment round counter, reset flat-footed on all combatants, decrement condition durations.
- HP going below 0 should auto-tag "Dying." HP = 0 should prompt: "Disabled or Stable?"
- Keep the layout dense — this is used while talking, rolling, and managing the table simultaneously.
