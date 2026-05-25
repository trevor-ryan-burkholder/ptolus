# Crime Scene / Investigation Seed Generator — Implementation Spec

**File:** `runner/investigations/index.html`
**Purpose:** Generate a complete investigation seed — victim, location, method, faction connection, one false lead, one real clue. For Arc I mysteries and city intrigue.

---

## UI

**Controls:**
- Complexity (dropdown): Simple (1 session) / Moderate (2–3 sessions) / Deep (full arc)
- District (dropdown): Random / specific
- Party Level (scales stakes and faction involvement)
- "Generate Case" button
- Seed control

**Output:**
```
[INVESTIGATION SEED — Moderate — Docks — Party Lvl 3]

THE INCIDENT: Murder
VICTIM: Tavrek Soll — male human, 40s, Delver's Guild licensed cartographer
        Known for: detailed Dungeon maps, sold to multiple buyers, never exclusive
        Status in community: respected, cautious, had enemies

LOCATION: His apartment above a chandler's shop, Docks district
          Scene: door unlocked, no signs of forced entry, body staged (hands folded)
          Time of death: 2–3 nights ago, nobody noticed

METHOD: Poison — specifically, a compound found only in certain Dungeon plants (Level 4+)
        Unusual: staged positioning suggests a message, not a crime of passion

FACTION CONNECTION: The Inverted Pyramid purchased three maps from Tavrek in the last month.
                   The last map covered an area of Level 5 nobody had returned from before.
                   The Pyramid says they don't know why he's dead.

FALSE LEAD: A Balacazar enforcer was seen near the building the night Tavrek died.
            He was there to collect an unrelated debt. He has an alibi. He's also a dead end.

REAL CLUE: Tavrek's journal is missing — but a charcoal rubbing of the last page is visible
           on the desk blotter. The rubbing shows a partial symbol — Covenant of the Third
           Thought, though the party won't know that yet.

WHAT ACTUALLY HAPPENED: A Covenant agent took Tavrek's last map because it showed something
                        that cannot become public knowledge — a route to a deep section that
                        intersects with Banewarrens geography. They didn't intend to kill him,
                        but Tavrek recognized his contact.

ESCALATION (if party investigates aggressively):
  → The Covenant will notice. They'll send someone to assess whether the party is a threat.
  → If party gets too close, evidence will start disappearing.
  → The Inverted Pyramid will offer to help — they have their own interest in the map.

RESOLUTION OPTIONS:
  → Party identifies the Covenant agent (they won't admit it, but will negotiate)
  → Party traces the map's location (it's been destroyed)
  → Party exposes the Balacazar connection (wrong, but politically useful)
  → Case goes cold — Tavrek's death becomes a rumor the party hears about later
```

---

## Tables

### Incident Types
| Type | Weight | Notes |
|------|--------|-------|
| Murder | 30 | Most flexible; works at all arcs |
| Theft (significant) | 25 | Item, information, or person |
| Disappearance | 20 | Victim may still be alive |
| Sabotage | 10 | Economic or political target |
| Frame-up | 10 | Someone is being set up |
| Supernatural incident | 5 | Something came up from below |

### Victim Types (by district)
- **Docks:** cartographer, merchant captain, dock overseer, fence, foreign sailor
- **Warrens:** small-time criminal, independent vendor, witness to something, displaced person
- **Midtown:** guild member, mid-level merchant, lawyer/scribe, minor noble servant
- **Nobles' Quarter:** noble family member, political aide, visiting dignitary
- **Temple District:** junior cleric, temple scholar, pilgrim from out of city
- **Guildsman's:** craftsperson, guild officer, apprentice who knew too much

### Method Table
| Method | Clue Type |
|--------|-----------|
| Stabbing (specific blade) | Weapon identification |
| Poison (exotic compound) | Alchemy/herbalism check |
| Magic (specific spell residue) | Spellcraft check |
| Blunt force (specific implement) | Physical evidence |
| Strangulation | Physical evidence, strength assessment |
| "Accident" (staged) | High Perception or Sense Motive |
| Unknown (no marks) | Dungeon/psionic/aberrant origin |

### Faction Connections (weighted by arc)
**Arc I:** Individual faction member acting independently, not faction policy
**Arc II:** Faction officially involved but with plausible deniability
**Arc III+:** Multiple factions with competing interests in the same case

### False Lead Types
- A criminal who was nearby for unrelated reasons
- A prior enemy of the victim with a genuine grudge but no involvement
- Physical evidence that was moved deliberately
- A witness with an incorrect but sincere account
- A faction whose involvement looks obvious because someone framed them

### Real Clue Types
- Physical object (partial, damaged, or hidden)
- A witness who doesn't know what they saw
- Financial record / transaction
- A second victim who survived and doesn't know they're connected
- Location evidence (something was in a wrong place)
- Timing anomaly (someone's alibi has a gap)

---

## Complexity Scaling

**Simple (1 session):**
- One victim, one perpetrator, one faction
- False lead is obviously wrong if investigated
- Resolution is clean — consequences are local

**Moderate (2–3 sessions):**
- One victim, multiple possible perpetrators, one or two factions
- False lead requires work to eliminate
- Resolution has a loose end

**Deep (full arc):**
- Multiple connected victims/incidents
- Faction war underneath the surface
- Resolution reveals something about the city that changes how the party sees it
- At least one faction the party trusted turns out to be involved

---

## Notes

- The "what actually happened" section is for Trevor only — never output it to players.
- Every investigation should have at least one way to fail gracefully (case goes cold, wrong person blamed) that still generates usable fiction.
- For Arc III+, connect investigation seeds to the Covenant of the Third Thought or Banewarrens as appropriate.
