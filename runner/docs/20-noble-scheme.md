# Noble Scheme Generator — Implementation Spec

**File:** `runner/noble-schemes/index.html`
**Purpose:** Generate a noble house political intrigue hook for Arc II+ content — two houses, a contested asset, their methods, what they want the party to do, and what they're not saying.

---

## UI

**Controls:**
- Campaign Arc (II, III, IV — not relevant for Arc I or V)
- Stakes (dropdown): Low (local, recoverable) / Medium (district-level) / High (city-wide)
- "Generate Scheme" button
- Seed control

**Output:**
```
[NOBLE SCHEME — Arc II — Medium Stakes]

HOUSES IN CONFLICT:
  House Callante — old money, trade empire, politically cautious
  House Drath — new money, military connections, aggressive expansion

CONTESTED ASSET:
  A warehouse district on the border of Guildsman's and Docks.
  Combined value: ~15,000 gp. More important: it controls a specific trade route
  and two loading docks with Commissariat inspection exemptions (grandfathered).

THE DISPUTE:
  House Callante holds the deeds. House Drath has been quietly buying debt from Callante's
  creditors. If Drath calls the debt simultaneously, Callante cannot pay — and Drath
  takes the district in lieu.

WHAT CALLANTE WANTS FROM THE PARTY:
  Find evidence that Drath has been buying the debt — documentation, witnesses, anything
  that can be used to void the debt purchases in court. They'll pay 1,200 gp on delivery.

WHAT THEY'RE NOT SAYING:
  The debt is legitimate. Callante can't void it legally — they want the party to steal
  or destroy the documentation, or intimidate the creditors into silence. They didn't
  say this. They were hoping the party would figure it out on their own.

WHAT DRATH WANTS FROM THE PARTY (if they approach both sides):
  Deliver a sealed letter to each creditor. The letter contains an offer — and a warning.
  They'll pay 800 gp for the delivery and 300 gp per creditor who stays bought.

WHAT DRATH IS NOT SAYING:
  Two of the creditors have already refused. They need to be persuaded more firmly.
  Drath's "persuasion" is not financial.

THIRD PARTY:
  A Delver's Guild factor has been quietly watching both houses. The inspection exemptions
  are worth more than the real estate — and the Guild wants them, not the houses.

ESCALATION (if party stays involved):
  → Round 1: Legal maneuvering, hired investigators, social pressure
  → Round 2: Evidence goes missing, witnesses recant, a Commissariat officer is bribed
  → Round 3: One house makes a move that cannot be undone — political, financial, or physical
  → Endgame: The losing house collapses or becomes a permanent enemy. Winner owes the party — or blames them.

COMPLICATIONS:
  A member of one house is not loyal to their house.
  The inspection exemptions are being used for something neither house knows about.
```

---

## Tables

### Noble Houses (Ptolus canon + extras)

Use Ptolus sourcebook for canonical house names and relationships. Key houses for this generator:

| House | Character | Resources | Style |
|-------|-----------|-----------|-------|
| Callante | Old trade money, cautious | Commercial empire, creditor networks | Legal, patient, passive-aggressive |
| Drath | Military new money, aggressive | Soldiers, Commissariat connections | Pressure, debt, controlled violence |
| Sadar | Ancient lineage, fading | Political connections, real estate | Pride, reputation, secrets |
| Rehani | Mercantile, foreign-connected | Import/export, foreign alliances | Pragmatic, transactional |
| Urvan | Religious ties, Church-adjacent | Temple connections, moral authority | Righteousness, exclusion |
| [Roll custom] | — | — | — |

### Contested Assets

| Asset | Stakes |
|-------|--------|
| Warehouse district / trade route | Medium |
| Political appointment (city council seat) | Medium–High |
| Marriage contract (alliance or dissolution) | Low–Medium |
| Property deed (Nobles' Quarter estate) | Low–Medium |
| Commissariat contract (security, permits) | Medium–High |
| Evidence / blackmail material | Any |
| A title or legal designation | High |
| Control of a Guild chapter | High |
| A Dungeon access permit (unique, grandfathered) | Medium–High |
| Foreign trade rights (exclusive) | High |

### Methods

**Legal / above-board:**
- Court challenge, contract dispute
- Buying debt or obligations
- Political lobbying (bribing council members)
- Public reputation campaign

**Grey:**
- Hiring investigators to find leverage
- Intercepting correspondence
- Encouraging creditors, witnesses, or allies to shift loyalty

**Dark:**
- Destroying documentation
- Intimidating witnesses or creditors
- Planting evidence
- Having someone arrested on convenient charges
- A targeted "accident"

### What They Ask vs. What They Want

Always generate both. The gap between them is the moral weight of the job:

| Ask | Want |
|-----|------|
| "Find documentation" | Steal and destroy it |
| "Deliver a message" | Intimidate the recipient |
| "Gather information" | Spy on a protected location |
| "Ensure a meeting happens" | Coerce an unwilling party |
| "Confirm someone's location" | Set them up for something |
| "Represent us at a negotiation" | Take the blame if it goes wrong |

### Third Parties

Every scheme has at least one party with an independent interest:
- Delver's Guild (trade access, permits)
- Commissariat officer (bribery opportunity or genuine corruption)
- Inverted Pyramid (arcane angle — always)
- Balacazars (crime angle — always)
- A foreign merchant house (trade rights)
- The Covenant of the Third Thought (Arc III+ only — they're watching)
- A house servant who knows everything and has their own agenda

---

## Escalation Model

All noble schemes should be playable at three levels of involvement:

1. **One job** — party does the task, gets paid, moves on. Consequences are local.
2. **Ongoing involvement** — party picks a side, becomes entangled. House becomes an ally or enemy.
3. **Full arc** — party is in deep enough that the house's fate is tied to theirs. Blowback is citywide.

Always note which escalation paths are available and what triggers each.
