import { useState } from 'react';
import D from '../lib/dice.js';
import { Layout, SeedControl, Log, useLog, esc } from '../components/ui.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const KEY = 'ptolus-cityturn-v1';
const DEFAULT = [
  { fac: 'The Chaos Cults', goal: 'Awaken the Galchutt', total: 12, filled: 1, momentum: 1, payoff: 'The Night of Dissolution begins — the city\'s doom clock.', notes: '' },
  { fac: 'The Forsaken', goal: 'Open the Banewarrens', total: 10, filled: 0, momentum: 1, payoff: 'A bane is loosed; a major artifact threat enters play.', notes: '' },
  { fac: 'The Balacazars', goal: 'Consolidate the Warrens', total: 8, filled: 2, momentum: 1, payoff: 'The family locks down the underworld; prices and pressure rise.', notes: '' },
  { fac: 'The Killravens', goal: 'Seize Balacazar territory', total: 8, filled: 1, momentum: 1, payoff: 'Open gang war erupts across the Docks and Warrens.', notes: '' },
  { fac: 'House Vladaam', goal: 'Claim the contested asset', total: 6, filled: 0, momentum: 1, payoff: 'Vladaam wins a key holding; a rival house is ruined.', notes: '' },
  { fac: 'The Inverted Pyramid', goal: 'Contain the chaos relic', total: 6, filled: 0, momentum: 1, payoff: 'The relic is locked away — or quietly studied. The Pyramid owes a favor, or hides a secret.', notes: '' },
  { fac: 'The Delver\'s Guild', goal: 'Chart the deep Dungeon', total: 6, filled: 0, momentum: 1, payoff: 'New safe routes open; better maps become available to members.', notes: '' },
  { fac: 'The City Watch', goal: 'Crack down on unlicensed magic', total: 4, filled: 0, momentum: 1, payoff: 'Spellcasting permits enforced citywide; unlicensed casters hunted.', notes: '' },
];
function defaultState() { return { week: 0, projects: JSON.parse(JSON.stringify(DEFAULT)) }; }

function clockStr(p) { return '●'.repeat(p.filled) + '○'.repeat(Math.max(0, p.total - p.filled)); }
function done(p) { return p.filled >= p.total; }

export default function CityTurn() {
  const [state, setState, reset] = useLocalStorage(KEY, defaultState());
  const log = useLog();
  const [nf, setNf] = useState('');
  const [ng, setNg] = useState('');
  const [ns, setNs] = useState('6');
  const [jsonText, setJsonText] = useState('');

  function advance() {
    setState((s) => {
      const week = s.week + 1;
      const projects = s.projects.map((p) => ({ ...p }));
      let out = '<span class="head">[CITY TURN — Week ' + week + ']</span>\n';
      projects.forEach((p) => {
        if (done(p)) { out += '• ' + esc(p.fac) + ': complete.\n'; return; }
        const r = D.roll(6);
        const tick = (r >= 5 ? 2 : r >= 3 ? 1 : 0) * (p.momentum || 1);
        const before = p.filled;
        p.filled = Math.min(p.total, p.filled + tick);
        let line = '• ' + esc(p.fac) + ' (' + esc(p.goal) + '): ' + (tick ? '+' + tick : 'no progress') + ' → ' + p.filled + '/' + p.total + ' [d6=' + r + ']';
        if (p.filled >= p.total && before < p.total) line += '\n  <span class="good">▶ CLOCK FILLED — ' + esc(p.payoff) + '</span>';
        out += line + '\n';
      });
      log.append(out);
      return { week, projects };
    });
  }

  function mutateProj(i, fn) {
    setState((s) => {
      const projects = s.projects.map((p) => ({ ...p }));
      if (!projects[i]) return s;
      fn(projects[i]);
      return { ...s, projects };
    });
  }
  function delProj(i) {
    if (!window.confirm('Delete this clock?')) return;
    setState((s) => ({ ...s, projects: s.projects.filter((_, idx) => idx !== i) }));
  }
  function addProj() {
    const fac = nf.trim(); const goal = ng.trim();
    if (!fac || !goal) return;
    setState((s) => ({
      ...s,
      projects: [...s.projects, { fac, goal, total: Math.max(1, parseInt(ns, 10) || 6), filled: 0, momentum: 1, payoff: 'The project completes.', notes: '' }],
    }));
    setNf(''); setNg('');
  }
  function exportState() {
    const t = JSON.stringify(state);
    setJsonText(t);
    if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
  }
  function importState() {
    try { const s = JSON.parse(jsonText); if (s && s.projects) setState(s); }
    catch { alert('Invalid JSON'); }
  }
  function resetAll() {
    if (window.confirm('Reset clocks to canonical defaults?')) setState(defaultState());
  }

  return (
    <Layout title="City Turn — Faction Clocks" sub="Advance the city between sessions" contextBar={false}>
      <style>{css}</style>
      <div className="ct-toolbar">
        <button className="primary" style={{ width: 'auto', margin: 0 }} onClick={advance}>▶ Advance a Week</button>
        <span className="hint2">Week {state.week}</span>
        <div className="right">
          <button onClick={exportState}>Copy State</button>
          <button onClick={resetAll}>Reset to Default</button>
        </div>
      </div>

      <div className="ct-wrap">
        {state.projects.length === 0
          ? <p className="hint2">No clocks. Add one below or Reset to Default.</p>
          : (
            <div className="grid">
              {state.projects.map((p, i) => (
                <div className={'pcard' + (done(p) ? ' done' : '')} key={i}>
                  <div className="fac">{p.fac}
                    <button style={{ float: 'right', fontSize: 12 }} onClick={() => delProj(i)}>✕</button>
                  </div>
                  <div className="goal">{p.goal}</div>
                  <div className="clock">{clockStr(p)}</div>
                  <div className="ct">{p.filled} / {p.total}{done(p) && <> — <span className="donetag">COMPLETE</span></>}</div>
                  {done(p) && <div className="ct" style={{ color: 'var(--good)' }}>▶ {p.payoff}</div>}
                  <div className="btns">
                    <button onClick={() => mutateProj(i, (pr) => { pr.filled = Math.max(0, pr.filled - 1); })}>−</button>
                    <button onClick={() => mutateProj(i, (pr) => { pr.filled = Math.min(pr.total, pr.filled + 1); })}>+</button>
                    <button onClick={() => mutateProj(i, (pr) => { pr.filled = 0; })}>reset</button>
                  </div>
                  <textarea className="notes" placeholder="notes…" value={p.notes || ''}
                    onChange={(e) => mutateProj(i, (pr) => { pr.notes = e.target.value; })} />
                </div>
              ))}
            </div>
          )}

        <div className="addrow">
          <div className="f"><label>Faction</label><input value={nf} placeholder="Faction" onChange={(e) => setNf(e.target.value)} /></div>
          <div className="f"><label>Goal / project</label><input value={ng} placeholder="what they're working toward" style={{ width: 240 }} onChange={(e) => setNg(e.target.value)} /></div>
          <div className="f"><label>Segments</label><input type="number" value={ns} style={{ width: 60 }} onChange={(e) => setNs(e.target.value)} /></div>
          <button onClick={addProj}>Add Clock</button>
        </div>

        <SeedControl />

        <div className="ct-log">
          <Log log={log} title="Turn Log" emptyText="Advance a week to roll the clocks." />
        </div>

        <p className="hint2" style={{ marginTop: 12 }}>Each week, every active clock advances on its own momentum (a d6 per faction: 5–6 = +2, 3–4 = +1, 1–2 = no progress). A filled clock fires its payoff. Tie the party's actions to the table — interfere to slow a clock, or ignore one and watch it complete. Saved in this browser.</p>

        <details style={{ marginTop: 8 }}>
          <summary style={{ color: 'var(--gold)', cursor: 'pointer' }}>State JSON</summary>
          <textarea style={{ width: '100%', minHeight: 100 }} value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
          <button style={{ marginTop: 6 }} onClick={importState}>Import</button>
        </details>
      </div>
    </Layout>
  );
}

const css = `
  .ct-toolbar { display:flex; gap:8px; align-items:center; padding:12px 20px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
  .ct-toolbar .right { margin-left:auto; display:flex; gap:8px; }
  .ct-wrap { padding:16px 20px 60px; }
  .ct-wrap .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:12px; margin-bottom:16px; }
  .pcard { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:14px; }
  .pcard.done { border-color:var(--gold-dim); opacity:0.7; }
  .pcard .fac { color:var(--gold); font-weight:bold; }
  .pcard .goal { font-size:14px; margin:2px 0 8px; }
  .pcard .clock { font-family:'Courier New',monospace; font-size:20px; letter-spacing:2px; color:var(--gold); }
  .pcard .ct { color:var(--muted); font-size:13px; }
  .pcard .btns { display:flex; gap:6px; margin-top:8px; }
  .pcard .btns button { flex:1; padding:5px; }
  .pcard .donetag { color:var(--good); font-weight:bold; }
  .pcard textarea.notes { width:100%; min-height:34px; font-size:13px; margin-top:6px; }
  .ct-wrap .addrow { display:flex; gap:8px; align-items:flex-end; flex-wrap:wrap; padding:12px; background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; }
  .ct-wrap .addrow .f { display:flex; flex-direction:column; }
  .ct-wrap .addrow label { margin:0 0 3px; }
  .ct-wrap .addrow input { width:auto; }
  .ct-log { margin-top:14px; }
  .ct-wrap .hint2 { color:var(--muted); font-size:13px; }
`;
