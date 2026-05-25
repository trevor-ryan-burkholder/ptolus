import { useState } from 'react';
import { Link } from 'react-router-dom';
import D from '../lib/dice.js';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

const DTYPE = ['acid', 'cold', 'electricity', 'fire', 'sonic'];
const FUNCS = {
  weak: [
    ['Deals 1d4 {d} damage on a touch attack, 1/day.', 'Weapon'],
    ['Grants darkvision 60 ft. for 10 min, 1/day — splitting headache after.', 'Sensory'],
    ["Detects chaos energy within 30 ft. (glows, hums) — always on, can't be switched off.", 'Sensory'],
    ['One-way communication with another attuned device within 100 ft.', 'Communication'],
    ['Feather fall, 1/day — but activates one round late, unpredictably.', 'Utility'],
    ['Produces an irritating drone on command — or at random.', 'Utility'],
  ],
  moderate: [
    ['Ranged {d} effect (2d6, 3 charges; recharges in chaos fields, Dungeon Level 3+).', 'Weapon'],
    ['Limited flight (10 ft./round, clumsy, 1 minute) — roll instability each round.', 'Utility'],
    ['Fear effect in a 15-ft. cone (Will DC 14) — fires when the user is frightened.', 'Weapon'],
    ['10-ft. force barrier for 1 round, 2/day — sometimes faces the wrong way.', 'Defensive'],
    ['Real-time translation of one language (earpiece) — 30% mistranslation per sentence.', 'Communication'],
    ['Records and replays one conversation up to 10 minutes.', 'Sensory'],
  ],
  strong: [
    ['Replicates a 3rd–5th level spell effect (limited uses).', 'Utility'],
    ['True seeing for 1 minute, 1/day — with 1d4 Wisdom damage.', 'Sensory'],
    ['Teleports the user 30 ft. any direction, 1/day — 10% chance of 1d6×5 ft. deviation.', 'Utility'],
    ['Summons a chaositech construct (CR 4) for 2 rounds, then it goes rogue.', 'Weapon'],
    ['Generates a chaos field (20-ft. radius, 1 round) — 20% spell failure for all inside.', 'Defensive'],
  ],
  apex: [
    ['Replicates a 6th–8th level spell (very limited uses, high instability).', 'Utility'],
    ['Opens a contained portal — destination unstable (roll on a planar table).', 'Utility'],
    ['Antimagic field (30 ft., 1 min) — also suppresses the item itself.', 'Defensive'],
    ['Chaos bomb: 6d6 of a random damage type, 30-ft. radius — single use.', 'Weapon'],
  ],
};
const INSTAB_RANGE = { weak: [1, 2], moderate: [2, 3], strong: [3, 4], apex: [4, 5] };
const INSTAB_LABEL = { 1: 'Stable', 2: 'Slightly Unstable', 3: 'Unstable', 4: 'Volatile', 5: 'Critical' };
const VALUE = { weak: () => D.range(1, 4) * 50, moderate: () => D.range(8, 12) * 100, strong: () => D.range(3, 8) * 1000, apex: () => 15000 + D.range(0, 20) * 1000 };

const GLITCH_UNIV = [
  'Partial function — the effect is halved this time.',
  'Delayed — activates 1d4 rounds later, when least convenient.',
  'Misdirected — affects a random target in range.',
  'Overloaded — double effect now, then a charge is depleted.',
  'Feedback — the user takes 1d6 {d} damage.',
  'Critical glitch — roll Chaotic Backlash (1d20; on a 1 it explodes: 3d6, 10 ft., Ref DC 18 half).',
];
const MAT = ['blackened steel', 'tarnished bronze', 'glass vials of glowing fluid', 'copper wire and crystal', 'bone-inlaid steel', 'leather-wrapped tubing', 'something with no visible mechanism'];
const COND = ['pristine, wrongly so', 'tarnished', 'cracked along one seam', 'badly repaired', 'one component missing', 'clearly salvaged from something larger'];
const TELL = ['glowing fluid', 'a faint hum', 'warm to the touch', 'cold despite the air', 'a smell of ozone', 'a smell that is simply wrong', 'a faint residue it leaves on the skin', 'a vibration when chaos energy is near'];
const NAME_A = ['Resonance', 'Entropy', 'Discord', 'Riot', 'Null', 'Spite', 'Murmur', 'Hollow', 'Seething', 'Galchutt'];
const NAME_N = ['Gauntlet', 'Lens', 'Sphere', 'Rod', 'Censer', 'Maw', 'Coil', 'Eye', 'Harness', 'Phial', 'Filament', 'Brace'];
const QUIRK = ['left-hand only — the right-hand version is undocumented', 'one of a numbered set; this is "III of ?"', 'engraved with a name in a dead script', 'marked with a cult\'s "bones of steel" sigil', 'asymmetrical, as if grown rather than built', 'paired with an empty socket for a second component'];
const FACTION = ['The Inverted Pyramid would pay double to study it.', 'A chaos cult would kill to recover it.', 'House Vladaam has a standing offer for "avalashax."', 'The Conciliators would destroy it on sight.', "Shilukar's people would want it back."];

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

const CANON = [
  ['Attack Sphere', 'Floats and grows blades; for 10 rds anyone you attack in melee is also struck (+10, 2d6). Sphere AC 24, hardness 20, 60 hp.', 45000],
  ['Bomb, Docility', "Silent flash; all within 20 ft. Will DC 17 or docile (half speed, can't attack) 2d10+5 rds.", 800],
  ['Bomb, Infestation', '100 tiny metal insects, 10-ft. radius (−2 all rolls), spreading to 20 ft. for 2 more rds (−1). No save.', 1000],
  ['Bomb, Madness', 'Dark grey vapor, 10-ft. radius. Will DC 18 or confused 1d10+10 rds.', 2500],
  ['Bomb, Void', '10-ft. sphere of blackness. Ref DC 22 to escape; Fort DC 22 or disintegrated (success still 6d6).', 9000],
  ['Chaos Storage Cube', 'Power source for all chaositech. Hardness 10, 50 hp, break DC 30. 100 lbs.', 20000],
  ['Device Destabilizer', "30-ft. cone; 2d20 vs. a trap/lock's DC to disable/open. Clockwork creatures: Fort or 3d6 (permanent).", 8000],
  ['Drilling Spear', 'Shortspear, drill tip. 1d10; full-round vs. an object ignores 6 hardness.', 4650],
  ['Emitter, Disruption Ray', 'Ranged touch, 200 ft., 3d6 to living only; Fort DC 14 or −4 to rolls 1d6+4 rds.', 7500],
  ['Emotion Reader', 'Wrist device; +4 Sense Motive vs. a target within 30 ft.', 1700],
  ['Harrower', '100-ft. line of shards, Ref DC 20 or 6d6; resettable to a 60-ft. cone, 4d6 (Ref DC 16 half).', 23000],
  ['Siphon', 'Refuels chaositech from a storage cube. Never checks for chaotic failure.', 6000],
  ['Spidery Walker', 'Eight-legged vehicle, speed 30, walls & ceilings, carries 900 lbs. AC 18, hardness 10, 100 hp.', 28000],
];

export default function Chaositech() {
  const log = useLog();
  const [power, setPower] = useState('moderate');
  const [type, setType] = useState('any');

  function build() {
    let pool = FUNCS[power];
    if (type !== 'any') { const f = pool.filter((x) => x[1] === type); if (f.length) pool = f; }
    const fn = D.pick(pool);
    const dtype = D.pick(DTYPE);
    const func = fn[0].replace(/\{d\}/g, dtype);
    const itemType = type === 'Unknown' ? 'Unknown' : fn[1];
    const ir = INSTAB_RANGE[power];
    const instab = D.range(ir[0], ir[1]);
    const bar = '█'.repeat(instab) + '░'.repeat(5 - instab);
    const value = VALUE[power]();
    const name = D.pick(NAME_A) + ' ' + D.pick(NAME_N);

    // build a 1d6 glitch table from universal effects (shuffled), dtype-filled
    const glitch = D.pickN(GLITCH_UNIV, 6).map((g) => g.replace(/\{d\}/g, dtype));

    let out = '<span class="head">[CHAOSITECH ITEM — ' + cap(power) + ']</span>\n\n';
    out += 'NAME: ' + name + ' <span class="muted">(' + D.pick(QUIRK) + ')</span>\n';
    out += 'TYPE: ' + itemType + '\n\n';
    out += 'FUNCTION: ' + func + '\n\n';
    out += 'INSTABILITY: ' + bar + ' (' + instab + '/5 — ' + INSTAB_LABEL[instab] + ')\n';
    out += "<span class=\"muted\">GLITCH (roll 1d6 on a natural 1, or at GM's call):</span>\n";
    glitch.forEach((g, i) => { out += '  ' + (i + 1) + ' — ' + g + '\n'; });
    out += '\nAPPEARANCE: ' + cap(D.pick(MAT)) + ', ' + D.pick(COND) + '. Tell: ' + D.pick(TELL) + '.\n';
    out += 'MARKET VALUE: ~' + value.toLocaleString('en-US') + ' gp (black market only; illegal above-ground)\n';
    out += '<span class="muted">FACTION INTEREST: ' + D.pick(FACTION) + '</span>';
    log.append(out);
  }

  function canon() {
    const c = D.pick(CANON);
    log.append('<span class="head">[CANONICAL CHAOSITECH — Ptolus p. 571–573]</span>\n\n' +
      'NAME: ' + c[0] + '\n' +
      'EFFECT: ' + c[1] + '\n' +
      'PRICE: ' + c[2].toLocaleString('en-US') + ' gp\n' +
      '<span class="muted">Powered by a chaos storage cube. Chaotic Failure on a natural 1; Chaotic Backlash on a second 1 (explodes).</span>');
  }

  return (
    <Layout title="Chaositech Generator" sub="Bones of steel — function, glitch, flavor" contextBar={false}>
      <div className="runner-main">
        <div className="panel">
          <h2>Chaositech</h2>
          <label>Power Level</label>
          <select value={power} onChange={(e) => setPower(e.target.value)}>
            <option value="weak">Weak (lvl 1–4)</option>
            <option value="moderate">Moderate (5–10)</option>
            <option value="strong">Strong (11–16)</option>
            <option value="apex">Apex (17+)</option>
          </select>
          <label>Type Filter</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="any">Any</option>
            <option>Weapon</option><option>Utility</option><option>Defensive</option>
            <option>Sensory</option><option>Communication</option><option>Unknown</option>
          </select>
          <button className="primary" onClick={build}>Generate Item</button>
          <button style={{ width: '100%', marginTop: 8 }} onClick={canon}>Canonical Item (Ptolus)</button>
          <SeedControl />
          <p className="hint">Illegal above-ground. The City Watch confiscates it; the Conciliators destroy it; the Inverted Pyramid studies it. (Ptolus p. 566–573) Each use risks corruption — track it in the <Link to="/corruption">Corruption Tracker</Link>.</p>
        </div>
        <Log log={log} title="Chaositech Log" />
      </div>
    </Layout>
  );
}
