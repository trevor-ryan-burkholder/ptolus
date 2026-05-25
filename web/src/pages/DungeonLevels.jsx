import { useState } from 'react';
import { Layout } from '../components/ui.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const KEY = 'ptolus-dungeon-zones-v1';
const STATUSES = ['Unexplored', 'Passed Through', 'Partially Mapped', 'Cleared (partial)', 'Active', 'Avoided'];

const CANON = [
  { id: 'A', name: 'The Sewers', depth: '≤ 20 ft below street', env: 'sewer · ptolus_undercity', cr: '1/3–3',
    factions: 'Ratmen (ratlings/ratlords/ratbrutes), System Monitors, Plagueborn cult shrines, Church of Lothian (rat-tail bounty)',
    features: 'Prust-built arched stone; 16-ft mains, 10-ft central channel. Older collapsed system under Oldtown. Dweomer St. has alchemical-runoff mutants. Grates: Str DC 22 to pry (damaging them is a crime).',
    connections: "City streets (grates); Ghul's Labyrinth (many); Undercity Market; river exits",
    status: 'Unexplored', notes: '', locked: false, ref: 'Ptolus p. 439–446' },
  { id: 'B', name: 'The Undercity', depth: 'Near-surface (deep in places)', env: 'ptolus_undercity · dungeon', cr: '1–10',
    factions: "Delver's Guild, Longfingers Guild, Brotherhood of Redemption, Order of the Legacy, Ennin slavers (Dark Market)",
    features: 'Undercity Market (Guild-run, 10% salvage tax), Dark Market (Search DC 25), Longfingers HQ, the Prison ("the Pit"), Mirror Maze, Chamber of Longing, Fortress of the Redeemed, Ravenstroke.',
    connections: "Streets (staircases); Sewers (many); Ghul's Labyrinth (numerous); Prison ↔ Cliffs of Lost Wishes",
    status: 'Unexplored', notes: '', locked: false, ref: 'Ptolus p. 423–438' },
  { id: 'C', name: "Ghul's Labyrinth", depth: 'Variable — the "default dungeon"', env: 'ptolus_dungeon · dungeon', cr: '2–8',
    factions: "No single controller; criminal groups, chaos cults, independent monsters, Longfingers (near HQ), Shilukar's chaositech lab",
    features: 'Artificial honeycomb built by Ghul to stage the Dwarvenhearth assault. Old Sorn-Ulth orc traps active. Guild waystations (restocked weekly). Pits of Insanity throughout.',
    connections: 'Sewers; Undercity; Banewarrens (edges); Caverns (many); Dwarvenhearth (Grand Entrance)',
    status: 'Unexplored', notes: '', locked: false, ref: 'Ptolus p. 418–422' },
  { id: 'E', name: "The Caverns (Giant's Staircase & below)", depth: 'Far below the Labyrinth', env: 'underground · planar_lower (deep)', cr: '5–15+',
    factions: 'Stonelost dwarves (Kaled Del), Pactlords of the Quaan, Children of Mrathrach (nagas), rhodintor, zaug, House Vrama dark elves',
    features: "Giant's Staircase → Eternity Cave (Erdek Ard); Umbral Lake (aboleths/skum); Serpent Caves; Vaults of the Rhodintor (greatest chaositech cache); Kastralathakasal; dark elf cities (Ul-Drakkan, Nluguran, Dreta Phantas).",
    connections: "Clock Tower cellars (Oldtown) → Giant's Staircase; Ghul's Labyrinth (many); Dwarvenhearth Grand Entrance",
    status: 'Unexplored', notes: '', locked: false, ref: 'Ptolus p. 447–458' },
  { id: 'F', name: 'Dwarvenhearth', depth: 'Via Eternity Cave Grand Entrance (mid–deep)', env: 'dungeon · underground', cr: '5–18',
    factions: 'Soulless (guardians), Erebaccus, Daragin, House Vrama (Zachean), Stonelost dwarves (exterior watch)',
    features: 'Sacked dwarven city-fortress (Ghulwar, ~330 BE). Gear Gate (hardness 13, 1,200 hp). Tomb of King Stardelve (Platinum Cestus). Cathedral Cavern. Day/Night King\'s Palaces. Mines still rich. Dwarven stone is hardness 10.',
    connections: 'Grand Entrance (below South Market); Ghul\'s Labyrinth (many); natural Caverns; rumored tunnels to Banewarrens',
    status: 'Unexplored', notes: '', locked: false, ref: 'Ptolus p. 460–483' },
  { id: 'D', name: 'The Banewarrens', depth: 'Within & below the Spire (3,000-ft shaft)', env: 'dungeon · planar_lower', cr: '8–15+',
    factions: 'Not faction-controlled. House Vladaam holds the Banewarrens key (unknowing). Dark elves seek entry.',
    features: "Danar Rotansin's sealed vaults for \"banes.\" Outer/Inner Vaults + the Baneheart (Tremoc Korin). Saggarintys (imprisoned silver dragon), Dark Averon, the Malificite. Only the Banewarrens key opens all seals. (Its own adventure arc.)",
    connections: "Ghul's Labyrinth (edges); Spire interior (ascending)",
    status: 'Unexplored', notes: '', locked: true, ref: 'Ptolus p. 419–420' },
];

function freshCanon() { return JSON.parse(JSON.stringify(CANON)); }

export default function DungeonLevels() {
  const [zones, setZones] = useLocalStorage(KEY, freshCanon());
  const [editing, setEditing] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  function updateField(i, k, v) {
    setZones((zs) => zs.map((z, idx) => (idx === i ? { ...z, [k]: v } : z)));
  }
  function delZone(i) {
    if (window.confirm('Delete this zone?')) setZones((zs) => zs.filter((_, idx) => idx !== i));
  }
  function addZone() {
    setZones((zs) => [...zs, { id: '?', name: 'New Zone', depth: '', env: '', cr: '', factions: '', features: '', connections: '', status: 'Unexplored', notes: '', locked: false }]);
    setEditing(true);
  }
  function doExport() {
    const t = JSON.stringify(zones, null, 2);
    setJsonText(t);
    setExportOpen(true);
    if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
  }
  function doImport() {
    try {
      const s = JSON.parse(jsonText);
      if (Array.isArray(s)) setZones(s);
      else window.alert('Invalid JSON.');
    } catch { window.alert('Invalid JSON.'); }
  }
  function doReset() {
    if (window.confirm('Discard your edits and restore canonical zones?')) setZones(freshCanon());
  }

  return (
    <Layout title="Dungeon Level Reference" sub="Canonical zones beneath Ptolus — editable, saved locally" contextBar={false}>
      <style>{`
        .dz-bar { padding:12px 20px; display:flex; gap:10px; align-items:center; border-bottom:1px solid var(--line); flex-wrap:wrap; }
        .dz-bar .right { margin-left:auto; display:flex; gap:8px; }
        .dz-bar label { margin:0; display:inline-flex; align-items:center; color:var(--text); }
        .dz-bar button { width:auto; }
        .dz-wrap { padding:16px 20px 60px; }
        .zcard { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:14px; margin-bottom:12px; }
        .zcard.locked { opacity:0.45; }
        .zcard h3 { margin:0 0 4px; color:var(--gold); font-size:19px; }
        .zcard .meta { font-size:13px; color:var(--muted); margin-bottom:8px; }
        .zcard .field { margin:5px 0; font-size:14px; line-height:1.4; }
        .zcard .field b { color:var(--gold); }
        .zcard .status { display:inline-block; border:1px solid var(--gold-dim); border-radius:4px; padding:1px 8px; font-size:12px; color:var(--gold); }
        .zcard textarea, .zcard input, .zcard select { font-size:14px; margin:2px 0 6px; width:100%; }
        .zcard textarea { min-height:48px; }
        .zcard input.idfield { width:60px; }
        .lbl { color:var(--muted); font-size:12px; display:block; }
        .delbtn { float:right; width:auto; }
      `}</style>
      <div className="dz-bar">
        <button onClick={() => setEditing((e) => !e)}>{editing ? '✓ Done Editing' : '✎ Edit Mode'}</button>
        <button onClick={addZone}>+ Add Zone</button>
        <label><input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} style={{ width: 'auto', marginRight: 6 }} />Reveal deep zones (Arc III+)</label>
        <div className="right">
          <button onClick={doExport}>Export Notes (JSON)</button>
          <button onClick={doReset}>Reset to Canon</button>
        </div>
      </div>
      <div className="dz-wrap">
        <div>
          {zones.map((z, i) => {
            if (z.locked && !reveal) {
              return (
                <div className="zcard locked" key={i}>
                  <h3>Zone {z.id} — {z.name} 🔒</h3>
                  <div className="meta">Deep zone — toggle "Reveal deep zones" to view (avoid spoiling scope).</div>
                </div>
              );
            }
            if (editing) return <EditCard key={i} z={z} i={i} onChange={updateField} onDelete={delZone} />;
            return <ViewCard key={i} z={z} />;
          })}
        </div>
        <details style={{ marginTop: 16 }} open={exportOpen}>
          <summary style={{ color: 'var(--gold)', cursor: 'pointer' }}>Export / Import JSON</summary>
          <textarea
            style={{ minHeight: 120, width: '100%' }}
            placeholder="Export drops your notes here. Paste a saved blob and click Import."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <button style={{ marginTop: 6, width: 'auto' }} onClick={doImport}>Import</button>
        </details>
      </div>
    </Layout>
  );
}

function Field({ label, val }) {
  return <div className="field"><b>{label}:</b> {val || '—'}</div>;
}

function ViewCard({ z }) {
  return (
    <div className="zcard">
      <h3>Zone {z.id} — {z.name}</h3>
      <div className="meta">
        {z.depth} · <span className="status">{z.status}</span>
        {z.ref && <> · <span className="lbl" style={{ display: 'inline' }}>{z.ref}</span></>}
      </div>
      <Field label="Environment" val={z.env} />
      <Field label="Typical CR" val={z.cr} />
      <Field label="Factions" val={z.factions} />
      <Field label="Features" val={z.features} />
      <Field label="Connections" val={z.connections} />
      {z.notes && <Field label="Party Notes" val={z.notes} />}
    </div>
  );
}

function EditCard({ z, i, onChange, onDelete }) {
  const inp = (k, ml) => ml
    ? <textarea value={z[k] || ''} onChange={(e) => onChange(i, k, e.target.value)} />
    : <input value={z[k] || ''} onChange={(e) => onChange(i, k, e.target.value)} />;
  return (
    <div className="zcard">
      <button className="delbtn" onClick={() => onDelete(i)}>✕ delete</button>
      <span className="lbl">ID</span>
      <input className="idfield" value={z.id} onChange={(e) => onChange(i, 'id', e.target.value)} />
      <span className="lbl">Name</span>{inp('name')}
      <span className="lbl">Depth</span>{inp('depth')}
      <span className="lbl">Environment</span>{inp('env')}
      <span className="lbl">Typical CR</span>{inp('cr')}
      <span className="lbl">Factions</span>{inp('factions', true)}
      <span className="lbl">Features</span>{inp('features', true)}
      <span className="lbl">Connections</span>{inp('connections', true)}
      <span className="lbl">Status</span>
      <select value={z.status} onChange={(e) => onChange(i, 'status', e.target.value)}>
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <span className="lbl">Party Notes</span>{inp('notes', true)}
    </div>
  );
}
