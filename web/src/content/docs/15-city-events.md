# City Event Generator — Implementation Spec

**File:** `runner/city-events/index.html`
**Purpose:** Generate what's happening in Ptolus this week -- faction moves, civic incidents, Dungeon news, monster incidents, Noble Quarter drama. Makes the city feel alive between sessions.

---

## Canonical Names Reference

- **Law enforcement:** The **City Watch** (uniformed guards from Watchhouses); the **Commissar's Men** (personal military force); the **Imperial Eyes** (covert). The person in charge is the **Commissar** (Igor Urnst, Fighter 18). The secondary law enforcement body is the **Sisterhood of Silence** (officially sanctioned female monk order; Ptolus p. 134). "Commissariat" is not the book's term.
- **Noble houses (canonical):** Abanar (mercantile), Dallimothan (dragons), Erthuo (scholars), Kath (arts), Khatru (military), Nagel (altruistic), Rau (rogues), Sadar (shadows), Shever (technology), Vladaam (evil). "House Callante" and "House Drath" are not in the book.
- **Delver's Guild:** Correct name. Leader is Guildmaster Delver Sorum Dandubal. ~800 members. Main office is in the Undercity Market; Library and Maproom are in Oldtown (Ptolus p. 108-109).
- **Balacazars:** Correct. The book refers to them as the Balacazar family or the Balacazar crime family -- "Balacazars" is fine.
- **Inverted Pyramid, Church of Lothian, Knights of the Pale, Keepers of the Veil, Sisterhood of Silence, The Fallen, The Forsaken:** All canonical faction names.

---

## UI

**Controls:**
- Campaign Arc (dropdown): Arc I (1–5) / Arc II (6–10) / Arc III (11–15) / Arc IV (16–19) / Arc V (20+) — scales event severity
- Focus District (optional): Random / specific district
- "Generate Week" button — produces 1d4+2 events for the week
- "Single Event" button — one event, specific category
- Category filter (optional): Faction / Civic / Monster / Dungeon / Noble / Church / Criminal / Weird
- Seed control

**Output:**
```
[PTOLUS — THIS WEEK — Arc I]

① FACTION — Balacazars
   The Balacazar family has quietly bought out three Docks warehouses in the last two weeks.
   Street word: they're expecting a large shipment from the south. Nobody knows what.
   → Who: Balacazars | Where: Docks | Urgency: Low | Hook: What's in the shipment?

② CIVIC — City Watch
   A Grade 3 monster (gnoll mercenary) was found dead in the Warrens. City Watch ruled it
   an accident. The gnoll's employer (a merchant) disagrees loudly.
   → Who: City Watch + unnamed merchant | Where: Warrens | Urgency: Medium

③ DUNGEON — Delver News
   A team came up from Level 4 with something sealed in a lead box. Refused to say what.
   Went straight to the Inverted Pyramid. Didn't come back out for two days.
   → Who: Unknown delver team, Inverted Pyramid | Urgency: Low | Hook: What's in the box?

④ MONSTER — Grade Incident
   A Grade 2 creature (troll) lost its permit after a violent incident in Midtown. 
   Now unregistered and somewhere in the city. City Watch offering 500 gp for information.
   → Where: Unknown (last seen Midtown) | Urgency: High | City Watch: active search

⑤ NOBLE — Political
   House Abanar and House Sadar are in public dispute over a collapsed trade agreement.
   Each is quietly hiring muscle "for security." This is going to get worse.
   → Who: House Abanar vs House Sadar | Where: Nobles' Quarter | Urgency: Medium
```

---

## Event Tables by Category

### Faction Events (weighted by arc — more intense in higher arcs)

**Arc I:**
- Balacazars buying property quietly in a specific district
- Inverted Pyramid mage spotted outside their tower, meeting with someone
- Delver's Guild posting unusually high-reward jobs for Level 1–2 content (something is down there)
- Church of Lothian beginning a "purification sweep" of a district
- Two criminal factions arguing over territory in the Warrens

**Arc II+:** (add)
- Faction openly challenging another faction's territory
- A Guild leader has gone missing — no announcement yet
- The Inverted Pyramid has sealed its tower. No explanation.
- The Balacazars called in multiple debts simultaneously — someone owes them something big

### Civic Events

**Arc I:**
- New permit regulation announced — affects delvers specifically
- City Watch crackdown on unlicensed weapon-carrying in a district
- A bridge/road is closed for "structural reasons" — rumor says something broke through from below
- Public execution scheduled — crime: monster-related violence (sympathy is divided)
- City council session ended in open argument — unusual

**Arc III+:** (add)
- District placed under partial curfew — official reason vague
- City infrastructure failing in an unexpected area (sewers, water, walls)
- Emergency City Watch conscription — they're pulling off-duty guards back in

### Monster Incidents

**Arc I:**
- Grade 3 monster found dead under suspicious circumstances
- Grade 4 monster applying for a residency permit — controversial
- A Grade 3 has gone missing from its registered address
- Grade 4 monster riot in the Warrens (minor, contained) — 3 injured
- Unregistered monster sighting in Midtown — could be Grade 3 or 4, unclear

**Arc II+:** (add)
- Grade 2 monster permit revoked after incident — now unregistered and loose
- Grade 1 sighting near the city walls — not yet inside
- Monster rights protest organized by integrated monster community

**Arc III+:** (add)
- Special Grade threat detected near the Dungeon entrance — City Watch sealed the block
- Multiple unconnected Grade 2 incidents in one week — someone is releasing them

### Dungeon News

- A team retrieved something significant — won't say what, went straight to [faction]
- An entrance nobody officially knew about opened up under a building
- A level known to be "cleared" has monster activity again — something moved in
- A delver team hasn't surfaced in [1d6] days — past their stated return window
- Seismic activity in Level [2d4] — unusual sounds reported by teams in adjacent levels
- Something came UP from a level no team has reached — Delver's Guild is not commenting

### Noble Drama

- Two houses in public dispute over [trade / property / marriage / debt] [canonical houses: Abanar, Dallimothan, Erthuo, Kath, Khatru, Nagel, Rau, Sadar, Shever, Vladaam]
- A noble has been hiring adventurers in unusual quantities — quietly
- Scandal: a noble house member was found in [wrong district] / [wrong company]
- A house is calling in favors — multiple parties are being contacted at once
- Succession question in a noble house — the heir is missing or in question

### Church Events

- The Church of Lothian is increasing presence in [district] — residents are nervous
- A relic from the Necropolis was stolen — Church is furious, not reporting it to City Watch
- Schism: two Church factions openly disagree about monster integration policy
- A new cult is operating in the city — not yet identified by City Watch

### Weird (Ptolus-specific, always unsettling)

- The Spire emitted a sound last night. Once. Nobody is talking about it officially.
- A street in Oldtown was found completely empty this morning — residents and all possessions gone
- A Dungeon artifact appeared in a Midtown market — no one knows how it got to the surface
- Three unconnected people had the same dream last night and reported it to the Church
- Something in the sewer system is organizing — City Watch dismisses it, delvers don't

---

## Urgency Tags

- **Low** — background color, party can ignore
- **Medium** — worth knowing, may intersect with play
- **High** — actively affects the city this week, will appear in play
- **Urgent** — immediate, cannot be ignored if party is in the area

---

## Arc Scaling

Higher arcs should produce more High/Urgent events and more faction-level threats. Arc IV events should make the city feel like it's starting to crack. Arc V events should feel like the world is ending — because it might be.
