# Name Generator — Implementation Spec

**File:** `runner/names/index.html`
**Purpose:** Generate culture-appropriate names for NPCs, places, or factions on demand. Fast — used mid-session.

---

## Data Source

Inline name lists (Markov chain or syllable-assembly). No external JSON needed for v1. Optionally mirror into `runner/data/names.js` if lists get large.

---

## UI

**Controls (left column):**
- Culture (dropdown):
  - Imperial (Ptolus standard — Romanesque)
  - Shoaln (Ptolus elven — angular, minimal)
  - Dwarven (Ptolus — Germanic/Norse)
  - Halfling (Ptolus — soft, rustic)
  - Gnome (Ptolus — compound words)
  - Drow (Ptolus — harsh, sibilant)
  - Forgotten Realms (generic Faerûnian — mixed)
  - Shou (FR eastern — short syllables, tonal feel)
  - Random
- Gender (dropdown): Male / Female / Neutral / Random
- Count (1 / 3 / 5 / 10)
- Include surname (toggle)
- "Generate Names" button
- Seed control

**Output:**
```
[IMPERIAL — Female — 5 names]
Seraia Voss
Mira Callante
Thessaly Orvain
Junia Marcen
Vella Drath
```

---

## Name Construction Method

Use **syllable-assembly** for all cultures. Each culture has:
- `prefixes[]` — opening syllables
- `middles[]` — optional middle syllables (used 40% of the time)
- `suffixes[]` — closing syllables
- `surnames[]` — pre-built or assembled surname list

For each name: pick `prefix + (maybe middle) + suffix`. Ensure no two adjacent same-syllable results.

Surnames: use a separate shorter table of pre-built options per culture. Syllable assembly for surnames too if the list runs short.

---

## Culture Reference

### Imperial (Ptolus default)
Romanesque. Latin feel. Dignified but not stuffy.

**Male prefixes:** Mar, Kal, Vor, Jev, Ser, Arc, Thal, Cas, Del, Orin, Luc
**Male suffixes:** -an, -us, -ic, -en, -avar, -ian, -os, -eth
**Female prefixes:** Mir, Ser, Jul, Vel, Jev, Tess, Lyss, Aur, Cal
**Female suffixes:** -a, -ia, -aine, -ella, -ine, -issa, -aia
**Surnames:** Voss, Thann, Marcen, Orvain, Callante, Drath, Cassan, Rhyl, Forren, Thessaly, Kerris, Delvain

### Shoaln (Ptolus Elves)
Minimal syllables, soft consonants. Names often 2 syllables total.

**Prefixes:** Ae, Syl, Eli, Cael, Aer, Oss, Tael, Mir, Fen
**Suffixes:** -iss, -an, -oss, -in, -ath, -iel, -ynn, -ael
**Surnames:** nature-based, often compound: Silverleaf, Dawnmantle, Greywater — or untranslated: Caelossyn, Fenriath

### Dwarven (Ptolus)
Hard consonants, short vowels, Norse/Germanic feel.

**Male prefixes:** Thor, Brak, Gund, Rul, Keld, Durn, Var, Morl
**Male suffixes:** -in, -an, -ok, -ur, -im, -ek, -gar
**Female prefixes:** Brun, Helga, Sig, Marg, Eld, Thora
**Female suffixes:** -a, -in, -dis, -run, -hild
**Clan surnames:** Ironhelm, Stonemantle, Copperforge, Gundrak, Brakken, Morlsson

### Halfling
Soft, rustic, English village feel. Given names often plant or nature-based.

**Prefixes:** Meri, Pip, Ros, Will, Tob, Fen, Del, Bur
**Suffixes:** -wise, -foot, -leaf, -wood, -wick, -field, -more, -brook, -well
**Full name feel:** Meri Leafwick, Tobias Fenmore, Rosie Copperbrook

### Gnome
Compound or hyphenated. Often describe something precise and odd.

**Format:** [adjective or noun] + [noun or action] — e.g., Copperspring Tinkersalt, Wobble-Fiz Cranksworth

### Drow (Ptolus)
House-based. House name is prefix (noble) or suffix (common). Harsh sibilants, double consonants.

**Given (male):** Szordrin, Vrinn, Kael'eth, Malaggar, Driszzt, Ysvith
**Given (female):** Iymril, Zress, Talice, Vharelle, Shri, Phyrra
**House names:** Kilvis, Tharoth, Ssuviri, Mezzant, Dro'xan
**Format:** [Given] [House] (noble) or [Given] of [district/place] (common)

### Forgotten Realms (generic Faerûnian)
Mixed — Latinate, Slavic, Celtic, vaguely medieval. Pull from Ptolus Imperial list + add:

**Extra prefixes:** Aeg, Brom, Cor, Dag, Fal, Gar, Hen, Ilm, Jas, Ker
**Extra suffixes:** -ric, -win, -wyn, -burn, -wick, -ton, -ford

### Shou (FR Eastern)
Short, tonal. Family name first.

**Family names:** Chen, Han, Kuo, Lung, Sung, Tang, Wu, Zhen, Mei, Li
**Given (male):** Bo, Jin, Lei, Peng, Shan, Wei, Xian, Yong
**Given (female):** Fen, Hui, Jing, Lan, Mei, Nuo, Ruo, Ting

---

## Future

Add `runner/data/names.js` when lists get large enough that inlining in HTML is unwieldy. Same format as `shared/data.js`.
