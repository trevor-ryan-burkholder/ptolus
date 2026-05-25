import { useState } from 'react';
import D from '../lib/dice.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { Layout } from '../components/ui.jsx';

const CSS = `
  .corr-toolbar { display:flex; gap:8px; align-items:flex-end; padding:12px 20px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
  .corr-toolbar .f { display:flex; flex-direction:column; } .corr-toolbar label { margin:0 0 3px; } .corr-toolbar input { width:auto; }
  .corr-toolbar .right { margin-left:auto; display:flex; gap:8px; }
  .corr-wrap { padding:16px 20px 60px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:12px; }
  .ccard { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:14px; }
  .ccard h3 { color:var(--gold); margin:0 0 2px; font-size:18px; }
  .ccard .ab { color:var(--muted); font-size:12px; margin-bottom:8px; }
  .track { margin:8px 0; }
  .track .row1 { display:flex; align-items:baseline; gap:8px; }
  .track .nm { font-weight:bold; } .track .score { font-size:20px; color:var(--gold); }
  .sev { display:inline-block; border-radius:4px; padding:1px 8px; font-size:12px; font-weight:bold; }
  .sev.None { color:var(--muted); border:1px solid var(--line); }
  .sev.Mild { color:#e8dca0; border:1px solid var(--gold-dim); }
  .sev.Moderate { color:#e8b878; border:1px solid #7a5520; }
  .sev.Severe { color:#f0a0a0; border:1px solid #7a3030; }
  .sev.Dead { color:#fff; background:#7a2020; }
  .track .eff { color:var(--muted); font-size:12px; margin-top:3px; }
  .btns { display:flex; gap:4px; flex-wrap:wrap; margin-top:6px; }
  .btns button { font-size:12px; padding:4px 7px; }
  .sources { margin-top:10px; border-top:1px dashed var(--line); padding-top:8px; }
  .sources button { font-size:12px; padding:4px 7px; margin:0 4px 4px 0; }
  .clog { font-size:12px; color:var(--muted); max-height:80px; overflow-y:auto; margin-top:6px; border-top:1px dashed var(--line); padding-top:5px; }
  .corr-wrap details summary { cursor:pointer; color:var(--gold); font-size:13px; margin-top:6px; }
  .hint2 { color:var(--muted); font-size:13px; }
`;

function band(ability) { return Math.ceil(Math.max(1, ability) / 4); }
function severity(score, ability) {
  if (score <= 0) return 'None';
  const b = band(ability);
  if (score <= 2 * b - 1) return 'Mild';
  if (score <= 6 * b - 1) return 'Moderate';
  if (score <= 14 * b - 1) return 'Severe';
  return 'Dead';
}
function nextThreshold(ability, sev) {
  const b = band(ability);
  if (sev === 'None') return '1 = Mild';
  if (sev === 'Mild') return 2 * b + ' = Moderate';
  if (sev === 'Moderate') return 6 * b + ' = Severe';
  if (sev === 'Severe') return 14 * b + ' = Dead/Insane';
  return '—';
}
const EFFECT = {
  None: 'No taint.',
  Mild: '1 permanent symptom.',
  Moderate: '+1 symptom; a bonus feat; good clerics/paladins lose powers until reduced. Removal: miracle/wish (or heal within 24 hrs).',
  Severe: '+1 severe symptom; another bonus feat. Exceed the cap → death (Corruption) or madness (Depravity).',
  Dead: 'Dead and rising as a Tainted Minion (Corruption), or irretrievably mad — Tainted Raver, DM control (Depravity).',
};

const CORR_SOURCES = [
  { n: 1, why: 'chaositech use (Fort DC 12+item lvl negates)', label: 'Chaositech use' },
  { n: 1, why: 'Pit of Insanity proximity', label: 'Pit (minor)' },
  { n: 'd3', why: 'direct Pit contact', label: 'Pit (direct, 1d3)' },
];
const DEP_SOURCES = [
  { n: 1, why: 'witnessed a Galchutt rite (Will DC 15)', label: 'Galchutt rite (observe)' },
  { n: 1, why: 'participated in a Galchutt rite (Will DC 18)', label: 'Galchutt rite (take part)' },
  { n: 1, why: 'cast an [evil] spell', label: '[Evil] spell' },
];

export default function Corruption() {
  const [state, setState] = useLocalStorage('ptolus-corruption-v1', { chars: {} });
  const [cname, setCname] = useState('');
  const [ccon, setCcon] = useState(12);
  const [cwis, setCwis] = useState(12);
  const [jsonBox, setJsonBox] = useState('');

  function logChange(c, key, delta, why) {
    const lbl = key === 'corr' ? 'Corruption' : 'Depravity';
    c.log.unshift((delta >= 0 ? '+' + delta : delta) + ' ' + lbl + ' → ' + c[key] + (why ? ' (' + why + ')' : ''));
  }
  function applyDelta(name, key, amount, why) {
    setState((s) => {
      if (!s.chars[name]) return s;
      const chars = { ...s.chars };
      const c = { ...chars[name], log: [...(chars[name].log || [])] };
      const ability = key === 'corr' ? c.con : c.wis;
      const before = severity(c[key], ability);
      c[key] = Math.max(0, c[key] + amount);
      const after = severity(c[key], ability);
      logChange(c, key, amount, why + (before !== after ? ' [' + before + '→' + after + ']' : ''));
      chars[name] = c;
      return { ...s, chars };
    });
  }
  function addChar() {
    const name = cname.trim();
    if (!name || state.chars[name]) return;
    setState((s) => ({
      ...s,
      chars: { ...s.chars, [name]: { con: parseInt(ccon, 10) || 10, wis: parseInt(cwis, 10) || 10, corr: 0, dep: 0, log: [], notes: '' } },
    }));
    setCname('');
  }
  function delChar(name) {
    if (!window.confirm('Remove ' + name + '?')) return;
    setState((s) => { const chars = { ...s.chars }; delete chars[name]; return { ...s, chars }; });
  }
  function setNotes(name, notes) {
    setState((s) => ({ ...s, chars: { ...s.chars, [name]: { ...s.chars[name], notes } } }));
  }
  function exportState() {
    const t = JSON.stringify(state);
    setJsonBox(t);
    if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
  }
  function importState() {
    try { const s = JSON.parse(jsonBox); if (s && s.chars) setState(s); } catch { window.alert('Invalid JSON.'); }
  }
  function resetAll() {
    if (window.confirm('Clear all characters?')) setState({ chars: {} });
  }

  const Track = ({ c, name, keyName, ability, label }) => {
    const score = c[keyName];
    const sev = severity(score, ability);
    const add = (amount, why) => applyDelta(name, keyName, amount, why);
    return (
      <div className="track">
        <div className="row1">
          <span className="nm">{label}</span> <span className="score">{score}</span>{' '}
          <span className={'sev ' + sev}>{sev === 'Dead' ? 'DEAD/INSANE' : sev}</span>
          <span className="hint2" style={{ marginLeft: 'auto' }}>next: {nextThreshold(ability, sev)}</span>
        </div>
        <div className="eff">{EFFECT[sev]}</div>
        <div className="btns">
          <button onClick={() => add(-1, 'manual')}>−1</button>
          <button onClick={() => add(1, 'manual')}>+1</button>
          <button onClick={() => add(D.roll(3), 'manual 1d3')}>+1d3</button>
        </div>
      </div>
    );
  };

  const Sources = ({ name, keyName, label, sources }) => (
    <div className="sources">
      <span className="hint2">{label}</span><br />
      {sources.map((src, i) => (
        <button key={i} onClick={() => applyDelta(name, keyName, src.n === 'd3' ? D.roll(3) : parseInt(src.n, 10), src.why)}>
          {src.label}
        </button>
      ))}
    </div>
  );

  const names = Object.keys(state.chars || {});

  return (
    <Layout title="Corruption / Taint Tracker" sub="Chaositech, the Pits, and the Galchutt's mark" contextBar={false}>
      <style>{CSS}</style>
      <div className="corr-toolbar">
        <div className="f"><label>Add character</label><input placeholder="name" value={cname} onChange={(e) => setCname(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addChar(); }} /></div>
        <div className="f"><label>Con</label><input type="number" style={{ width: 56 }} value={ccon} onChange={(e) => setCcon(e.target.value)} /></div>
        <div className="f"><label>Wis</label><input type="number" style={{ width: 56 }} value={cwis} onChange={(e) => setCwis(e.target.value)} /></div>
        <button onClick={addChar}>Add</button>
        <div className="right">
          <button onClick={exportState}>Copy State</button>
          <button onClick={() => { const el = document.getElementById('corr-json'); if (el) el.scrollIntoView(); }}>Load State</button>
          <button onClick={resetAll}>Reset</button>
        </div>
      </div>

      <div className="corr-wrap">
        <div>
          {names.length ? (
            <div className="grid">
              {names.map((name) => {
                const c = state.chars[name];
                return (
                  <div className="ccard" key={name}>
                    <h3>{name} <button style={{ float: 'right', fontSize: 12 }} onClick={() => delChar(name)}>✕</button></h3>
                    <div className="ab">Con {c.con} · Wis {c.wis}</div>
                    <Track c={c} name={name} keyName="corr" ability={c.con} label="Corruption" />
                    <Sources name={name} keyName="corr" label="add Corruption:" sources={CORR_SOURCES} />
                    <Track c={c} name={name} keyName="dep" ability={c.wis} label="Depravity" />
                    <Sources name={name} keyName="dep" label="add Depravity:" sources={DEP_SOURCES} />
                    <details>
                      <summary>Notes &amp; log</summary>
                      <textarea
                        placeholder="symptoms, afflictions…"
                        style={{ minHeight: 38, marginTop: 5 }}
                        value={c.notes || ''}
                        onChange={(e) => setNotes(name, e.target.value)}
                      />
                      <div className="clog">
                        {c.log && c.log.length ? c.log.map((l, i) => <div key={i}>{l}</div>) : <div>(no changes)</div>}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="hint2">No characters yet. Add one above.</p>
          )}
        </div>

        <p className="hint2" style={{ marginTop: 14 }}>
          Corruption (physical, vs Con) and Depravity (mental, vs Wis) — Heroes of Horror taint, keyed to Ptolus chaositech &amp; the Pits of Insanity.
          Thresholds: Table 4-1. Crossing a threshold locks in unless reduced within 24 hrs (heal/restoration) or by miracle/wish. Saved in this browser.
        </p>
        <details style={{ marginTop: 8 }}>
          <summary>State JSON</summary>
          <textarea id="corr-json" style={{ minHeight: 100, width: '100%' }} value={jsonBox} onChange={(e) => setJsonBox(e.target.value)} />
          <button style={{ marginTop: 6 }} onClick={importState}>Import from box</button>
        </details>
      </div>
    </Layout>
  );
}
