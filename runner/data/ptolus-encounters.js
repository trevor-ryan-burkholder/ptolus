/* ptolus-encounters.js — canonical & homebrew Ptolus encounter tables.
 * Source: srd/ptolus/encounter-tables.md (Ptolus Random Encounter Matrix +
 * homebrew sewer/labyrinth tables). Loaded by the encounter generator's
 * "Ptolus Tables" mode. Exposes global PTOLUS_ENC.
 */
(function (g) {
  // Homebrew Sewers (d20, 1-in-6 per 20 min) — entries with CR where combat
  const sewer = [
    { t: 'Ratman scouting patrol (1d4+1 ratmen)', cr: '1–2 ea' },
    { t: 'Ratman nest guards (2d4 ratmen)', cr: '1–2 ea' },
    { t: 'Ratman shaman + 1d4 ratmen', cr: '3 (lead)' },
    { t: 'Giant rats (1d6+2); may be diseased (Fort DC 11 or filth fever)', cr: '1/4 ea' },
    { t: 'Dire rat swarm (2d4 dire rats)', cr: '1/3 ea' },
    { t: 'Sewer workers (2) heading to a problem junction', cr: '' },
    { t: 'City Watch sewer patrol (1d4 guards + sergeant)', cr: '' },
    { t: 'Goblin scavengers (1d6+2) grabbing anything they can carry', cr: '1/3 ea' },
    { t: 'Cultists using the sewer as transit (2d4 warriors, lvl 1d4)', cr: 'varies' },
    { t: '1d4 crocodiles in the lower passages', cr: '2 ea' },
    { t: 'Otyugh in a refuse pool — attacks from below', cr: '4' },
    { t: 'Gelatinous cube filling a corridor (50% you walk in first)', cr: '3' },
    { t: 'Abandoned delver camp (gear, bedroll, blood — no body)', cr: '' },
    { t: 'Ochre jelly in a side passage', cr: '5' },
    { t: 'Skulks (1d3) using the sewers to cross districts', cr: '1 ea' },
    { t: "1d4 Longfingers Guild rogues (lvl 1d4+1) moving something unseen", cr: 'varies' },
    { t: 'Recent ceiling collapse — passage blocked or unstable', cr: '' },
    { t: 'A gate between sewer sections, locked from the far side', cr: '' },
    { t: 'Evidence of a recent battle: weapons, blood, drag marks; no survivors', cr: '' },
    { t: "A passage opens onto an unmapped Ghul's Labyrinth junction", cr: '' },
  ];
  // Homebrew Ghul's Labyrinth (d12, every 30 min known / 15 min unexplored)
  const labyrinth = [
    { t: "Animated skeletons (2d6) from Ghul's old garrison", cr: '1/3 ea' },
    { t: 'Zombies (1d6+2) wandering a sealed chamber', cr: '1/2 ea' },
    { t: 'Ghouls (1d4+1) hunting; 50% tracking a wounded delver', cr: '1 ea' },
    { t: "Ghul's mark: walls carved with skulls + an old trap (Search DC 20)", cr: '' },
    { t: 'Shadow (1–2) haunting the old torture chambers', cr: '3 ea' },
    { t: 'A wight in ancient Squirming Horde armor; attacks any warm creature', cr: '3' },
    { t: "Delver's Guild waystation — safe to rest if the door is barred", cr: '' },
    { t: 'A rival delver team (2d4, lvl 1d6+2); friendly or territorial', cr: 'varies' },
    { t: 'Ratmen colony (1d6+4) holding an old barracks', cr: '1–2 ea' },
    { t: "Ghul's construction: a massive sealed door / ancient inscription", cr: '' },
    { t: 'A chaos-warped creature near a Pit (cosmetic mutation, +1 atk/dmg)', cr: 'varies' },
    { t: 'A Pit of Insanity (roll on the Pits of Insanity generator)', cr: '' },
  ];
  // Necropolis at night (canonical column highlights)
  const necropolis = [
    { t: '1d3 ghouls sneaking through the shadows', cr: '1 ea' },
    { t: 'Vampire spawn waiting in ambush', cr: '2' },
    { t: 'A vampire (fighter, lvl 1d12) waiting in ambush', cr: '8–13' },
    { t: '1d6 ghouls in ambush', cr: '1 ea' },
    { t: '2d4 shadows flit from the darkness', cr: '3 ea' },
    { t: '2d6 zombies wandering aimlessly', cr: '1/2 ea' },
    { t: '2d3 Forsaken cultists + a priest performing a ritual', cr: 'varies' },
    { t: '1d4 Forsaken cultists prowling among the gravestones', cr: 'varies' },
    { t: '1d4 cultists looking to kidnap someone for sacrifice', cr: 'varies' },
    { t: '1d3 demons wandering loose', cr: '5–9' },
    { t: '1d4 Keepers of the Veil, in a hurry', cr: '' },
    { t: 'An inexplicable, bone-deep chill', cr: '' },
    { t: 'An ominous raven staring intently at the party', cr: '' },
  ];
  // City-street named encounters by type (condensed from the matrix descriptions)
  const street = {
    watch: [
      '1d8 City Watch guards on patrol', '1d8 guards + a constable, en route to a call',
      '1d6 guards chasing a rogue (lvl 1d4)', 'A guard posting a wanted poster',
      '1d4+1 Sisters of Silence en route to an arrest', 'A tax collector with 1d6 guards',
    ],
    noble: [
      '1d2 aristocrats walking arm in arm', '1d3 drunken aristocrats, arrogant and loud',
      'Two young aristocrats dueling over an insult', 'A noble carriage forces its way through',
      'A flying ship passes overhead',
    ],
    commoner: [
      'A vendor hawking food or goods', 'An illegal drug vendor (a rogue in disguise)',
      'A Bellringers’ Guild crier shouting the news', 'A rat catcher with his ratter dog',
      'Sewer workers heading to a problem junction', 'Laborers hauling goods on an errand',
    ],
    adventurer: [
      'A wizard (lvl 1d6+10) with a shield guardian', 'A ranger (lvl 1d6+5) with a bear companion',
      'A druid (lvl 1d6+8) with a giant owl', 'A large fighter spoiling for a fight',
      'A centaur commoner pulling a cart',
    ],
    criminal: [
      'A pickpocket working the crowd (Perception DC 15)', 'A con artist running a rigged dice game',
      'A pickpocket gang: a rogue + 2d4 children', '1d6+2 drunken fighters causing trouble',
      '1d3 ratmen lurking in the gutters [CR 1–2 ea]', '1d3 goblins on the rooftops [CR 1/3 ea]',
    ],
    docks: [
      'Dockworkers and sailors on shore leave', 'Livestock being loaded from a ship',
      'Travelers arriving or departing with baggage', 'A labor dispute between guild factions',
      'Slavers / a press gang hunting for victims',
    ],
    faction: [
      '4d6+6 Commissar’s Men marching in formation', '1d4 Knights of the Pale, mounted or afoot',
      '1d4+1 Sisters of Silence returning to the Priory', 'Clerics/paladins en route to a temple',
      '1d4+1 Knights of the Dawn, elated', '1d4 Knights of the Dawn, beaten and limping',
      '1d4 Keepers of the Veil, in a hurry',
    ],
    monster: [
      '1d6 ratmen in ambush [CR 1–2 ea]', '1d10 goblins hiding in an alley [CR 1/3 ea]',
      '1d4 Ornu-Nom orcs looking for trouble [CR 1/2 ea]', 'A male ogre, not caring who sees him [CR 3]',
      'Lizardfolk beggars or escaped slaves [CR 1 ea]', 'A masked Harrow elf sorcerer, aggressive',
      '1d2 Vai assassins tailing a target',
    ],
    necro: necropolis.map(function (e) { return e.t + (e.cr ? ' [CR ' + e.cr + ']' : ''); }),
    weird: [
      'Everything goes quiet and still', 'A commoner asleep on the ground',
      'Distant music in an otherwise empty street', 'Seagulls fighting over garbage',
      'A freshly dead corpse on the ground', '2d4 shadows flit from the darkness [CR 3 ea]',
      '2d6 zombies wandering aimlessly [CR 1/2 ea]', '2d3 Forsaken cultists + priest at a ritual',
    ],
  };
  // District tone: type -> weight (day). Night handled by a multiplier below.
  const districtTone = {
    'Nobles\' Quarter': { noble: 5, faction: 2, watch: 2, commoner: 1 },
    'Midtown': { adventurer: 3, commoner: 2, watch: 2, weird: 1, faction: 1, criminal: 1 },
    'Temple District': { faction: 4, commoner: 1, necro: 1, weird: 1 },
    'South Market': { commoner: 4, criminal: 1, faction: 1 },
    'North Market': { commoner: 4, criminal: 1, watch: 1 },
    'Guildsman District': { commoner: 3, criminal: 1, faction: 1, watch: 1 },
    'Oldtown': { adventurer: 3, weird: 2, commoner: 1, necro: 1 },
    'Rivergate': { commoner: 3, watch: 1, criminal: 1 },
    'Docks': { docks: 5, commoner: 2, criminal: 2, watch: 1, weird: 1 },
    'Warrens': { criminal: 4, monster: 4, weird: 1 },
    'Necropolis': { necro: 5, faction: 1, weird: 2 },
  };
  // At night these types get heavier; civic/daytime types lighter.
  const nightBoost = { criminal: 2, monster: 2, weird: 2, necro: 2, noble: 0.3, commoner: 0.4, faction: 0.7 };

  g.PTOLUS_ENC = {
    sewer: sewer, labyrinth: labyrinth, necropolis: necropolis,
    street: street, districtTone: districtTone, nightBoost: nightBoost,
    districts: Object.keys(districtTone),
  };
})(typeof window !== 'undefined' ? window : globalThis);
