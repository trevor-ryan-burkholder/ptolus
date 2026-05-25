import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/ui.jsx';
import { useCtx } from '../state/ctx.jsx';
import { readJSON } from '../hooks/useLocalStorage.js';

const MONTHS = ['Newyear', 'Birth', 'Wind', 'Rain', 'Bloom', 'Sun', 'Growth', 'Blessing', 'Toil', 'Harvest', 'Moons', 'Yearsend'];
function ord(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
const DISP = { '-5': 'HOSTILE', '-4': 'ANTAGONISTIC', '-3': 'UNFRIENDLY', '-2': 'WARY', '-1': 'COOL', '0': 'NEUTRAL', '1': 'NOTICED', '2': 'CAUTIOUS ALLY', '3': 'FRIENDLY', '4': 'ALLIED', '5': 'TRUSTED' };
const ARC_NUM = ['', 'I', 'II', 'III', 'IV', 'V'];

const JUMP = ['encounters', 'loot', 'npcs', 'dungeons', 'delve', 'districts', 'city-events', 'jobs', 'rumors', 'quests', 'display'];

export default function Dashboard() {
  const ctx = useCtx();
  const [, setTick] = useState(0);

  // auto-refresh cross-tool localStorage reads
  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('storage', refresh);
    const id = setInterval(refresh, 2000);
    return () => { window.removeEventListener('storage', refresh); clearInterval(id); };
  }, []);

  const cal = readJSON('ptolus-calendar-v1');
  const date = (cal && cal.cur)
    ? (ord(cal.cur.d) + ' of ' + MONTHS[cal.cur.m - 1] + ', ' + cal.cur.y + ' IA')
    : (ctx.date || '—');
  const cb = readJSON('ptolus-combat-v1');
  const ct = readJSON('ptolus-cityturn-v1');
  const dv = readJSON('ptolus-delve-v1');
  const fx = readJSON('ptolus-factions-v1');
  const party = ctx.party || [];

  // combat
  let combatBody;
  if (cb && cb.combatants && cb.combatants.length) {
    const list = cb.combatants.slice().sort((a, b) => b.init - a.init || a.id - b.id);
    const act = list.find((c) => c.id === cb.activeId);
    combatBody = (
      <>
        <div className="big">Round {cb.round || 1} · {list.length} combatants</div>
        <div className="row">Turn: {act ? act.name : '—'}</div>
        <div className="row muted2">{list.slice(0, 8).map((c) => c.name + ' (' + c.init + ')').join(', ')}</div>
      </>
    );
  } else {
    combatBody = <div className="muted2">No combat in progress. <Link to="/combat">Open tracker →</Link></div>;
  }

  // faction clocks
  let clockBody;
  if (ct && ct.projects && ct.projects.length) {
    clockBody = (
      <>
        <div className="muted2">Week {ct.week || 0}</div>
        {ct.projects.slice().sort((a, b) => (b.filled / b.total) - (a.filled / a.total)).slice(0, 6).map((p, i) => (
          <div className="row" key={i}>
            <span className="clock">{'●'.repeat(p.filled) + '○'.repeat(Math.max(0, p.total - p.filled))}</span>{' '}
            {p.fac}{p.filled >= p.total ? ' ✓' : ''}
          </div>
        ))}
      </>
    );
  } else {
    clockBody = <div className="muted2">No clocks. <Link to="/city-turn">Open City Turn →</Link></div>;
  }

  // delve (only when active)
  let delveCard = null;
  if (dv && (dv.elapsed > 0 || (dv.lights && dv.lights.length) || dv.depth > 1)) {
    const h = Math.floor((dv.elapsed || 0) / 60), m = (dv.elapsed || 0) % 60;
    const tstr = (h ? h + 'h ' : '') + m + 'm';
    let lightStr;
    if (!dv.lights || !dv.lights.length) lightStr = <span style={{ color: 'var(--bad)' }}>no light — darkness</span>;
    else {
      const rem = dv.lights.filter((l) => l.remaining != null).map((l) => l.remaining);
      lightStr = dv.lights.length + ' lit' + (rem.length ? ' · ' + Math.min.apply(null, rem) + ' min to next burnout' : '');
    }
    delveCard = (
      <div className="card">
        <h2>Delve <Link to="/delve">tracker →</Link></h2>
        <div className="big">Level {dv.depth || 1} · {tstr} under</div>
        <div className="row">{lightStr}</div>
        <div className="row muted2">Next wandering check in {Math.max(0, dv.toCheck || 0)} min</div>
      </div>
    );
  }

  // live factions (moved off neutral)
  let factionCard = null;
  if (fx && fx.factions) {
    const live = Object.keys(fx.factions).map((k) => fx.factions[k])
      .filter((f) => !f.hidden && f.disp !== 0)
      .sort((a, b) => Math.abs(b.disp) - Math.abs(a.disp)).slice(0, 8);
    if (live.length) {
      factionCard = (
        <div className="card">
          <h2>Factions <Link to="/factions">track →</Link></h2>
          {live.map((f, i) => (
            <div className="row" key={i}>
              <span style={{ color: f.disp < 0 ? 'var(--bad)' : 'var(--gold)' }}>{DISP[String(f.disp)] || f.disp}</span> · {f.name}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <Layout title="GM Dashboard" sub="Everything at a glance" contextBar={false}>
      <style>{css}</style>
      <div className="db-grid">
        <div className="card">
          <h2>Campaign <Link to="/party">edit party →</Link></h2>
          <div className="big">APL {ctx.partyLevel} · Arc {ARC_NUM[ctx.arc]}</div>
          <div className="row">Party of {ctx.partySize} · District: {ctx.district}</div>
          <div className="row muted2">{date}</div>
        </div>

        <div className="card">
          <h2>Party</h2>
          {party.length
            ? party.map((p, i) => (
              <div className="row" key={i}>{p.name || 'PC'} — L{p.level || '?'} {p.cls || ''} · AC {p.ac || '?'} · HP {p.hp || '?'}</div>
            ))
            : <div className="muted2">No roster yet. <Link to="/party">Add PCs →</Link></div>}
        </div>

        <div className="card">
          <h2>Combat <Link to="/combat">tracker →</Link></h2>
          {combatBody}
        </div>

        <div className="card">
          <h2>Faction Clocks <Link to="/city-turn">advance →</Link></h2>
          {clockBody}
        </div>

        {delveCard}
        {factionCard}

        <div className="card">
          <h2>Jump to</h2>
          {JUMP.map((t) => (
            <Link className="pill" to={'/' + t} key={t}>{t.replace('-', ' ')}</Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const css = `
  .db-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:14px; padding:16px 20px 60px; }
  .db-grid .card { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:14px 16px; }
  .db-grid .card h2 { color:var(--gold); font-size:14px; text-transform:uppercase; letter-spacing:1.5px; border-bottom:1px solid var(--line); padding-bottom:6px; margin:0 0 10px; display:flex; }
  .db-grid .card h2 a { margin-left:auto; font-size:12px; }
  .db-grid .big { font-size:22px; color:var(--gold); }
  .db-grid .row { padding:3px 0; font-size:15px; }
  .db-grid .muted2 { color:var(--muted); font-size:13px; }
  .db-grid .clock { font-family:'Courier New',monospace; color:var(--gold); }
  .db-grid .pill { display:inline-block; border:1px solid var(--gold-dim); border-radius:5px; padding:1px 8px; font-size:13px; margin:2px 4px 2px 0; text-decoration:none; color:var(--text); }
`;
