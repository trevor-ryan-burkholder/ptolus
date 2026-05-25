import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { Layout } from '../components/ui.jsx';

const KEY = 'ptolus-quests-v1';
const CT_KEY = 'ptolus-cityturn-v1';

const STATUS = { active: 'Active', lead: 'Lead', hold: 'On hold', done: 'Done', failed: 'Failed' };
const STATUS_ORDER = ['active', 'lead', 'hold', 'done', 'failed'];
const TYPES = ['main', 'side', 'personal', 'faction'];

function readClocks() {
  try { const s = JSON.parse(localStorage.getItem(CT_KEY)); if (s && s.projects) return s.projects; } catch { /* ignore */ }
  return [];
}

function ClockBlock({ fac, clocks }) {
  if (!fac) return null;
  const p = clocks.find((c) => c.fac === fac) || null;
  if (!p) return <div className="q-clock"><span className="miss">⚙ {fac} — no matching clock</span></div>;
  const dots = '●'.repeat(p.filled) + '○'.repeat(Math.max(0, p.total - p.filled));
  const done = p.filled >= p.total;
  return (
    <div className="q-clock">⚙ {fac}: {dots} {p.filled}/{p.total}{done ? ' ✦' : ''}
      {'\n'}<span style={{ color: 'var(--muted)' }}>▶ {p.payoff || ''}</span>
    </div>
  );
}

function ClockSelect(props) {
  const { value, clocks, onChange } = props;
  const facs = clocks.map((p) => p.fac);
  const stale = value && facs.indexOf(value) === -1;
  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">— none —</option>
      {facs.map((f) => <option key={f} value={f}>{f}</option>)}
      {stale && <option value={value}>{value} (no clock)</option>}
    </select>
  );
}

function QuestCard({ q, clocks, update, remove, addStep, delStep, toggleStep }) {
  return (
    <div className={'q-card st-' + q.status}>
      <div className="q-top">
        <input className="q-title" value={q.title} onChange={(e) => update(q.id, 'title', e.target.value)} />
        <button className="q-del" onClick={() => remove(q)}>Delete</button>
      </div>
      <div className="q-row">
        <div>
          <label>Status</label>
          <select value={q.status} onChange={(e) => update(q.id, 'status', e.target.value)}>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
          </select>
        </div>
        <div>
          <label>Type</label>
          <select value={q.type} onChange={(e) => update(q.id, 'type', e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <label>Giver / source</label>
      <input value={q.giver || ''} onChange={(e) => update(q.id, 'giver', e.target.value)} />
      <label>Summary</label>
      <textarea rows="2" value={q.summary || ''} onChange={(e) => update(q.id, 'summary', e.target.value)} />
      <label>Steps / objectives</label>
      <ul className="q-steps">
        {(q.steps || []).map((s, i) => (
          <li key={i} className={s.done ? 'sd' : ''}>
            <input type="checkbox" checked={!!s.done} onChange={(e) => toggleStep(q.id, i, e.target.checked)} />
            <span>{s.text}</span>
            <button className="q-del" onClick={() => delStep(q.id, i)}>✕</button>
          </li>
        ))}
      </ul>
      <button className="q-del" onClick={() => addStep(q.id)}>+ step</button>
      <label>Reward</label>
      <input value={q.reward || ''} onChange={(e) => update(q.id, 'reward', e.target.value)} />
      <label>Linked faction clock</label>
      <ClockSelect value={q.clock} clocks={clocks} onChange={(v) => update(q.id, 'clock', v)} />
      <ClockBlock fac={q.clock} clocks={clocks} />
      <label>Notes</label>
      <textarea rows="2" value={q.notes || ''} onChange={(e) => update(q.id, 'notes', e.target.value)} />
    </div>
  );
}

export default function Quests() {
  const [state, setState] = useLocalStorage(KEY, { seq: 0, quests: [] });
  const [clocks, setClocks] = useState(readClocks);
  const [filter, setFilter] = useState('open');

  // add-bar fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('side');
  const [giver, setGiver] = useState('');
  const [addClock, setAddClock] = useState('');

  // backup textarea
  const [json, setJson] = useState('');

  const refreshClocks = useCallback(() => setClocks(readClocks()), []);
  useEffect(() => {
    function onStorage(e) { if (e.key === CT_KEY) refreshClocks(); }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshClocks]);

  function update(id, field, value) {
    setState((s) => ({ ...s, quests: s.quests.map((q) => q.id === id ? { ...q, [field]: value } : q) }));
  }
  function remove(q) {
    if (window.confirm('Delete "' + q.title + '"?')) {
      setState((s) => ({ ...s, quests: s.quests.filter((x) => x.id !== q.id) }));
    }
  }
  function addStep(id) {
    const t = window.prompt('Step / objective:');
    if (t) setState((s) => ({ ...s, quests: s.quests.map((q) => q.id === id ? { ...q, steps: [...(q.steps || []), { text: t, done: false }] } : q) }));
  }
  function delStep(id, i) {
    setState((s) => ({ ...s, quests: s.quests.map((q) => q.id === id ? { ...q, steps: q.steps.filter((_, j) => j !== i) } : q) }));
  }
  function toggleStep(id, i, done) {
    setState((s) => ({ ...s, quests: s.quests.map((q) => q.id === id ? { ...q, steps: q.steps.map((st, j) => j === i ? { ...st, done } : st) } : q) }));
  }
  function addQuest() {
    const t = title.trim();
    if (!t) return;
    setState((s) => ({
      ...s,
      seq: s.seq + 1,
      quests: [...s.quests, { id: s.seq + 1, title: t, type, status: 'active', giver: giver.trim(), summary: '', steps: [], reward: '', clock: addClock || '', notes: '' }],
    }));
    setTitle(''); setGiver('');
  }

  function visible() {
    let list = state.quests.slice();
    if (filter === 'open') list = list.filter((q) => ['active', 'lead', 'hold'].indexOf(q.status) !== -1);
    else if (filter !== 'all') list = list.filter((q) => q.status === filter);
    list.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
    return list;
  }

  function doExport() {
    const t = JSON.stringify(state);
    setJson(t);
    if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
  }
  function doImport() {
    try { const s = JSON.parse(json); if (s && s.quests) setState(s); else window.alert('Not a quests backup.'); }
    catch { window.alert('Invalid JSON'); }
  }

  const list = visible();
  const open = state.quests.filter((q) => ['active', 'lead', 'hold'].indexOf(q.status) !== -1).length;

  const css = `
  .quests .q-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(330px, 1fr)); gap:14px; }
  .quests .q-card { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:12px 14px; }
  .quests .q-card.st-active { border-left:4px solid var(--gold); }
  .quests .q-card.st-lead { border-left:4px solid var(--muted); }
  .quests .q-card.st-hold { border-left:4px solid var(--warn); }
  .quests .q-card.st-done { border-left:4px solid var(--good); opacity:.78; }
  .quests .q-card.st-failed { border-left:4px solid var(--bad); opacity:.7; }
  .quests .q-card .q-top { display:flex; gap:8px; align-items:center; margin-bottom:6px; }
  .quests .q-card .q-title { flex:1; font-weight:bold; font-size:16px; }
  .quests .q-card label { margin:8px 0 2px; }
  .quests .q-card select, .quests .q-card input, .quests .q-card textarea { font-size:14px; padding:5px 7px; }
  .quests .q-row { display:flex; gap:6px; }
  .quests .q-row > * { flex:1; }
  .quests .q-steps { list-style:none; padding:0; margin:6px 0; }
  .quests .q-steps li { display:flex; gap:6px; align-items:flex-start; padding:2px 0; font-size:14px; }
  .quests .q-steps li.sd { color:var(--muted); text-decoration:line-through; }
  .quests .q-steps input[type=checkbox] { width:auto; margin-top:4px; }
  .quests .q-clock { font-family:'Courier New', monospace; font-size:13px; color:var(--gold); margin-top:6px; white-space:pre-wrap; }
  .quests .q-clock .miss { color:var(--bad); }
  .quests .q-del { font-size:12px; padding:3px 8px; }
  .quests .addbar { display:flex; gap:8px; flex-wrap:wrap; align-items:end; margin-bottom:14px; }
  .quests .addbar > div { display:flex; flex-direction:column; }
  .quests .addbar label { margin:0 0 2px; }
  .quests .addbar input, .quests .addbar select { width:auto; }
  .quests #qtitle { min-width:240px; }
  `;

  return (
    <Layout title="Quest & Plot Tracker" sub="Threads, leads, and what each faction clock will trigger" contextBar={false}>
      <style>{css}</style>
      <div className="quests" style={{ padding: '0 20px' }}>
        <div className="addbar">
          <div>
            <label htmlFor="qtitle">New quest / lead</label>
            <input id="qtitle" value={title} placeholder="Title (e.g. The Lead Box)"
              onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addQuest(); }} />
          </div>
          <div>
            <label htmlFor="qtype">Type</label>
            <select id="qtype" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="qgiver">Giver / source</label>
            <input id="qgiver" value={giver} placeholder="Who/where" onChange={(e) => setGiver(e.target.value)} />
          </div>
          <div>
            <label htmlFor="qclock">Link clock</label>
            <ClockSelect value={addClock} clocks={clocks} onChange={setAddClock} />
          </div>
          <div>
            <button className="primary" style={{ width: 'auto', marginTop: 0, padding: '8px 16px' }} onClick={addQuest}>+ Add</button>
          </div>
        </div>

        <div className="log-head" style={{ marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Quests</h2>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 0 0 16px', color: 'var(--muted)' }}>Filter
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 'auto', padding: '4px 8px' }}>
              <option value="open">Open (active+lead+hold)</option>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="lead">Leads</option>
              <option value="hold">On hold</option>
              <option value="done">Done</option>
              <option value="failed">Failed</option>
            </select>
          </label>
          <Link className="home" to="/city-turn" style={{ marginLeft: 'auto' }}>City Turn clocks ▸</Link>
          <button onClick={refreshClocks}>↻ Clocks</button>
        </div>

        <div className="q-grid">
          {list.length
            ? list.map((q) => <QuestCard key={q.id} q={q} clocks={clocks} update={update} remove={remove}
                addStep={addStep} delStep={delStep} toggleStep={toggleStep} />)
            : <p className="hint">No quests in this filter. Add one above.</p>}
        </div>
        <p className="hint">{state.quests.length} quest(s) total · {open} open · showing {list.length}</p>

        <div className="panel" style={{ marginTop: 20, maxWidth: 680 }}>
          <h2>Backup (this tool)</h2>
          <div className="btn-row">
            <button onClick={doExport}>Export quests JSON</button>
            <button onClick={doImport}>Import</button>
          </div>
          <textarea rows="3" placeholder="Quest JSON" value={json} onChange={(e) => setJson(e.target.value)} style={{ marginTop: 8 }} />
          <p className="hint">For a full-campaign backup of every tool at once, use the <Link to="/save">Campaign Save</Link> page.</p>
        </div>
      </div>
    </Layout>
  );
}
