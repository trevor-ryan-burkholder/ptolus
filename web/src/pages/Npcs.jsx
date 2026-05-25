import { useState, useEffect, useRef } from 'react';
import D from '../lib/dice.js';
import GRADES from '../lib/grades.js';
import { DATA } from '../data/index.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

/* ---- NPC level band defaults to the party's band (shared campaign context) ---- */
function bandFor(lv) { lv = lv || 1; return lv <= 3 ? '1-3' : lv <= 6 ? '4-6' : lv <= 10 ? '7-10' : '11+'; }

/* ---- names (compact, by race) ---- */
const NAMES = {
  Human: { m: ['Mar', 'Kal', 'Vor', 'Jev', 'Ser', 'Arc', 'Thal', 'Cas', 'Del', 'Orin', 'Luc'], mf: ['an', 'us', 'ic', 'en', 'avar', 'ian', 'os', 'eth'],
    f: ['Mir', 'Ser', 'Jul', 'Vel', 'Tess', 'Lyss', 'Aur', 'Cal'], ff: ['a', 'ia', 'aine', 'ella', 'ine', 'issa', 'aia'],
    sur: ['Voss', 'Thann', 'Marcen', 'Orvain', 'Callante', 'Drath', 'Cassan', 'Rhyl', 'Forren', 'Thessaly', 'Kerris', 'Delvain'] },
  Elf: { m: ['Ae', 'Syl', 'Eli', 'Cael', 'Aer', 'Oss', 'Tael', 'Fen'], mf: ['iss', 'an', 'oss', 'in', 'ath', 'iel', 'ynn', 'ael'],
    f: ['Ae', 'Syl', 'Eli', 'Mir', 'Lyr', 'Aer'], ff: ['iel', 'wen', 'ynn', 'aith', 'ess', 'ara'],
    sur: ['Silverleaf', 'Dawnmantle', 'Greywater', 'Caelossyn', 'Fenriath', 'Moonvale'] },
  Dwarf: { m: ['Thor', 'Brak', 'Gund', 'Rul', 'Keld', 'Durn', 'Var', 'Morl'], mf: ['in', 'an', 'ok', 'ur', 'im', 'ek', 'gar'],
    f: ['Brun', 'Helga', 'Sig', 'Marg', 'Eld', 'Thora'], ff: ['a', 'in', 'dis', 'run', 'hild'],
    sur: ['Ironhelm', 'Stonemantle', 'Copperforge', 'Gundrak', 'Brakken', 'Morlsson'] },
  Halfling: { m: ['Meri', 'Pip', 'Ros', 'Will', 'Tob', 'Fen', 'Del', 'Bur'], mf: ['ias', 'win', 'o', 'ander', 'ic'],
    f: ['Rosie', 'Meri', 'Lily', 'Pansy', 'Daisy', 'Nora'], ff: ['', 'a', 'ie', 'el'],
    sur: ['Leafwick', 'Fenmore', 'Copperbrook', 'Goodbarrel', 'Greenfield', 'Underwood'] },
  Gnome: { m: ['Fizz', 'Wobble', 'Copper', 'Tinker', 'Gear', 'Bren'], mf: ['wick', 'sprocket', 'salt', 'bin', 'dle'],
    f: ['Nix', 'Pim', 'Zinn', 'Bree', 'Fenn'], ff: ['a', 'le', 'y', 'et'],
    sur: ['Cranksworth', 'Tinkersalt', 'Copperspring', 'Wheelwright', 'Sprokett'] },
  'Half-orc': { m: ['Gor', 'Thok', 'Brak', 'Mug', 'Dur', 'Krell'], mf: ['ash', 'uk', 'an', 'og', 'nar'],
    f: ['Gra', 'Sha', 'Vol', 'Mor', 'Ren'], ff: ['a', 'ka', 'ush', 'na'],
    sur: ['Skullsplit', 'Ironside', 'Bonecrack', 'of the Warrens', 'Greaver'] },
  'Shoal elf': { m: ['Aes', 'Cor', 'Sael', 'Vyr', 'Tael'], mf: ['issan', 'oth', 'aril', 'enn'],
    f: ['Aes', 'Syl', 'Vael', 'Cira'], ff: ['issa', 'aith', 'wyn', 'ael'],
    sur: ['of the Outer Isles', 'Tidewalker', 'Saltbound', 'Aesvyril'] },
};
function buildName(race, gender) {
  const t = NAMES[race] || NAMES.Human;
  const male = gender === 'm' || (gender === 'r' && D.coinFlip());
  const pre = D.pick(male ? t.m : t.f);
  const suf = D.pick(male ? t.mf : t.ff);
  let given = pre + suf;
  if (race === 'Gnome') given = D.pick(t.m) + D.pick(t.mf);
  const sur = D.pick(t.sur);
  return given + ' ' + sur;
}

/* ---- type tables ---- */
const TYPES = ['commoner', 'criminal', 'guild', 'guard', 'priest', 'delver', 'noble'];
const TYPE_LABEL = { commoner: 'Commoner', criminal: 'Criminal', guild: 'Guild Member', guard: 'City Guard', priest: 'Priest', delver: 'Delver', noble: 'Noble' };
const RACE_WEIGHTS = [['Human', 55], ['Elf', 10], ['Dwarf', 10], ['Halfling', 8], ['Gnome', 5], ['Half-orc', 5], ['Shoal elf', 7]];

const CLASSES = {
  commoner: [['Commoner', 3], ['Expert', 2]],
  criminal: [['Rogue', 3], ['Expert', 2], ['Fighter', 1]],
  guild: [['Expert', 3], ['Aristocrat', 1], ['Warrior', 1]],
  guard: [['Warrior', 3], ['Fighter', 2]],
  priest: [['Cleric', 3], ['Adept', 1]],
  delver: [['Fighter', 1], ['Rogue', 1], ['Wizard', 1], ['Cleric', 1], ['Ranger', 1]],
  noble: [['Aristocrat', 3], ['Fighter', 1], ['Wizard', 1]],
};
const ROLE = {
  commoner: ['laborer', 'street vendor', 'fishmonger', 'porter', 'beggar', 'washerwoman', 'cooper', 'stablehand'],
  criminal: ['fence, appraises stolen goods', 'information broker', 'enforcer', 'pickpocket', 'smuggler', 'burglar'],
  guild: ['merchant', 'guild factor', 'appraiser', 'moneylender', 'warehouse master', 'caravan master'],
  guard: ['City Watch patrolman', 'sergeant of the watch', 'gate guard', 'house guard', "Commissar's Man"],
  priest: ['temple acolyte', 'street preacher', 'funerary priest', 'temple administrator', 'wandering cleric'],
  delver: ['dungeon delver', 'relic hunter', 'sellsword', 'map-maker', 'tomb-robber', 'expedition scout'],
  noble: ['minor house scion', 'house steward', 'political fixer', 'knight of a house', 'court wizard'],
};
// Canonical Ptolus deities (verified vs. core book). PT6 adds Civilization/Technology/Sleep domains.
const DEITIES = [
  { n: 'Lothian, the Lawgiver', dom: ['Good', 'Law', 'Protection', 'Sun'] },
  { n: 'the Watcher of the Skies', dom: ['Knowledge', 'Law', 'Protection'] },
  { n: 'Teun, Mother of All Machines', dom: ['Civilization', 'Law', 'Technology'] },
  { n: 'Navashtrom, God of Strength & Harmony', dom: ['Good', 'Protection', 'Strength'] },
  { n: 'Gaen, Goddess of Light', dom: ['Good', 'Law', 'Light'] },
  { n: 'Tardeshou, Goddess of Truth', dom: ['Good', 'Knowledge', 'Law'] },
  { n: 'Ahaar, Lord of the Air', dom: ['Air', 'Good', 'Protection'] },
  { n: 'Tevra', dom: ['Healing', 'Law', 'Technology'] },
  { n: 'Phoeboul, God of Dreams', dom: ['Chaos', 'Knowledge', 'Sleep'] },
  { n: 'Melann', dom: ['Animal', 'Good', 'Plant'] },
  { n: 'Myliesha, Mistress of the Wind’s Path', dom: ['Air', 'Good', 'Travel'] },
];

const PERSONALITY = ['blunt', 'cheerful under pressure', 'paranoid', 'overly formal', 'world-weary', 'ambitious', 'deferential', 'bitter', 'genuinely kind', 'calculating', 'sentimental', 'jaded'];
const QUIRK = ["won't make eye contact", 'touches a lucky charm when nervous', 'always bargaining', 'quotes scripture unprompted', 'laughs at the wrong moments', 'excessively punctual', 'counts things quietly', 'refuses to use names', 'always has food on hand', 'slips into a regional accent when stressed', 'taps the table three times before any deal'];
const SECRET = {
  commoner: ['witnessed a crime and is terrified', 'is hiding a relative from the law', 'secretly literate and reads forbidden texts'],
  criminal: ['informant for the City Watch', 'owes a Balacazar debt', 'is actually a Delver in disguise', 'planning to flee the city'],
  guild: ['skimming from the accounts', 'holds evidence of a noble crime', 'is a plant for a rival guild', 'sells secrets on the side'],
  guard: ['on the take', 'covering up a killing', 'sympathizes with the monster-rights movement', 'reports to a noble house, not the City Watch'],
  priest: ['crisis of faith', 'knows something the church wants buried', 'has been bribed', 'secretly worships a forbidden god'],
  delver: ['knows where a body is buried (literally)', 'has a stolen Dungeon artifact', 'is being followed', 'left a partner to die down below'],
  noble: ['carries a blood debt', 'is of bastard lineage', 'secret Inverted Pyramid member', 'bankrupt and hiding it'],
};
const MOTIVE = ['money, straightforwardly', 'getting out of a bad situation', 'protecting someone', 'revenge', 'ambition', 'survival', 'curiosity', 'loyalty to a faction'];
const KNOW = {
  commoner: ['who really runs this street', 'which guard takes bribes', 'where a body turned up last week'],
  criminal: ['a cache of chaositech moving through the Docks this week', 'a fence who specializes in Dungeon relics', 'which crew is muscling in on the Warrens'],
  guild: ['which house is quietly buying warehouse leases', 'a shipment arriving with undeclared cargo', 'who defaulted on a major loan'],
  guard: ['where the next City Watch sweep will hit', 'which officer is compromised', 'a missing-persons case being buried'],
  priest: ['a recently desecrated street shrine', 'a parishioner confessing to something dark', 'church politics turning ugly'],
  delver: ['a Dungeon entrance nobody officially knows about', 'a partial map of level 3', 'a relic that buyers are hunting for'],
  noble: ['which two houses are about to feud', 'a scandal about to break', 'a marriage being arranged for leverage'],
};
const WANT = {
  commoner: ['a small loan they can never repay', 'someone to scare off a landlord', 'word sent to a relative'],
  criminal: ['buyers for stolen gems of unclear provenance', "a message run to a contact they can't visit", 'protection from a rival'],
  guild: ['a discreet escort for a valuable shipment', 'a competitor investigated', 'a debt collected quietly'],
  guard: ['a problem to disappear off the books', 'help proving a theory their captain ignores', 'a favor owed for looking the other way'],
  priest: ['a relic recovered from the Necropolis', 'a heretic followed', 'alms — and information — from delvers'],
  delver: ['a fourth for a Dungeon run', 'funding for an expedition', 'someone who can read an old inscription'],
  noble: ['leverage over a rival house', 'a deniable errand done', "a rival's secret confirmed"],
};
const APPEAR = {
  build: ['heavyset', 'wiry', 'tall and stooped', 'short and broad', 'gaunt', 'soft-handed', 'scarred', 'unremarkable'],
  feat: ['shaved head', 'ink-stained fingers', 'a livid burn scar', 'missing two fingers', 'mismatched eyes', 'an expensive but worn coat', 'a nervous twitch', 'a gold tooth', 'always chewing something', 'a faded guild tattoo'],
};
const HD = { Commoner: 4, Expert: 6, Adept: 6, Warrior: 8, Aristocrat: 8, Fighter: 10, Rogue: 6, Wizard: 4, Cleric: 8, Ranger: 8 };

function levelFromBand(band) {
  if (band === '1-3') return D.range(1, 3);
  if (band === '4-6') return D.range(4, 6);
  if (band === '7-10') return D.range(7, 10);
  if (band === '11+') return D.range(11, 16);
  return D.range(1, 4);
}
function resolveType(t) { return t === 'random' ? D.pick(TYPES) : t; }
function resolveRace(r) { return r === 'random' ? D.weightedPick(RACE_WEIGHTS) : r; }

function statLine(cls, lvl) {
  const hd = HD[cls] || 6;
  const hp = Math.max(1, Math.round(lvl * (hd / 2 + 0.5)));
  const goodBab = ['Fighter', 'Warrior', 'Ranger', 'Barbarian', 'Paladin'].indexOf(cls) !== -1;
  const bab = goodBab ? lvl : (['Rogue', 'Cleric', 'Aristocrat', 'Expert', 'Adept', 'Bard'].indexOf(cls) !== -1 ? Math.floor(lvl * 0.75) : Math.floor(lvl / 2));
  return 'HP ~' + hp + ', BAB +' + bab;
}

/* ---- Monster NPC (grade system) ---- */
const MON_NAMES = ['Vrakka', 'Gorth', 'Iss-Tlan', 'Murghol', 'Sythiss', 'Brakka', 'Ulgrund', 'Naxx', 'Vethra', 'Khoros', 'Sliss', 'Grunda'];
const MON_TYPES_OK = ['Humanoid', 'Monstrous Humanoid', 'Giant', 'Aberration', 'Fey', 'Outsider', 'Undead', 'Dragon'];
const MON_KNOW = ['which sewer routes the City Watch never checks', 'where its kind shelters inside the walls', 'a smuggler who moves "unregistered" folk in and out', 'which fence buys from monsters without flinching', 'a grudge between two gangs it could point the party toward'];
const MON_WANT = ['a sponsor so it can get a real permit', "someone to carry a message it can't deliver in daylight", "protection from a mob that's been gathering", "work that doesn't ask what it is", 'a missing member of its kind, taken by slavers'];
const MON_SECRET = ['is unregistered and one incident from a death warrant', "is informing on its own kind to the Commissar's Men", 'was redeemed by the Brotherhood and fears relapse', 'serves a chaos cult it is desperate to leave', 'is far more intelligent than it lets the city believe'];
function pickMonsterNPC() {
  const pool = DATA.monsters.filter((m) => m.cr_value > 0 && m.abilities && m.abilities.int >= 4 && MON_TYPES_OK.indexOf(m.type) !== -1);
  return D.pick(pool.length ? pool : DATA.monsters.filter((m) => m.cr_value > 0));
}

export default function Npcs() {
  const ctx = useCtx();
  const log = useLog();
  const [type, setType] = useState('random');
  const [race, setRace] = useState('random');
  const [level, setLevel] = useState(() => bandFor(ctx.partyLevel));
  const levelTouched = useRef(false);

  // keep band synced to the party level until the user touches it
  useEffect(() => {
    if (!levelTouched.current) setLevel(bandFor(ctx.partyLevel));
  }, [ctx.partyLevel]);

  function onLevelChange(e) { levelTouched.current = true; setLevel(e.target.value); }

  function generate() {
    if (type === 'monster') return generateMonster();
    const t = resolveType(type);
    const r = resolveRace(race);
    const band = level;
    const name = buildName(r, 'r');
    const cls = D.weightedPick(CLASSES[t]);
    const lvl = levelFromBand(band);
    let role = D.pick(ROLE[t]);
    if (t === 'priest') { const dei = D.pick(DEITIES); role += ' of ' + dei.n + ' (domains: ' + D.pickN(dei.dom, 2).join(', ') + ')'; }

    const pers = D.pickN(PERSONALITY, D.coinFlip() ? 2 : 1).join(', ');
    const quirk = D.pick(QUIRK);
    const secret = D.pick(SECRET[t]);
    const motive = D.pick(MOTIVE);
    const appear = D.pick(APPEAR.build) + ', ' + D.pick(APPEAR.feat) + ', ' + D.pick(APPEAR.feat);
    const know = D.pickN(KNOW[t], 2);
    const want = D.pickN(WANT[t], 2);

    let out = '<span class="head">[NPC — ' + TYPE_LABEL[t] + ' — ' + r + ']</span>\n\n';
    out += 'NAME: ' + name + '\n';
    if (band === 'none') out += 'ROLE: ' + role + '\n';
    else out += 'CLASS/LEVEL: ' + cls + ' ' + lvl + ' (' + role + ')\n';
    out += 'APPEARANCE: ' + appear + '\n\n';
    out += 'PERSONALITY: ' + pers + '\n';
    out += 'QUIRK: ' + quirk + '\n';
    out += '<span class="muted">SECRET: ' + secret + '</span>\n';
    out += 'MOTIVATION: ' + motive + '\n\n';
    out += 'WHAT THEY KNOW:\n' + know.map((k) => '  - ' + k).join('\n') + '\n';
    out += 'WHAT THEY WANT:\n' + want.map((w) => '  - ' + w).join('\n');
    if (band !== 'none' && band !== '11+') {
      out += '\n\n<span class="muted">[Unstatted — ' + cls + ' ' + lvl + ': ' + statLine(cls, lvl) + ']</span>';
    } else if (band === '11+') {
      out += '\n\n<span class="muted">[Unstatted — ' + cls + ' ' + lvl + '. Build a full block if it matters.]</span>';
    }
    log.append(out);
  }

  function quick() {
    if (type === 'monster') return quickMonster();
    const t = resolveType(type);
    const r = resolveRace(race);
    const male = D.coinFlip();
    const name = buildName(r, male ? 'm' : 'f');
    const desc = (male ? 'male ' : 'female ') + r.toLowerCase() + ', ' + D.pick(PERSONALITY) + ', ' +
      D.pick(ROLE[t]) + ', ' + D.pick(['owes someone a favor', 'hiding something', 'looking for work', 'new in town', 'well-connected', 'not to be trusted']);
    log.append(name + ' — ' + desc);
  }

  function generateMonster() {
    const m = pickMonsterNPC();
    const g = GRADES.classify(m.name, m.cr_value) || GRADES.byCR(m.cr_value);
    let out = '<span class="head">[NPC — Monster — ' + (g ? g.grade : '?') + ']</span>\n\n';
    out += 'NAME: ' + D.pick(MON_NAMES) + '\n';
    out += 'SPECIES: ' + m.name + ' (CR ' + m.cr + ') — ' + m.size + ' ' + m.type + (m.alignment ? ', ' + m.alignment : '') + '\n';
    out += 'APPEARANCE: ' + D.pick(APPEAR.build) + ', ' + D.pick(APPEAR.feat) + '\n\n';
    out += 'PERSONALITY: ' + D.pickN(PERSONALITY, D.coinFlip() ? 2 : 1).join(', ') + '\n';
    out += 'QUIRK: ' + D.pick(QUIRK) + '\n';
    out += '<span class="muted">SECRET: ' + D.pick(MON_SECRET) + '</span>\n';
    out += 'MOTIVATION: ' + D.pick(MOTIVE) + '\n\n';
    out += 'WHAT IT KNOWS:\n' + D.pickN(MON_KNOW, 2).map((k) => '  - ' + k).join('\n') + '\n';
    out += 'WHAT IT WANTS:\n' + D.pickN(MON_WANT, 2).map((w) => '  - ' + w).join('\n');
    if (g) {
      out += '\n\n<span class="muted">CIVIC STATUS: ' + g.grade + ' — ' + g.status + '\n';
      out += 'Permit: ' + (GRADES.permits[g.grade] || '—') + '\n';
      out += 'If it makes trouble: ' + g.response + ' (' + g.responseDice + ')</span>';
    }
    log.append(out);
  }
  function quickMonster() {
    const m = pickMonsterNPC();
    const g = GRADES.classify(m.name, m.cr_value);
    log.append(D.pick(MON_NAMES) + ' the ' + m.name + ' — ' + (g ? g.grade : '?') + ', ' + D.pick(PERSONALITY) + ', ' +
      D.pick(['new in the district', 'well-known to the Watch', 'keeping its head down', 'looking for work', 'not what it seems']));
  }

  return (
    <Layout title="NPC Generator" sub="On-the-spot characters in 3 seconds">
      <div className="runner-main">
        <div className="panel">
          <h2>NPC</h2>
          <label>NPC Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="random">Random</option>
            <option value="commoner">Commoner / Street</option>
            <option value="criminal">Criminal / Underworld</option>
            <option value="guild">Guild Member / Merchant</option>
            <option value="guard">City Guard / Soldier</option>
            <option value="priest">Priest / Temple</option>
            <option value="delver">Delver / Adventurer</option>
            <option value="noble">Noble / Political</option>
            <option value="monster">Monster (grade system)</option>
          </select>

          <label>Race</label>
          <select value={race} onChange={(e) => setRace(e.target.value)}>
            <option value="random">Random</option>
            <option value="Human">Human</option>
            <option value="Elf">Elf</option>
            <option value="Dwarf">Dwarf</option>
            <option value="Halfling">Halfling</option>
            <option value="Gnome">Gnome</option>
            <option value="Half-orc">Half-orc</option>
            <option value="Shoal elf">Ptolus-exotic</option>
          </select>

          <label>Approximate Level</label>
          <select value={level} onChange={onLevelChange}>
            <option value="1-3">1–3</option>
            <option value="4-6">4–6</option>
            <option value="7-10">7–10</option>
            <option value="11+">11+</option>
            <option value="none">Don't stat</option>
          </select>

          <button className="primary" onClick={generate}>Generate NPC</button>
          <button onClick={quick} style={{ width: '100%', marginTop: 8 }}>Quick NPC (name + one line)</button>

          <SeedControl />
        </div>
        <Log log={log} title="NPC Log" />
      </div>
    </Layout>
  );
}
