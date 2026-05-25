import { useCallback, useState } from 'react';
import { Layout } from '../components/ui.jsx';

// Authoritative list of the app's keys + friendly labels.
const KNOWN = [
  ['ptolus-ctx-v1', 'Campaign context (level, district, party, date)'],
  ['ptolus-calendar-v1', 'Calendar / current date'],
  ['ptolus-combat-v1', 'Combat tracker'],
  ['ptolus-cityturn-v1', 'City Turn — faction clocks'],
  ['ptolus-factions-v1', 'Faction tracker'],
  ['ptolus-corruption-v1', 'Corruption tracker'],
  ['ptolus-dungeon-zones-v1', 'Dungeon zones'],
  ['ptolus-quests-v1', 'Quests & plot threads'],
  ['ptolus-delve-v1', 'Delve tracker'],
];
const LABEL = {};
KNOWN.forEach((k) => { LABEL[k[0]] = k[1]; });
// transient handoff/display keys — not part of a campaign backup
const EXCLUDE = ['ptolus-pending-encounter', 'ptolus-pending-xp', 'ptolus-broadcast'];

function discoveredKeys() {
  const set = {};
  KNOWN.forEach((k) => { set[k[0]] = true; });
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('ptolus-') === 0) set[k] = true; } } catch { /* ignore */ }
  return Object.keys(set).filter((k) => EXCLUDE.indexOf(k) === -1);
}
function bytes(s) { return s == null ? 0 : (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length); }
function fmtBytes(n) { return n < 1024 ? n + ' B' : (n / 1024).toFixed(1) + ' KB'; }

function buildBackup() {
  const data = {};
  let count = 0, total = 0;
  discoveredKeys().forEach((k) => {
    const raw = localStorage.getItem(k);
    if (raw == null) return;
    count++; total += bytes(raw);
    try { data[k] = JSON.parse(raw); } catch { data[k] = raw; }
  });
  return { backup: { app: 'ptolus-runner', version: 1, exported: new Date().toISOString(), keys: count, data }, count, total };
}

export default function Save() {
  const [blob, setBlob] = useState('');
  const [exportInfo, setExportInfo] = useState('');
  const [inblob, setInblob] = useState('');
  const [importInfo, setImportInfo] = useState('');
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  function doExport() {
    const b = buildBackup();
    const text = JSON.stringify(b.backup, null, 2);
    setBlob(text);
    setExportInfo(b.count + ' key(s), ' + fmtBytes(b.total) + ' of saved data.');
    return text;
  }
  function copy() {
    const text = blob || doExport();
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setExportInfo('Copied to clipboard.');
  }
  function download() {
    const text = blob || doExport();
    try {
      const b = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(b);
      const a = document.createElement('a');
      const d = new Date();
      a.href = url; a.download = 'ptolus-campaign-' + d.toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setExportInfo('Download not available here — copy the text instead.'); }
  }

  function clearKey(k) {
    if (window.confirm('Clear ' + k + '? This cannot be undone.')) { localStorage.removeItem(k); rerender(); }
  }
  function wipe() {
    if (!window.confirm('Wipe ALL Ptolus campaign data from this browser? Export a backup first!')) return;
    if (!window.confirm('Really wipe everything? Last chance.')) return;
    discoveredKeys().forEach((k) => localStorage.removeItem(k));
    EXCLUDE.forEach((k) => localStorage.removeItem(k));
    rerender();
    setImportInfo('All campaign data wiped.');
  }

  function applyBackup(text, mode) {
    let parsed;
    try { parsed = JSON.parse(text); } catch { setImportInfo('__bad__Invalid JSON.'); return; }
    const data = (parsed && parsed.data && typeof parsed.data === 'object') ? parsed.data : parsed;
    const keys = Object.keys(data).filter((k) => k.indexOf('ptolus-') === 0);
    if (!keys.length) { setImportInfo('__bad__No ptolus- keys found in that backup.'); return; }
    if (!window.confirm((mode === 'replace' ? 'Replace ALL current data' : 'Merge ' + keys.length + ' key(s)') + '? This overwrites matching saved state.')) return;
    if (mode === 'replace') { discoveredKeys().forEach((k) => localStorage.removeItem(k)); }
    let n = 0;
    keys.forEach((k) => {
      if (EXCLUDE.indexOf(k) !== -1) return;
      const v = data[k];
      try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); n++; } catch { /* quota */ }
    });
    rerender();
    setImportInfo('__good__Restored ' + n + ' key(s) (' + mode + '). Reopen the other tools to see the data.');
  }

  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { setInblob(String(r.result)); setImportInfo('Loaded ' + f.name + '. Choose Replace or Merge.'); };
    r.readAsText(f);
  }

  const keys = discoveredKeys();

  let importNode = null;
  if (importInfo.startsWith('__bad__')) importNode = <span style={{ color: 'var(--bad)' }}>{importInfo.slice(7)}</span>;
  else if (importInfo.startsWith('__good__')) importNode = <span style={{ color: 'var(--good)' }}>{importInfo.slice(8)}</span>;
  else importNode = importInfo;

  const css = `
  .save .wrap { padding:18px 20px; max-width:880px; }
  .save table.ref td .k { font-family:'Courier New', monospace; font-size:13px; color:var(--muted); }
  .save .present { color:var(--good); } .save .absent { color:var(--muted); }
  .save .danger { color:var(--bad); border-color:var(--bad); }
  .save textarea#blob { font-family:'Courier New', monospace; font-size:12px; }
  `;

  return (
    <Layout title="Campaign Save" sub="One file holds the whole campaign" contextBar={false}>
      <style>{css}</style>
      <div className="save">
        <div className="wrap">
          <div className="panel">
            <h2>Export — back up everything</h2>
            <p className="hint" style={{ marginTop: 0 }}>Bundles every Adventure Runner tool's saved state (party, combat, calendar, city-turn clocks, factions, corruption, quests, delve, context) into one file. Save it somewhere safe, or move it to another computer.</p>
            <div className="btn-row">
              <button className="primary" style={{ marginTop: 0 }} onClick={doExport}>Build backup</button>
              <button onClick={download}>⬇ Download .json</button>
              <button onClick={copy}>Copy to clipboard</button>
            </div>
            <textarea id="blob" rows="6" value={blob} onChange={(e) => setBlob(e.target.value)}
              placeholder='Click "Build backup" — the full campaign JSON appears here.' style={{ marginTop: 10 }} />
            <div className="hint">{exportInfo}</div>
          </div>

          <div className="panel" style={{ marginTop: 18 }}>
            <h2>Current saved data</h2>
            <table className="ref"><tbody>
              <tr><th>Key</th><th>Tool</th><th>State</th><th></th></tr>
              {keys.map((k) => {
                const raw = localStorage.getItem(k);
                const present = raw != null;
                return (
                  <tr key={k}>
                    <td><span className="k">{k}</span></td>
                    <td>{LABEL[k] || '(unknown tool)'}</td>
                    <td>{present
                      ? <span className="present">saved · {fmtBytes(bytes(raw))}</span>
                      : <span className="absent">— empty —</span>}</td>
                    <td>{present && <button className="q-del" style={{ fontSize: 12, padding: '3px 8px' }} onClick={() => clearKey(k)}>clear</button>}</td>
                  </tr>
                );
              })}
            </tbody></table>
            <button className="danger" style={{ width: 'auto', marginTop: 10 }} onClick={wipe}>⚠ Wipe ALL campaign data</button>
          </div>

          <div className="panel" style={{ marginTop: 18 }}>
            <h2>Import / restore</h2>
            <p className="hint" style={{ marginTop: 0 }}>Paste a backup below (or load a file), then choose how to apply it. <b>Replace</b> clears current data first; <b>Merge</b> overwrites only the keys present in the backup.</p>
            <input type="file" accept=".json,application/json" onChange={onFile} style={{ marginBottom: 8 }} />
            <textarea rows="6" value={inblob} onChange={(e) => setInblob(e.target.value)} placeholder="Paste backup JSON here…" />
            <div className="btn-row">
              <button className="primary" style={{ marginTop: 0 }} onClick={() => applyBackup(inblob, 'replace')}>Replace all</button>
              <button onClick={() => applyBackup(inblob, 'merge')}>Merge</button>
            </div>
            <div className="hint">{importNode}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
