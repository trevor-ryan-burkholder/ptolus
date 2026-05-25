import { useState } from 'react';
import D from '../lib/dice.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

const INCIDENTS = [['Murder', 30], ['Theft (significant)', 25], ['Disappearance', 20], ['Sabotage', 10], ['Frame-up', 10], ['Supernatural incident', 5]];
const DISTRICTS = ['Docks', 'Warrens', 'Midtown', "Nobles' Quarter", 'Temple District', "Guildsman's"];
const VICTIMS = {
  Docks: ["a Delver's Guild cartographer", 'a merchant captain', 'a dock overseer', 'a fence', 'a foreign sailor'],
  Warrens: ['a small-time criminal', 'an independent vendor', 'a witness to something', 'a displaced refugee'],
  Midtown: ['a guild member', 'a mid-level merchant', 'a lawyer-scribe', "a minor noble's servant"],
  "Nobles' Quarter": ['a noble family member', 'a political aide', 'a visiting dignitary'],
  'Temple District': ['a junior cleric', 'a temple scholar', 'an out-of-city pilgrim'],
  "Guildsman's": ['a master craftsperson', 'a guild officer', 'an apprentice who knew too much'],
};
const FIRST = ['Tavrek', 'Sella', 'Vorin', 'Mira', 'Galt', 'Junia', 'Kervis', 'Wynn', 'Dorn', 'Vessa'];
const LAST = ['Soll', 'Voss', 'Marek', 'Brack', 'Caine', 'Thann', 'Holt', 'Drey', 'Orvain', 'Cassan'];
const KNOWN = ['detailed Dungeon maps sold to many buyers', 'quietly moving money others noticed', 'asking questions about the wrong people', 'a debt that never seemed to shrink', 'knowing a secret about a powerful house'];
const SCENE = ['door unlocked, no forced entry, the body staged', 'forced entry, a struggle, something taken', 'no body — only signs of a hurried departure', "everything in place except one thing that's missing", 'a fire that started in exactly one room'];
const METHODS = [
  ['Poison — an exotic compound found only in Dungeon plants (Level 4+)', 'Alchemy/Heal check'],
  ['Stabbing with a specific, identifiable blade', 'Weapon identification'],
  ['Magic — a distinctive spell residue', 'Spellcraft check'],
  ['Blunt force with a specific implement', 'Physical evidence'],
  ['Strangulation — the killer was strong', 'Physical evidence'],
  ['Staged to look like an accident', 'high Perception or Sense Motive'],
  ['No marks at all — origin unknown', 'Dungeon / psionic / aberrant'],
];
const FACTIONS = ['the Inverted Pyramid', 'the Balacazars', 'House Vladaam', "the Delver's Guild", 'the Church of Lothian', 'a chaos cult (the Forsaken)'];
const FALSE = [
  'A Balacazar enforcer was seen nearby — he was there for an unrelated debt. Solid alibi. Dead end.',
  'A prior enemy of the victim has a genuine grudge but no involvement.',
  'Physical evidence was moved deliberately to point the wrong way.',
  'A witness gives a confident, sincere account that is simply wrong.',
  'A faction looks obviously guilty — because someone framed them.',
];
const CLUES = [
  "The victim's journal is missing — but a charcoal rubbing of its last page survives on the desk blotter.",
  "A witness saw something they don't understand the meaning of.",
  "A financial record shows one transaction that shouldn't exist.",
  "A second victim survived and doesn't know they're connected.",
  'Something was found in a place it could not have gotten to on its own.',
  'An alibi has a gap of exactly the wrong length of time.',
];
const MOTIVES = [
  'because the victim recognized a contact who should have stayed unknown',
  'to recover information that cannot become public',
  'to settle a debt in a currency other than coin',
  'to bury evidence of a larger crime',
  'to send a message to someone still alive',
];
const ESCALATION = [
  "They'll notice the party investigating. Someone is sent to assess whether the party is a threat.",
  'If the party gets close, evidence starts disappearing.',
  'A faction offers to "help" — because they have their own interest in the outcome.',
];
const RESOLUTION = [
  "The party identifies the culprit (who won't admit it, but will negotiate).",
  "The party traces the object/person (it's already been destroyed or moved).",
  'The party exposes the false connection (wrong, but politically useful).',
  'The case goes cold — and becomes a rumor the party hears later.',
];

function name() { return D.pick(FIRST) + ' ' + D.pick(LAST); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function Investigations() {
  const ctx = useCtx();
  const log = useLog();
  const [complexity, setComplexity] = useState('moderate');
  const [district, setDistrict] = useState('random');

  function generate() {
    let dist = district; if (dist === 'random') dist = D.pick(DISTRICTS);
    const lvl = Math.max(1, Math.min(20, ctx.partyLevel || 1));
    const incident = D.weightedPick(INCIDENTS);
    const victim = name();
    const vtype = D.pick(VICTIMS[dist]);
    const method = D.pick(METHODS);
    const culprit = D.pick(FACTIONS);
    let other = D.pick(FACTIONS); while (other === culprit) other = D.pick(FACTIONS);

    let factionLine;
    if (lvl <= 5) factionLine = 'An individual member of ' + culprit + ' acted on their own — not faction policy.';
    else if (lvl <= 10) factionLine = culprit + ' is officially involved, but with plausible deniability.';
    else factionLine = culprit + ' and ' + other + ' both have competing interests in this case.';

    let out = '<span class="head">[INVESTIGATION SEED — ' + cap(complexity) + ' — ' + dist + ' — Party Lvl ' + lvl + ']</span>\n\n';
    out += 'THE INCIDENT: ' + incident + '\n';
    out += 'VICTIM: ' + victim + ' — ' + vtype + '\n';
    out += '        Known for: ' + D.pick(KNOWN) + '\n\n';
    out += 'LOCATION: ' + dist + ' — ' + D.pick(['a rented room above a shop', 'a workshop', 'a back office', 'a private apartment', 'a warehouse corner']) + '\n';
    out += '          Scene: ' + D.pick(SCENE) + '\n';
    out += '          Time: ' + D.range(1, 3) + ' nights ago; nobody noticed until now\n\n';
    out += 'METHOD: ' + method[0] + '\n';
    out += '        Identify via: ' + method[1] + '\n\n';
    out += 'FACTION CONNECTION: ' + factionLine + '\n\n';
    out += '<span class="muted">FALSE LEAD: ' + D.pick(FALSE) + '</span>\n\n';
    out += 'REAL CLUE: ' + D.pick(CLUES) + '\n\n';
    out += '<span class="bad">WHAT ACTUALLY HAPPENED (GM ONLY): An agent of ' + culprit + ' is responsible — ' + D.pick(MOTIVES) + '.';
    if (complexity === 'deep') out += ' This connects upward: a faction the party trusts is also involved, and the trail leads toward the Banewarrens.';
    out += '</span>\n\n';
    out += 'ESCALATION (if the party pushes):\n' + D.pickN(ESCALATION, complexity === 'simple' ? 2 : 3).map((e) => '  → ' + e).join('\n') + '\n\n';
    const nres = complexity === 'simple' ? 2 : complexity === 'moderate' ? 3 : 4;
    out += 'RESOLUTION OPTIONS:\n' + D.pickN(RESOLUTION, nres).map((r) => '  → ' + r).join('\n');
    log.append(out);
  }

  return (
    <Layout title="Investigation Seed Generator" sub="Victim · method · false lead · real clue" accent="crimson">
      <div className="runner-main">
        <div className="panel">
          <h2>Investigation</h2>
          <label>Complexity</label>
          <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="simple">Simple (1 session)</option>
            <option value="moderate">Moderate (2–3 sessions)</option>
            <option value="deep">Deep (full arc)</option>
          </select>
          <label>District</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="random">Random</option>
            <option>Docks</option><option>Warrens</option><option>Midtown</option>
            <option>Nobles' Quarter</option><option>Temple District</option><option>Guildsman's</option>
          </select>
          <label>Party Level (1–20)</label>
          <input type="number" min="1" max="20" value={ctx.partyLevel}
            onChange={(e) => ctx.set('partyLevel', Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))} />
          <button className="primary" onClick={generate}>Generate Case</button>
          <SeedControl />
          <p className="hint">"What actually happened" is GM-only — never read it to players.</p>
        </div>
        <Log log={log} title="Case Log" />
      </div>
    </Layout>
  );
}
