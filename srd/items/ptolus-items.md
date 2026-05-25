# Ptolus-Specific Magic Items

Items unique to or flavorful for the Ptolus setting. Source: *Ptolus, City by the Spire* (see page citations).

This file is a placeholder for setting-specific gear we add as the campaign needs it. Items in here generally follow the standard schema (see `magic-items.json`) but include a `setting_notes` field explaining their Ptolus flavor.

## Item categories particular to Ptolus

The core book details several flavor categories of magic item. Add new entries to `magic-items.json` and tag them with the appropriate tag so the runner can include or exclude them by loot table.

- **Mrathrach-style items** — items associated with the Mrathrach Machine and lost Ghul lore. Often have unusual or alien aesthetics; tag as `mrathrach`. *(Ptolus pp. 558–559, 622+)*
- **Imperial relics** — items dating from the Empire of Tarsis, often etched with the Imperial Eye. Tag as `imperial-relic`. *(Ptolus chapter 4)*
- **Church of Lothian sanctified items** — divine items blessed by the Church. Tag as `lothian-blessed`. *(Ptolus pp. 73–80)*
- **Forge gear** — items from the dwarven smiths of Grailwarden or Stonelost stoneworkers; tag as `dwarven-forge`. *(Ptolus pp. 49, 200+)*
- **Chaos-cult contraband** — twisted, often risky items associated with the Cults of Chaos. Tag as `chaos-cult`. Players should think twice about attuning. *(Ptolus pp. 130+, Night of Dissolution)*

## Notes when adding items

When adding a Ptolus item to `magic-items.json`:
1. Cite the Ptolus page in `source`.
2. Add a `setting_notes` field with the flavor blurb that goes on the player handout.
3. Tag with one or more of the categories above so the loot generator can sort by flavor when desired.

Example entry to add later:
```json
{
  "name": "Ring of the Imperial Eye",
  "category": "Ring",
  "tier": "medium",
  "subtier": "lesser",
  "price_gp": 6000,
  "body_slot": "ring",
  "caster_level": 7,
  "aura": "moderate divination",
  "description": "+5 competence bonus on Sense Motive; 1/day, true seeing for 1 minute.",
  "setting_notes": "Sigil of the lost Empire of Tarsis. Worn by Imperial inquisitors. Recognizable to anyone who knows Imperial history (Knowledge: history DC 15).",
  "source": "Ptolus p. ??",
  "tags": ["divination", "imperial-relic", "ptolus-themed"]
}
```
