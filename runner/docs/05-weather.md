# Weather & Ambience Generator — Implementation Spec

**File:** `runner/weather/index.html`
**Purpose:** Roll weather and city ambience for a session or scene. Output is read-aloud-ready flavor, not a weather simulation.

---

## Data Source

Inline JS tables only. No external JSON.

---

## UI

**Controls (left column):**
- Location (dropdown):
  - Ptolus City (streets, markets, districts)
  - The Docks
  - The Necropolis
  - The Dungeon (underground — weather = air quality, sounds, moisture)
  - Wilderness (Faerûn coast)
- Season (dropdown): Spring / Summer / Autumn / Winter
- Time of Day (dropdown): Dawn / Morning / Midday / Afternoon / Dusk / Evening / Night / Deep Night
- "Roll Weather & Ambience" button
- "Ambience Only" button (skips weather, just rolls sounds + details)
- Seed control

**Output:**
```
[PTOLUS CITY — Autumn — Night]

WEATHER: Heavy overcast, no rain yet. Wind from the sea, strong enough to make cloaks snap.
  Visibility: 60 ft in open areas (torchlight diffuses in the mist)
  Mechanical: ranged attacks –2 (wind), Listen checks +2 (wind masks movement)

AMBIENCE:
  Smell: salt air, coal smoke, something burning nearby
  Sound: distant bells from the Commissariat tower, a dog barking, wagon wheels on cobblestone
  Detail: A drunk leaning against a wall watches you pass without moving. A window shutter bangs open-closed-open in the wind.
  Crowd: Sparse — late-night foot traffic, a few cloaked figures moving quickly

MOOD: Cold, tense, observed. The city doesn't sleep, it just watches.
```

---

## Tables

### Weather by Season + Location

Base weather roll (d10):

| Roll | Spring | Summer | Autumn | Winter |
|------|--------|--------|--------|--------|
| 1–2 | Clear, warm | Clear, hot | Clear, cold | Clear, bitter cold |
| 3–4 | Partly cloudy | Partly cloudy | Overcast | Overcast, grey |
| 5–6 | Light rain | Afternoon storm | Heavy overcast | Sleet / freezing rain |
| 7–8 | Steady rain | Humid, oppressive | Rain | Light snow |
| 9 | Wind, no rain | Thunderstorm | Wind + rain | Heavy snow |
| 10 | Fog (thick) | Heat haze | Thick fog | Blizzard |

Modify for location:
- **Necropolis:** Always add "unnatural stillness" regardless of weather. Wind feels wrong.
- **Docks:** Sea weather — add 1d2 to roll in Spring/Autumn. Smell is always saltwater + fish.
- **Dungeon:** Replace weather with: air quality (stale/flowing/humid/hot/cold), moisture (dry/damp/wet), sounds (dripping/silent/echoing/wind-through-cracks).

### Wind (roll when relevant)
Calm / light breeze / strong breeze (cloaks snap) / strong wind (–2 ranged, 1d6 cold per hour unprotected) / gale (can't shoot ranged, flying DC 15)

### Visibility modifier
Clear: normal / overcast: normal (no sun glare) / rain: half in open / fog: 30 ft max / blizzard: 10 ft max

### Mechanical Effects (show only what's relevant)
- Wind strong+: ranged –2, Perception –4 (hearing)
- Rain: Perception –4 (sight, hearing), fire spells –2 CL (not in 3.5 RAW but reasonable houserule — note it)
- Fog: Concealment (20%), Perception –6 sight
- Snow on ground: Track DC –4 (easier), Move 3/4 speed in deep snow

---

### Ambience Tables

**Smells (Ptolus City):**
- coal smoke / rain on stone / roasting meat (nearby inn) / salt from the harbor / garbage / incense (temple district) / blood (don't explain) / industrial smoke / horse manure / fresh bread / fish

**Sounds (by time of day):**
- Night: distant bells / a single voice, singing / footsteps echoing / nothing / a door slamming / something skittering in an alley / a scream (far away, cut short)
- Day: market noise / cart wheels / arguing / a herald's announcement / children / hammering / bells / crowds

**Crowd density:**
- Deep night: empty / 1d4 figures in view
- Night: sparse / groups of 2–4 moving quickly
- Dawn/Dusk: moderate, purposeful
- Day: busy; specific district flavor

**Details (Ptolus-specific):**
- A Commissariat patrol (1d4 guards + 1 officer) turns the corner ahead
- A delver team — identifiable by their packs and weapons — moving toward the Dungeon entrance
- A poster on the wall: wanted notice, guild announcement, or city proclamation
- A Grade 3 monster visible at a distance — being escorted or moving alone
- A street shrine to a Ptolus deity, recently burned
- Someone watching from a window above — gone when you look again

**Mood line:** One sentence. Cold/tense/oppressive/festive/eerie/electric/exhausted/dangerous/ordinary. This is the thing Trevor reads aloud last.

---

## Dungeon Ambience (when Location = The Dungeon)

Replace weather section:

```
AIR: Stale and warm. No airflow. The torch burns straight up.
MOISTURE: Damp — walls weep in this section. Stone is dark.
SOUND: Distant dripping. Something large moved, maybe 200 ft away, 3 minutes ago. Silence now.
SMELL: Old stone, rot, something metallic.
LIGHT: Torch radius normal. No ambient.
```

Tables:
- Air: stale/flowing/humid/hot (volcanic)/cold (deep water nearby)/chemical (alchemical outgassing)
- Sound: dripping/silence/echoing steps (not yours)/wind through cracks/distant rhythmic sound (machinery?)/nothing
- Smell: old stone / rot / blood / alchemical / mineral / salt / nothing / something that doesn't have a name
