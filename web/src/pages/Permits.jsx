import { useState } from 'react';
import GRADES from '../lib/grades.js';
import { Layout, esc } from '../components/ui.jsx';

const CITY_LICENSES = [
  ['Firearms Permit', 'Owning/carrying firearms in the city', '10 gp + 5 gp/yr', 'Seized; 100 gp fine (rising to 500 gp + 30 days)'],
  ['Business License', 'Any fixed commercial enterprise', '25–100 gp/yr', 'Shuttered, goods seized; 200 gp + back fees'],
  ['Publishing License', 'Public broadsheets, books, pamphlets', '15 gp/title or 50 gp/yr', 'Print run seized; 150 gp (sedition: up to 1 yr)'],
  ['Spell Use Permit', 'Mass-effect/destructive spells in the city', '500 gp/use; 1,000 gp/yr standing', '500–800 gp; Watch list (repeat: up to 5 yr)'],
];

const VIOLATIONS = [
  ['Failure to produce a required permit', '100–500 gp', 'None (first)'],
  ['Unlicensed business', '200 gp + back fees', 'None (first)'],
  ['Trafficking illegal goods (mundane)', '500 gp', '1 year'],
  ['Trafficking illegal goods (magic)', '800 gp', '5 years'],
  ['Chaositech possession/sale', 'Confiscation + 1,000 gp', '2–10 years'],
  ['Unlicensed mass spellcasting', '500–800 gp', 'Up to 5 years'],
];

const GRADE_PERMITS = [
  { open: true, summary: 'Grade 4 — Movement Permit (CR 1/4–1)', body: 'Daytime travel on designated routes, no overnight stay. 5 gp/month, clerk-level, low scrutiny. Must use Undercity Market routes; barred from Nobles\' Quarter, Temple District, Oldtown unescorted. Without it: detained & escorted out, 25 gp fine; aggressive/repeat → lethal response authorized.' },
  { open: false, summary: 'Grade 3 — Residency Permit (CR 2–5)', body: 'Registered residence, free daylight movement in most districts. 50 gp/year + 2 letters of reference (Delver\'s Guild membership counts). Curfew midnight–dawn unless +20 gp/yr Night Travel Endorsement. Without it: treated as Grade 2 threat; Commissar\'s Men; 100 gp + forced registration or expulsion.' },
  { open: false, summary: 'Grade 2 — Special Dispensation (CR 6–10)', body: 'Presence with a sponsor (noble house, major guild, or church) who assumes liability. 500 gp one-time (250 gp/yr renewal). Must register address with the district captain; no independent commercial/violent operation. Without it: Commissar\'s Men (1d4+2) respond; creature detained or killed; known sponsor fined 1,000 gp.' },
  { open: false, summary: 'Grade 1 — Council Exception (CR 11–15)', body: 'Case-by-case, requires a City Council vote. Political capital + ~2,000–5,000 gp in fees/bribes. Permanent probation; any incident triggers review. Without it: Commissar\'s Men + Watch; Imperial Eyes notified; maximum-force authorization.' },
  { open: false, summary: 'Special Grade — No Permit (CR 16+)', body: 'No system applies; presence is treated as an active emergency. All forces respond; Inverted Pyramid notified; Knights of the Pale if undead/chaos. Rare exception: ancient dragons with house ties, by direct Commissar arrangement (not a permit).' },
];

const WATCH_RESPONSE = [
  ['Grade 4, no Movement Permit', '1–2 Watch officers', 'Only if it resists'],
  ['Grade 3, no Residency Permit', '1d4 Watch', 'Commissar\'s Men if it flees'],
  ['Grade 2, no Dispensation', '1d4+2 Watch + sergeant', 'Commissar\'s Men simultaneously'],
  ['Grade 1, no Exception', 'Commissar\'s Men (full unit)', 'Imperial Eyes notified'],
  ['Special Grade (any)', 'All available forces', 'Emergency; Inverted Pyramid notified'],
  ['Unlicensed firearm', '1 Watch officer', 'Escalates if owner resists'],
  ['Illegal spell use', '1d4 Watch + Watch mage', 'Inverted Pyramid liaison consulted'],
];

const GM_NOTES = [
  'Uneven enforcement: Nobles\' Quarter & Temple District are strict; the Warrens & Docks are lax. A quiet Grade 3 in the Warrens may never be questioned; the same creature in Midtown draws Watch within hours.',
  'Delver\'s Guild membership isn\'t a permit, but Watch officers give "working delvers" latitude.',
  'Bribes: a Watch officer overlooks a minor violation for 10–20 gp. Commissar\'s Men: 100–200 gp — and offering is itself a crime if refused.',
  'The Balacazars run a shadow permit system for creatures they employ — no legal weight, but they\'ll intervene (for a price) if the Watch moves on their assets.',
];

export default function Permits() {
  const [mname, setMname] = useState('');
  const [cr, setCr] = useState('3');
  const [result, setResult] = useState('');

  function lookUp() {
    const name = mname.trim();
    const crVal = parseFloat(cr);
    const g = GRADES.classify(name || null, isNaN(crVal) ? null : crVal) || (isNaN(crVal) ? null : GRADES.byCR(crVal));
    if (!g) { setResult('Enter a CR (and optionally a known monster name).'); return; }
    const permit = GRADES.permits[g.grade] || '';
    setResult(
      '<span class="head">' + (name ? esc(name) + ' — ' : '') + g.grade + ' (' + g.crLabel + ')</span>\n' +
      'Legal status: ' + g.status + '\n' +
      'Permit: ' + permit + '\n' +
      'Watch response: ' + g.response + ' (' + g.responseDice + ')\n' +
      'On the street: ' + g.social
    );
  }

  return (
    <Layout title="Ptolus Permits & Licensing" sub="Costs, issuers, consequences, grades" contextBar={false}>
      <style>{`
        .permits-wrap { padding:16px 20px 60px; max-width:920px; }
        .permits-wrap h2.sec { color:var(--gold); font-size:15px; text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid var(--line); margin:24px 0 10px; padding-bottom:5px; }
        .permits-wrap .lookup { background:var(--bg-panel); border:1px solid var(--gold-dim); border-radius:8px; padding:14px; display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; }
        .permits-wrap .lookup input { width:120px; }
        .permits-wrap #lookresult { margin-top:12px; white-space:pre-wrap; font-family:'Courier New',monospace; font-size:15px; }
        .permits-wrap details { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; margin-bottom:10px; padding:0 14px; }
        .permits-wrap details summary { cursor:pointer; color:var(--gold); font-weight:bold; padding:11px 0; }
        .permits-wrap details[open] summary { border-bottom:1px solid var(--line); margin-bottom:8px; }
        .permits-wrap details p, .permits-wrap details ul { font-size:14px; line-height:1.45; }
        .permits-wrap footer { color:var(--muted); font-size:13px; padding:10px 0 0; }
      `}</style>
      <div className="permits-wrap">
        <h2 className="sec">CR → Grade Quick Lookup</h2>
        <div className="lookup">
          <div>
            <div className="hint">Monster name (optional)</div>
            <input value={mname} placeholder="e.g. Troll" onChange={(e) => setMname(e.target.value)} />
          </div>
          <div>
            <div className="hint">CR</div>
            <input type="number" step="0.25" value={cr} onChange={(e) => setCr(e.target.value)} />
          </div>
          <button className="primary" onClick={lookUp} style={{ width: 'auto', margin: 0, padding: '10px 18px' }}>Look Up</button>
        </div>
        {result && <div id="lookresult" dangerouslySetInnerHTML={{ __html: result }} />}

        <h2 className="sec">Canonical City Licenses (Ptolus p. 553–559)</h2>
        <table className="ref">
          <tbody>
            <tr><th>License</th><th>For</th><th>Cost</th><th>Without it</th></tr>
            {CITY_LICENSES.map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="hint">Issued at the Administration Building, Oldtown (dawn–dusk, closed Sixday). Adventuring spells in active combat are generally not prosecuted absent serious collateral damage.</p>

        <h2 className="sec">Trafficking & Violation Penalties (Ptolus p. 555)</h2>
        <table className="ref">
          <tbody>
            <tr><th>Offense</th><th>Fine</th><th>Imprisonment</th></tr>
            {VIOLATIONS.map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 className="sec">Monster Grade Permits <span className="hint">[homebrew]</span></h2>
        {GRADE_PERMITS.map((g) => (
          <details key={g.summary} open={g.open}>
            <summary>{g.summary}</summary>
            <p>{g.body}</p>
          </details>
        ))}

        <h2 className="sec">City Watch Response by Violation</h2>
        <table className="ref">
          <tbody>
            <tr><th>Situation</th><th>First Responder</th><th>Escalation</th></tr>
            {WATCH_RESPONSE.map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 className="sec">GM Notes</h2>
        <ul>
          {GM_NOTES.map((n, i) => <li key={i}>{n}</li>)}
        </ul>

        <footer>City permits: Ptolus p. 553–559. Monster grades: homebrew (see runner/docs/08-monster-grades.md). Administration Building, Oldtown.</footer>
      </div>
    </Layout>
  );
}
