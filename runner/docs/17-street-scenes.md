# Street Scene Generator — Implementation Spec

**File:** `runner/street-scenes/index.html`
**Purpose:** Generate what's happening on this street corner right now — not just monsters, but the full texture of city life. For city traversal, random interruptions, or adding life to a scene.

---

## UI

**Controls:**
- District dropdown (same list as weather generator)
- Time of Day: Dawn / Morning / Midday / Afternoon / Dusk / Evening / Night / Deep Night
- Campaign Arc: I / II / III / IV / V
- "Generate Scene" button
- "Quick Scene" button (one-liner, no detail)
- Seed control

**Output:**
```
[STREET SCENE — Docks — Evening — Arc I]

TYPE: Criminal Activity (minor)

SCENE: Two dockhands are arguing loudly in front of a warehouse. One is blocking the door.
       The argument is about money owed. It is not about money owed.

WHAT'S ACTUALLY HAPPENING: The one blocking the door is stalling. Someone inside is moving
cargo that shouldn't be moved. The argument will last until they're done (1d6 × 5 min).

PEOPLE PRESENT:
  • 3 dockhands (participants/witnesses) — nervous
  • 1 Commissariat patrol passing at the end of the block — not paying attention yet
  • A halfling sitting on a crate eating, watching everything

HOOK (optional): The halfling will make eye contact with the party. She knows what's happening.
                 She works for the people inside.

COMPLICATION IF PARTY INTERVENES: The cargo they're moving has a Balacazar mark on it.
```

---

## Scene Type Table (weighted by district and time)

| Type | Districts | Times | Arc |
|------|-----------|-------|-----|
| Ordinary street life | All | Day | Any |
| Criminal activity (minor) | Docks, Warrens | Evening, Night | Any |
| Criminal activity (major) | Warrens, Docks | Night | II+ |
| Faction interaction | Midtown, Nobles' | Day, Evening | Any |
| Monster incident | Any | Any | Any |
| Civic event | Any | Day | Any |
| Commissariat action | Any | Any | Any |
| Chase scene (ongoing) | Any | Any | II+ |
| Religious activity | Temple District | Morning, Evening | Any |
| Noble drama | Nobles' Quarter | Day, Evening | II+ |
| Delver activity | Dungeon entrance, Midtown | Any | Any |
| Strange/Ptolus-specific | Any | Night, Deep Night | Any |

---

## Scene Tables by Type

### Ordinary Street Life
- Street vendor arguing with a customer over price (neither will back down)
- A funeral procession passing — which temple, who died?
- Children playing in an alley; one of them is watching the party carefully
- A cart overturned — produce everywhere; owner furious, cart-driver gone
- A street preacher proclaiming the Spire is speaking; nobody is listening
- Two Guild members walking together, deep in urgent conversation
- A monster (Grade 4) doing an ordinary job (carrying goods, cleaning, delivering)

### Criminal Activity (minor)
- A pickpocket at work — party may notice (Perception DC 15)
- Goods being moved between buildings at unusual hours
- A bribe being paid to a guard who doesn't want to take it
- Two people exchanging a package — both walk away quickly
- Someone watching a building from across the street. Has been there a while.

### Criminal Activity (major)
- A robbery in progress (in an alley, just off the main street)
- Enforcers collecting on a debt — person can't pay, things are escalating
- A body being moved. Quietly. The people moving it are calm.
- Contraband unloading at the docks — Grade 2 creature providing "security"

### Monster Incident
- Grade 4 monster being harassed by a crowd — situation is escalating
- Grade 3 monster outside its permitted zone — doesn't know, or doesn't care
- A Grade 2 monster standing completely still in the middle of the street; everyone is walking around it
- Two Grade 4 monsters in a fistfight — crowd is either watching or fleeing

### Commissariat Action
- Patrol stops someone for a document check — person is panicking
- Patrol responding to a call — moving fast, not stopping for anyone
- A guard post set up where there wasn't one yesterday; checking permits
- Two Commissariat officers arguing with each other about jurisdiction

### Delver Activity
- A delver team returning from the Dungeon — visibly shaken, equipment damaged, won't talk
- A delver team gearing up outside an entrance — overly cheerful, it's their first run
- A delver being treated in public — healer working fast, wound is unusual
- Delver's Guild rep posting a job notice; small crowd forming

### Strange / Ptolus-Specific
- A section of street has a chalk circle around it; nobody is crossing it. Nobody knows who drew it.
- A chaositech device is going off in someone's pocket — they don't know why and can't turn it off
- A Dungeon entrance that's supposed to be sealed has a fresh torch burning next to it
- An elderly woman is feeding birds that are not birds
- The sound from the Spire last night — someone on the street says they know what it means. They'll tell you for 5 sp. The information is wrong but they believe it.

---

## People Present Table

Roll 1d3+1 people/groups present (besides the main scene):

- Commissariat patrol (at distance)
- Merchant with a cart (hurrying)
- 1d4 laborers (watching or ignoring)
- An elf (rare in this district — stands out)
- A grade 4 monster going about its business
- A delver team passing through
- Someone who clearly recognizes the party
- A beggar (actually listening carefully to everything)
- Children (running, always)
- A noble's closed carriage (moving too fast for this street)

---

## Quick Scene (one-liner output)

For fast use mid-session when Trevor just needs a texture beat:

```
→ A Guard sergeant is apologizing to a gnoll about something. The gnoll is not accepting the apology.
→ Two women arguing from opposite windows about a shared wall.
→ A delver sits in a doorway eating a meal calmly. His arm is gone below the elbow. He seems fine.
→ A child runs past at full speed holding a hat that is not theirs.
```
