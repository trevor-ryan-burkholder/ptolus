# XP Calculator — Implementation Spec

**File:** `runner/xp/index.html`
**Purpose:** Calculate XP awards for 3.5e encounters. Input ELs defeated, party size and level, get per-character XP instantly.

---

## UI

**Party Setup (persists across calculations):**
- Party size: 1–8 (number input or +/− buttons)
- Average party level (APL): 1–20

**Encounter Entry:**
- Add Encounter button → row with: [EL __] [×__] [Remove]
- Can add multiple encounters (for end-of-session bulk award)
- "Add from Combat Tracker" button (future — for now, manual entry)

**Output:**
```
[ENCOUNTER XP — APL 4, Party of 4]

EL 4 (standard)      → 1,200 XP total → 300 XP each
EL 2 (easy)          → 300 XP total   → 75 XP each
EL 6 (challenging)   → 2,400 XP total → 600 XP each  ⚠ Above APL+1

SESSION TOTAL: 3,900 XP → 975 XP each

[Optional: Story Award ___gp XP] [Bonus: Role-play ___]
```

---

## Algorithm (3.5e DMG p.37)

Base XP per encounter = **300 × (EL − APL + 5)** with a minimum of 0 and cap adjustments:

| EL vs APL | XP Award |
|-----------|----------|
| APL − 5 or less | 0 (trivial) |
| APL − 4 | 75 XP |
| APL − 3 | 150 XP |
| APL − 2 | 300 XP |
| APL − 1 | 600 XP |
| APL (standard) | 1,200 XP |
| APL + 1 | 1,800 XP |
| APL + 2 | 2,700 XP |
| APL + 3 | 3,600 XP |
| APL + 4 | 5,400 XP |
| APL + 5+ | 7,200 XP (hard cap) |

Divide total by party size for per-character award.

**Party size adjustment:** Standard party = 4. For each PC above 4, divide total by (size/4). For fewer than 4, multiply by (4/size). Show the modifier if non-standard.

**Flag over-APL+1 encounters** with ⚠ — these were dangerous and should be noted.

---

## Story & Bonus Awards

Free text fields for:
- Story award (XP value — for completing objectives, not killing things)
- Role-play bonus (Trevor's discretion, suggested 5–10% of session total)
- Penalty (negative XP, rare but possible for catastrophic decisions)

---

## Notes

- The calculator does not track cumulative XP toward level — that's per-character and tracked on character sheets. This is a session-end tool only.
- Include a small "Level Thresholds" reference at the bottom: the XP required to reach each level 1–20 (PHB p.22 Table 3-2).
