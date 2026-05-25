import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATALOG, CATEGORIES } from '../catalog.js';
import { DATA, DIVINE, WHOSWHO } from '../data/index.js';
import { DiceTray, SpireMark } from '../components/ui.jsx';

const TOOLS = CATALOG.filter((t) => !t.banner);
const BANNERS = CATALOG.filter((t) => t.banner);

export default function Home() {
  const [q, setQ] = useState('');
  const ql = q.toLowerCase().trim();

  const results = useMemo(() => {
    if (ql.length < 2) return null;
    const tools = CATALOG.filter((t) => t.name.toLowerCase().includes(ql)).slice(0, 8)
      .map((t) => ({ label: t.name.replace(/^[^\w]+\s*/, ''), to: '/' + t.path }));
    const hit = (arr, fn) => (arr || []).filter((e) => e.name.toLowerCase().includes(ql)).slice(0, 6).map(fn);
    const npcs = hit(WHOSWHO.npcs, (e) => ({ label: e.name, sub: e.faction && e.faction !== '—' ? e.faction : e.role, to: '/whoswho?view=npcs&q=' + encodeURIComponent(e.name) }));
    const venues = hit(WHOSWHO.venues, (e) => ({ label: e.name, sub: e.type, to: '/whoswho?view=venues&q=' + encodeURIComponent(e.name) }));
    const deities = hit(DIVINE.deities, (e) => ({ label: e.name, sub: e.title, to: '/divine?view=deities&q=' + encodeURIComponent(e.name) }));
    const monsters = hit(DATA.monsters, (e) => ({ label: e.name, sub: 'CR ' + e.cr, to: '/codex?tab=monsters&q=' + encodeURIComponent(e.name) }));
    const spells = hit(DATA.spells, (e) => ({ label: e.name, sub: e.school, to: '/codex?tab=spells&q=' + encodeURIComponent(e.name) }));
    const items = hit(DATA.magicItems, (e) => ({ label: e.name, sub: e.tier, to: '/codex?tab=magicItems&q=' + encodeURIComponent(e.name) }));
    return [['Tools', tools], ['NPCs', npcs], ['Venues', venues], ['Deities', deities], ['Monsters', monsters], ['Spells', spells], ['Magic Items', items]].filter(([, a]) => a.length);
  }, [ql]);

  const byCat = useMemo(() => {
    const m = {};
    TOOLS.forEach((t) => { (m[t.cat] = m[t.cat] || []).push(t); });
    return m;
  }, []);

  return (
    <>
      <header className="runner-head">
        <SpireMark />
        <h1>Ptolus Adventure Runner</h1>
        <span className="sub">GM tools for the City by the Spire — 3.5e / d20</span>
      </header>
      <div className="launch-wrap">
        <p className="tagline">Self-contained table tools. Pick a generator. Every page has a seed control for deterministic re-rolls.</p>

        <div className="palette-wrap">
          <input id="palette" placeholder="Search everything — tools, monsters, spells, items, NPCs, deities…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
          {results && (
            <div className="results">
              {results.length === 0 ? <div className="none">No matches for "{q}".</div> : results.map(([grp, items]) => (
                <div key={grp}>
                  <div className="rgrp">{grp}</div>
                  {items.map((r, i) => <Link key={i} to={r.to} onClick={() => setQ('')}>{r.label}{r.sub ? <span className="rsub"> · {r.sub}</span> : null}</Link>)}
                </div>
              ))}
            </div>
          )}
        </div>

        {BANNERS.map((b) => (
          <Link className="banner" key={b.path} to={'/' + b.path}>
            <div className="name">{b.name}</div>
            <div className="desc">{b.desc}</div>
          </Link>
        ))}

        {CATEGORIES.filter((c) => byCat[c]).map((cat) => (
          <div className="cat" key={cat}>
            <h2>{cat}</h2>
            <div className="grid">
              {byCat[cat].map((t) => (
                <Link className="card" key={t.path} to={'/' + t.path}>
                  <div className="name">{t.name}</div>
                  <div className="desc">{t.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <DiceTray />
    </>
  );
}
