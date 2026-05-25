# Dungeon Level Reference — Implementation Spec

**File:** `runner/reference/dungeon-levels.html`
**Purpose:** At-table reference for known Dungeon levels — dominant factions, typical CR range, environment, features. Grows as the party explores. Trevor edits it directly.

---

## What This Is

The Dungeon beneath Ptolus is a vast, multi-level megadungeon. Ptolus canon describes many of its levels. This reference page gives Trevor an at-a-glance overview during play, and a place to track party discoveries. It is **not a generator** — it is a curated, editable reference.

---

## UI

Single-page reference. Two modes:
- **View Mode:** Clean card display of each level, sorted by level number
- **Edit Mode:** Toggle to edit any level's content directly in the browser (using `contenteditable` or a textarea overlay). Changes saved to localStorage.

**"Add Level" button:** Creates a blank level card for new discovery.
**"Export Notes" button:** Copies all level data as JSON to clipboard for pasting into a session file.

---

## Level Card Structure

Each card:
```
LEVEL [N] — [Name if known]
Depth: ~[X] ft below street
Environment: [tags from SRD vocabulary]
Typical CR: [range]
Dominant Faction(s): [who controls or inhabits]
Known Features: [bullet list — brief]
Connections: [levels above/below, other known access points]
Party Status: [ Unexplored | Passed Through | Partially Mapped | Cleared (partial) | Notes ]
Party Notes: [free text — updated after each session]
```

---

## Canonical Dungeon Structure (from Ptolus)

Ptolus does not number its dungeon areas by level in the way a traditional megadungeon does. Instead, the book describes distinct **zones** by type and depth. The Dungeon is not a single continuous structure — it is a collection of different types of underground space that connect in many places, often unexpectedly. *(Ptolus p. 414–416)*

The major zones from shallowest to deepest:

1. **The Sewers** — closest to the surface; connect quickly to other Dungeon areas
2. **The Undercity** — settled subterranean areas; businesses, organizations, relatively safe
3. **Ghul's Labyrinth** — vast artificial honeycomb of tunnels and rooms; the "default dungeon"
4. **The Banewarrens** — sealed vaults within and beneath the Spire; extremely dangerous
5. **The Caverns** — deep natural cave complexes; dark elves, dwarves, monsters
6. **Dwarvenhearth** — ancient dwarven city-fortress; mid-to-deep levels
7. **Caverns of the Galchutt** — deepest; Galchutt sleep here

The book notes: **"In effect, Ghul's Labyrinth is the default dungeon beneath Ptolus. Its passages and chambers honeycomb the entire Dungeon area. When in doubt, it is safe to assume they were once a part of the Labyrinth."** *(Ptolus p. 420)*

**Key structural fact:** Many underground areas connect to each other in ways the builders did not intend — a cellar breaks into a Labyrinth passage; a sewer tunnel punches into a natural cavern. Most connections were sealed, but many have been reopened. *(Ptolus p. 416)*

**Pits of Insanity** can appear almost anywhere below Ptolus, but occur with greater frequency near the Spire. They are zones of raw chaos that warp matter and creatures nearby. *(Ptolus p. 416–418)*

---

## Pre-Populated Zones (Canonical from Ptolus)

### Zone A — The Sewers
- **Depth:** Up to 20 feet below street level (the sewers go down about 20 feet underground at most)
- **Environment:** Engineered sewer (Prust-built, Grailwarden-assisted); sturdily cut stone with arched supports; well-maintained by the city's System Monitors
- **Layout:** Main tunnels ~16 ft. wide; central channel 10 ft. wide and 10 ft. deep; 3-ft. dry ledges on either side (often submerged after rain). Smaller tunnels (~10 ft. wide) and drainage conduits (~2.5 ft. diameter) also exist. Drain access via iron grates in city streets (Strength DC 22 to pry up; damaging grates is a crime).
- **Dominant Inhabitants:** Ratmen (ratlings, ratlords, ratbrutes), dire rats, criminal elements, System Monitor workers, rat hunters. Occasional chaos cultists with small shrines. Otyughs, oozes, and aquatic creatures also appear.
- **Factions Present:** Ratmen (organized nests), System Monitors (city workers), Church of Lothian (bounty on ratman tails — 3 gp per tail), Plagueborn chaos cult (small shrines in the sewers)
- **Notable Features:** Oldtown has a secondary, much older sewer system beneath its modern one — smaller, poorly built, partially collapsed, full of stagnant water. These old tunnels connect to some buildings via drains. Sewers beneath Dweomer Street in Oldtown contain weird magical effects and mutated creatures from alchemical runoff. Sewers beneath the Warrens district are perpetually clogged and overflow.
- **Connections:** City streets above (iron grates); Ghul's Labyrinth (many connections, some sealed); Undercity Market (Longfingers Guild HQ enters via sewers); exits via Cliffs of Lost Wishes, King's River Gorge, and riverside
- **Typical CR:** 1/3–3 (ratmen nests); occasional higher threats in special areas
- **Random Encounter Table:** See Ptolus p. 441 (d% table — 65% no encounter; ratmen most common threat; also bandits, wererats, oozes, chokers, insects)
*(Ptolus p. 439–446)*

---

### Zone B — The Undercity
- **Depth:** Near-surface; described as a "settled" zone that can be quite deep in places
- **Environment:** Mix of carved chambers, repurposed old construction, and natural rock; lit by torches, lanterns, and everburning torches. "Relatively clean" compared to the Dungeon proper — but still damp, grimy, cold, and dark.
- **Description:** The Undercity is not a discrete location with clear borders. It is the collection of all underground areas that most closely resemble aboveground city life — businesses operate, people live here. Accessed from the surface via public staircases (e.g., wide staircase in Delver's Square in Midtown) and known building access points.
- **Key Locations:**
  - **Undercity Market** — Delver's Guild-run market catering exclusively to adventurers and delvers; former lair of Kagrisos the Ghost-Lich; contains Delver's Guild office, scouts/guides/porters, potions shop, alchemist, map-making supplies, knife seller, leather goods, iron rations, everburning torches. Originally cleared and secured by the Guild. Imperial tax assayer's table now present (10% salvage tax).
  - **Dark Market** — Secret shadow market accessed via a secret door (Search DC 25) in Scouts, Guides, and Porters; sells poisons, slaves, drugs, illegal magic; run by Travinor. *(Ptolus p. 427)*
  - **Longfingers Guild Headquarters** — Sprawling underground complex below Midtown; headquarters of the Longfingers thieves' guild; magically shielded against divination; extensively trapped; accessed from sewers via bookshop on Birch Street and other concealed entrances; connects to Ghul's Labyrinth via secret passages. *(Ptolus p. 429–435)*
  - **The Prison ("The Pit")** — Far below the Guildsman District; accessible only by boat through a cave in the Cliffs of Lost Wishes; harbors side passages into Ghul's Labyrinth; tribes of goblins (led by bugbears, armed with ancient chaositech) lurk in surrounding passages and avoid the Prison itself. Dark elves in nearby passages seek a way into the Banewarrens. *(Ptolus p. 436–438)*
  - **Mirror Maze** — Below Oldtown; created by Kagrisos the Ghost-Lich; made entirely of self-renewing mirrored steel; doorway to three major passages of Ghul's Labyrinth. *(Ptolus p. 436)*
  - **Chamber of Longing** — Near Undercity Market; mysterious room with a giant stone claw statue; frequent meeting place for delvers. *(Ptolus p. 427)*
  - **Fortress of the Redeemed** — Below the Guildsman District; Brotherhood of Redemption headquarters; holds intelligent creatures (trolls, ogres, nagas, doppelgangers) for magical/psychological redemption. *(Ptolus p. 421)*
  - **Halls of Cordaris** — Below the North Market; ancient complex built into Ghul's Labyrinth by the Order of the Legacy ~500 years ago. *(Ptolus p. 421)*
  - **Slave City** — A fortified refuge for escaped slaves led by Moondros; location well-guarded from slavers. *(Ptolus p. 422)*
  - **Ravenstroke** — Below Rivergate; former lab of elf wizard Aelian Fardream; 4-level complex now occupied by malevolent skulks serving a mad clone called the Shadow Eyes. *(Ptolus p. 422)*
- **Dominant Inhabitants:** Delvers, merchants, Guild members, thieves, criminals, escaped slaves, various monstrous races who have found their niche
- **Factions Present:** Delver's Guild, Longfingers Guild, Brotherhood of Redemption, Order of the Legacy (Halls of Cordaris), Ennin slavers (Dark Market), Commissariat (tax assayer)
- **Connections:** City streets above (staircases, building access); Sewers (many points); Ghul's Labyrinth (numerous); Prison connects to Cliffs of Lost Wishes
- **Typical CR:** 1–6 in market/settled areas; 6–10 in Longfingers HQ and Prison approaches; higher in specific keyed encounters
*(Ptolus p. 423–438)*

---

### Zone C — Ghul's Labyrinth
- **Depth:** Variable — winds through multiple layers beneath Ptolus
- **Environment:** Artificial dungeon (constructed by Ghul's servants); passages and rooms with doors; the default dungeon environment when nothing else is specified
- **History:** Built by Ghul the Skull-King and his armies as barracks, storehouses, and laboratories — used to stage the assault on Dwarvenhearth. Many rooms were magical laboratories and festering pits where Ghul created monsters. Ancient Sorn-Ulth orc traps are still active throughout.
- **Dominant Inhabitants:** Creatures that can cope with doors (open, destroy, or bypass them); descendants of Ghul's created monsters; intelligent monsters using the passages for lairs. Many areas have been repurposed by newer inhabitants.
- **Factions Present:** No single controlling faction; various criminal groups, chaos cults, independent monsters, and the Longfingers Guild (portions near their HQ). Dark elves occasionally pass through. Shilukar the dark elf has claimed a section as his chaositech laboratory. *(Ptolus p. 420)*
- **Notable Features:** Connects to the natural caverns (many points), to Dwarvenhearth entrances, to the edges of the Banewarrens, to crypts, cellars, and sewers throughout the city. Waystations dot the Labyrinth (restocked weekly by Delver's Guild). Delver's Guild maps most of the system but not the secret areas. Pits of Insanity appear throughout.
- **Connections:** Sewers (many); Undercity (many); Banewarrens (edges); Caverns (many, via natural passages); Dwarvenhearth (Grand Entrance and other points)
- **Typical CR:** 2–8 (variable; deeper and more remote sections are higher)
*(Ptolus p. 418–422)*

---

### Zone D — The Banewarrens
- **Depth:** Below and within the Spire; the Baneheart occupies most of the Spire's interior in a 3,000-foot shaft
- **Environment:** Constructed catacombs; sealed vaults; magically warded and compartmentalized
- **History:** Built by Danar Rotansin (the Dread One) to store evil "banes" he collected from the world. The Baneheart (Tremoc Korin) was thrust upward by a geological upheaval, forming the Spire. The Outer Vaults ring what is now the Spire; the Inner Vaults lie within their perimeter; the worst banes are in the Baneheart at the Spire's top.
- **Dominant Inhabitants:** Powerful guardians (the silver dragon Saggarintys is imprisoned here); corrupted former guardians including Dark Averon and the Malificite (a corrupted planetar). Anything that has breached the seals may lurk within.
- **Factions Present:** The Banewarrens themselves are not faction-controlled; House Vladaam possesses the Banewarrens key (made from the Dread One's own hand) without understanding its significance. Dark elves in the Prison's surrounding passages seek entry.
- **Notable Features:** Compartmentalized with magical warding generators and sealed doors. Only the Banewarrens key (currently in House Vladaam's vaults) can open all sealed doors. Connections to Ghul's Labyrinth exist at the edges. A full adventure arc is described in *The Banewarrens* (separate product).
- **Connections:** Ghul's Labyrinth (edges); Spire interior (ascending); possibly sewers and Prison area passages
- **Typical CR:** 8–15+ (this is an arc-level destination; extreme danger)
*(Ptolus p. 419–420)*

---

### Zone E — The Caverns (Giant's Staircase and Below)
- **Depth:** Far deeper than the Labyrinth, Undercity, and sewers; the deepest accessible levels before the Galchutt
- **Environment:** Natural cave complexes; uneven floors and ceilings; Balance checks (DC 15) often required; subterranean rivers flow toward the sea
- **Access:** The **Giant's Staircase** is the primary entry — a vast cavern below Oldtown with huge descending terraces leading to the Eternity Cave (Erdek Ard). The most common surface connection runs from the cellars below the Clock Tower in Oldtown. Also accessible from many points in Ghul's Labyrinth.
- **Major Sub-Locations:**

  **Giant's Staircase / Eternity Cave (Erdek Ard):** Massive cavern over 3,000 ft. wide and almost a mile long. The **Umbral Lake** fills the southern half — home to aboleths (descendants of those from Jabel Shammar), skum, dragon turtles, water nagas, chuuls, and locathahs. The island of Tridam in the lake holds the greatest Pactlords of the Quaan stronghold (other than the Quaan itself). The dwarven "city" of **Kaled Del** stands here — the community of Stonelost dwarves keeping vigil over Dwarvenhearth. Passages lead west to the Serpent Caves and deep dark elf realms; northeast to Dwarvenhearth's Grand Entrance. *(Ptolus p. 448–450)*

  **Serpent Caves:** Mazelike caverns inhabited by 100+ evil nagas (Children of Mrathrach) who worship Father Claw (the Serpentine Lord, a Vested of the Galchutt). Avoided by dwarves and dark elves. A passage from the lowest level of Mahdoth's Asylum in South Market connects to these caves. *(Ptolus p. 451–452)*

  **Locathah Cavern (Glaugsgulgus):** Large cave with shrines to the Sea Mother, God of the Open Sea, and Lord of Caverns. *(Ptolus p. 452)*

  **Vaults of the Rhodintor:** Sealed caverns where rhodintor (earthbound demons created by the Galchutt) slept for millennia. Now they are awakening. These vaults are the greatest accumulation of chaositech in the world. Dozens still sleep; a few score are active — spreading chaositech and uniting chaos cults. *(Ptolus p. 453)*

  **Kastralathakasal (Caverns of the Galchutt):** Stronghold of the zaug — alien entities older than the world itself, former servants of the Galchutt — built of alien metals and living organic components. Below this, the **Throne of Darkness** (fortress of the ancient Galchutt servant Shallamoth Kindred) is now haunted by ghosts, spectres, wraiths, chaos beasts, gibbering mouthers, plasms, doppelgangers, oozes, and Elder Brood guardians. Contains the **Dreaming Stone** and a **Tourbillion** teleportation chamber. *(Ptolus p. 453–454)*

  **Dark Elf Caverns:** Below the other caverns. Contains:
  - **Ul-Drakkan** (Citadel of the Lizard) — House Vrama's fortress; built inside three natural stone columns joined by bridges; ~150 residents; ruled by Alevolenz (female dark elf cleric12); she seeks chaositech (called *avalashax*) to unite the dark elf houses for war against surface elves *(Ptolus p. 456)*
  - **Nluguran** — Large dark elf city; degenerate commoner population; labyrinthine passages; temple-palace of Ul-Rassadin at its heart *(Ptolus p. 457)*
  - **Ul-Sinistar** — Second major dark elf fortress, flanking Nluguran *(Ptolus p. 456)*
  - **Dreta Phantas** — The Dreaming City; an Elder Elf city stolen by the dark elves using Galchutt magic; now rests in a cavern 2,600 ft. east-to-west and ~850 ft. north-to-south, below Ul-Sinistar; originally built for ~8,000 Solarr and Lunas elves; requires recovery of the Dreaming Stone and cask of frozen dreams to restore *(Ptolus p. 457)*

- **Dominant Inhabitants:** Stonelost dwarves (Kaled Del), aboleths and skum (Umbral Lake), evil nagas (Serpent Caves), locathahs, rhodintor, zaug, dark elves (Houses Vrama and others), Elder Brood
- **Factions Present:** Stonelost dwarves, Pactlords of the Quaan (Tridam island), Children of Mrathrach (nagas), rhodintor (serving the Galchutt), zaug, House Vrama (dark elves), other dark elf houses
- **Connections:** Giant's Staircase to surface (via Clock Tower cellars, Oldtown); Ghul's Labyrinth (many); Dwarvenhearth (Grand Entrance); Eternity Cave serves as the gateway hub
- **Typical CR:** 5–15+ depending on depth; Serpent Caves and dark elf fortresses 8–15; Vaults of Rhodintor and Caverns of Galchutt 15+
*(Ptolus p. 447–458)*

---

### Zone F — Dwarvenhearth
- **Depth:** Accessed from the Eternity Cave via the Grand Entrance, below South Market; mid-to-deep tier
- **Environment:** Constructed dwarven city; vast multi-level megadungeon; thousands of chambers from small 20×20 storehouses to the Cathedral Cavern (1,000+ feet long); multiple vertical levels throughout; stone worked by dwarves has hardness 10 (not 8)
- **History:** Built ~3,000 years ago by Stonemight dwarves (confederation of four clans: Boar, Flame, Silver Thorn, Stoneblood/Mindforge). Occupied for centuries. Sacked by Ghul's armies in the "Ghulwar" (~330 BE); surviving dwarves evacuated and sealed the city. The Stonelost dwarves consider themselves unworthy of it until redeemed.
- **Scale:** Covers an area larger than most surface districts of Ptolus; city originally housed 10,000 Stonemight dwarves
- **Current Inhabitants:**
  - **Soulless** — Dwarven volunteers who imprisoned their own souls in runes to remain as guardians; soulless but not undead (immune to mind-affecting, poison, sleep, paralysis, etc.); CR +1 vs. normal dwarf; turn to dust when slain *(Ptolus p. 471)*
  - **Erebaccus ("the Unhinged")** — Insane dwarven remnants and descendants of those who couldn't escape; driven mad by Pits of Insanity or just trapped; nomadic bands pillaging storehouses *(Ptolus p. 468)*
  - **Daragin ("the Forsworn")** — Evil dwarves who stayed behind; organized bands; set traps and ambushes; code prohibits killing each other; many desperately want to leave *(Ptolus p. 465–466)*
  - **Dark elves** — Led by Zachean (dark elf vampire sorcerer, CR 13) hunting for the Tomb of King Stardelve *(Ptolus p. 466, 478)*
  - **Hiistiches** — Bizarre insect swarms that can coalesce into shapes; haunt the Cathedral Cavern *(Ptolus p. 470)*
  - **Bulettes** — Two have burrowed in recently; now wandering *(Ptolus p. 478)*
  - **Various constructs, golems, trapped creatures**
- **Key Locations:**
  - **Grand Entrance** — Near Eternity Cave; defended by Gear Gate (adamantine-reinforced steel, hardness 13, 1,200 hp; 10 lock mechanisms, all must succeed or reset; immune to spells 4th level and below), Inverted Tower, Inner Gate, Slaughterhouse *(Ptolus p. 477)*
  - **Outer Tombs** — Dwarven necropolis east of Grand Entrance; treasure-laden but well-trapped *(Ptolus p. 478)*
  - **Tomb of King Stardelve** — Contains the **Platinum Cestus** (artifact gauntlet); multiple false tombs with lethal traps; real tomb sealed with lead-filled seams *(Ptolus p. 478–481)*
  - **Cathedral Cavern** — Largest natural space incorporated into the city; 1,000+ feet long; temples to all dwarven gods (including the Brothers — Mocharum and Morachon); Daragin and hiistiches frequent this area; contains a war altar (self-propelled wheeled platform; Price 80,000 gp) *(Ptolus p. 481–482)*
  - **Plazas** — Two levels (main floor + gallery); thick rectangular columns; most shops looted by Erebaccus or Daragin *(Ptolus p. 476)*
  - **Bastions** — Defensible positions throughout; iron drawbridges over 20-ft. ditches; heavy iron gates; arrow loops; murder holes; cannons; Soulless guardians *(Ptolus p. 473–475)*
  - **Forges and Workshops** — Throughout the city; rarely guarded; artisan ghosts/wraiths possible *(Ptolus p. 475)*
  - **Mines** — Winding passages with ore cart tracks still in place; still contain valuable veins of silver, gold, and minerals; never trapped but potentially unstable *(Ptolus p. 475)*
  - **Night King's Palace** — Black décor; haunted with shadows, wraiths, spectres, ghosts; Soulless and stone golems; Kaled Menar tower (Mindforge headquarters, puzzle-locked) *(Ptolus p. 483)*
  - **Day King's Palace** — 5 levels; hundreds of rooms; columned great halls; arena; opera house; mithral-and-steel vaults protected by traps, Soulless, constructs, and triggered summonings *(Ptolus p. 483)*
- **Treasure Types:** Masterwork items throughout; mithral and adamantine items; dwarven coins (rectangular, bear hammers/anvils/axes — spending them in Ptolus attracts attention and angers Stonelost dwarves); skarls (wand-equivalent brass-knuckle magic items created by the Flame Clan); firearms including exotic models (hydra rifle, chimera rifle, hellsbreath gun); clockwork mechanisms; various magic items *(Ptolus p. 472)*
- **Factions Present:** Soulless (guardians), Erebaccus, Daragin, House Vrama dark elves (Zachean's party), Stonelost dwarves (Kaled Del — exterior watch), Pactlords of the Quaan (distant interest)
- **Connections:** Grand Entrance near Eternity Cave (below South Market); many connections to Ghul's Labyrinth; some connections to natural Caverns; connections to Banewarrens edges (rumored hidden tunnels through hiistich-infested passages)
- **Typical CR:** 5–8 near Grand Entrance; 8–13 mid-level (Cathedral Cavern, Tombs); 13–18 for Day King's/Night King's vaults and deepest sealed areas
*(Ptolus p. 460–483)*

---

## Dungeon Cross-Reference: Canonical Access Points to the Surface

| Surface Location | Underground Connection |
|-----------------|----------------------|
| Delver's Square, Midtown | Wide staircase to Undercity Market |
| Clock Tower cellars, Oldtown | Giant's Staircase / Eternity Cave |
| Cliffs of Lost Wishes (by boat) | Prison entrance |
| Guildsman District (converted house) | Fortress of the Redeemed |
| North Market (below) | Halls of Cordaris |
| Midtown (various) | Longfingers Guild HQ via sewers |
| Mahdoth's Asylum, South Market | Passage to Serpent Caves |
| Below South Market | Dwarvenhearth Grand Entrance |
| Oldtown buildings | Old sewer system (pre-modern) |
| Oldtown, below Clock Tower | Passage through "Buried City" to Giant's Staircase |

*(Ptolus p. 414–416, 421–426, 436–438, 447–448, 477)*

---

## Dungeon Faction Summary

| Faction | Primary Zone | Notes |
|---------|-------------|-------|
| Ratmen (ratlings/ratlords/ratbrutes) | Sewers | Organized nests; worship Abhoth via Rat God proxy |
| System Monitors / rat hunters | Sewers | City workers; bounty hunters |
| Delver's Guild | Undercity Market | Maintain waystations in Labyrinth; map the Dungeon |
| Longfingers Guild | Undercity / Labyrinth | Thieves' HQ underground |
| Brotherhood of Redemption | Undercity / Labyrinth | Redeem monsters |
| Chaos Cults (various) | Sewers, Labyrinth | Plagueborn have sewer shrines |
| House Vladaam | Surface + Banewarrens (key) | Unknowingly hold the Banewarrens key |
| Pactlords of the Quaan | Umbral Lake (Tridam island) | Aboleths and locathahs as allies |
| Children of Mrathrach | Serpent Caves | 100+ evil nagas; worship Father Claw |
| Rhodintor | Vaults of Rhodintor | Galchutt's awakening servants; spread chaositech |
| Zaug | Kastralathakasal | Ancient pre-world entities; Galchutt loyalists |
| Stonelost dwarves (Kaled Del) | Eternity Cave | Guard Dwarvenhearth entrance; self-exiled |
| House Vrama (dark elves) | Ul-Drakkan / Dwarvenhearth | Led by Alevolenz; seek chaositech; hostile to surface elves |
| Soulless | Dwarvenhearth | Dwarven soul-guardians; attack all intruders |
| Erebaccus | Dwarvenhearth | Insane dwarf remnants; nomadic |
| Daragin | Dwarvenhearth | Evil dwarves; want to escape |

*(Ptolus p. 414–483)*

---

## Environment Tag Reference (from SRD)

| Tag | Meaning |
|-----|---------|
| `ptolus_dungeon` | Generic Dungeon environment |
| `ptolus_undercity` | Sewers, sub-streets |
| `sewer` | Active sewer system |
| `underground` | Caves, natural passages |
| `dungeon` | Constructed dungeon |
| `planar_lower` | Planar bleed (deep levels only) |

---

## Party Status Tracking

| Status | Meaning |
|--------|---------|
| Unexplored | Party has not been here |
| Passed Through | In and out, minimal interaction |
| Partially Mapped | Some rooms keyed, not complete |
| Cleared (partial) | Major threats neutralized, but level not done |
| Active | Party currently operating here |
| Avoided | Party knows about it and is avoiding it |

---

## Notes

- This is the one runner file Trevor is expected to edit between sessions.
- Use localStorage to persist edits between sessions.
- "Export Notes" should produce a JSON string that can be pasted into a `campaign/sessions/` file for the record.
- Do not invent Dungeon content — always verify against Ptolus core book first.
- The Banewarrens approach zone (deep levels) should be locked/greyed until Arc III+ to avoid spoiling the scope of the megadungeon prematurely.
