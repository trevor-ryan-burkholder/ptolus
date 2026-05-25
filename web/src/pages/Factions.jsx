import { useState } from 'react';
import { Layout } from '../components/ui.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const STATUS = {
  '-5': 'HOSTILE', '-4': 'ANTAGONISTIC', '-3': 'UNFRIENDLY', '-2': 'WARY', '-1': 'COOL',
  '0': 'NEUTRAL', '1': 'NOTICED', '2': 'CAUTIOUS ALLY', '3': 'FRIENDLY', '4': 'ALLIED', '5': 'TRUSTED',
};
const DEFAULTS = [
  ['The Balacazars', 'Criminal / Power', false, 'Enemy of the Killravens.'],
  ['The Killravens', 'Criminal / Power', false, 'Rivals of the Balacazars.'],
  ['The City Watch', 'Civic / Law', false, 'Uneasy with the City Council. Led by Commissar Igor Urnst.'],
  ['The Delver\'s Guild', 'Civic / Law', false, 'Neutral broker; ~800 members.'],
  ['The City Council', 'Civic / Law', false, 'Ten noble houses, in tension.'],
  ['The Inverted Pyramid', 'Arcane / Scholarly', false, 'Secretive mage cabal.'],
  ['The Dreaming Apothecary', 'Arcane / Scholarly', false, 'Anonymous magic-item makers.'],
  ['Church of Lothian', 'Religious', false, 'Dominant church; pressures the Necropolis.'],
  ['Church of Asche', 'Religious', false, 'Fire-faith, militant.'],
  ['Other Ptolus Temples', 'Religious', false, 'Grouped minor temples.'],
  ['The Knights of the Pale', 'Special', false, 'Hunt evil; allied (uneasy) with Lothian.'],
  ['The Forsaken', 'Special', false, 'Chaos cult of the Galchutt.'],
  ['The Chaos Cults', 'Special', false, 'Grouped — the Cults of Chaos.'],
  ['Covenant of Blood', 'Hidden', true, 'Vampires of the Dark Reliquary. Reveal when known.'],
  ['House Abanar', 'Noble Houses', false, 'Mercantile.'],
  ['House Sadar', 'Noble Houses', false, 'Shadows.'],
  ['House Vladaam', 'Noble Houses', false, 'Evil; the most dangerous house.'],
  ['Integrated Monster Community', 'Monster / Non-Human', false, 'Grade-4 majority.'],
  ['Illithid Network', 'Monster / Non-Human', true, 'Hidden — reveal when relevant.'],
];
const CAT_ORDER = ['Criminal / Power', 'Civic / Law', 'Arcane / Scholarly', 'Religious', 'Special', 'Noble Houses', 'Monster / Non-Human', 'Custom'];
const KEY = 'ptolus-factions-v1';

function defaultState() {
  const f = {};
  DEFAULTS.forEach(([name, cat, hidden, rel]) => {
    f[name] = { name, cat, hidden, rel, disp: 0, lastChange: '', notes: '', log: [] };
  });
  return { factions: f };
}
function barColor(v) { return v < 0 ? '#c46a6a' : v > 0 ? '#c8a84b' : '#666'; }

export default function Factions() {
  const [state, setState, reset] = useLocalStorage(KEY, defaultState());
  const [filter, setFilter] = useState('all');
  const [showHidden, setShowHidden] = useState(false);
  const [customName, setCustomName] = useState('');
  const [jsonText, setJsonText] = useState('');
  // per-card "reason" inputs, keyed by faction name (not persisted)
  const [reasons, setReasons] = useState({});
  const [reasonErr, setReasonErr] = useState({});

  function mutate(name, fn) {
    setState((s) => {
      const factions = { ...s.factions };
      const f = factions[name];
      if (!f) return s;
      const nf = { ...f, log: [...f.log] };
      fn(nf);
      factions[name] = nf;
      return { ...s, factions };
    });
  }

  function changeDisp(name, act) {
    const f = state.factions[name];
    if (!f) return;
    const reason = (reasons[name] || '').trim();
    if (!reason) { setReasonErr((e) => ({ ...e, [name]: true })); return; }
    setReasonErr((e) => ({ ...e, [name]: false }));
    let target;
    if (act === 'plus') target = Math.min(5, f.disp + 1);
    else if (act === 'minus') target = Math.max(-5, f.disp - 1);
    else target = 0;
    const delta = target - f.disp;
    const sign = delta > 0 ? '+' + delta : (delta < 0 ? '' + delta : '±0');
    mutate(name, (nf) => {
      nf.disp = target;
      nf.lastChange = reason;
      nf.log = [sign + ' → ' + (target > 0 ? '+' : '') + target + ' — ' + reason, ...nf.log];
    });
    setReasons((r) => ({ ...r, [name]: '' }));
  }

  function setNotes(name, value) { mutate(name, (nf) => { nf.notes = value; }); }

  function addCustom() {
    const name = customName.trim();
    if (!name || state.factions[name]) return;
    setState((s) => ({
      ...s,
      factions: { ...s.factions, [name]: { name, cat: 'Custom', hidden: false, rel: '', disp: 0, lastChange: '', notes: '', log: [] } },
    }));
    setCustomName('');
  }

  function exportState() {
    const txt = JSON.stringify(state);
    setJsonText(txt);
    if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {});
  }
  function importState() {
    try { const s = JSON.parse(jsonText); if (s && s.factions) setState(s); }
    catch { alert('Invalid state JSON.'); }
  }
  function resetAll() {
    if (window.confirm('Reset all factions to Neutral and clear logs?')) reset();
  }

  // build groups
  const groups = {};
  Object.values(state.factions).forEach((f) => {
    if (f.hidden && !showHidden) return;
    if (filter === 'neg' && f.disp > -3) return;
    if (filter === 'pos' && f.disp < 3) return;
    (groups[f.cat] = groups[f.cat] || []).push(f);
  });
  const cats = CAT_ORDER.filter((c) => groups[c]);

  return (
    <Layout title="Faction Disposition Tracker" sub="Saved in this browser via localStorage" contextBar={false}>
      <style>{css}</style>
      <div className="ft-toolbar">
        <label style={{ margin: 0 }}>View:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">Show all</option>
          <option value="neg">Negative (≤ −3)</option>
          <option value="pos">Positive (≥ +3)</option>
        </select>
        <label style={{ margin: 0 }}>
          <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} style={{ width: 'auto', marginRight: 6 }} />
          Reveal hidden factions
        </label>
        <input value={customName} placeholder="Add custom faction…" style={{ marginLeft: 'auto' }}
          onChange={(e) => setCustomName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }} />
        <button onClick={addCustom}>Add</button>
        <button onClick={exportState}>Copy State</button>
        <button onClick={importState}>Load State</button>
        <button onClick={resetAll}>Reset All</button>
      </div>

      <div className="ft-wrap">
        {cats.length === 0 && <p className="hint">No factions match this filter.</p>}
        {cats.map((cat) => (
          <div className="catgroup" key={cat}>
            <h2>{cat}</h2>
            <div className="grid">
              {groups[cat].map((f) => {
                const segLeft = f.disp >= 0 ? 50 : 50 + (f.disp / 5) * 50;
                const segW = Math.abs(f.disp / 5) * 50;
                const color = barColor(f.disp);
                return (
                  <div className={'fcard' + (f.hidden ? ' hidden-f' : '')} key={f.name}>
                    <div className="fname">{f.name}</div>
                    <div className="fcat">{f.cat}</div>
                    {f.rel && <div className="frel">{f.rel}</div>}
                    <div className="dispbar">
                      <div className="seg" style={{ left: '50%', width: 1, background: '#888' }} />
                      <div className="seg" style={{ left: segLeft + '%', width: segW + '%', background: color }} />
                    </div>
                    <div className="dispval" style={{ color }}>{(f.disp > 0 ? '+' : '') + f.disp}</div>
                    <div className="status" style={{ color }}>{STATUS[String(f.disp)]}</div>
                    <input
                      className="reason"
                      placeholder={reasonErr[f.name] ? 'Reason required before changing.' : 'reason for change (required)'}
                      style={reasonErr[f.name] ? { borderColor: 'var(--bad)' } : undefined}
                      value={reasons[f.name] || ''}
                      onChange={(e) => setReasons((r) => ({ ...r, [f.name]: e.target.value }))}
                    />
                    <div className="dispctl">
                      <button onClick={() => changeDisp(f.name, 'minus')}>−</button>
                      <button onClick={() => changeDisp(f.name, 'neutral')}>Neutral</button>
                      <button onClick={() => changeDisp(f.name, 'plus')}>+</button>
                    </div>
                    {f.lastChange && <div className="fcat">Last: {f.lastChange}</div>}
                    <details>
                      <summary>Notes &amp; log</summary>
                      <textarea className="notes" placeholder="faction notes…" value={f.notes || ''}
                        onChange={(e) => setNotes(f.name, e.target.value)} />
                      <div className="flog">
                        {f.log.length
                          ? f.log.map((l, i) => <div key={i}>{l}</div>)
                          : <div>(no changes logged)</div>}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <details style={{ marginTop: 20 }}>
          <summary>State JSON (for save/load between sessions)</summary>
          <textarea style={{ minHeight: 120 }} placeholder="Paste a saved state here and click Load State."
            value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
        </details>
      </div>
    </Layout>
  );
}

const css = `
  .ft-toolbar { display:flex; gap:8px; align-items:center; padding:12px 20px; flex-wrap:wrap; border-bottom:1px solid var(--line); }
  .ft-toolbar select, .ft-toolbar input { width:auto; }
  .ft-wrap { padding:16px 20px 60px; }
  .ft-wrap .catgroup h2 { color:var(--gold); font-size:14px; text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid var(--line); margin:22px 0 12px; padding-bottom:5px; }
  .ft-wrap .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:12px; }
  .fcard { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:14px; }
  .fcard.hidden-f { opacity:0.5; }
  .fcard .fname { color:var(--gold); font-weight:bold; font-size:17px; }
  .fcard .fcat { color:var(--muted); font-size:12px; }
  .fcard .frel { color:var(--muted); font-size:12px; font-style:italic; margin-top:4px; }
  .fcard .dispbar { height:18px; background:#141414; border:1px solid var(--line); border-radius:5px; margin:10px 0 4px; position:relative; overflow:hidden; }
  .fcard .dispbar .seg { position:absolute; top:0; bottom:0; }
  .fcard .dispval { text-align:center; font-weight:bold; font-size:15px; }
  .fcard .dispctl { display:flex; gap:6px; margin:8px 0; }
  .fcard .dispctl button { flex:1; padding:6px; }
  .fcard .status { text-align:center; font-weight:bold; letter-spacing:1px; margin:6px 0; }
  .fcard .reason { width:100%; margin:4px 0; }
  .fcard .flog { font-size:12px; color:var(--muted); max-height:90px; overflow-y:auto; margin-top:6px; border-top:1px dashed var(--line); padding-top:6px; }
  .fcard .flog div { padding:1px 0; }
  .fcard textarea.notes { font-size:13px; min-height:40px; margin-top:6px; width:100%; }
  .ft-wrap details summary { cursor:pointer; color:var(--gold); font-size:13px; }
`;
