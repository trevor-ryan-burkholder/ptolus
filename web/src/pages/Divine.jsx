import { useMemo, useState } from 'react';
import { DIVINE } from '../data/index.js';
import { Layout } from '../components/ui.jsx';

const DEI = (DIVINE && DIVINE.deities) || [];
const DOM = (DIVINE && DIVINE.domains) || [];
const DOMMAP = {};
DOM.forEach((d) => { DOMMAP[d.name.toLowerCase()] = d; });
function domByName(n) { return DOMMAP[String(n).toLowerCase()] || null; }

function SpellTable({ d }) {
  if (!d.spells || !d.spells.length) {
    return <div className="ptol">Spell list defined in {d.source} — see the core book.</div>;
  }
  return (
    <table className="spells"><tbody>
      {d.spells.map((s, i) => {
        const m = String(s).match(/^\s*(\d+)\s*[:.\-]\s*(.*)$/);
        const lv = m ? m[1] : '?';
        const nm = m ? m[2] : s;
        return <tr key={i}><td className="lv">{lv}</td><td><i>{nm}</i></td></tr>;
      })}
    </tbody></table>
  );
}

function DomCard({ d }) {
  return (
    <div className="domcard">
      <h3>{d.name}<span className={'src' + (d.prestige ? ' prestige' : '')}>{d.source}{d.prestige ? ' · prestige' : ''}</span></h3>
      {d.granted && <div className="granted"><b>Granted Power:</b> {d.granted}</div>}
      <SpellTable d={d} />
      {d.ptolus && <div className="ptol">{d.ptolus}</div>}
    </div>
  );
}

function DeityCard({ de, onChip }) {
  return (
    <div className="dcard">
      <div className="nm">{de.name}{de.title && <span className="ti"> — {de.title}</span>}
        {de.alignment && <span className="src"> {de.alignment}</span>}</div>
      {de.portfolio && <div>{de.portfolio}</div>}
      {(de.domains || []).length > 0 && (
        <div style={{ marginTop: 6 }}>
          {(de.domains || []).map((n) => (
            <span key={n} className="chip" onClick={() => onChip && onChip(n)}>{n}</span>
          ))}
        </div>
      )}
      {de.notes && <div className="ptol">{de.notes}</div>}
    </div>
  );
}

const DEITY_NAMES = DEI.slice().sort((a, b) => a.name.localeCompare(b.name));

export default function Divine() {
  const [view, setView] = useState('deities');
  const [q, setQ] = useState('');
  const [src, setSrc] = useState('all');
  const [deity, setDeity] = useState(DEITY_NAMES.length ? DEITY_NAMES[0].name : '');

  function jumpToDomain(name) { setView('domains'); setSrc('all'); setQ(name); }

  const deityList = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return DEI.filter((d) => !ql ||
      ((d.name + ' ' + (d.title || '') + ' ' + (d.portfolio || '') + ' ' + (d.domains || []).join(' ') + ' ' + (d.notes || '')).toLowerCase().indexOf(ql) !== -1));
  }, [q]);

  const domainList = useMemo(() => {
    const ql = q.toLowerCase().trim();
    let list = DOM.filter((d) => src === 'all' || d.source === src);
    if (ql) list = list.filter((d) => ((d.name + ' ' + (d.granted || '') + ' ' + (d.spells || []).join(' ') + ' ' + (d.ptolus || '')).toLowerCase().indexOf(ql) !== -1));
    return list;
  }, [q, src]);

  const selectedDeity = useMemo(() => DEI.find((d) => d.name === deity) || null, [deity]);

  let count = '';
  if (view === 'deities') count = deityList.length + ' deities';
  else if (view === 'domains') count = domainList.length + ' domains';
  else if (selectedDeity) count = selectedDeity.name + ' — ' + (selectedDeity.domains || []).length + ' domain(s)';

  const css = `
  .divine .controls { display:flex; gap:10px; flex-wrap:wrap; align-items:end; padding:14px 20px 0; }
  .divine .controls > div { display:flex; flex-direction:column; }
  .divine .controls label { margin:0 0 3px; }
  .divine .controls input, .divine .controls select { width:auto; }
  .divine #q { min-width:240px; }
  .divine .out { padding:14px 20px 50px; max-width:1000px; }
  .divine .dcard, .divine .domcard { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:12px 16px; margin-bottom:12px; }
  .divine .dcard .nm { color:var(--gold); font-weight:bold; font-size:18px; }
  .divine .dcard .ti { color:var(--muted); font-style:italic; }
  .divine .domcard h3 { margin:0 0 4px; color:var(--gold); font-size:17px; }
  .divine .chip { display:inline-block; background:var(--bg-input); border:1px solid var(--gold-dim); border-radius:5px; padding:1px 9px; margin:3px 5px 3px 0; font-size:14px; color:var(--gold); cursor:pointer; }
  .divine .chip:hover { background:#3a3320; }
  .divine .src { font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); border:1px solid var(--line); border-radius:4px; padding:0 6px; margin-left:6px; }
  .divine .src.prestige { color:var(--warn); border-color:var(--warn); }
  .divine .granted { margin:6px 0; }
  .divine table.spells { border-collapse:collapse; margin:6px 0; }
  .divine table.spells td { border:1px solid var(--line); padding:3px 10px; font-size:14px; }
  .divine table.spells td.lv { color:var(--gold); text-align:center; width:36px; }
  .divine .ptol { color:var(--muted); font-size:14px; margin-top:6px; border-left:3px solid var(--gold-dim); padding-left:8px; }
  .divine .count { color:var(--muted); font-size:13px; padding:0 20px; }
  `;

  return (
    <Layout title="Deities & Domains" sub="Ptolus pantheon + 3.5e cleric domains" contextBar={false}>
      <style>{css}</style>
      <div className="divine">
        <div className="controls">
          <div>
            <label htmlFor="view">View</label>
            <select id="view" value={view} onChange={(e) => setView(e.target.value)}>
              <option value="deities">Deities</option>
              <option value="domains">Domains</option>
              <option value="bydeity">By deity (cleric helper)</option>
            </select>
          </div>
          {view !== 'bydeity' && (
            <div>
              <label htmlFor="q">Search (name, portfolio, spell…)</label>
              <input id="q" value={q} placeholder="e.g. Lothian, fire, healing" onChange={(e) => setQ(e.target.value)} />
            </div>
          )}
          {view === 'domains' && (
            <div>
              <label htmlFor="src">Source</label>
              <select id="src" value={src} onChange={(e) => setSrc(e.target.value)}>
                <option value="all">All</option>
                <option value="PHB">PHB core</option>
                <option value="CD">Complete Divine</option>
                <option value="DotF">Prestige (DotF)</option>
                <option value="Ptolus PT6">Ptolus</option>
              </select>
            </div>
          )}
          {view === 'bydeity' && (
            <div>
              <label htmlFor="deity">Deity</label>
              <select id="deity" value={deity} onChange={(e) => setDeity(e.target.value)}>
                {DEITY_NAMES.map((d) => <option key={d.name} value={d.name}>{d.name + (d.title ? ' — ' + d.title : '')}</option>)}
              </select>
            </div>
          )}
        </div>
        <p className="count">{count}</p>
        <div className="out">
          {view === 'deities' && (
            deityList.length
              ? deityList.map((de) => <DeityCard key={de.name} de={de} onChip={jumpToDomain} />)
              : <p className="count">No deities match.</p>
          )}
          {view === 'domains' && (
            domainList.length
              ? domainList.map((d) => <DomCard key={d.name} d={d} />)
              : <p className="count">No domains match.</p>
          )}
          {view === 'bydeity' && selectedDeity && (
            <>
              <DeityCard de={selectedDeity} onChip={jumpToDomain} />
              {!(selectedDeity.domains || []).length && <p className="count">No domains listed for this deity in the source.</p>}
              {(selectedDeity.domains || []).map((n) => {
                const d = domByName(n);
                return d
                  ? <DomCard key={n} d={d} />
                  : <div className="domcard" key={n}><h3>{n}<span className="src">core</span></h3><div className="ptol">See PHB domain list.</div></div>;
              })}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
