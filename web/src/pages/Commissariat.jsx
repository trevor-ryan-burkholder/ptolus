import { useEffect, useRef, useState } from 'react';
import D from '../lib/dice.js';
import { Layout, SeedControl } from '../components/ui.jsx';

const CSS = `
  .timer-display { font-size:54px; color:var(--gold); font-weight:bold; text-align:center; margin:10px 0; font-family:'Courier New',monospace; }
  .timer-display.arrived { color:var(--bad); }
  .bar { height:26px; background:#141414; border:1px solid var(--line); border-radius:6px; overflow:hidden; margin:8px 0 18px; }
  .bar .fill { height:100%; background:linear-gradient(90deg,var(--gold-dim),var(--gold)); width:100%; transition:width 0.4s linear; }
  .bar .fill.warn { background:linear-gradient(90deg,#a05020,#d8a64b); }
  .bar .fill.crit { background:linear-gradient(90deg,#7a2020,#c46a6a); }
  .incident-head { font-size:22px; color:var(--gold); text-transform:uppercase; letter-spacing:1px; text-align:center; }
  .block { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:14px; margin-top:12px; white-space:pre-wrap; font-family:'Courier New',monospace; }
  .block h3 { color:var(--gold); margin:0 0 8px; font-size:14px; letter-spacing:1px; }
`;

const GRADE_LABEL = { 4: 'Grade 4', 3: 'Grade 3', 2: 'Grade 2', 1: 'Grade 1', 0: 'Special Grade' };

function baseSeconds(g) {
  if (g === '4') return D.roll(6) * 10 * 60;
  if (g === '3') return D.roll(6) * 5 * 60;
  if (g === '2') return D.roll(4) * 3 * 60;
  if (g === '1') return D.rollN(2, 4) * 10;
  return D.roll(4) * 6; // special: 1d4 rounds
}
function districtMod(d) {
  if (d === "Nobles' Quarter" || d === 'Temple District') return -D.roll(4) * 60;
  if (d === 'Docks' || d === 'Warrens') return D.roll(4) * 60;
  if (d === 'Necropolis') return D.rollN(2, 6) * 60;
  return 0;
}
const COMP = {
  4: '1d4+2 guards (Warrior 1–2) + 1 corporal (Warrior 3)',
  3: '2d4+4 guards + 1 sergeant (Warrior 4) + 1d2 specialists',
  2: '8–12 guards + 1 lieutenant (Fighter 4–6) + 1 mage (Wiz 5); possible cleric',
  1: "City Watch Elite (6–8, Fighter 6–8) + commander + senior mage (Wiz 9); Commissar's Men may respond; backup waves",
  0: 'Full mobilization — all available units, district lockdown, city-wide alert; the Commissar himself may appear',
};
const DOACTION =
  'Contain the threat. Subdue if possible, kill if not.\nAnyone near the scene is a witness. Anyone with a weapon drawn is a suspect.\nThe Watch keeps order, not justice — they won\'t investigate (Ptolus p. 553).';
const COMPLICATIONS = [
  'A second unit was already nearby — arrives in HALF the time.',
  'The responding sergeant has a personal grudge — he knows someone in the party.',
  'A broadsheet journalist is shadowing the patrol.',
  'The unit is tied up with a separate incident nearby — delayed 1d6×5 min.',
  "Political interference — a noble's runner asks the Watch to stand down.",
  'The Covenant of Blood is already here — standing nearby, watching.',
];

function fmt(sec) {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

export default function Commissariat() {
  const [grade, setGrade] = useState('2');
  const [district, setDistrict] = useState('Midtown');
  const [tod, setTod] = useState('Day');
  const [state, setState] = useState(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const intervalRef = useRef(null);

  // tick the countdown every second when running
  useEffect(() => {
    if (!state) { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } return; }
    if (state.district === 'The Dungeon' || state.remain <= 0) return;
    intervalRef.current = setInterval(() => {
      setState((s) => {
        if (!s || s.remain <= 0) return s;
        return { ...s, remain: s.remain - 1 };
      });
    }, 1000);
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [state && state.id, state && state.district]);

  function trigger(gradeOverride) {
    const g = gradeOverride || grade;
    const night = tod === 'Night';
    let total = baseSeconds(g) + districtMod(district);
    if (night) total = Math.round(total * 1.5);
    total = Math.max(6, total);
    setState({ id: Date.now(), grade: g, district, night, total, remain: total, special: g === '0', notes: [] });
  }
  function reset() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setState(null);
  }
  function escalate() {
    if (!stateRef.current) return;
    const order = ['4', '3', '2', '1', '0'];
    const i = order.indexOf(stateRef.current.grade);
    if (i < order.length - 1) { setGrade(order[i + 1]); trigger(order[i + 1]); }
  }
  function complication() {
    setState((s) => {
      if (!s) return s;
      const idx = D.range(1, COMPLICATIONS.length);
      const c = '#' + idx + ': ' + COMPLICATIONS[idx - 1];
      let remain = s.remain;
      if (/HALF the time/.test(c)) remain = Math.round(remain / 2);
      if (/delayed 1d6/.test(c)) remain += D.roll(6) * 5 * 60;
      return { ...s, notes: [...s.notes, c], remain };
    });
  }

  function renderDisplay() {
    if (!state) {
      return <p className="hint" style={{ textAlign: 'center', marginTop: 40 }}>Set a grade and district, then Trigger Incident.</p>;
    }
    if (state.district === 'The Dungeon') {
      const note = state.grade === '0'
        ? 'Special Grade: the Watch seals the nearest surface entrance.'
        : (+state.grade <= 1 ? "On a surface breach, the Delvers' Guild may respond to Grade 1+." : "You're on your own down here.");
      return (
        <>
          <p className="incident-head">{GRADE_LABEL[state.grade]} — The Dungeon</p>
          <div className="block"><h3>NO CITY WATCH RESPONSE</h3>The Watch does not enter the Dungeon. {note}</div>
        </>
      );
    }
    const remain = Math.max(0, state.remain);
    const pct = state.total > 0 ? Math.round((remain / state.total) * 100) : 0;
    const arrived = remain <= 0;
    let fillCls = 'fill';
    if (pct <= 20) fillCls += ' crit'; else if (pct <= 50) fillCls += ' warn';
    return (
      <>
        <p className="incident-head">{GRADE_LABEL[state.grade]} Incident — {state.district}{state.night ? ' (Night)' : ''}</p>
        <div className={'timer-display' + (arrived ? ' arrived' : '')}>{arrived ? 'ARRIVED' : fmt(remain)}</div>
        <div className="bar"><div className={fillCls} style={{ width: pct + '%' }} /></div>
        <div className="block">
          <h3>ARRIVING</h3>
          {COMP[state.grade]}{state.district === 'Necropolis' ? '\n+ a Church of Lothian liaison (Necropolis protocol)' : ''}
        </div>
        <div className="block"><h3>WHAT THEY&#39;LL DO</h3>{DOACTION}</div>
        {state.notes.length ? <div className="block"><h3>COMPLICATIONS</h3>{state.notes.join('\n')}</div> : null}
      </>
    );
  }

  return (
    <Layout title="City Watch Response Timer" sub="How long until they arrive">
      <style>{CSS}</style>
      <div className="runner-main">
        <div className="panel">
          <h2>Incident</h2>
          <label>Threat Grade</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="4">Grade 4</option>
            <option value="3">Grade 3</option>
            <option value="2">Grade 2</option>
            <option value="1">Grade 1</option>
            <option value="0">Special Grade</option>
          </select>
          <label>District</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option>Nobles&#39; Quarter</option><option>Temple District</option>
            <option>Midtown</option><option>Guildsman&#39;s District</option>
            <option>Docks</option><option>Warrens</option>
            <option>Necropolis</option><option>The Dungeon</option>
          </select>
          <label>Time of Day</label>
          <select value={tod} onChange={(e) => setTod(e.target.value)}><option>Day</option><option>Night</option></select>

          <button className="primary" onClick={() => trigger()}>Trigger Incident</button>
          <div className="btn-row">
            <button onClick={complication}>Complication</button>
            <button onClick={escalate}>Escalate</button>
          </div>
          <button onClick={reset} style={{ width: '100%', marginTop: 8 }}>Reset</button>
          <SeedControl />
          <p className="hint">Grades are a homebrew convenience. The book&#39;s force is the <strong>City Watch</strong> under Commissar Igor Urnst (Ptolus pp. 551–553).</p>
        </div>

        <div id="display">{renderDisplay()}</div>
      </div>
    </Layout>
  );
}
