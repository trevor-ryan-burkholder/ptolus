import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WHOSWHO } from '../data/index.js';
import { Layout } from '../components/ui.jsx';

const NPCS = (WHOSWHO && WHOSWHO.npcs) || [];
const VENUES = (WHOSWHO && WHOSWHO.venues) || [];
const CANON_DISTRICTS = ["Nobles' Quarter", 'Midtown', 'Temple District', 'South Market', 'North Market', 'Guildsman', 'Oldtown', 'Rivergate', 'Docks', 'Warrens', 'Necropolis', 'Undercity'];

function distinct(arr) { return [...new Set(arr.filter((x) => x && x !== '—'))].sort(); }
const FACTIONS = distinct(NPCS.map((n) => n.faction));
const VTYPES = distinct(VENUES.map((v) => v.type));

function inDistrict(rec, d) {
  return d === 'all' || String(rec.district || '').toLowerCase().indexOf(d.toLowerCase()) !== -1;
}

function NpcCard({ n }) {
  const disp = (n.disposition || '').toLowerCase();
  const meta = [n.race_class, n.district, (n.faction && n.faction !== '—' ? n.faction : '')].filter(Boolean).join(' · ');
  return (
    <div className="card">
      <div className="nm">{n.name}
        {n.alignment && <span className="tagd">{n.alignment}</span>}
        {disp && <span className={'tagd disp-' + disp}>{n.disposition}</span>}
      </div>
      {n.role && <div className="rl">{n.role}</div>}
      <div className="meta">{meta}</div>
      {n.location && n.location !== '—' && <div className="line">📍 {n.location}</div>}
      {n.wants && n.wants !== '—' && <div className="line">Wants: {n.wants}</div>}
      {n.secret && <div className="secret">Secret: {n.secret}</div>}
    </div>
  );
}

function VenueCard({ v }) {
  const meta = [v.district, (v.proprietor && v.proprietor !== '—' ? '👤 ' + v.proprietor : '')].filter(Boolean).join(' · ');
  return (
    <div className="card">
      <div className="nm">{v.name}<span className="tagd">{v.type}</span></div>
      <div className="meta">{meta}</div>
      {v.services && v.services !== '—' && <div className="line">{v.services}</div>}
      {v.prices && v.prices !== '—' && <div className="line">💰 {v.prices}</div>}
      {v.hook && <div className="hook">{v.hook}</div>}
    </div>
  );
}

export default function Whoswho() {
  const [sp] = useSearchParams();
  const [view, setView] = useState(sp.get('view') === 'venues' ? 'venues' : 'npcs');
  const [q, setQ] = useState(sp.get('q') || '');
  const [district, setDistrict] = useState('all');
  const [faction, setFaction] = useState('all');
  const [vtype, setVtype] = useState('all');

  const npcList = useMemo(() => {
    const ql = q.toLowerCase().trim();
    let list = NPCS.filter((n) => inDistrict(n, district) && (faction === 'all' || n.faction === faction));
    if (ql) list = list.filter((n) => ((n.name + ' ' + (n.role || '') + ' ' + (n.race_class || '') + ' ' + (n.faction || '') + ' ' + (n.location || '') + ' ' + (n.wants || '') + ' ' + (n.secret || '')).toLowerCase().indexOf(ql) !== -1));
    return list.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [q, district, faction]);

  const venueList = useMemo(() => {
    const ql = q.toLowerCase().trim();
    let list = VENUES.filter((v) => inDistrict(v, district) && (vtype === 'all' || v.type === vtype));
    if (ql) list = list.filter((v) => ((v.name + ' ' + (v.proprietor || '') + ' ' + (v.services || '') + ' ' + (v.prices || '') + ' ' + (v.hook || '')).toLowerCase().indexOf(ql) !== -1));
    return list.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [q, district, vtype]);

  const count = view === 'npcs'
    ? npcList.length + ' of ' + NPCS.length + ' NPCs'
    : venueList.length + ' of ' + VENUES.length + ' venues';

  const css = `
  .whoswho .controls { display:flex; gap:10px; flex-wrap:wrap; align-items:end; padding:14px 20px 0; }
  .whoswho .controls > div { display:flex; flex-direction:column; }
  .whoswho .controls label { margin:0 0 3px; }
  .whoswho .controls input, .whoswho .controls select { width:auto; }
  .whoswho #q { min-width:240px; }
  .whoswho .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(310px,1fr)); gap:12px; padding:14px 20px 50px; }
  .whoswho .card { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:12px 14px; }
  .whoswho .card .nm { color:var(--gold); font-weight:bold; font-size:17px; }
  .whoswho .card .rl { color:var(--text); font-size:14px; }
  .whoswho .card .meta { color:var(--muted); font-size:13px; margin:4px 0; }
  .whoswho .card .line { font-size:14px; margin:3px 0; }
  .whoswho .card .secret { color:var(--warn); font-size:13px; margin-top:5px; border-left:3px solid var(--gold-dim); padding-left:7px; }
  .whoswho .card .hook { color:var(--muted); font-size:13px; font-style:italic; margin-top:4px; }
  .whoswho .tagd { display:inline-block; font-size:11px; text-transform:uppercase; letter-spacing:1px; border:1px solid var(--line); border-radius:4px; padding:0 6px; margin-left:5px; color:var(--muted); }
  .whoswho .disp-friendly { color:var(--good); } .whoswho .disp-hostile { color:var(--bad); } .whoswho .disp-wary { color:var(--warn); }
  .whoswho .count { color:var(--muted); font-size:13px; padding:2px 20px 0; }
  `;

  return (
    <Layout title="Ptolus Who's-Who" sub="Canon NPCs & venues — GM lookup" contextBar={false}>
      <style>{css}</style>
      <div className="whoswho">
        <div className="controls">
          <div>
            <label htmlFor="view">Show</label>
            <select id="view" value={view} onChange={(e) => setView(e.target.value)}>
              <option value="npcs">NPCs</option>
              <option value="venues">Venues</option>
            </select>
          </div>
          <div>
            <label htmlFor="q">Search</label>
            <input id="q" value={q} placeholder="name, role, faction, what they want…" onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <label htmlFor="district">District</label>
            <select id="district" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="all">All districts</option>
              {CANON_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          {view === 'npcs' && (
            <div>
              <label htmlFor="faction">Faction</label>
              <select id="faction" value={faction} onChange={(e) => setFaction(e.target.value)}>
                <option value="all">All factions</option>
                {FACTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          )}
          {view === 'venues' && (
            <div>
              <label htmlFor="vtype">Type</label>
              <select id="vtype" value={vtype} onChange={(e) => setVtype(e.target.value)}>
                <option value="all">All types</option>
                {VTYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
        </div>
        <p className="count">{count}</p>
        <div className="grid">
          {view === 'npcs'
            ? (npcList.length ? npcList.map((n) => <NpcCard key={n.name} n={n} />) : <p className="count">No NPCs match.</p>)
            : (venueList.length ? venueList.map((v) => <VenueCard key={v.name} v={v} />) : <p className="count">No venues match.</p>)}
        </div>
      </div>
    </Layout>
  );
}
