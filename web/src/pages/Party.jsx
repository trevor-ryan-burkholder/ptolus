import { useCtx } from '../state/ctx.jsx';
import { Layout } from '../components/ui.jsx';

const CSS = `
  .party-wrap { padding:16px 20px 60px; }
  table.party { border-collapse:collapse; width:100%; max-width:1000px; }
  table.party th { text-align:left; color:var(--gold); font-size:12px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--line); padding:6px 6px; }
  table.party td { border-bottom:1px solid var(--line); padding:4px 6px; }
  table.party input { width:100%; padding:5px 6px; }
  table.party input.num { width:56px; text-align:center; }
  table.party input.name { min-width:120px; }
  .derived { color:var(--gold); font-size:16px; margin:10px 0; }
  .ref { margin-top:18px; }
  .ref h2 { color:var(--gold); font-size:14px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--line); padding-bottom:4px; }
  .hint2 { color:var(--muted); font-size:13px; }
  .pcrow td:first-child { border-left:3px solid var(--gold-dim); }
`;

const NUM_FIELDS = { level: 1, ac: 1, hp: 1, fort: 1, ref: 1, will: 1, init: 1, perc: 1 };
const blank = () => ({ name: '', level: '', cls: '', ac: '', hp: '', fort: '', ref: '', will: '', init: '', perc: '' });
const sgn = (n) => (n === '' || n == null ? '?' : n >= 0 ? '+' + n : '' + n);

export default function Party() {
  const ctx = useCtx();

  // Local editable rows; mirror Ctx.party but always show at least one row.
  const rows = ctx.party && ctx.party.length ? ctx.party : [blank()];

  function commit(nextRows) {
    // Keep only rows that have a name or level (matches vanilla read()).
    const kept = nextRows
      .map((pc) => {
        const out = {};
        Object.keys(blank()).forEach((f) => {
          let v = pc[f] != null ? pc[f] : '';
          if (NUM_FIELDS[f]) v = v === '' ? '' : parseInt(v, 10) || 0;
          out[f] = v;
        });
        return out;
      })
      .filter((pc) => pc.name || pc.level);
    ctx.setParty(kept);
  }

  function updateCell(idx, field, value) {
    const next = rows.map((r) => ({ ...r }));
    next[idx][field] = value;
    commit(next);
  }
  function addRow() {
    commit([...rows.map((r) => ({ ...r })), blank()]);
  }
  function delRow(idx) {
    const next = rows.filter((_, i) => i !== idx);
    commit(next.length ? next : [blank()]);
  }
  function clearAll() {
    if (window.confirm('Clear the whole roster?')) ctx.setParty([]);
  }

  const p = ctx.party || [];
  const apl = p.length ? Math.round(p.reduce((a, x) => a + (x.level || 0), 0) / p.length) : 0;
  const acs = p.map((x) => x.ac).filter(Boolean);
  const pers = p.map((x) => x.perc).filter(Boolean);

  const cell = (idx, k, cls) => (
    <td>
      <input
        className={cls || ''}
        value={rows[idx][k] != null ? rows[idx][k] : ''}
        onChange={(e) => updateCell(idx, k, e.target.value)}
      />
    </td>
  );

  return (
    <Layout title="Party Roster" sub="Your PCs — shared across every tool" contextBar={false}>
      <style>{CSS}</style>
      <div className="party-wrap">
        <div className="derived">
          {p.length ? `Party of ${p.length} · APL ${apl}` : 'No PCs yet — add your party below.'}
        </div>
        <table className="party">
          <thead>
            <tr>
              <th>PC</th><th>Lvl</th><th>Class</th><th>AC</th><th>HP</th>
              <th>Fort</th><th>Ref</th><th>Will</th><th>Init</th><th>Pass.&nbsp;Per</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr className="pcrow" key={idx}>
                {cell(idx, 'name', 'name')}
                {cell(idx, 'level', 'num')}
                {cell(idx, 'cls')}
                {cell(idx, 'ac', 'num')}
                {cell(idx, 'hp', 'num')}
                {cell(idx, 'fort', 'num')}
                {cell(idx, 'ref', 'num')}
                {cell(idx, 'will', 'num')}
                {cell(idx, 'init', 'num')}
                {cell(idx, 'perc', 'num')}
                <td><button onClick={() => delRow(idx)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="primary" onClick={addRow} style={{ width: 'auto', marginTop: 10 }}>+ Add PC</button>
        <button onClick={clearAll} style={{ marginTop: 10 }}>Clear Roster</button>
        <p className="hint2">
          Saved in this browser and shared across tools — the Combat Tracker can add the party, the XP calculator auto-fills size &amp; level, and the player display shows initiative.
          Init/save fields are modifiers (e.g. +6); Passive Per is the full value (10 + Perception).
        </p>

        <div className="ref">
          <h2>At a glance (GM reference)</h2>
          <div className="hint2">
            {p.length === 0 ? null : (
              <>
                {p.map((x, i) => (
                  <div key={i}>
                    {x.name || '(PC)'} — L{x.level || '?'} {x.cls || ''} · AC {x.ac || '?'} · HP {x.hp || '?'}
                    {' '}· Fort {sgn(x.fort)} Ref {sgn(x.ref)} Will {sgn(x.will)} · passive Per {x.perc || '?'}
                  </div>
                ))}
                {acs.length ? (
                  <div style={{ marginTop: 6 }}>
                    Lowest AC {Math.min(...acs)} · Highest passive Per {pers.length ? Math.max(...pers) : '?'}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
