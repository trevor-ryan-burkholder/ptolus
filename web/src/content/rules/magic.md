# Magic (3.5e Basics)

## Spell components

- **V** verbal — silenced creatures can't cast.
- **S** somatic — must have a free hand; armor causes arcane spell failure (ASF).
- **M** material — consumed; usually trivial cost (carried in component pouch unless noted).
- **F** focus — not consumed; specific item required.
- **DF** divine focus — holy symbol.
- **XP** — experience point cost.

## Casting a spell

1. Declare the spell.
2. Concentration check if distracted (DC 10 + damage + spell level for ongoing damage; DC 15 + spell level for vigorous motion; etc.).
3. Apply components.
4. Resolve: range, target, save, SR.

Casting in melee provokes an AoO unless you cast defensively (Concentration DC 15 + spell level).

## Spell resistance

Many creatures have SR (e.g., 17). Caster level check: `1d20 + caster level` vs. SR. Beat or equal SR to affect the target. SR can be voluntarily lowered.

## Saving throws against spells

DC = `10 + spell level + casting ability mod` (+ feats like Spell Focus).

- Wizard/sorcerer/bard: spell level cap by caster ability (Int 10+spell level).
- A successful save against a damage spell typically halves damage; against control/illusion typically negates entirely. See each spell.

## Spell preparation

- **Wizards / Clerics / Druids**: prepare slots each day (8 hr rest, 1 hr study/prayer). Casts a spell expends that slot.
- **Sorcerers / Bards**: know fewer spells; can cast any known spell from available slots spontaneously. No preparation.
- **Clerics**: can spontaneously cast *cure* or *inflict* of equal level by sacrificing any prepared spell (good clerics get cure, evil get inflict; neutral choose at first level).
- **Domains**: clerics get bonus domain spell per level + granted power. Casters with school specialization get bonus spell of that school per level.

## Schools of magic

- **Abjuration** — protection (shield, dispel magic, protection from evil)
- **Conjuration** — bring/create things (summon monster, web, cure light wounds — yes, healing is conjuration)
- **Divination** — knowledge (detect magic, see invisibility, true strike)
- **Enchantment** — affect minds (charm person, sleep, hold person)
- **Evocation** — manipulate energy (magic missile, fireball, lightning bolt)
- **Illusion** — sensory deceit (silent image, invisibility, mirror image)
- **Necromancy** — life and death (vampiric touch, animate dead, energy drain)
- **Transmutation** — change properties (enlarge person, bull's strength, fly)

## Spell descriptors

Spells may carry descriptors (fire, cold, evil, etc.) that interact with creature immunities and resistances.

## Spell ranges

- **Touch**: melee touch attack, no provoking attack roll usually.
- **Close**: 25 ft. + 5 ft./2 levels.
- **Medium**: 100 ft. + 10 ft./level.
- **Long**: 400 ft. + 40 ft./level.
- **Personal**: caster only.

## Energy resistance vs. immunity

- Resistance N: subtract N from energy damage each instance.
- Immunity: no damage.
- Vulnerability: +50% damage from that type.

## Counterspelling

Ready an action. When target casts, Spellcraft DC 15 + spell level to identify, then cast the same spell (or *dispel magic* with caster-level check) to negate.

## Magic items by tier

Use these for treasure rolls (DMG Table 7-4):
- **Minor**: 0–25 gp through ~4,000 gp.
- **Medium**: ~4,000–18,000 gp.
- **Major**: 18,000+ gp.

The Adventure Runner's loot generator rolls on these tiers and pulls from `srd/items/magic-items.json` filtered by `tier`.
