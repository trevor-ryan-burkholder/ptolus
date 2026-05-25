/* catalog.js — single source of truth for tool routes + launcher cards.
 * App.jsx auto-generates routes from `component`; Home renders cards by `cat`.
 * banner:true → rendered as a top banner on Home instead of a category card. */
export const CATALOG = [
  // banners
  { path: 'library', name: '📚 Reference Library', desc: 'Every doc in one place — Ptolus lore, 3.5e rules, classes & races, and all generator specs. Searchable, rendered in-browser.', cat: 'Reference', component: 'Library', banner: true },
  { path: 'codex', name: '🐉 Codex', desc: 'Searchable stat blocks & cards — monsters, spells, magic items, gear, and psionic powers. Filter by CR, tier, class, school.', cat: 'Reference', component: 'Codex', banner: true },

  // At the Table
  { path: 'dashboard', name: '🖥 GM Dashboard', desc: 'One screen: party, live combat, faction clocks, campaign context.', cat: 'At the Table', component: 'Dashboard' },
  { path: 'display', name: '📺 Player Display', desc: 'Second screen for players — initiative, bloodied status, read-aloud.', cat: 'At the Table', component: 'Display' },

  // Generators
  { path: 'encounters', name: '⚔ Encounters', desc: 'Random encounter by region + party level, with EL and average loot.', cat: 'Generators', component: 'Encounters' },
  { path: 'encounter-builder', name: '🎯 Encounter Builder', desc: 'Hand-pick monsters to a target EL — live difficulty, XP budget & loot.', cat: 'Generators', component: 'EncounterBuilder' },
  { path: 'loot', name: '💰 Treasure / Loot', desc: 'Treasure parcels by EL — coins, goods, magic items (DMG 7-4).', cat: 'Generators', component: 'Loot' },
  { path: 'npcs', name: '🎭 NPCs', desc: 'Instant NPC: race, class, personality, quirk, secret, motive.', cat: 'Generators', component: 'Npcs' },
  { path: 'names', name: '📜 Names', desc: 'Culture-keyed names for people, places, and factions.', cat: 'Generators', component: 'Names' },
  { path: 'weather', name: '🌧 Weather & Ambience', desc: 'Weather plus read-aloud city ambience for a scene.', cat: 'Generators', component: 'Weather' },
  { path: 'tavern', name: '🍺 Tavern & Shop', desc: 'Keyed tavern or shop — owner, atmosphere, stock, rumor.', cat: 'Generators', component: 'Tavern' },
  { path: 'dungeons', name: '🏰 Dungeon Rooms', desc: 'Keyed room or whole level: shape, exits, contents, dressing, encounter.', cat: 'Generators', component: 'Dungeons' },
  { path: 'traps', name: '⚠ Traps', desc: 'CR-scaled mechanical & magic traps — trigger, DCs, save, effect.', cat: 'Generators', component: 'Traps' },
  { path: 'advancer', name: '🐲 Monster Advancer', desc: 'Scale any monster to a target CR — add HD or apply templates.', cat: 'Generators', component: 'Advancer' },

  // Combat & Session
  { path: 'party', name: '🧝 Party Roster', desc: 'PCs, AC, saves & passive Perception — feeds combat and XP.', cat: 'Combat & Session', component: 'Party' },
  { path: 'combat', name: '🛡 Combat Tracker', desc: 'Initiative, HP, conditions, inline stat blocks, attack & save rolls.', cat: 'Combat & Session', component: 'Combat' },
  { path: 'delve', name: '🔦 Delve Tracker', desc: 'Time, torch burn & wandering-monster checks as the party descends.', cat: 'Combat & Session', component: 'Delve' },
  { path: 'xp', name: '✦ XP Calculator', desc: 'Per-character XP from the ELs the party defeated.', cat: 'Combat & Session', component: 'Xp' },
  { path: 'commissariat', name: '⏱ City Watch Timer', desc: 'City Watch response countdown — real table tension.', cat: 'Combat & Session', component: 'Commissariat' },
  { path: 'calendar', name: '📅 Imperial Calendar', desc: 'Track the date, weekday, holy days, and campaign time.', cat: 'Combat & Session', component: 'Calendar' },

  // City & Intrigue
  { path: 'city-events', name: '🏙 City Events', desc: "What's happening in Ptolus this week.", cat: 'City & Intrigue', component: 'CityEvents' },
  { path: 'jobs', name: '📋 Job Board', desc: 'Delver contracts: patron, objective, reward, catch.', cat: 'City & Intrigue', component: 'Jobs' },
  { path: 'street-scenes', name: '🚶 Street Scenes', desc: 'The texture of a city street corner, right now.', cat: 'City & Intrigue', component: 'StreetScenes' },
  { path: 'districts', name: '🏛 Districts', desc: 'Canonical venues, NPCs & hooks for all 11 districts.', cat: 'City & Intrigue', component: 'Districts' },
  { path: 'factions', name: '⚑ Faction Tracker', desc: "Track each faction's attitude toward the party (saved).", cat: 'City & Intrigue', component: 'Factions' },
  { path: 'rumors', name: '💬 Rumors', desc: "Rumors keyed to the source NPC's profession.", cat: 'City & Intrigue', component: 'Rumors' },
  { path: 'city-turn', name: '⏳ City Turn', desc: "Faction clocks — advance the city's plots between sessions.", cat: 'City & Intrigue', component: 'CityTurn' },

  // Ptolus-Specific
  { path: 'chaositech', name: '⚙ Chaositech', desc: 'Unstable chaositech items — function, glitch, flavor.', cat: 'Ptolus-Specific', component: 'Chaositech' },
  { path: 'investigations', name: '🔍 Investigations', desc: 'Crime scene seed: victim, method, clue, false lead.', cat: 'Ptolus-Specific', component: 'Investigations' },
  { path: 'noble-schemes', name: '♟ Noble Schemes', desc: 'House-vs-house intrigue hooks for Arc II+.', cat: 'Ptolus-Specific', component: 'NobleSchemes' },
  { path: 'chaos', name: '🌀 Pits of Insanity', desc: 'Chaos mutation & warping effects, minor and major.', cat: 'Ptolus-Specific', component: 'Chaos' },
  { path: 'corruption', name: '☣ Corruption Tracker', desc: 'Per-character taint from chaositech, the Pits, and the Galchutt.', cat: 'Ptolus-Specific', component: 'Corruption' },

  // Reference
  { path: 'conditions', name: '📖 Conditions', desc: 'All 3.5e conditions on one searchable page.', cat: 'Reference', component: 'Conditions' },
  { path: 'actions', name: '⏳ Action Economy', desc: 'Action types with common examples.', cat: 'Reference', component: 'Actions' },
  { path: 'dungeon-levels', name: '🗺 Dungeon Levels', desc: 'Known Dungeon levels — factions, CR, features (editable).', cat: 'Reference', component: 'DungeonLevels' },
  { path: 'permits', name: '🪪 Permits & Licensing', desc: 'Ptolus permits, costs, issuers, monster grades.', cat: 'Reference', component: 'Permits' },
  { path: 'divine', name: '⛪ Deities & Domains', desc: 'Ptolus pantheon + 3.5e cleric domains (granted powers + spell lists).', cat: 'Reference', component: 'Divine' },
  { path: 'whoswho', name: "👥 Ptolus Who's-Who", desc: 'Canon NPC & venue directory — search by name, faction, district.', cat: 'Reference', component: 'Whoswho' },

  // Campaign Prep
  { path: 'prep', name: '📝 Session Prep', desc: 'Scaffold the next session file, dated to the calendar.', cat: 'Campaign Prep', component: 'Prep' },
  { path: 'quests', name: '🗺 Quests & Plots', desc: 'Track threads, leads & objectives — linked to City Turn clocks.', cat: 'Campaign Prep', component: 'Quests' },
  { path: 'handout', name: '📜 Handouts', desc: 'In-world proclamations, letters, posters & broadsheets.', cat: 'Campaign Prep', component: 'Handout' },
  { path: 'save', name: '💾 Campaign Save', desc: "Export or restore every tool's data in one backup file.", cat: 'Campaign Prep', component: 'Save' },
];

export const CATEGORIES = ['At the Table', 'Generators', 'Combat & Session', 'City & Intrigue', 'Ptolus-Specific', 'Reference', 'Campaign Prep'];
