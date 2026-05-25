# Treasure / Loot Generator — Implementation Spec

**File:** `runner/loot/index.html`
**Purpose:** Generate a treasure parcel for a given EL. Break it into coins, goods, and items using DMG Table 7-4. Output is specific and ready to hand to players.

---

## Data Source

`shared/data.js` → `DATA.magicItems`, `DATA.mundaneItems`
`shared/tables.js` → `Tables.treasureValueByEL(el)`

---

## UI

**Controls (left column):**
- EL (1–20, number input)
- Treasure Type (dropdown):
  - Standard (all three categories — coins, goods, items)
  - Coins Only
  - Items Only (magic + mundane)
  - Hoard (2× standard — for lair or boss)
  - Incidental (1/4 standard — for humanoids carrying pockets)
- Ptolus Flavor (checkbox, default on): adds Ptolus-specific item flavor text
- "Roll Treasure" button
- "Add Single Item" button (rolls one magic item at a given tier without the full parcel)
- Seed control

**Output:**
```
[TREASURE — EL 7 — Standard]

COINS: 1,360 gp
  → 500 gp in mixed coin, 400 gp in a velvet pouch (Ptolus mint), 460 gp in gems
    Gems: 3× bloodstone (50 gp ea), 1× deep blue spinel (120 gp), 1× smoky quartz (40 gp)

GOODS: 680 gp
  → Bolt of Thessiran silk (200 gp), masterwork thieves' tools (100 gp),
     set of silver eating utensils (80 gp), deed to a warehouse in the Docks (300 gp)

ITEMS: 680 gp
  → Potion of Cure Moderate Wounds (300 gp)
  → Scroll of Invisibility (Wiz 2, CL 3) (150 gp)
  → Cloak of Resistance +1 (1,000 gp) [exceeds budget — use as partial find or adjust]

TOTAL: ~2,720 gp
```

---

## Algorithm

### Coins
1. Get `coins_gp` from `Tables.treasureValueByEL(el)`.
2. Split into denomination mix: 60% gp, 25% sp (converted), 15% gems/art.
3. For gems: roll 1d4 gems, allocate value to each (weighted low — most gems are 10–100 gp, rare ones higher).
4. For art: roll 1d3 art objects (weapons, jewelry, furnishings, textiles, documents).

### Goods
1. Get `goods_gp` from table.
2. Roll 1d4 goods items.
3. Each item: roll category (mundane weapons, armor, tools, trade goods, documents, clothing, Ptolus-specific).
4. Assign value. If sum exceeds budget significantly, drop last item.
5. Goods are flavorful non-magical objects — make them specific, not "trade goods (200 gp)."

Ptolus goods flavor list:
- Delver permit (expired but valuable to a fence)
- Chaositech component (inert, 1d6×50 gp to the right buyer)
- Inverted Pyramid token (membership, unknown tier)
- Property deed (Docks, Warrens, or Midtown)
- Letter of credit from a Ptolus trading house
- Dungeon-salvage manifest (partial map of level 3)
- Prohibited alchemical reagent
- Sealed contract with a noble house

### Items (Magic)
1. Get `items_gp` from table.
2. Determine tier by EL:
   - EL 1–4 → minor (trivial/lesser)
   - EL 5–8 → minor (lesser/greater)
   - EL 9–12 → medium
   - EL 13–16 → medium/major mix
   - EL 17–20 → major
3. Filter `DATA.magicItems` by tier.
4. `Dice.pick()` from filtered list.
5. If item `price_gp` significantly exceeds remaining budget, note it in output rather than silently dropping — Trevor may want to award a partial item (component, IOU, etc.).

---

## "Add Single Item" Mode

Dropdown: minor / medium / major. Rolls one item from `DATA.magicItems` at that tier and displays it with price and source citation. Useful mid-session when Trevor needs to improvise a found item.

---

## Ptolus Flavor Toggle

When on, at least one goods item should be Ptolus-specific (from the list above). Magic items may have a one-line flavor note appended — e.g., "Cloak of Resistance +1 — appears to be Ptolus military issue, marked with a faded district seal."

---

## Output Notes

- Always show total estimated value at the end.
- If rolling a hoard (2×), label it clearly and double all three category budgets.
- Show source citations for magic items so Trevor can reference the full entry.
