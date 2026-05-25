/* ui.jsx — shared chrome: Layout, ContextBar, SeedControl, DiceTray, Log. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Dice from '../lib/dice.js';
import { useCtx } from '../state/ctx.jsx';

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function Layout({ title, sub, contextBar = true, children }) {
  return (
    <>
      <header className="runner-head">
        <h1>{title || 'Ptolus Adventure Runner'}</h1>
        {sub && <span className="sub">{sub}</span>}
        <Link className="home" to="/">← Runner Home</Link>
      </header>
      {contextBar && <ContextBar />}
      {children}
      <DiceTray />
    </>
  );
}

export function ContextBar() {
  const ctx = useCtx();
  return (
    <div className="ctx-bar">
      <span className="ctx-label">Campaign:</span>
      <label>Lvl <input type="number" min="1" max="20" style={{ width: 50 }} value={ctx.partyLevel}
        onChange={(e) => ctx.set('partyLevel', parseInt(e.target.value, 10) || 1)} /></label>
      <label>Arc <select value={ctx.arc} onChange={(e) => ctx.set('arc', parseInt(e.target.value, 10))}>
        {[1, 2, 3, 4, 5].map((a) => <option key={a} value={a}>{a}</option>)}
      </select></label>
      <label>District <select value={ctx.district} onChange={(e) => ctx.set('district', e.target.value)}>
        {ctx.DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select></label>
      {ctx.date && <span className="ctx-date">· {ctx.date}</span>}
      <span className="ctx-hint">shared across tools</span>
    </div>
  );
}

export function SeedControl() {
  const [val, setVal] = useState('');
  const [now, setNow] = useState('(unseeded — random each load)');
  const apply = () => { const v = parseInt(val, 10); if (!isNaN(v)) { Dice.seed(v); setNow('Seed: ' + v); } };
  const rnd = () => { const s = Dice.randomSeed(); setVal(String(s)); setNow('Seed: ' + s); };
  return (
    <div className="seed-box">
      <label>RNG Seed</label>
      <div className="seed-input-row">
        <input type="number" value={val} placeholder="(random)" onChange={(e) => setVal(e.target.value)} />
        <button onClick={apply}>Apply</button>
        <button onClick={rnd}>Random</button>
      </div>
      <div className="seed-now">{now}</div>
    </div>
  );
}

// log hook — append accepts an HTML string (tools build markup), rendered safely-ish via innerHTML
export function useLog() {
  const [entries, setEntries] = useState([]);
  const append = useCallback((html) => setEntries((e) => [...e, html]), []);
  const clear = useCallback(() => setEntries([]), []);
  const lastRef = useRef('');
  useEffect(() => { lastRef.current = entries.length ? entries[entries.length - 1] : ''; }, [entries]);
  return { entries, append, clear, lastRef };
}

export function Log({ log, title = 'Log', actions, emptyText = 'No results yet. Roll something.' }) {
  const boxRef = useRef(null);
  useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }, [log.entries]);
  return (
    <div>
      <div className="log-head"><h2>{title}</h2>{actions}<button onClick={log.clear}>Clear Log</button></div>
      <div className="log" ref={boxRef}>
        {log.entries.length === 0
          ? <div className="empty">{emptyText}</div>
          : log.entries.map((h, i) => <div className="entry" key={i} dangerouslySetInnerHTML={{ __html: h }} />)}
      </div>
    </div>
  );
}

function rollExpr(expr) {
  const s = String(expr).toLowerCase().replace(/\s/g, '');
  if (/^-?\d+$/.test(s)) return { total: +s, rolls: [+s] };
  const m = s.match(/^(\d*)d(\d+)([x*]\d+)?([+-]\d+)?$/);
  if (!m) return null;
  const n = m[1] ? +m[1] : 1, sides = +m[2], mult = m[3] ? +m[3].slice(1) : 1, mod = m[4] ? +m[4] : 0;
  const rolls = []; let sum = 0;
  for (let i = 0; i < n; i++) { const r = Math.floor(Math.random() * sides) + 1; rolls.push(r); sum += r; }
  return { total: sum * mult + mod, rolls };
}

export function DiceTray() {
  const [open, setOpen] = useState(false);
  const [expr, setExpr] = useState('');
  const [log, setLog] = useState([]);
  const quick = ['d20', 'd100', 'd12', 'd10', 'd8', 'd6', 'd4', '2d6', '1d8+5'];
  const go = (e) => { const r = rollExpr(e || 'd20'); if (r) setLog((l) => [{ expr: e || 'd20', ...r }, ...l]); };
  return (
    <>
      <button className="dice-fab" title="Dice tray" onClick={() => setOpen((o) => !o)}>🎲</button>
      {open && (
        <div className="dice-panel">
          <div className="dice-quick">{quick.map((q) => <button key={q} onClick={() => go(q)}>{q}</button>)}</div>
          <div className="dice-in">
            <input value={expr} placeholder="e.g. 3d6+2" onChange={(e) => setExpr(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') go(expr); }} />
            <button onClick={() => go(expr)}>Roll</button>
          </div>
          <div className="dice-log">
            {log.map((r, i) => (
              <div key={i}><b>{r.expr}</b> = <span className="dice-tot">{r.total}</span>
                {r.rolls.length > 1 && <span className="dice-rolls"> [{r.rolls.join(', ')}]</span>}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
