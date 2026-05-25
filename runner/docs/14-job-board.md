# Delver Job Board -- Implementation Spec

**File:** `runner/jobs/index.html`
**Purpose:** Generate a random delver contract -- patron, location, objective, reward, complication, and catch. One button, full job hook ready for play.

---

## Canonical Names Reference

- **Delver's Guild:** Correct canonical name. The leader's title is **Guildmaster Delver** (currently Sorum Dandubal). The guild's office is in the Undercity Market; Library/Maproom are in Oldtown. ~800 members with 4 ranks: Associate Guildsman, Guildsman, Master Delver, Grand Master (Ptolus pp. 108-109).
- **Law enforcement patron:** Use **City Watch Officer** or **Commissar's Agent**, not "Commissariat Officer." The book's enforcement bodies are the City Watch, the Commissar's Men, and the Imperial Eyes. The Commissar (Igor Urnst) is the person, not an institution name.
- **Noble house patrons:** Canonical houses only: Abanar, Dallimothan, Erthuo, Kath, Khatru, Nagel, Rau, Sadar, Shever, Vladaam.
- **The Balacazars:** Correct. They are a crime family, not a formal guild.
- The **Delver's Guild** posts 10 gp for maps of Dungeon areas they don't already have (Ptolus p. 108). This is a real canon hook for job origins.

---

## Data Source

Inline JS tables. Optionally reference `DATA.monsters` for target creatures.
References faction names from `srd/ptolus/factions.md` (hardcode the key ones).

---

## UI

**Controls:**
- Party Level (1–20) — scales reward and difficulty
- Job Type (dropdown):
  - Random
  - Dungeon Delve (retrieve/clear/map)
  - City Contract (locate/escort/investigate)
  - Faction Job (work for a specific faction)
  - Black Market (morally grey)
  - Emergency (urgent, time-limited)
- Faction Filter (optional): any / City Watch / Delver's Guild / Inverted Pyramid / Church of Lothian / Balacazars / Noble House / Anonymous
- "Post Job" button
- "Post Board" button (generates 1d4+1 jobs at once — full board view)
- Seed control

**Output:**
```
[JOB POSTING — Party Lvl 4 — Dungeon Delve]

PATRON: Aldric Voss, Delver's Guild Factor (human male, officious, always counting coin)
CONTACT METHOD: Guild Hall, Midtown — ask for Voss by name. He won't come to you.

OBJECTIVE: Retrieve a brass compass from Level 3 of the Dungeon, last known location:
           Room 7 of the Ossuary Corridor. Previous team went in 6 days ago. Didn't come back.

TARGET LOCATION: The Dungeon — Level 3 (Ossuary Corridor)
ESTIMATED THREAT: EL 4–6 (skeletons, ghouls, one unknown)

REWARD: 800 gp on delivery. 200 gp bonus if the previous team's survivors are returned.
TIMELINE: Open — but the Guild wants it done before someone else finds it.

COMPLICATION: The previous team wasn't just exploring. They were looking for something specific,
              and the compass is how they were tracking it.

THE CATCH: Voss will lowball the bonus if he can. He's also reporting to someone above him
           who wants whatever the previous team found — not just the compass.

HOOKS:
  → Who hired the previous team, and for what?
  → The compass is attuned to something. What?
```

---

## Tables

### Patron Types (weighted by job type)

| Patron | Job Types | Notes |
|--------|-----------|-------|
| Delver's Guild Factor | Dungeon, retrieval | Professional, transactional |
| Noble House (roll house) | City, faction, high reward | Deniable, political |
| Inverted Pyramid Mage | Any, arcane focus | Cryptic, dangerous employers |
| Church of Lothian | City, undead-related | Righteous framing, real agenda |
| City Watch Officer / Commissar's Agent | City, law-adjacent | Official cover, unofficial ask |
| Balacazar Fixer | Black market, escort | Don't ask questions |
| Anonymous (via intermediary) | Any | Unknown patron — always a hook |
| Merchant / Guild Member | Escort, retrieval | Mundane but reliable pay |
| Desperate Individual | Any | Urgent, personal, possibly a trap |

### Objective Types

**Dungeon Delve:**
- Retrieve [item] from [location/level]
- Clear [location] of [creature type] — bring proof
- Map [area] — no party has returned with usable maps
- Escort a mage/scholar into [location] and out again
- Find out what happened to [previous party]

**City Contract:**
- Locate [person] — alive preferred, but that's negotiable
- Deliver [item/message] to [person] without being seen
- Investigate [incident] — the Commissar's office wants it quiet
- Protect [person/location] for [duration]
- Acquire [item] from someone who won't sell it

**Faction Job:**
- Steal [item] from rival faction
- Discredit [person] — evidence preferred, rumor acceptable
- Disrupt [operation] without leaving traces
- Move something through the city without triggering City Watch notice
- Surveil [location/person] and report

**Black Market:**
- Transport [cargo] — no questions
- Provide muscle for [exchange]
- Make a problem disappear (intimidation, not murder — probably)
- Obtain something that technically requires a permit

### Reward Scale by Party Level

| Level | Base Reward | Bonus Range |
|-------|-------------|-------------|
| 1–3 | 100–300 gp | +50–150 gp |
| 4–6 | 400–800 gp | +100–300 gp |
| 7–10 | 1,000–2,500 gp | +500–1,000 gp |
| 11–15 | 3,000–8,000 gp | +1,000–3,000 gp |
| 16+ | 10,000+ gp or political capital | Negotiable |

### Complications (always 1)
1. The target location has changed since the job was posted
2. A rival delver team took the same job — they're a day ahead
3. The patron is being watched — meeting them is itself a risk
4. The objective is connected to a faction the party has history with
5. The item/person being retrieved doesn't want to be retrieved
6. A third party is also interested — and better funded

### The Catch (always 1 — the thing the patron isn't saying)
1. The reward is lower than what they'd actually pay — room to negotiate
2. The patron is reporting to someone else; the real client is unknown
3. The job is a test — the real ask comes after
4. The patron needs this done because they can't be seen doing it themselves
5. The "retrieve" job is actually a "find out if it still exists" job
6. Success will make an enemy the patron didn't warn them about

---

## "Post Board" Mode

Generates 1d4+2 jobs in a card grid — simulates a physical job board at the Delver's Guild. Each card shows: title, patron (vague), location, reward tier, and one-line hook. Trevor can click any card to expand to the full output.
