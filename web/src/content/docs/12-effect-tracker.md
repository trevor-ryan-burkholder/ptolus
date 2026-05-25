# Spell & Effect Tracker — Implementation Spec

**File:** Integrate as a panel within `runner/combat/index.html`, or standalone at `runner/effects/index.html`.
**Purpose:** Track active spells, abilities, and conditions with round/minute/hour durations. Critical for 3.5e where buff stacking is common and durations matter.

---

## UI

**Effect list:** Each row represents one active effect.

```
[Effect Name_______] on [Target____] Duration: [__] [rounds/min/hrs ▾] [Concentration?☐] [✕]
```

- Effect Name: free text (e.g., "Haste", "Bless", "Blur", "Hold Person")
- Target: free text or pick from combat tracker party list
- Duration value + unit (rounds / minutes / hours / until dispelled / permanent)
- Concentration checkbox: highlights if caster takes damage
- ✕ removes effect

**"Next Round" button** (synced with combat tracker if on same page): decrements all round-duration effects by 1, removes effects at 0, shows alert for effects expiring this round.

**"Add Effect" quick-entry:**
- Name + target + duration. Done. No fussing.

**"Add from Spell List" shortcut:**
- Type spell name → pulls duration formula from `DATA.spells` → auto-fills duration based on caster level input.

---

## Duration Units

| Unit | Decremented by |
|------|---------------|
| Rounds | "Next Round" button |
| Minutes | Manual (or every 10 rounds) |
| Hours | Manual |
| Until Dispelled | Never auto-removed |
| Permanent | Never auto-removed |

---

## Display

Group effects by target. Show:
- Effects expiring this round: **bold + red**
- Effects expiring next round: orange
- Concentration effects: purple border — remind Trevor when the caster is hit

---

## Useful Pre-Built Effect Templates

Quick-add buttons for the most common buffs (saves typing mid-combat):

| Button | Effect | Typical Duration |
|--------|--------|-----------------|
| Bless | +1 morale attack/saves vs fear | 1 min/level |
| Haste | +1 attack, +30 ft speed, +1 AC/Ref | 1 round/level |
| Blur | 20% miss chance | 1 min/level |
| Mirror Image | 1d4+1 images | 1 min/level |
| Hold Person | Paralyzed | 1 round/level |
| Invisibility | Invisible until attacks | 1 min/level |
| Heroism | +2 attack/saves/skills | 10 min/level |
| Fly | Flight | 1 min/level |
| Rage | Barbarian rage (track separately — fatigue follows) | Con mod rounds |

---

## Notes

- State is lost on page refresh. That's acceptable — effects are session-ephemeral.
- If integrated into combat tracker, show effect panel below the initiative list as a collapsible section.
- Concentration effects should flash when any combatant takes damage (requires combat tracker integration — track as future feature).
