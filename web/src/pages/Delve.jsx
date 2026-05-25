import { useRef, useState } from 'react';
import D from '../lib/dice.js';
import Tables from '../lib/tables.js';
import { DATA } from '../data/index.js';
import { useCtx } from '../state/ctx.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { Layout, SeedControl, Log, useLog, esc } from '../components/ui.jsx';

const CSS = `
  .delve-status { background:#15140f; border:1px solid var(--gold-dim); border-radius:8px; padding:12px 14px; margin-bottom:14px;
                  font-family:'Courier New', monospace; font-size:15px; line-height:1.7; white-space:pre-wrap; }
  .delve-status .big { color:var(--gold); font-weight:bold; font-size:18px; }
  .delve-status .warn { color:var(--warn); }
  .delve-status .bad { color:var(--bad); }
  .delve-status .dim { color:var(--muted); }
  .grp { border-top:1px dashed var(--line); margin-top:12px; padding-top:10px; }
  .grp h3 { margin:0 0 6px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .grid2 button { width:100%; }
`;

const REGION_LABEL = {
  ptolus_dungeon: 'The Dungeon', ptolus_undercity: 'Undercity', ptolus_necropolis: 'Necropolis',
  dungeon: 'Generic Dungeon', underground: 'Underground',
};
const DEFAULT_STATE = { elapsed: 0, depth: 1, lights: [], toCheck: 30, interval: 30, chance: 6, region: 'ptolus_dungeon' };

function fmtTime(min) {
  const h = Math.floor(min / 60), m = min % 60;
  if (h && m) return h + 'h ' + m + 'm';
  if (h) return h + 'h';
  return m + 'm';
}
function poolFor(region) {
  return DATA.monsters.filter((m) => Array.isArray(m.environments) && m.cr_value > 0 && (m.environments.indexOf(region) !== -1 || m.environments.indexOf('any') !== -1));
}
function pickNearCR(pool, target) {
  if (!pool.length) return null;
  for (let tol = 0.5; tol <= 25; tol += 1) { const c = pool.filter((m) => Math.abs(m.cr_value - target) <= tol); if (c.length) return D.pick(c); }
  return pool.slice().sort((a, b) => Math.abs(a.cr_value - target) - Math.abs(b.cr_value - target))[0];
}
function buildEncounter(region, el) {
  const pool = poolFor(region);
  if (!pool.length) return null;
  const picks = [];
  const tpl = D.pick(['single', 'single', 'pair', 'group']);
  if (tpl === 'single') { const m = pickNearCR(pool, el); if (m) picks.push(m); }
  else if (tpl === 'pair') { const m = pickNearCR(pool, el - 2); if (m) picks.push(m, m); }
  else {
    const cnt = D.range(3, 5); const mook = pickNearCR(pool, Math.max(0.25, el - 4));
    if (mook) for (let i = 0; i < cnt; i++) picks.push(mook);
    if (D.coinFlip()) { const boss = pickNearCR(pool.filter((m) => m !== mook), el - 2); if (boss) picks.push(boss); }
  }
  if (!picks.length) { const m = pickNearCR(pool, el); if (m) picks.push(m); }
  return picks.length ? picks : null;
}
function tally(picks) { const map = new Map(); picks.forEach((m) => { const e = map.get(m.name) || { m, n: 0 }; e.n++; map.set(m.name, e); }); return [...map.values()]; }
function reaction() {
  return D.pick(['already aware, lying in wait', 'aware and approaching', 'unaware — surprise possible', 'fleeing toward the party from something else', 'feeding/distracted', 'hostile on sight']);
}

export default function Delve() {
  const ctx = useCtx();
  const log = useLog();
  const [state, setState] = useLocalStorage('ptolus-delve-v1', DEFAULT_STATE);
  const [customMin, setCustomMin] = useState(5);
  const lastEncounter = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const plevel = () => ctx.partyLevel;
  const targetEL = (s) => Math.max(1, plevel() + ((s || stateRef.current).depth - 1));

  function patch(updater) {
    setState((s) => updater({ ...s }));
  }

  function advanceTime(min, label) {
    min = Math.max(0, Math.round(min));
    if (!min) return;
    const s = { ...stateRef.current };
    s.elapsed += min;
    // burn light
    let lights = s.lights.map((l) => ({ ...l }));
    const out = [];
    lights.forEach((l) => { if (l.remaining != null) l.remaining -= min; });
    for (let i = lights.length - 1; i >= 0; i--) {
      if (lights[i].remaining != null && lights[i].remaining <= 0) { out.unshift(lights[i].name); lights.splice(i, 1); }
    }
    s.lights = lights;
    log.append('<span class="muted">+' + min + ' min — ' + (label || 'time passes') + '. (Underground ' + fmtTime(s.elapsed) + ')</span>');
    out.forEach((n) => log.append('<span class="bad">✦ ' + n + ' burns out.</span>'));
    // wandering checks
    s.toCheck -= min;
    let checks = 0;
    while (s.toCheck <= 0) { checks++; s.toCheck += s.interval; }
    setState(s);
    for (let i = 0; i < checks; i++) wanderingCheck(true, s);
  }

  function wanderingCheck(fromTime, sArg) {
    const s = sArg || { ...stateRef.current };
    const roll = D.roll(s.chance);
    const tag = fromTime ? '' : ' (manual)';
    if (roll !== 1) {
      log.append('<span class="muted">Wandering check' + tag + ' (1 in ' + s.chance + '): rolled ' + roll + ' — clear.</span>');
      return;
    }
    const region = s.region;
    const el = targetEL(s);
    const picks = buildEncounter(region, el);
    if (!picks) {
      log.append('<span class="head">⚠ WANDERING MONSTER' + tag + '</span>\n<span class="bad">No monsters tagged for ' + REGION_LABEL[region] + '. Add to monsters.json.</span>');
      return;
    }
    lastEncounter.current = picks;
    const groups = tally(picks);
    const actualEL = Tables.elFromCRs(picks.map((m) => m.cr_value));
    const t = Tables.treasureValueByEL(actualEL);
    let out = '<span class="head">⚠ WANDERING MONSTER' + tag + ' — Depth ' + s.depth + ' — ' + REGION_LABEL[region] + '</span>\n';
    out += groups.map((g) => '<b>' + esc(g.m.name) + '</b> (CR ' + g.m.cr + ')' + (g.n > 1 ? ' ×' + g.n : '')).join(' + ') + '\n';
    out += '<span class="muted">→ approx EL ' + actualEL + ' · loot ' + Tables.gp(t.coins_gp) + ' coins | ' + Tables.gp(t.goods_gp) + ' goods | ' + Tables.gp(t.items_gp) + ' items</span>\n';
    out += '<span class="muted">→ Reaction: ' + reaction() + '. Distance: ' + (D.range(2, 8) * 10) + ' ft.</span>';
    log.append(out);
  }

  function addLight(name, remaining, radius) {
    patch((s) => { s.lights = [...s.lights, { name, remaining, radius }]; return s; });
    log.append('<span class="good">✦ Lit: ' + name + (remaining == null ? ' (permanent)' : ' (' + remaining + ' min)') + '.</span>');
  }
  function snuff() {
    patch((s) => { s.lights = []; return s; });
    log.append('<span class="bad">All light extinguished.</span>');
  }
  function descend(delta) {
    let newDepth;
    patch((s) => { s.depth = Math.max(1, s.depth + delta); newDepth = s.depth; return s; });
    log.append('<span class="head">' + (delta > 0 ? '▼ Descend' : '▲ Ascend') + ' to Level ' + newDepth + '</span>\n<span class="muted">Wandering EL now targets ' + Math.max(1, plevel() + (newDepth - 1)) + '.</span>');
  }
  function setRegion(region) { patch((s) => { s.region = region; return s; }); }
  function setInterval2(v) {
    patch((s) => { s.interval = v; if (s.toCheck > v) s.toCheck = v; return s; });
  }
  function setChance(v) { patch((s) => { s.chance = v; return s; }); }
  function reset() {
    const next = { ...DEFAULT_STATE, interval: state.interval, chance: state.chance, toCheck: state.interval, region: state.region };
    setState(next);
    lastEncounter.current = null;
    log.append('<span class="muted">Delve reset. The party is at the entrance, no time elapsed.</span>');
  }

  function sendToCombat() {
    const enc = lastEncounter.current;
    if (!enc || !enc.length) { log.append('<span class="bad">No wandering monster to send yet.</span>'); return; }
    const counts = {}; enc.forEach((m) => { counts[m.name] = (counts[m.name] || 0) + 1; });
    const seen = {};
    const combatants = enc.map((m) => {
      let hp = m.hp; try { if (m.hd) hp = D.d(m.hd.replace(/\s/g, '')); } catch { /* keep */ }
      hp = Math.max(1, hp);
      let name = m.name;
      if (counts[m.name] > 1) { seen[m.name] = (seen[m.name] || 0) + 1; name = m.name + ' ' + seen[m.name]; }
      return { name, srcName: m.name, hp, maxhp: hp, init: D.roll(20) + (m.initiative || 0), cr: m.cr };
    });
    try { localStorage.setItem('ptolus-pending-encounter', JSON.stringify({ combatants, ts: Date.now() })); } catch { /* quota */ }
    log.append('<span class="good">✓ Sent ' + combatants.length + ' combatant(s) to the Combat Tracker. Open it → "Import Encounter".</span>');
  }

  // status panel
  const statusHtml = (() => {
    let s = '<span class="big">Underground ' + fmtTime(state.elapsed) + '</span>   ·   Depth: Level ' + state.depth + '\n';
    if (!state.lights.length) {
      s += '<span class="bad">No light burning — darkness.</span>\n';
    } else {
      s += 'Light:\n';
      state.lights.forEach((l) => {
        if (l.remaining == null) s += '  • ' + l.name + ' (' + l.radius + ' ft, permanent)\n';
        else {
          const cls = l.remaining <= 10 ? 'bad' : l.remaining <= 20 ? 'warn' : 'dim';
          s += '  • ' + l.name + ' (' + l.radius + ' ft) — <span class="' + cls + '">' + l.remaining + ' min left</span>\n';
        }
      });
    }
    s += '<span class="dim">Next wandering check in ' + Math.max(0, state.toCheck) + ' min · 1 in ' + state.chance + ' · target EL ' + targetEL() + '</span>';
    return s;
  })();

  return (
    <Layout title="Delve Tracker" sub="Time, light, and wandering monsters underground">
      <style>{CSS}</style>
      <div className="runner-main">
        <div className="panel">
          <h2>Delve</h2>
          <div className="delve-status" dangerouslySetInnerHTML={{ __html: statusHtml }} />

          <div className="grp">
            <h3>Advance Time</h3>
            <div className="grid2">
              <button onClick={() => advanceTime(10, 'explore a room')}>Explore room (+10)</button>
              <button onClick={() => advanceTime(10, 'search')}>Search (+10)</button>
              <button onClick={() => advanceTime(20, 'careful movement')}>Careful move (+20)</button>
              <button onClick={() => advanceTime(60, 'short rest')}>Short rest (+60)</button>
            </div>
            <div className="btn-row">
              <input type="number" min="1" value={customMin} style={{ flex: 1 }} onChange={(e) => setCustomMin(e.target.value)} />
              <button style={{ flex: 1 }} onClick={() => advanceTime(parseInt(customMin, 10) || 0, 'time passes')}>+ minutes</button>
            </div>
          </div>

          <div className="grp">
            <h3>Light Sources</h3>
            <div className="grid2">
              <button onClick={() => addLight('Torch', 60, 20)}>Torch (1 hr · 20 ft)</button>
              <button onClick={() => addLight('Hooded lantern', 360, 30)}>Hooded lantern (6 hr · 30 ft)</button>
              <button onClick={() => addLight('Sunrod', 360, 30)}>Sunrod (6 hr · 30 ft)</button>
              <button onClick={() => addLight('Everburning torch', null, 20)}>Everburning (∞ · 20 ft)</button>
            </div>
            <button style={{ width: '100%', marginTop: 6 }} onClick={snuff}>Snuff all light</button>
          </div>

          <div className="grp">
            <h3>Depth &amp; Checks</h3>
            <div className="btn-row">
              <button onClick={() => descend(-1)}>▲ Ascend</button>
              <button onClick={() => descend(1)}>▼ Descend</button>
            </div>
            <label>Encounter region</label>
            <select value={state.region} onChange={(e) => setRegion(e.target.value)}>
              <option value="ptolus_dungeon">The Dungeon (Ptolus)</option>
              <option value="ptolus_undercity">Undercity</option>
              <option value="ptolus_necropolis">Necropolis</option>
              <option value="dungeon">Generic Dungeon</option>
              <option value="underground">Underground (caves)</option>
            </select>
            <p className="hint">Party level {ctx.partyLevel} (set in the bar above).</p>
            <div className="btn-row">
              <span style={{ flex: 1 }}>
                <label style={{ marginTop: 0 }}>Check every</label>
                <select value={state.interval} onChange={(e) => setInterval2(parseInt(e.target.value, 10) || 30)}>
                  <option value={10}>10 min</option><option value={30}>30 min</option><option value={60}>1 hour</option>
                </select>
              </span>
              <span style={{ flex: 1 }}>
                <label style={{ marginTop: 0 }}>Chance</label>
                <select value={state.chance} onChange={(e) => setChance(parseInt(e.target.value, 10) || 6)}>
                  <option value={4}>1 in 4</option><option value={6}>1 in 6</option><option value={8}>1 in 8</option><option value={10}>1 in 10</option>
                </select>
              </span>
            </div>
            <button className="primary" onClick={() => wanderingCheck(false)}>Roll Wandering Check now</button>
            <button style={{ width: '100%', marginTop: 8 }} onClick={sendToCombat}>⚔ Send last encounter to Combat</button>
          </div>

          <button style={{ width: '100%', marginTop: 12 }} onClick={reset}>Reset Delve</button>
          <SeedControl />
        </div>

        <Log log={log} title="Delve Journal" />
      </div>
    </Layout>
  );
}
