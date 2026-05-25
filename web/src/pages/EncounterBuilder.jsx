import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Dice from '../lib/dice.js';
import Tables from '../lib/tables.js';
import GRADES from '../lib/grades.js';
import { DATA } from '../data/index.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout } from '../components/ui.jsx';

// XP for the whole encounter by (EL − APL) — mirrors the XP Calculator (Xp.jsx).
function xpForDiff(diff) {
  const T = { '-4': 75, '-3': 150, '-2': 300, '-1': 600, 0: 1200, 1: 1800, 2: 2700, 3: 3600, 4: 5400 };
  if (diff <= -5) return 0;
  if (diff >= 5) return 7200;
  return T[String(diff)];
}
function difficulty(diff) {
  if (diff <= -3) return ['Trivial', 'good'];
  if (diff <= -1) return ['Easy', 'good'];
  if (diff === 0) return ['Standard (≈20% of party resources)', ''];
  if (diff === 1) return ['Challenging', 'warn'];
  if (diff === 2) return ['Hard', 'warn'];
  if (diff === 3) return ['Very hard', 'bad'];
  return ['Overwhelming — TPK risk', 'bad'];
}
const comma = (n) => Math.round(n).toLocaleString('en-US');

const POOL = DATA.monsters.filter((m) => m.cr_value > 0).slice().sort((a, b) => a.cr_value - b.cr_value || a.name.localeCompare(b.name));

const CSS = `
.eb-add { position:relative; }
.eb-matches { border:1px solid var(--line); border-radius:6px; margin-top:6px; max-height:46vh; overflow-y:auto; }
.eb-matches .row { display:flex; justify-content:space-between; gap:8px; padding:6px 10px; cursor:pointer; font-size:14px; border-bottom:1px solid var(--line-soft); }
.eb-matches .row:last-child { border-bottom:none; }
.eb-matches .row:hover { background:var(--bg-input); }
.eb-matches .row .cr { color:var(--muted); font-size:13px; white-space:nowrap; }
.eb-roster td .cnt { display:inline-flex; align-items:center; gap:6px; }
.eb-roster td .cnt button { width:26px; padding:2px 0; font-size:15px; }
.eb-roster td .rm { color:var(--bad); cursor:pointer; background:none; border:none; font-size:16px; padding:0 4px; width:auto; }
.eb-sum { margin-top:14px; }
.eb-sum .big { font-size:30px; font-family:var(--font-display); color:var(--gold); }
.eb-sum .row { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid var(--line-soft); }
.eb-sum .row:last-child { border-bottom:none; }
.eb-sum .row .v { color:var(--text); font-weight:bold; }
`;

export default function EncounterBuilder() {
  const ctx = useCtx();
  const apl = ctx.partyLevel;
  const [size, setSize] = useState(4);
  const [q, setQ] = useState('');
  // roster: { [name]: { m, n } }
  const [roster, setRoster] = useState({});
  const [note, setNote] = useState('');

  const matches = useMemo(() => {
    const ql = q.toLowerCase().trim();
    if (!ql) return POOL.slice(0, 16);
    return POOL.filter((m) => m.name.toLowerCase().includes(ql) || (m.type || '').toLowerCase().includes(ql)).slice(0, 24);
  }, [q]);

  const list = Object.values(roster);
  const crList = list.flatMap((e) => Array(e.n).fill(e.m.cr_value));
  const el = crList.length ? Tables.elFromCRs(crList) : 0;
  const diff = el - apl;
  const [diffLabel, diffClass] = difficulty(diff);
  const partyXP = crList.length ? xpForDiff(diff) : 0;
  const perPC = Math.round(partyXP / Math.max(1, size));
  const loot = crList.length ? Tables.treasureValueByEL(el) : null;
  const headcount = crList.length;

  function add(m) { setRoster((r) => ({ ...r, [m.name]: { m, n: (r[m.name]?.n || 0) + 1 } })); setNote(''); }
  function bump(name, d) {
    setRoster((r) => {
      const e = r[name]; if (!e) return r;
      const n = e.n + d;
      if (n <= 0) { const c = { ...r }; delete c[name]; return c; }
      return { ...r, [name]: { ...e, n } };
    });
  }
  function remove(name) { setRoster((r) => { const c = { ...r }; delete c[name]; return c; }); }
  function clear() { setRoster({}); setNote(''); }

  function sendToCombat() {
    if (!headcount) { setNote('Add at least one monster first.'); return; }
    const expanded = list.flatMap((e) => Array(e.n).fill(e.m));
    const counts = {}; expanded.forEach((m) => { counts[m.name] = (counts[m.name] || 0) + 1; });
    const seen = {};
    const combatants = expanded.map((m) => {
      let hp = m.hp; try { if (m.hd) hp = Dice.d(m.hd.replace(/\s/g, '')); } catch { /* keep listed hp */ }
      hp = Math.max(1, hp);
      let name = m.name;
      if (counts[m.name] > 1) { seen[m.name] = (seen[m.name] || 0) + 1; name = m.name + ' ' + seen[m.name]; }
      return { name, srcName: m.name, hp, maxhp: hp, init: Dice.roll(20) + (m.initiative || 0), cr: m.cr };
    });
    try { localStorage.setItem('ptolus-pending-encounter', JSON.stringify({ combatants, ts: Date.now() })); } catch { /* quota */ }
    setNote('✓ Sent ' + combatants.length + ' combatant(s) to the Combat Tracker.');
  }

  function copySummary() {
    const lines = list.map((e) => e.m.name + ' (CR ' + e.m.cr + ')' + (e.n > 1 ? ' ×' + e.n : ''));
    const txt = ['ENCOUNTER (APL ' + apl + ', party of ' + size + ')', ...lines,
      '→ EL ' + el + ' — ' + diffLabel,
      '→ XP: ' + comma(partyXP) + ' total / ' + comma(perPC) + ' each',
      loot ? '→ Avg loot: ' + Tables.gp(loot.coins_gp) + ' coins, ' + Tables.gp(loot.goods_gp) + ' goods, ' + Tables.gp(loot.items_gp) + ' items' : '',
    ].filter(Boolean).join('\n');
    try { navigator.clipboard.writeText(txt); setNote('✓ Summary copied.'); } catch { setNote(txt); }
  }

  // City Watch grade for the toughest creature (Ptolus flavor)
  const toughest = list.length ? list.map((e) => e.m).sort((a, b) => b.cr_value - a.cr_value)[0] : null;
  const grade = toughest ? GRADES.classify(toughest.name, toughest.cr_value) : null;

  return (
    <Layout title="Encounter Builder" sub="Hand-pick monsters to a target EL">
      <style>{CSS}</style>
      <div className="runner-main">
        <div className="panel">
          <h2>Build</h2>
          <p className="hint">APL {apl} (set in the bar above). For a random encounter instead, use <Link to="/encounters">Encounters</Link>.</p>
          <label>Party size</label>
          <input type="number" min="1" max="12" value={size} onChange={(e) => setSize(Math.max(1, parseInt(e.target.value, 10) || 1))} />
          <label>Add monster</label>
          <div className="eb-add">
            <input placeholder="Search the bestiary…" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="eb-matches">
              {matches.map((m) => (
                <div className="row" key={m.name} onClick={() => add(m)}>
                  <span>{m.name}</span><span className="cr">CR {m.cr} · {m.type}</span>
                </div>
              ))}
              {matches.length === 0 && <div className="row"><span className="muted">No matches.</span></div>}
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="log-head"><h2 style={{ margin: 0 }}>Current Encounter</h2>
              <button style={{ marginLeft: 'auto', width: 'auto' }} onClick={clear}>Clear</button></div>
            {headcount === 0
              ? <p className="hint">Search on the left and click monsters to add them.</p>
              : (
                <table className="ref eb-roster">
                  <thead><tr><th>Monster</th><th>CR</th><th>Count</th><th></th></tr></thead>
                  <tbody>
                    {list.map((e) => (
                      <tr key={e.m.name}>
                        <td>{e.m.name}</td>
                        <td>{e.m.cr}</td>
                        <td><span className="cnt"><button onClick={() => bump(e.m.name, -1)}>−</button>{e.n}<button onClick={() => bump(e.m.name, 1)}>+</button></span></td>
                        <td><button className="rm" title="Remove" onClick={() => remove(e.m.name)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            {headcount > 0 && (
              <div className="eb-sum">
                <div className="big">EL {el}</div>
                <div className="row"><span>Difficulty vs APL {apl}</span><span className={'v ' + diffClass}>{diffLabel}</span></div>
                <div className="row"><span>Creatures</span><span className="v">{headcount}</span></div>
                <div className="row"><span>XP (party total)</span><span className="v">{comma(partyXP)}</span></div>
                <div className="row"><span>XP each (party of {size})</span><span className="v">{comma(perPC)}</span></div>
                {loot && <div className="row"><span>Avg loot</span><span className="v">{Tables.gp(loot.coins_gp + loot.goods_gp + loot.items_gp)}</span></div>}
                {grade && <div className="row"><span>City Watch (toughest)</span><span className="v">{grade.grade}</span></div>}
              </div>
            )}

            <div className="btn-row">
              <button className="primary" style={{ marginTop: 12 }} onClick={sendToCombat}>⚔ Send to Combat Tracker</button>
            </div>
            <div className="btn-row"><button onClick={copySummary}>Copy summary</button></div>
            {note && <p className="hint" style={{ color: note[0] === '✓' ? 'var(--good)' : 'var(--warn)' }}>{note}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
