import { useEffect, useState } from 'react';
import { Layout } from '../components/ui.jsx';
import { readJSON } from '../hooks/useLocalStorage.js';

const MONTHS = ['Newyear', 'Birth', 'Wind', 'Rain', 'Bloom', 'Sun', 'Growth', 'Blessing', 'Toil', 'Harvest', 'Moons', 'Yearsend'];
function ord(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

function status(c) {
  const dead = (c.conditions || []).some((x) => ['Dead', 'Dying', 'Unconscious', 'Stable'].indexOf(x.name) !== -1) || c.hpCur <= 0;
  if (dead) return ['DOWN', 'b-down'];
  if (c.hpMax && c.hpCur <= c.hpMax / 2) return ['BLOODIED', 'b-bloodied'];
  return ['HEALTHY', 'b-ok'];
}

export default function Display() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('storage', refresh);
    const id = setInterval(refresh, 1500);
    return () => { window.removeEventListener('storage', refresh); clearInterval(id); };
  }, []);

  const cal = readJSON('ptolus-calendar-v1');
  const date = (cal && cal.cur) ? (ord(cal.cur.d) + ' of ' + MONTHS[cal.cur.m - 1] + ', ' + cal.cur.y + ' IA') : '';

  const bc = readJSON('ptolus-broadcast');
  const hasReadAloud = bc && bc.text && bc.text.trim();
  const readAloud = hasReadAloud ? bc.text : 'The table awaits…';

  const cb = readJSON('ptolus-combat-v1');
  const list = (cb && cb.combatants ? cb.combatants.slice() : []).sort((a, b) => b.init - a.init || a.id - b.id);
  const roundLabel = list.length ? '· Round ' + (cb.round || 1) : '';

  return (
    <Layout title="Player View" sub="Live view for the table display" contextBar={false}>
      <style>{css}</style>
      <div className="pv">
        <div className="topline">
          <span className="title">PTOLUS</span>
          <span id="sub">Player View</span>
          <span className="date">{date}</span>
        </div>

        <div className={'readaloud' + (hasReadAloud ? '' : ' empty')}>{readAloud}</div>

        <div className="initwrap">
          <h2>Initiative <span className="round">{roundLabel}</span></h2>
          <ul className="ilist">
            {!list.length
              ? <li className="none">No combat in progress.</li>
              : list.map((c) => {
                const [label, cls] = status(c);
                const act = cb.activeId === c.id;
                return (
                  <li className={act ? 'active' : undefined} key={c.id}>
                    <span className="turn">{act ? '▶' : ''}</span>
                    <span className="nm">{c.name}</span>
                    <span className={'badge ' + cls}>{label}</span>
                  </li>
                );
              })}
          </ul>
        </div>

        <div className="foot">Live view — push read-aloud from Weather, Street Scenes, Encounters, or Handouts; initiative mirrors the Combat Tracker. Open this in a separate window on the table display.</div>
      </div>
    </Layout>
  );
}

const css = `
  .pv { padding:24px 32px 40px; max-width:1100px; margin:0 auto; }
  .pv .topline { display:flex; align-items:baseline; gap:20px; color:var(--muted); border-bottom:1px solid var(--gold-dim); padding-bottom:10px; }
  .pv .topline .title { color:var(--gold); font-size:22px; font-weight:bold; letter-spacing:1px; }
  .pv .topline .date { margin-left:auto; color:var(--gold); font-size:18px; }
  .pv .readaloud { background:#15140f; border:1px solid var(--gold-dim); border-radius:10px; padding:24px 28px; margin:22px 0;
               font-family:Georgia, serif; font-size:26px; line-height:1.5; white-space:pre-wrap; min-height:80px; }
  .pv .readaloud.empty { color:var(--muted); font-style:italic; font-size:20px; }
  .pv .initwrap h2 { color:var(--gold); font-size:16px; text-transform:uppercase; letter-spacing:2px; }
  .pv .initwrap .round { color:var(--gold); font-weight:bold; }
  .pv .ilist { list-style:none; padding:0; margin:8px 0; }
  .pv .ilist li { display:flex; align-items:center; gap:14px; font-size:30px; padding:10px 16px; border-bottom:1px solid var(--line); }
  .pv .ilist li.active { background:#2b2616; border-radius:8px; }
  .pv .ilist li .turn { width:30px; color:var(--gold); }
  .pv .ilist li .nm { flex:1; }
  .pv .badge { font-size:18px; font-weight:bold; padding:3px 14px; border-radius:6px; letter-spacing:1px; }
  .pv .b-ok { color:#9fdf9f; border:1px solid #3a6a3a; }
  .pv .b-bloodied { color:#e8b878; border:1px solid #7a5520; }
  .pv .b-down { color:#f0a0a0; border:1px solid #7a3030; }
  .pv .none { color:var(--muted); font-style:italic; }
  .pv .foot { color:var(--muted); font-size:13px; margin-top:24px; }
`;
