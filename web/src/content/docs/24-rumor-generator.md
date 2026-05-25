# Rumor Generator — Implementation Spec

**File:** `runner/rumors/index.html`
**Purpose:** Generate 3–5 plausible in-character rumors keyed to the social position of the source NPC type. Trevor selects a profession, gets rumors appropriate to what that type of person would actually know. Each rumor includes a truth tag and a hook for play.

---

## Canonical Names Reference

- **Law enforcement:** The **City Watch** (uniformed guards from Watchhouses); the **Commissar's Men** (personal military force); the **Imperial Eyes** (covert). The Commissar is **Igor Urnst** (Fighter 18). The secondary body is the **Sisterhood of Silence** (PT3: p. 134). Term "Commissariat" is not canonical.
- **Noble houses (canonical):** Abanar (mercantile), Dallimothan (dragons), Erthuo (scholars), Kath (arts), Khatru (military), Nagel (altruistic), Rau (rogues), Sadar (shadows), Shever (technology), Vladaam (evil).
- **Delver's Guild:** Correct name. Leader: **Guildmaster Delver Sorum Dandubal**. ~800 members. Office: Undercity Market. Library/Maproom: Oldtown (PT3: p. 108–109).
- **Balacazars:** The Balacazar crime family — not a guild. Correct as "the Balacazars."
- **Key factions:** Inverted Pyramid, Church of Lothian, Knights of the Pale, Knights of the Dawn, Keepers of the Veil, Sisterhood of Silence, The Fallen, The Forsaken, Shuul, Longfingers Guild, Order of Iron Might.
- **Districts:** Nobles' Quarter, Midtown, Temple District, South Market, North Market, Guildsman District, Oldtown, Rivergate, Docks, Warrens, Necropolis.

---

## UI

**Controls:**
- Source NPC Type (dropdown):
  - Delver (at the Undercity Market or Delver's Square)
  - Temple Priest (any church, roll for which)
  - City Watch Guard
  - Dock Worker
  - Noble's Servant
  - Merchant (South Market or North Market)
  - Warrens Resident
  - Undercity Market Vendor
- Campaign Arc (dropdown): Arc I (1–5) / Arc II (6–10) / Arc III (11–15) / Arc IV–V (16+)
- Rumor Count: 3 / 4 / 5
- Seed control
- "Generate Rumors" button

**Output:**
```
[RUMORS — Source: Dock Worker — Arc I]

① "There's a ship in the harbor — the Saltfang, out of the Bay of Ptolus — that docked three
   days ago and nobody's come off it. Dockmaster's filed a complaint but the City Watch won't
   touch it. Something about a wax seal on the gangway. Imperial mark, someone said."
   TRUTH: Mostly True | HOOK: The ship belongs to an Imperial Eyes operation. Whatever's inside
   is being 'not noticed' on purpose.

② "One of the Balacazars' warehouse bosses turned up dead last week. Not robbed —
   everything still on him. Word from the boys is it wasn't the family's doing, which means
   someone's moving against them and they don't know who yet."
   TRUTH: True | HOOK: The killing was done by a Vai assassin on contract. The Balacazars are
   rattled and looking to hire muscle while they investigate.

③ "I heard the Shuul's been paying for cargo to come in through the Docks without being logged
   by the tax collectors. Big crates, heavy. Nobody knows what's in them."
   TRUTH: Partial | HOOK: Most of the crates are legitimate construction materials for Shever
   projects. One crate is not.
```

---

## Rumor Tables by NPC Type

All rumors have three fields:
- **Text** — in-character phrasing, as the NPC would say it
- **Truth** — `True` / `Mostly True` / `Partial` / `False`
- **Hook** — brief GM note on what this connects to

---

### 1. Delver (at Delver's Square or Undercity Market)

Delvers know Dungeon conditions, guild politics, recent expedition results, and Undercity gossip. They don't know city politics above ground very well, but they hear what other delvers bring back.

**Arc I Rumors:**

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| D1 | "Level 2 south corridor has been reopened by the guild. There was a collapse last season — they've shored it up. But the team that did it came back without one of their members and won't say what happened." | Mostly True | The missing delver was taken by something that's moved into the collapse zone — not a monster the guild has catalogued. |
| D2 | "The Guild's offering ten gold for maps of any area past the Ossuary Corridor that nobody's charted. Easy money if you can get there without dying." | True | This is a real guild posting (see Ptolus p. 108). What's at the far end of the uncharted stretch is why nobody's come back with a complete map. |
| D3 | "Watch out for the ratmen on Level 1. They've organized. Not just a nest — they've got a leader. Somebody's giving them orders and it's not one of their own." | Mostly True | A Forsaken cultist is using the ratmen as a forward screen. He has something in their territory he doesn't want found. |
| D4 | "A team came up yesterday with a sealed lead box from Level 3. Went straight to the Inverted Pyramid. Didn't come out for two days. That's never good." | True | The box contained a chaos relic — a shard of Ghul's original armaments. The Pyramid has it and is arguing internally about whether to destroy it or study it. |
| D5 | "The Undercity Market had a break-in two nights ago. Not the main hall — the Dark Market side. They got in through the sewer junction." | True | The Longfingers Guild pulled the job. They were hired by a Balacazar underboss to steal a specific item from a vendor who didn't know what he had. |
| D6 | "I heard a Guildmaster-level delver went down on a private job and hasn't surfaced. The Guild's not saying anything officially." | Partial | The delver went down on a job for House Vladaam, not the Guild. He's alive but imprisoned in a subterranean Vladaam facility. |
| D7 | "There's a waystation on Level 2 southeast that's been restocked with *extra* supplies — more than the Guild standard. Someone's planning a long trip and they staged supplies in advance." | True | A team funded by the Inverted Pyramid is planning to push past Level 4. The supplies are for a three-week expedition. |
| D8 | "The Pits of Insanity have been drifting. One of the old reliable routes through Level 1 now runs right past one that wasn't there six months ago. Three teams have taken damage from it." | Mostly True | The Entropy Sphere's activity has shifted slightly. The Guild's cartographers know but haven't updated the public maps yet. |

**Arc II+ additions:**

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| D9 | "Something's come up from a level no team's ever reached. The Guild knows. They're not posting it. That means whatever it is frightened them." | True | A creature from the Caverns of the Galchutt has breached upward through a collapsed section. The Guild is trying to assess it without causing a panic. |
| D10 | "I hear there's a faction buying up information about the Banewarrens — not the Inverted Pyramid. Someone new, and they're paying well. Nobody knows who the buyer is." | Mostly True | A chaos cult front organization is mapping the Banewarrens' outer seals. They're close to finding a weakness. |

---

### 2. Temple Priest

Priests know congregation matters, inter-church disputes, healing requests (which reveal what people are suffering), and theological politics. They hear confessions in spirit if not in name.

**When using:** Roll or choose a church — Church of Lothian, the Temple of Gaen (Goddess of Light), the grim Sisters of Death, or a lesser temple.

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| P1 | "We've had three families come in this week asking for blessing against nightmares. All three live in the same block of Midtown. The same dream — red eyes in the dark, watching them. It started the same night." | Mostly True | A demon bound in the cellar of a building in that block is projecting fear. It's been there for decades but something recently weakened its containment. |
| P2 | "The Church received a donation last month from an anonymous patron. A large one — ten thousand gold in a box, left at the door. The Arch-Prelate won't discuss who it was from. I've never seen him nervous before." | True | The donation came from House Vladaam as a bribe to look the other way on a specific undead-related matter in the Necropolis. |
| P3 | "One of the Forsaken was seen near the Temple District three nights ago. A citizen reported it. The Knights of the Pale responded but found nothing. The Forsaken are usually careful — if one was *seen*, they wanted to be seen." | Mostly True | The sighting was deliberate. The Forsaken was delivering a message to someone inside the Temple District who doesn't want it known they're in contact with the Fallen. |
| P4 | "The Church of Lothian and the Keepers of the Veil are arguing about who has jurisdiction over the eastern Necropolis wall. It's been going on for three months. There's something behind that wall they both want access to." | True | An ancient sealed crypt behind the wall contains a pre-Lothian artifact that both groups believe is theirs by right. It's actually neither — it predates both organizations by six centuries. |
| P5 | "We had a young woman come in last week — couldn't speak, couldn't write. Our healing confirmed it wasn't physical. Someone had placed a magical silence on her that wouldn't dispel. She'd been enslaved in the Dark Market." | True | She escaped. The Ennin slavers are looking for her. She knows something about a specific buyer that the Longfingers Guild would also like to know. |
| P6 | "I heard from a Lothian brother who tends the Necropolis that something has been disturbing the tombs in the Necropolis. Not random — specific families. Old families. Someone is researching a bloodline." | Mostly True | A House Vladaam agent is researching proof of a specific inheritance claim that would give the house legal title to a contested property — by demonstrating that all other heirs are dead. |
| P7 | "A paladin came to me for healing he didn't want on the official record. He'd been burned — from the inside, from chaos energy. He wouldn't say where he'd been. He looked like he'd been near a Pit of Insanity." | True | The paladin was investigating a chaos cult site beneath the Guildsman District. He found more than he expected and is now trying to decide whether to report it to the Knights of the Pale. |
| P8 | "The Church has received three separate reports this month of people hearing chanting beneath their homes. Different districts, different nights. The Arch-Prelate is treating it as separate incidents. I don't think they're separate." | Partial | Two of the three are unconnected cultist activity. The third is a different group entirely — a faction the Church has never encountered before. |

---

### 3. City Watch Guard

Guards know patrol incidents, internal Watch politics, criminal activity they've dealt with or been warned about, and neighborhood tensions. They don't know much about the Dungeon.

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| W1 | "We had orders last week not to enter a specific block in the Guildsman District after dark. No reason given — just 'do not respond to calls from that block until further notice.' Three days, then the order was lifted. Nobody will say what was there." | Mostly True | Commissar's Men were running a covert operation involving the Imperial Eyes. The block was being used for a surveillance handoff. |
| W2 | "The Balacazars have a new lieutenant running the Warrens district. Nobody we recognize. Young, well-dressed. Not a fighter. That's the worrying kind." | True | The new lieutenant is actually a mage on retainer from the Inverted Pyramid, placed by arrangement with the Balacazar family leadership to handle a specific operation. |
| W3 | "We got a complaint about a Grade 2 monster sighting in Midtown. Officially we logged it as a misidentification — just a large Grade 3. But the witness was a physician, not a drunk. If there's a Grade 2 loose in Midtown without a permit, someone's going to get killed." | Mostly True | The creature is a troll that escaped from a private holding facility owned by House Khatru. The house is quietly trying to recapture it before anyone connects it to them. |
| W4 | "There's a new tax on unlicensed spellcasting in public. The Commissar's pushed it through. The Inverted Pyramid is furious. I don't know who starts that war, but I know who finishes it, and it's not us." | True | The tax is a trial enforcement — nobody in the Watch actually wants to confront Pyramid mages. The law exists to give the Commissar leverage in a different negotiation with the Pyramid. |
| W5 | "One of our constables was bribed last month. He took the money, reported it to his captain, and they both agreed to take it again from the same source and see where it leads. I have no idea how that story ends." | Mostly True | The bribe came from a Balacazar front. The sting is ongoing but the Balacazars suspect something — they've gone quiet. |
| W6 | "The Sisterhood arrested someone in Midtown last week that they didn't process through the normal Watchhouse. Took them straight to the Priory. Official paperwork shows nothing. Someone connected is in that Priory right now." | True | The detained person is a minor noble from House Sadar caught in contact with a known chaos cult member. The Sisterhood is questioning them before deciding whether to hand them to the Commissar — or handle it themselves. |
| W7 | "We've been told to leave a particular alley off our patrol route in Oldtown. Every time we go near it, the sergeant finds something else for us to do. I walked past it on my own time — it smelled wrong. Not bad wrong. Magic wrong." | Mostly True | The alley contains a concealed access point to a Ghul's Labyrinth tunnel that the Inverted Pyramid is quietly using for materials transit. The Watch has been 'managed' diplomatically. |
| W8 | "The next time someone builds a new building in Midtown, they're going to break through into something. The surveyors keep finding voids under the foundations. The city engineers say it's normal settling. The engineers are lying." | True | Three separate Ghul's Labyrinth chambers run under a six-block area of Midtown. The city has known for years and has a standing policy of not publicizing it to avoid panic and property devaluation. |

---

### 4. Dock Worker

Dock workers know what comes off ships, which merchants are operating oddly, which captains pay well for no questions, and the physical comings and goings of the city.

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| K1 | "There's a ship that's come in three times in the last two months — the *Ardathos*, out of the south. Every time it comes in, the cargo master registers it as 'trade goods, mixed' and nobody opens the crates. Some of us have started calling her the Ghost Ship because she doesn't exist on the Harbor Master's ledger." | Mostly True | The ship is running contraband for the Balacazars — chaositech components sourced from the south, not currently on any banned list because the Commissar's office doesn't know chaositech well enough to describe it. |
| K2 | "The deep-water dock — the one furthest from the Harbor Master's office — has had armed men on it for a week. Not City Watch. Not any uniform I know. They're guarding something big they brought in on a flat barge." | True | House Shever has imported a large mechanical device — a prototype they don't want the Shuul to know about. The guards are Shever private security. |
| K3 | "Captain Urven off the *Mercies* swears she saw lights in the bay three nights running. Not ships — stationary. Under the water. She's a steady woman, not given to sea stories. She filed a report with the Harbor Master and was told to mind her cargo." | Mostly True | Sahuagin scouts are mapping the harbor's defenses in preparation for something. The Keepers of the Veil know and are monitoring, but consider it a manageable threat for now. |
| K4 | "We were told not to load a particular cargo container last week — it was already logged and scheduled, but at the last minute someone from the Commissar's office came down and had it held. Nobody opened it. It's sitting in the storage warehouse on Pier Three." | True | The container is flagged by Imperial Eyes as connected to a person of interest. It's been magically traced and they're waiting to see who comes to collect it. |
| K5 | "The fish market's been running short on supply for two weeks. The fishing boats aren't going out as far as usual. The captains won't say why, but they've all pulled their range in by about three miles." | Mostly True | Something large is moving through the bay at depth. Most captains think it's a whale or a large shark. Two have seen tentacles. The Keepers of the Veil are keeping watch. |
| K6 | "A man came to the Docks three days ago looking for passage out of Ptolus — wouldn't give his name, paid in gems, wanted to leave that same day. Captain took him on. Word came down this morning that the City Watch is looking for someone matching his description." | True | He's a witness to something connected to House Vladaam and is trying to get clear of the city before he can be silenced. He didn't make it — the ship has not yet cleared the harbor and the Watch has an eye on it. |

---

### 5. Noble's Servant

Noble servants know house politics, the genuine private affairs of powerful people, and the social maneuvering happening in the Nobles' Quarter. They gossip constantly among themselves.

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| N1 | "Lord Abanar has been meeting privately with someone from the Inverted Pyramid. Three times in the last month. Always at night, always unannounced to the household staff. My counterpart at the Abanar estate noticed because the kitchen was asked to prepare supper for two without registering the guest." | Mostly True | Abanar is negotiating access to a specific enchantment service that doesn't bear public scrutiny. The Pyramid mage is using this leverage to extract a political concession. |
| N2 | "House Vladaam has hired twice the usual number of staff this season. All of them young, healthy, with no family nearby. The official reason is a planned major reception. There's been no invitations sent for any reception." | True | The new 'staff' are being used in experiments. Some will not be seen again. This is business as usual for Vladaam, but the scale is larger than usual — they're preparing something. |
| N3 | "Lady Kath's youngest daughter has been seeing someone from the Guildsman District. Not a noble — not even close. The family doesn't know yet. If Lord Kath finds out, there's going to be a scene, and scenes in the Kath household tend to involve lawyers and sometimes blades." | True | The 'Guildsman District someone' is a young man of good character who happens to be a senior member of the Delver's Guild. This is actually a net positive for House Kath, but Lord Kath won't see it that way initially. |
| N4 | "I heard from someone in the Nagel household that Lord Nagel turned down a very large anonymous donation last week. That almost never happens — Lord Nagel turns down nothing. Whatever was attached to the money, he didn't want it." | Mostly True | The donation came with a request to provide sanctuary to a person under investigation. Lord Nagel recognized the name and knew accepting would create a political problem he couldn't afford. |
| N5 | "House Khatru has been moving money — quietly, in ways that don't appear on public ledgers. Quite a lot of it. Military families do this before a campaign. There's no campaign announced." | True | House Khatru is preparing for private military action against a competitor. They have not decided which competitor yet. |
| N6 | "Lord Vladaam's personal physician resigned last month and left the city immediately. Didn't give notice. I heard from a contact in the Vladaam household that he was replaced the same day, as though it was expected." | Mostly True | The physician discovered something in the course of his work that frightened him enough to run. The replacement physician is under a magical compulsion to stay and not ask questions. |

---

### 6. Merchant (South Market or North Market)

Merchants know trade flows, pricing anomalies (which reveal criminal activity or faction operations), which guilds are applying pressure, and who's buying what in unusual quantities.

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| M1 | "Someone's been buying up iron in quantity — not enough to flag a report, but I've talked to five suppliers and we're all seeing the same pattern. Smaller purchases, different buyers, but always the same grade and specification. Military-grade iron, custom bar stock." | Mostly True | A front organization for House Khatru is stockpiling materials for private armor production. They're not going through the Smiths' Guild to avoid the paperwork trail. |
| M2 | "The Shuul has opened a new supplier relationship with someone on the Docks. They're receiving regular shipments of a material I can't identify — my supplier described it as 'glass but heavier, and it hums.' He was told not to ask what it was." | Mostly True | It's processed chaositech components in a stable form. The Shuul is experimenting with incorporating chaos-derived materials into their technology, which is either brilliant or catastrophically dangerous. |
| M3 | "The Delver's Guild is buying magical light sources in bulk. Everburning torches, continual flame rods, sunrods — more than they normally stock at the Undercity Market. They're preparing for a long push somewhere dark." | True | The Guild is equipping an expedition to a deep Dungeon level. Specifically, they've found evidence of a large Dwarvenhearth sub-level and are mounting a serious expedition. |
| M4 | "A man came into my shop last week — well dressed, paid in Imperial gold, bought six months of preserved food. Asked me to hold it under a false name. I took the money. I have no idea what he's planning but it's either an expedition or someone who expects the city to stop working." | Partial | He's a delver planning a long solo expedition into the deep Dungeon. He's been turned down by every guild team and decided to go alone. He won't come back. |
| M5 | "The Alchemists are refusing to fill orders for a specific list of reagents for anyone connected to House Vladaam. Quietly — no official statement. But the word went out to all the licensed shops. Someone at the top of the guild made a decision." | True | House Vladaam used alchemical products in an incident that killed an alchemist's apprentice. The guild head knows and has taken informal action, pending a private resolution. |
| M6 | "There's a new shop opening in the South Market — nice fit-out, expensive inventory, owner nobody's seen before. I checked with the Merchants' Guild and the registration paperwork is perfectly in order. Too perfectly. Everything about them is correct in a way that real new merchants never are." | True | The shop is a Balacazar front, set up to launder specific categories of income. The owner is a mid-level family operative who is genuinely a decent shopkeeper — and entirely aware of what the business is really for. |

---

### 7. Warrens Resident

Warrens residents know street-level criminal activity, monster movements, gang territory, and the grinding realities of the city's most dangerous district. They have no access to above-ground politics.

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| V1 | "The Beggar King's territory on the east side shifted last week. New boundary. Two of his beggars who were on that corner didn't come back to their usual spots. Nobody's asking questions." | Mostly True | A new gang is moving into the Warrens from the Undercity. They're using the sewer connections to claim territory. The Beggar King knows who they are and is deciding whether to fight or negotiate. |
| V2 | "There's something in the sewer under Bucket Lane. Not ratmen — I've heard ratmen. This is different. Big. Patient. It's been there for three weeks and it hasn't done anything yet. That's the worrying part." | True | An otyugh has moved into an expanded sewer junction and is feeding on refuse. It hasn't attacked anyone yet because the feeding has been sufficient. If the refuse level drops, it'll start looking at residents. |
| V3 | "A healer set up in the Warrens last month. No charge, no questions, just healing. Everyone's suspicious because that's not how things work down here. Nobody's come to shut him down. He's either very well protected or very useful to someone." | Partial | He's a cleric of Navashtrom doing genuine charity work. He is also passing information to the Keepers of the Veil about chaos cult activity in the Warrens, which is the 'useful to someone' part — he's not hiding it, he just doesn't mention it. |
| V4 | "The goblins under the south block have gone quiet. Not 'moved away' quiet — 'holding still' quiet. They're afraid of something. I don't know what scares goblins that bad, but I know I don't want to find out." | True | A Forsaken cultist has moved through their territory and left a mark — a magical intimidation sigil that keeps creatures away from a specific passage he wants kept clear. The goblins are too smart to go near it. |
| V5 | "One of the Ornu-Nom orc families got their movement permit revoked last week. No explanation given. Family of six, been here twenty years, never a problem. If they can pull a permit that clean, they can pull anyone's." | Mostly True | The revocation was an error by a City Watch clerk, not policy. But a local Watch sergeant used it as leverage to extract a bribe before 'finding' the paperwork error. This is routine in the Warrens. |
| V6 | "I heard a woman screaming in the alley behind the old mill three nights ago. By the time I looked out, nothing. No blood, no marks. Just a single black feather on the ground." | True | Vai assassins were making a collection — someone who owed the Balacazars a debt that they decided to collect differently than with money. The feather is Vai calling-card etiquette. |

---

### 8. Undercity Market Vendor

Vendors at the Undercity Market know delver activity, black market activity (they don't always advertise this), Guild politics, and the comings and goings of the Dungeon-adjacent underground.

| # | Rumor Text | Truth | Hook |
|---|-----------|-------|------|
| U1 | "The map a team brought in last month — the one they sold to the Guild library — there's something wrong with it. The scale doesn't match known areas on two sides. Either the cartographer was bad or they edited something out before selling." | Mostly True | The team edited out one room — a chamber with a chaos relic they intend to retrieve themselves before anyone else can. The Guild's cartographer suspects but doesn't have proof. |
| U2 | "Travinor's got something going on. The Dark Market access has been restricted to known regulars only for the last two weeks. First time I've seen that. Something spooked him." | True | A Commissar's Eyes operative got close enough that Travinor's network flagged it. He's tightening access until he's satisfied the operative has been identified and managed. |
| U3 | "The Delver's Guild is quietly purchasing specific items from teams who come in — not the usual maps and loot. They're looking for anything marked with a specific symbol. They're not describing the symbol publicly, which means they don't want anyone else to know what it looks like." | Mostly True | The symbol is Ghul's personal mark from his era — appearing on it means the item is from Ghul's inner sanctum, not just the Labyrinth. The Guild has found evidence that someone is actively looting that level. |
| U4 | "I sold a scroll to a woman last week — didn't recognize her, which is unusual; I know most regulars. Paid above asking, didn't haggle. Came back two days later for a second one, same type. Charm person, both times. She's not building a collection." | True | She's a Vai operative who needs the scrolls as tools for an ongoing contract. She's not a threat to the vendor, but whoever she's targeting should be worried. |
| U5 | "Something broke through the eastern sewer junction last week. The Guild shored it up and posted a notice that it was 'structural settling.' The team that did the repair work hasn't been seen in the Market since. Guild hasn't listed them as missing." | Mostly True | Something from Ghul's Labyrinth pushed through the junction from below. The repair team encountered it and survived — but the Guild has them isolated and debriefing. The situation is being managed. |
| U6 | "A buyer came through last week with very specific needs: chaos-resistant materials, anything with anti-scrying properties, and maps of the deep Dungeon below Level 6. That's not a delver's shopping list. That's a mage getting ready for something specific." | True | She's an Inverted Pyramid senior mage preparing for an expedition to the Caverns of the Galchutt. She has authorization from the Pyramid's inner council. She's been planning this for a year. |

---

## Arc Scaling

| Arc | Rumor Character |
|-----|----------------|
| Arc I (1–5) | Street-level: petty crime, neighborhood tensions, guild politics, low-level monsters |
| Arc II (6–10) | Faction-level: houses moving against each other, cults becoming organized, dungeon threats at mid-level |
| Arc III (11–15) | City-level: chaos cult operations, Galchutt-adjacent events, Vladaam plots becoming visible |
| Arc IV–V (16+) | World-shaking: Forsaken openly active, Night of Dissolution elements visible, power structures fracturing |

Higher arcs: increase the proportion of `True` and `Mostly True` tags (the city is at war and accurate information matters more), escalate faction names toward the major chaos organizations, and reference the Entropy Sphere / Pits of Insanity / Caverns of the Galchutt.

---

## Truth Tag Guidelines

- **True** — The rumor is accurate. Playing it straight will reward the PCs.
- **Mostly True** — The core is accurate but a detail is wrong, exaggerated, or incomplete. Close enough to act on, but may mislead in specifics.
- **Partial** — The rumor has a true seed embedded in a false framing, or accurately describes a surface phenomenon while misidentifying the cause.
- **False** — The rumor is fabricated, misunderstood, or deliberately planted. Acting on it leads somewhere interesting but not where expected.

**Suggested distribution:** roughly 30% True / 35% Mostly True / 25% Partial / 10% False.

---

## Output Format

```
[RUMORS — Source: [TYPE] — Arc [I/II/III/IV]]

① "[Rumor text in-character]"
   TRUTH: [tag] | HOOK: [one sentence on what this connects to in play]

② ...
```

Each rumor should be 1–3 sentences, stated as the NPC would say it — present tense, first person or reported speech, no summary. The hook is GM-facing only.
