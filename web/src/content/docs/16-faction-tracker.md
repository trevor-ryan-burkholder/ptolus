# Faction Disposition Tracker — Implementation Spec

**File:** `runner/factions/index.html`
**Purpose:** Track each major faction's attitude toward the party. Visual, fast, persistent via localStorage or manual export.

---

## UI

**Layout:** Card grid — one card per faction.

**Each faction card:**
```
┌─────────────────────────────────┐
│ THE BALACAZARS                  │
│ Crime / Power                   │
│                                 │
│ Disposition: ████████░░  +2     │
│ [−] [Neutral] [+]               │
│                                 │
│ Status: CAUTIOUS                │
│ Last change: "Refused a job"    │
│                                 │
│ [Notes ▾]                       │
└─────────────────────────────────┘
```

- Disposition: −5 to +5 scale (or −10 to +10 for finer granularity)
- Visual bar: shifts color (red at negative, grey at neutral, gold at positive)
- Status label (see scale below)
- Last change note: free text field Trevor fills in
- Notes: expandable text area for faction-specific tracking

---

## Disposition Scale

| Value | Status | Meaning |
|-------|--------|---------|
| −5 | HOSTILE | Active enemy — will act against the party |
| −4 | ANTAGONISTIC | Will obstruct, may hire opposition |
| −3 | UNFRIENDLY | Cold, unhelpful, suspicious |
| −2 | WARY | Cautious — watching, not helping |
| −1 | COOL | Slightly negative; won't go out of their way |
| 0 | NEUTRAL | Unknown quantity; no history |
| +1 | NOTICED | On their radar in a positive way |
| +2 | CAUTIOUS ALLY | Will deal fairly; limited trust |
| +3 | FRIENDLY | Will assist if not costly |
| +4 | ALLIED | Active cooperation; some trust |
| +5 | TRUSTED | Deep relationship; will take risks for the party |

---

## Pre-Loaded Factions

Start all at 0 (Neutral). Trevor adjusts as play develops.

**Criminal / Power:**
- The Balacazars (crime family)
- The Killravens (rival criminal org)

**Civic / Law:**
- The Commissariat
- The Delver's Guild
- The City Council

**Arcane / Scholarly:**
- The Inverted Pyramid
- The Dreaming Apothecary

**Religious:**
- Church of Lothian (dominant)
- Church of Asche
- Other Ptolus temples (grouped)

**Faction-specific:**
- The Covenant of the Third Thought (hidden — starts greyed out, revealed when party becomes aware)
- The Knights of the Pale
- The Forsaken
- The Chaos Cults (grouped)

**Noble Houses:**
- House Callante
- House Drath
- House Sadar
- [Add custom]

**Monster / Non-Human:**
- Integrated Monster Community (Grade 4 majority)
- Illithid Network (hidden — reveal when relevant)

---

## Features

**Inter-faction relationships (reference only):**
Small tooltip on each card showing known faction relationships — "Enemy of: Killravens / Allied with: City Council (uneasy)." This is static reference data, not tracked dynamically.

**"Faction Event" quick-log:**
Below each card, a timestamped log of disposition changes:
```
+1 Session 3 — Helped recover stolen Guild cargo
−2 Session 5 — Refused Balacazar job, publicly
+2 Session 7 — Delivered information about rival faction
```

**Export / Import:**
"Copy State" button exports current disposition values as a JSON string. "Load State" imports it. Lets Trevor save state between sessions without a server.

**Filter view:**
- Show only: Hostile/Antagonistic | Show only: Allied/Trusted | Show all

---

## Notes

- The Covenant of the Third Thought should start hidden (card grayed out with "???" as name) and be revealed only when the party becomes aware of them — toggle in settings.
- Disposition changes should require Trevor to fill in the "reason" field before confirming, so the log is always meaningful.
- This is a session-to-session tool. Saving state via copy/paste JSON is enough for v1.
