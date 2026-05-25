# City Watch Response Timer — Implementation Spec

**File:** `runner/commissariat/index.html` or panel within `runner/encounters/index.html`
**Purpose:** When a serious incident occurs in Ptolus, start a countdown showing what's coming and when. Creates real table tension.

---

## Accuracy Note (canonical names)

The book's law enforcement bodies are (Ptolus pp. 551-552):
- **The City Watch** -- the main uniformed force, commanded by the Commissar, operating from Watchhouses throughout the city. Think occupying military force, not modern police. More interested in order than justice.
- **The Commissar's Men** -- the Commissar's personal military force (separate from the Watch).
- **The Imperial Eyes** -- covert agents; special operatives may hold "death licenses" permitting murder.
- **The Sisterhood of Silence** -- independently sanctioned female monks who patrol and apprehend criminals; work alongside but separate from the City Watch.
- **The Commissar** -- Igor Urnst, Fighter 18, a former military general. He is the ultimate authority and the person who commands the City Watch. "Commissariat" is not the book's term for the law enforcement body; use "City Watch" or "the Commissar's forces."

The "Grade" monster classification system in this doc is a homebrew convenience tool, not a canonical Ptolus mechanic.

---

## UI

**Incident Setup:**
- Grade dropdown: Grade 4 / Grade 3 / Grade 2 / Grade 1 / Special Grade
- District dropdown (affects response time modifier):
  - Nobles' Quarter / Temple District: -1d4 min (faster, higher patrol density)
  - Midtown / Guildsman District: standard
  - Docks / Warrens: +1d4 min (slower, lower priority)
  - Necropolis: special (see below)
  - The Dungeon: no City Watch response (see below)
- Time of Day: Day / Night (night adds +50% to response time)
- "Trigger Incident" button

**Active Timer display (large, prominent):**
```
GRADE 2 INCIDENT -- MIDTOWN

CITY WATCH RESPONSE INCOMING:
  [XXXXXXXX.......] 4:23 remaining

ARRIVING:
  Rapid Response Squad
  8-12 guards + 1 Combat Specialist (treat as Fighter 6)
  Mage on call (Wizard 5, evocation focus)

WHAT THEY'LL DO:
  Contain the threat. Subdue if possible. Kill if not.
  Anyone near the scene is a witness. Anyone with weapons drawn is a suspect.
  The Watch is more interested in order than justice -- they won't investigate.

[Reset] [Add Complication] [Escalate Grade]
```

---

## Response Time Table

| Grade | Base Time | Roll |
|-------|-----------|------|
| Grade 4 | 10 min avg | 1d6 x 10 min |
| Grade 3 | 5 min avg | 1d6 x 5 min |
| Grade 2 | 3 min avg | 1d4 x 3 min |
| Grade 1 | 30 sec avg | 2d4 x 10 sec |
| Special Grade | Immediate | 1d4 rounds |

District modifier applied after base roll (see above).

Timer counts down in real time (seconds). At zero, response arrives.

---

## Response Composition

| Grade | Who Shows Up |
|-------|-------------|
| Grade 4 | 1d4+2 guards (Warrior 1-2), 1 corporal (Warrior 3) |
| Grade 3 | 2d4+4 guards, 1 sergeant (Warrior 4), 1d2 specialists |
| Grade 2 | 8-12 guards, 1 lieutenant (Fighter 4-6), 1 mage (Wiz 5), possible cleric |
| Grade 1 | City Watch Elite (6-8, Fighter 6-8), 1 commander, 1 senior mage (Wiz 9), backup waves; Commissar's Men may also respond |
| Special Grade | Full mobilization -- all available units, district lockdown, city-wide alert; Commissar himself may appear |

---

## Special Locations

**Necropolis:** City Watch responds slower (+2d6 min) and with more caution. Often sends a Church of Lothian liaison alongside guards. Grade 1+ incidents may prompt a Church response instead of/in addition to the Watch.

**The Dungeon:** No City Watch response. Delver's Guild may respond to Grade 1+ if surface breach occurs. Special Grade = Watch seals the nearest surface entrance.

---

## Complications (optional roll when "Add Complication" is clicked)

1. A second unit was already nearby -- arrives in half the time
2. The responding sergeant has a personal grudge (roll NPC -- he knows someone in the party)
3. A journalist from a city broadsheet is following the patrol
4. The unit is already dealing with a separate incident nearby -- delayed by 1d6 x 5 min
5. Political interference -- a noble sent a runner asking the Watch to stand down
6. The Covenant of Blood (vampires from the Dark Reliquary) has already arrived -- standing nearby, watching [NOTE: "Covenant of the Third Thought" is not a canonical Ptolus faction; the book's comparable shadowy watcher faction is the Covenant of Blood]

---

## Escalation

"Escalate Grade" button: bumps to next grade, recalculates response time and composition. Used when a situation gets worse mid-scene.

---

## Notes

- The timer is pure pressure -- it doesn't resolve the encounter, it just tells Trevor how long the party has.
- Even if the party handles the threat before the City Watch arrives, the Watch still shows up. The aftermath is its own scene.
- The Watch does not investigate crimes in any modern sense. They stop ongoing crimes, arrest whoever looks guilty, and move on (Ptolus p. 553).
- Display the district and grade prominently. Trevor should be able to glance at this from across the table.
