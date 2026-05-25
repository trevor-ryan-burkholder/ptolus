import { useState } from 'react';
import D from '../lib/dice.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

const HOUSES = [
  ['Abanar', 'mercantile old money, politically cautious', 'a commercial empire and creditor networks', 'legal, patient, passive-aggressive'],
  ['Dallimothan', 'dragon-blooded, ancient and proud', 'old wealth and deep secrets', 'slow, deliberate, never forgets'],
  ['Erthuo', 'scholars and collectors', 'knowledge, arcane contacts, rare goods', 'cerebral, indirect, manipulative'],
  ['Kath', 'patrons of the arts', 'social capital and public goodwill', 'reputation, charm, social pressure'],
  ['Khatru', 'military new money, aggressive', 'soldiers and City Watch connections', 'pressure, debt, controlled violence'],
  ['Nagel', 'altruistic and well-liked', 'public goodwill and broad alliances', 'principled, cautious, hard to corner'],
  ['Rau', 'respectable face over rogue dealings', 'criminal ties and quiet money', 'deniable, opportunistic'],
  ['Sadar', 'an ancient lineage, fading', 'political connections and real estate', 'pride, reputation, buried secrets'],
  ['Shever', 'inventors with Shuul ties', 'technology, invention, and wealth', 'innovative, ruthless, secretive'],
  ['Vladaam', 'the most dangerous house, openly feared', 'vast resources and dark magic', 'anything goes; no line uncrossed'],
];
const ASSETS = {
  low: [
    'a marriage contract (an alliance to forge — or dissolve)',
    "the deed to a Nobles' Quarter estate",
    "a piece of blackmail material that embarrasses but doesn't destroy",
  ],
  medium: [
    "a warehouse district on the Guildsman's/Docks border — and the trade route it controls",
    'a City Watch security & inspection contract',
    'a unique grandfathered Dungeon-access permit',
    'two loading docks with grandfathered inspection exemptions',
  ],
  high: [
    'a vacant City Council seat',
    'a title and legal designation that reshapes precedence',
    'control of a Guild chapter',
    'exclusive foreign trade rights',
    'blackmail material that could destroy a house',
  ],
};
const ASK_WANT = [
  ['Find documentation that proves the wrongdoing.', 'Steal and destroy it — there is no legal remedy.'],
  ['Deliver a message to each party.', 'Intimidate the recipients into compliance.'],
  ["Gather information on the rival's dealings.", 'Spy on a protected location.'],
  ['Ensure a particular meeting happens.', 'Coerce an unwilling party to attend.'],
  ["Confirm someone's whereabouts.", 'Set them up to be caught — or worse.'],
  ['Represent the house at a negotiation.', 'Take the blame if it goes wrong.'],
];
const DISPUTE = [
  "{A} holds the deeds; {B} has been quietly buying {A}'s debt from its creditors. Call it all in at once and {A} can't pay — and {B} takes the asset.",
  'Both houses claim a prior right to it. The paperwork is genuinely ambiguous, and each is racing to make their claim a fact on the ground.',
  '{A} controls it now, but {B} has leverage over the official who must renew it — and that renewal is due.',
  'A marriage would have settled it; the betrothal just collapsed, and now both houses are arming lawyers and worse.',
];
const THIRD = [
  "A Delver's Guild factor is watching both houses — the permit/exemptions are worth more than the real estate, and the Guild wants them.",
  'A City Watch officer is positioned to be bribed — or is already genuinely corrupt.',
  'The Inverted Pyramid has an arcane angle no one else sees (they always do).',
  'The Balacazars smell opportunity and are offering "services" to both sides.',
  'A foreign merchant house wants the trade rights and is funding the chaos quietly.',
  'A house servant who knows everything is playing their own game.',
];
const THIRD_HIGH = 'The Forsaken are watching — the contested asset sits atop something they want kept buried.';
const COMPLICATIONS = [
  'A member of one house is not loyal to their house.',
  'The asset is being used for something neither house knows about.',
  "One side has already crossed a line they can't walk back.",
  'A previous party of adventurers took this job and vanished.',
];
const ESCALATION = [
  'Round 1: legal maneuvering, hired investigators, social pressure.',
  'Round 2: evidence goes missing, witnesses recant, a City Watch officer is bribed.',
  'Round 3: one house makes a move that cannot be undone — political, financial, or physical.',
  'Endgame: the losing house collapses or becomes a permanent enemy. The winner owes the party — or blames them.',
];

function roman(a) { return ['', 'I', 'II', 'III', 'IV', 'V'][a] || a; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function NobleSchemes() {
  const ctx = useCtx();
  const log = useLog();
  const [stakes, setStakes] = useState('medium');

  function generate() {
    const arc = ctx.arc;
    const pair = D.pickN(HOUSES, 2);
    const A = pair[0], B = pair[1];
    const asset = D.pick(ASSETS[stakes]);
    const dispute = D.pick(DISPUTE).replace(/\{A\}/g, 'House ' + A[0]).replace(/\{B\}/g, 'House ' + B[0]);
    const askA = D.pick(ASK_WANT), askB = D.pick(ASK_WANT);
    const rewardA = stakes === 'low' ? D.range(4, 8) * 100 : stakes === 'medium' ? D.range(10, 20) * 100 : D.range(4, 10) * 1000;
    const rewardB = Math.round(rewardA * 0.7);

    let out = '<span class="head">[NOBLE SCHEME — Arc ' + roman(arc) + ' — ' + cap(stakes) + ' Stakes]</span>\n\n';
    out += 'HOUSES IN CONFLICT:\n';
    out += '  House ' + A[0] + ' — ' + A[1] + '. Resources: ' + A[2] + '. Style: ' + A[3] + '.\n';
    out += '  House ' + B[0] + ' — ' + B[1] + '. Resources: ' + B[2] + '. Style: ' + B[3] + '.\n\n';
    out += 'CONTESTED ASSET: ' + asset + '.\n\n';
    out += 'THE DISPUTE: ' + dispute + '\n\n';
    out += 'WHAT HOUSE ' + A[0].toUpperCase() + ' ASKS: ' + askA[0] + ' (pays ~' + rewardA.toLocaleString('en-US') + ' gp)\n';
    out += "<span class=\"muted\">WHAT THEY ACTUALLY WANT: " + askA[1] + " They didn't say it — they hoped the party would work it out.</span>\n\n";
    out += 'WHAT HOUSE ' + B[0].toUpperCase() + ' ASKS (if approached): ' + askB[0] + ' (pays ~' + rewardB.toLocaleString('en-US') + ' gp)\n';
    out += '<span class="muted">WHAT THEY ACTUALLY WANT: ' + askB[1] + '</span>\n\n';
    out += 'THIRD PARTY: ' + D.pick(THIRD) + (arc >= 3 ? '\n             ' + THIRD_HIGH : '') + '\n\n';
    out += 'ESCALATION (by depth of involvement):\n' + ESCALATION.map((e) => '  → ' + e).join('\n') + '\n\n';
    out += '<span class="muted">COMPLICATION: ' + D.pick(COMPLICATIONS) + '</span>';
    log.append(out);
  }

  return (
    <Layout title="Noble Scheme Generator" sub="Two houses, a contested asset, and what nobody says" accent="crimson">
      <div className="runner-main">
        <div className="panel">
          <h2>Noble Scheme</h2>
          <label>Campaign Arc</label>
          <select value={Math.max(2, Math.min(4, ctx.arc))} onChange={(e) => ctx.set('arc', parseInt(e.target.value, 10))}>
            <option value={2}>Arc II</option><option value={3}>Arc III</option><option value={4}>Arc IV</option>
          </select>
          <label>Stakes</label>
          <select value={stakes} onChange={(e) => setStakes(e.target.value)}>
            <option value="low">Low (local, recoverable)</option>
            <option value="medium">Medium (district-level)</option>
            <option value="high">High (city-wide)</option>
          </select>
          <button className="primary" onClick={generate}>Generate Scheme</button>
          <SeedControl />
          <p className="hint">Canonical houses (Ptolus): Abanar, Dallimothan, Erthuo, Kath, Khatru, Nagel, Rau, Sadar, Shever, Vladaam.</p>
        </div>
        <Log log={log} title="Scheme Log" />
      </div>
    </Layout>
  );
}
