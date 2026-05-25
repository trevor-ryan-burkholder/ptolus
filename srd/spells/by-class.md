# Spells by Class

Human-readable index into `spells.json`. The runner uses the structured JSON; this file is for at-the-table lookups.

Currently the database includes ~73 spells across levels 0–4 — the most commonly cast PHB spells. Expand as needed.

## Cleric

**Level 0**: Cure Minor Wounds · Detect Magic · Guidance · Light · Read Magic · Resistance
**Level 1**: Bless · Command · Comprehend Languages · Cure Light Wounds · Detect Undead · Doom · Entangle (druid only really) · Inflict Light Wounds · Magic Weapon · Obscuring Mist · Protection from Evil · Sanctuary · Shield of Faith
**Level 2**: Bear's Endurance · Bull's Strength · Cure Moderate Wounds · Eagle's Splendor · Hold Person · Owl's Wisdom · Silence · Sound Burst · Spiritual Weapon
**Level 3**: Animate Dead · Bestow Curse · Cure Serious Wounds · Dispel Magic · Magic Circle Against Evil · Searing Light · Speak with Dead · Summon Monster III

## Wizard / Sorcerer

**Level 0**: Acid Splash · Detect Magic · Light · Mage Hand · Prestidigitation · Ray of Frost · Read Magic · Resistance
**Level 1**: Burning Hands · Charm Person · Color Spray · Comprehend Languages · Detect Undead · Disguise Self · Enlarge Person · Feather Fall · Grease · Mage Armor · Magic Missile · Magic Weapon · Obscuring Mist · Protection from Evil · Shield · Sleep · True Strike · Unseen Servant
**Level 2**: Acid Arrow · Bear's Endurance · Bull's Strength · Cat's Grace · Detect Thoughts · Eagle's Splendor · Flaming Sphere · Fox's Cunning · Glitterdust · Invisibility · Knock · Levitate · Mirror Image · Owl's Wisdom · Scorching Ray · See Invisibility · Web
**Level 3**: Dispel Magic · Fireball · Fly · Haste · Hold Person · Lightning Bolt · Magic Circle Against Evil · Slow · Stinking Cloud · Summon Monster III · Vampiric Touch
**Level 4**: Animate Dead · Bestow Curse

## Bard

**Level 0**: Detect Magic · Light · Mage Hand · Prestidigitation · Read Magic · Resistance
**Level 1**: Charm Person · Comprehend Languages · Cure Light Wounds · Disguise Self · Feather Fall · Grease · Sleep · Unseen Servant
**Level 2**: Bear's Endurance (no — see PHB) · Cat's Grace · Cure Moderate Wounds · Detect Thoughts · Eagle's Splendor · Fox's Cunning · Glitterdust · Hold Person · Invisibility · Mirror Image · Silence · Sound Burst
**Level 3**: Cure Serious Wounds · Dispel Magic · Haste · See Invisibility · Slow

## Druid

**Level 0**: Cure Minor Wounds · Detect Magic · Guidance · Light · Read Magic · Resistance
**Level 1**: Cure Light Wounds · Entangle · Obscuring Mist
**Level 2**: Bear's Endurance · Flaming Sphere · Owl's Wisdom
**Level 3**: Cure Serious Wounds · Fly
**Level 4**: Cure Serious Wounds (no — level 4 druid) · Dispel Magic

## Paladin

**Level 1**: Bless · Cure Light Wounds · Detect Undead · Magic Weapon · Protection from Evil · Read Magic · Resistance
**Level 2**: Bull's Strength · Eagle's Splendor · Owl's Wisdom
**Level 3**: Cure Serious Wounds · Dispel Magic · Magic Circle Against Evil · Searing Light (no — see PHB; clerical)

## Ranger

**Level 1**: Read Magic · Entangle
**Level 2**: Bear's Endurance · Cat's Grace · Cure Light Wounds · Owl's Wisdom
**Level 3**: Cure Moderate Wounds
**Level 4**: Cure Serious Wounds · Dispel Magic

> **Note**: When characters need a spell not in the database, look it up in the PHB and add it to `spells.json` following the schema. The runner's spell-pick generators (when built) read from JSON, not from this file.
