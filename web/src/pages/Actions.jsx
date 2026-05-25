import { Layout } from '../components/ui.jsx';

const ACTION_TYPES = [
  ['Standard', '1', 'Attack, cast most spells, activate items'],
  ['Move', '1', 'Move up to speed, draw weapon, pick up item'],
  ['Full-Round', 'replaces both', 'Full attack, charge, run, coup de grace'],
  ['Free', 'several', 'Drop item, speak, cease concentration'],
  ['Swift', '1/turn', 'Quickened spell, some class abilities'],
  ['Immediate', '1/round', "Out-of-turn; uses next turn's swift"],
  ['Attack of Opportunity', 'varies', 'Triggered by actions in a threatened square'],
];

const MANEUVERS = [
  ['Trip', 'Melee touch, then Str vs Str/Dex', 'Target prone'],
  ['Disarm', 'Melee touch, opposed attack', 'Weapon dropped (or to you)'],
  ['Grapple', 'Melee touch, then Grapple check', 'Target grappled'],
  ['Sunder', 'Attack vs object AC (provokes)', 'Damage the object'],
  ['Feint', 'Bluff vs Sense Motive', 'Target loses Dex to AC for 1 attack'],
  ['Bull Rush', 'Str check (opposed)', 'Push target back'],
  ['Overrun', 'Str check (opposed)', 'Move through their square'],
];

export default function Actions() {
  return (
    <Layout title="Action Economy Reference" sub="What can be done in a round" contextBar={false}>
      <style>{`
        .act-wrap { padding:16px 20px 60px; max-width:900px; }
        .act-wrap details { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; margin-bottom:10px; padding:0 14px; }
        .act-wrap details summary { cursor:pointer; color:var(--gold); font-size:16px; font-weight:bold; padding:12px 0; letter-spacing:0.5px; }
        .act-wrap details[open] summary { border-bottom:1px solid var(--line); margin-bottom:8px; }
        .act-wrap details ul { margin:6px 0 12px; padding-left:22px; }
        .act-wrap details li { margin:3px 0; font-size:15px; line-height:1.4; }
        .act-wrap .yes { color:var(--good); } .act-wrap .no { color:var(--bad); }
      `}</style>
      <div className="act-wrap">
        <table className="ref">
          <tbody>
            <tr><th>Action Type</th><th>Per Round</th><th>Typical Uses</th></tr>
            {ACTION_TYPES.map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="hint">A standard + a move = a round. A full-round action replaces both.</p>

        <details open>
          <summary>Standard Actions</summary>
          <ul>
            <li>Single attack (highest BAB) / unarmed strike</li>
            <li>Cast a touch spell and touch a target the same round</li>
            <li>A special attack: disarm, trip, sunder, feint</li>
            <li>Cast a spell with a 1-standard-action casting time</li>
            <li>Activate a scroll (spell completion) or wand (spell trigger)</li>
            <li>Use a supernatural or activated magic item (command word is free)</li>
            <li>Administer a potion to another creature</li>
            <li>Ready an action; start/complete a full-round action</li>
          </ul>
        </details>

        <details open>
          <summary>Move Actions</summary>
          <ul>
            <li>Move up to your speed</li>
            <li>Draw/sheathe a weapon (draw is free during a move if BAB +1 or higher)</li>
            <li>Pick up an item; retrieve a stored item</li>
            <li>Load a hand or light crossbow</li>
            <li>Open or close a door; mount or dismount</li>
            <li>Stand up from prone (provokes AoO)</li>
            <li>Move a heavy object (half speed)</li>
          </ul>
        </details>

        <details>
          <summary>Full-Round Actions</summary>
          <ul>
            <li>Full attack (iteratives at −5 / −10 / −15)</li>
            <li>Charge (2× speed straight line, then attack: +2 attack, −2 AC)</li>
            <li>Run (4× speed straight line, −4 AC)</li>
            <li>Coup de grace on a helpless foe (auto-crit; Fort DC 10 + damage or die)</li>
            <li>Withdraw (2× speed; no AoO from your starting square)</li>
            <li>Load a heavy/repeating crossbow; cast a 1-full-round spell</li>
          </ul>
        </details>

        <details>
          <summary>Free / Swift / Immediate</summary>
          <ul>
            <li><strong>Free:</strong> drop an item, drop prone, speak briefly, cease concentration, use a command-word item</li>
            <li><strong>Swift (1/turn):</strong> cast a swift-time spell, activate a quickened spell, some class abilities</li>
            <li><strong>Immediate (1/round):</strong> <em>feather fall</em> while falling; some defensive triggers. Uses your next turn's swift if used between turns.</li>
          </ul>
        </details>

        <details>
          <summary>Attacks of Opportunity</summary>
          <p style={{ margin: '4px 0' }}><span className="no">Provokes:</span></p>
          <ul>
            <li>Moving through a threatened square</li>
            <li>Casting in melee (unless Defensive Casting, DC 15 + spell level)</li>
            <li>Using a ranged weapon in melee; loading a crossbow</li>
            <li>Standing up from prone; picking up or retrieving an item</li>
            <li>Most skill uses in a threatened square</li>
          </ul>
          <p style={{ margin: '4px 0' }}><span className="yes">Does NOT provoke:</span></p>
          <ul>
            <li>Drawing a weapon (if BAB +1+, free during a move)</li>
            <li>The first square you move out of; a 5-foot step</li>
            <li>Swift actions; total defense</li>
          </ul>
          <p style={{ margin: '4px 0' }}>Limit: 1 AoO per threatening creature per round (Combat Reflexes adds your Dex modifier in extra AoOs).</p>
        </details>

        <details>
          <summary>5-Foot Step · Ready · Delay</summary>
          <ul>
            <li><strong>5-foot step:</strong> 5 ft, no AoO, once/round, only if you haven't otherwise moved.</li>
            <li><strong>Ready:</strong> "I ready to [action] when [trigger]." Uses your standard action; you act just before the trigger.</li>
            <li><strong>Delay:</strong> voluntarily act later in the round; your initiative resets to where you act.</li>
          </ul>
        </details>

        <details>
          <summary>Combat Maneuvers</summary>
          <table className="ref">
            <tbody>
              <tr><th>Maneuver</th><th>Check</th><th>On Success</th></tr>
              {MANEUVERS.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="hint">All provoke an AoO unless a feat (e.g., Improved Trip) says otherwise. Feint in combat is a standard action.</p>
        </details>
      </div>
    </Layout>
  );
}
