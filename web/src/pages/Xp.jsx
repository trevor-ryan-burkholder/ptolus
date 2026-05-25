import { useEffect, useRef, useState } from 'react';
import { Layout, Log, useLog } from '../components/ui.jsx';

const CSS = `
  .encrow { display:flex; gap:8px; align-items:center; margin:6px 0; }
  .encrow input { width:70px; }
  .encrow .lbl { color:var(--muted); font-size:14px; }
  #thresholds td, #thresholds th { font-size:13px; padding:4px 8px; }
`;

// XP by (EL - APL) difference
function xpForDiff(diff) {
  const T = { '-4': 75, '-3': 150, '-2': 300, '-1': 600, 0: 1200, 1: 1800, 2: 2700, 3: 3600, 4: 5400 };
  if (diff <= -5) return 0;
  if (diff >= 5) return 7200;
  return T[String(diff)];
}
const DIFFLABEL = (d) =>
  d <= -3 ? 'trivial' : d === -2 ? 'easy' : d === -1 ? 'easy' : d === 0 ? 'standard' : d === 1 ? 'challenging' : 'dangerous';
const comma = (n) => Math.round(n).toLocaleString('en-US');
function pad(s, n) { return (s + ' '.repeat(n)).slice(0, Math.max(n, s.length + 1)); }
const xpForLevel = (L) => 1000 * ((L * (L - 1)) / 2);

let ENC_SEQ = 0;

export default function Xp() {
  const log = useLog();
  const [size, setSize] = useState(4);
  const [apl, setApl] = useState(4);
  const [encs, setEncs] = useState([]); // { id, el, mult }
  const [story, setStory] = useState(0);
  const [rp, setRp] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const didInit = useRef(false);

  function addEncRow(el, mult) {
    setEncs((rows) => [...rows, { id: ++ENC_SEQ, el: el || 4, mult: mult || 1 }]);
  }
  function delEncRow(id) { setEncs((rows) => rows.filter((r) => r.id !== id)); }
  function updateEnc(id, key, val) {
    setEncs((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  }

  function readPending() {
    try { return JSON.parse(localStorage.getItem('ptolus-pending-xp')); } catch { return null; }
  }

  // Import defeated-monster ELs handed off by the Combat tracker.
  function importFromCombat(announce) {
    const p = readPending();
    if (!p || !p.encounters || !p.encounters.length) {
      if (announce) log.append('<span class="bad">Nothing pending. In the Combat tracker, defeat some monsters and click "Award XP".</span>');
      return false;
    }
    if (p.size) setSize(p.size);
    if (p.apl != null) setApl(p.apl);
    const imported = p.encounters.map((e) => ({ id: ++ENC_SEQ, el: e.el, mult: e.mult || 1 }));
    let merged = [];
    setEncs((rows) => { merged = [...rows, ...imported]; return merged; });
    try { localStorage.removeItem('ptolus-pending-xp'); } catch { /* ignore */ }
    setPendingCount(0);
    if (announce) {
      // calc immediately using the merged rows (state updater above also captured them)
      calcWith(p.size != null ? p.size : size, p.apl != null ? p.apl : apl, merged);
    } else {
      log.append('<span class="good">Imported ' + p.encounters.length + ' encounter(s) from Combat — press Calculate.</span>');
    }
    return true;
  }

  // On mount: auto-import if combat left something, else start with one blank row.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (!importFromCombat(false)) addEncRow();
    const p = readPending();
    setPendingCount(p && p.encounters ? p.encounters.length : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function calcWith(sz, ap, rows) {
    const useSize = Math.max(1, parseInt(sz, 10) || 4);
    const useApl = Math.max(1, parseInt(ap, 10) || 1);
    let sessionPerChar = 0;
    let out = '<span class="head">[ENCOUNTER XP — APL ' + useApl + ', Party of ' + useSize + ']</span>\n';
    if (useSize !== 4) out += '<span class="muted">Encounter XP divided among ' + useSize + ' characters (standard party = 4).</span>\n';
    out += '\n';
    let any = false;
    rows.forEach((r) => {
      const el = parseInt(r.el, 10) || 0;
      const mult = parseInt(r.mult, 10) || 1;
      if (!el) return;
      any = true;
      const diff = el - useApl;
      const total = xpForDiff(diff) * mult;
      const each = Math.round(total / useSize);
      sessionPerChar += each;
      const warn = diff > 1 ? '  ⚠ Above APL+1' : '';
      const lbl = 'EL ' + el + (mult > 1 ? ' ×' + mult : '') + ' (' + DIFFLABEL(diff) + ')';
      out += pad(lbl, 26) + '→ ' + comma(total) + ' XP total → ' + comma(each) + ' XP each' + warn + '\n';
    });
    if (!any) { log.append('<span class="bad">Add at least one encounter with an EL.</span>'); return; }

    const s = parseInt(story, 10) || 0;
    const r = parseInt(rp, 10) || 0;
    if (s) { out += pad('Story award', 26) + '→ ' + comma(s) + ' XP each\n'; sessionPerChar += s; }
    if (r) { out += pad('Role-play bonus', 26) + '→ ' + comma(r) + ' XP each\n'; sessionPerChar += r; }

    out += '\n<span class="good">SESSION TOTAL: ' + comma(sessionPerChar) + ' XP each → ' + comma(sessionPerChar * useSize) + ' XP across the party</span>';
    log.append(out);
  }
  function calc() { calcWith(size, apl, encs); }

  const combatBtnLabel = pendingCount ? '⚔ Import from Combat (' + pendingCount + ')' : '⚔ Import from Combat';

  return (
    <Layout title="XP Calculator" sub="Per-character XP from ELs defeated">
      <style>{CSS}</style>
      <div className="runner-main">
        <div className="panel">
          <h2>Party</h2>
          <label>Party size</label>
          <input type="number" min="1" max="8" value={size} onChange={(e) => setSize(parseInt(e.target.value, 10) || '')} />
          <label>Average Party Level (APL)</label>
          <input type="number" min="1" max="20" value={apl} onChange={(e) => setApl(parseInt(e.target.value, 10) || '')} />

          <h2 style={{ marginTop: 18 }}>Encounters</h2>
          <div>
            {encs.map((r) => (
              <div className="encrow" key={r.id}>
                <span className="lbl">EL</span>
                <input type="number" min="1" max="25" value={r.el} onChange={(e) => updateEnc(r.id, 'el', e.target.value)} />
                <span className="lbl">×</span>
                <input type="number" min="1" max="20" value={r.mult} onChange={(e) => updateEnc(r.id, 'mult', e.target.value)} />
                <button onClick={() => delEncRow(r.id)}>✕</button>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: 8 }} onClick={() => addEncRow()}>+ Add Encounter</button>
          <button className={pendingCount ? 'primary' : ''} style={{ width: '100%', marginTop: 8 }} onClick={() => importFromCombat(true)}>{combatBtnLabel}</button>

          <h2 style={{ marginTop: 18 }}>Extras</h2>
          <label>Story award (flat XP each)</label>
          <input type="number" value={story} onChange={(e) => setStory(e.target.value)} />
          <label>Role-play bonus (flat XP each)</label>
          <input type="number" value={rp} onChange={(e) => setRp(e.target.value)} />

          <button className="primary" onClick={calc}>Calculate</button>
        </div>

        <div>
          <Log log={log} title="XP Log" />
          <details style={{ marginTop: 14 }}>
            <summary style={{ color: 'var(--gold)', cursor: 'pointer' }}>Level Thresholds (PHB 3-2)</summary>
            <table className="ref" id="thresholds">
              <tbody>
                <tr><th>Level</th><th>XP</th><th>Level</th><th>XP</th></tr>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((L) => (
                  <tr key={L}>
                    <td>{L}</td><td>{comma(xpForLevel(L))}</td>
                    <td>{L + 9}</td><td>{comma(xpForLevel(L + 9))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </div>
    </Layout>
  );
}
