# Monster Grade Reference — Implementation Spec

**File:** No standalone generator. This is a reference table used by encounters, NPCs, and tavern generators.
Optionally expose as a lookup tab in `runner/encounters/index.html`.

---

## Purpose

The Monster Grade system (JJK-inspired) is a legal/civic classification that governs how intelligent monsters are treated in Ptolus. It affects encounter flavor, NPC reactions, Commissariat response, and permit requirements. It does NOT affect the Spire.

This data should live in `runner/data/grades.js` and be imported by any generator that references monster grades.

---

## Grade Definitions

| Grade | CR Range (rough) | Legal Status | Commissariat Response | Permit Required |
|-------|-----------------|-------------|----------------------|----------------|
| Grade 4 | CR 1/4–1 | Tolerated in designated zones | Patrol sweep | Movement permit (cheap, easy) |
| Grade 3 | CR 2–5 | Restricted — must register | Full patrol response | Residency permit (expensive, background check) |
| Grade 2 | CR 6–10 | Heavily restricted | Rapid response squad | Special dispensation from city council |
| Grade 1 | CR 11–15 | Exclusion default — case-by-case exemptions | Commissariat Elite + backup | Council vote required |
| Special Grade | CR 16+ | No legal integration — shoot on sight default | Full mobilization | Not available |

CR ranges are guidelines. The city classifies based on demonstrated threat, not stat block. A CR 3 monster with demonstrated psionic ability or aberrant qualities may be Grade 2.

---

## Canonical Examples

| Monster | Grade | Notes |
|---------|-------|-------|
| Goblin | Grade 4 | Common, tolerated in Warrens |
| Kobold | Grade 4 | Common, often working menial jobs |
| Gnoll | Grade 3 | Restricted, often mercenary |
| Ogre | Grade 3 | Working class in some districts, watched |
| Bugbear | Grade 3 | Dangerous rep; permits rarely granted |
| Troll | Grade 2 | Regeneration makes them special-case |
| Illithid | Grade 2 | High intelligence raises grade; Covenant contacts |
| Beholder | Grade 1 | Exemptions exist but are politically costly |
| Vampire | Grade 1 | Temple District pressure keeps grade high |
| Aboleth | Special Grade | No integration; Covenant liaison only |
| Lich | Special Grade | Shoot on sight; no exceptions on record |
| Dracolich | Special Grade | Has never been tested in the city |

---

## Civic Mechanics

### Permit Types
- **Movement Permit:** Grade 4. Day travel only, designated routes. 5 gp/month.
- **Residency Permit:** Grade 3. Registered address required. Annual review. 50 gp/year + references.
- **Special Dispensation:** Grade 2. Requires sponsor (noble, guild, or church). 500 gp, valid 1 year.
- **Council Exception:** Grade 1. Voted on by full council. Political capital required. Rarely granted.

### Commissariat Response Time (in-city)
- Grade 4 incident: 1d6 × 10 minutes (patrol sweep)
- Grade 3 incident: 1d6 × 5 minutes (full patrol response)
- Grade 2 incident: 1d4 minutes (rapid response squad, 8–12 guards + a specialist)
- Grade 1 incident: 2d4 rounds (Elite response — treat as a named NPC encounter)
- Special Grade incident: immediate — all available units; city districts may go into lockdown

### Social Flavor
- Grade 4 monsters are an ordinary sight in Ptolus — part of the city's texture.
- Grade 3 monsters are visibly monitored; shopkeepers lock doors when they pass.
- Grade 2 monsters cause civilians to cross the street.
- Grade 1 monsters cause a block to empty in minutes.
- Special Grade monsters cause a district to empty.

---

## Integration Notes

- **Encounter generator:** Tag monsters with their grade in output. Show Commissariat response time.
- **NPC generator:** When Type = Monster, filter by grade to match district appropriateness.
- **Tavern generator:** Can include a notable Grade 3 or 4 patron as a detail.
- **Weather/Ambience:** "A Grade 3 monster visible at a distance — being escorted or moving alone" is a detail option.
