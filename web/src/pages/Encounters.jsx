import { useState } from 'react';
import Dice from '../lib/dice.js';
import Tables from '../lib/tables.js';
import GRADES from '../lib/grades.js';
import { DATA, PTOLUS_ENC } from '../data/index.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, Log, useLog, esc } from '../components/ui.jsx';

const REGIONS = [
  ['ptolus_streets', 'Ptolus Streets'], ['ptolus_undercity', 'Ptolus Undercity'], ['ptolus_necropolis', 'Ptolus Necropolis'],
  ['ptolus_dungeon', 'The Dungeon'], ['ptolus_docks', 'Ptolus Docks'], ['ptolus_spire', 'Ptolus Spire'],
  ['dungeon', 'Generic Dungeon'], ['sewer', 'Sewer'], ['wilderness_temperate', 'Wilderness (Temperate)'],
  ['wilderness_cold', 'Wilderness (Cold)'], ['wilderness_warm', 'Wilderness (Warm)'], ['wilderness_coastal', 'Coastal / Aquatic'],
  ['underground', 'Underground'], ['urban', 'Urban (generic)'], ['planar_lower', 'Lower Planes'],
];
const REGION_LABEL = Object.fromEntries(REGIONS.map(([v, l]) => [v, l]));
const CITY_REGIONS = ['ptolus_streets', 'ptolus_undercity', 'ptolus_docks', 'urban'];

function poolFor(region) {
  return DATA.monsters.filter((m) => Array.isArray(m.environments) && m.cr_value > 0 &&
    (m.environments.indexOf(region) !== -1 || m.environments.indexOf('any') !== -1));
}
function pickNearCR(pool, targetCR) {
  if (!pool.length) return null;
  for (let tol = 0.5; tol <= 25; tol += 1) { const c = pool.filter((m) => Math.abs(m.cr_value - targetCR) <= tol); if (c.length) return Dice.pick(c); }
  return pool.slice().sort((a, b) => Math.abs(a.cr_value - targetCR) - Math.abs(b.cr_value - targetCR))[0];
}
function build(region, targetEL) {
  const pool = poolFor(region);
  if (!pool.length) return null;
  const picks = [];
  const template = Dice.pick(['single', 'single', 'pair', 'group']);
  if (template === 'single') { const m = pickNearCR(pool, targetEL); if (m) picks.push(m); }
  else if (template === 'pair') { const base = pickNearCR(pool, targetEL - 2); if (base) picks.push(base, base); }
  else {
    const count = Dice.range(4, 6);
    const mook = pickNearCR(pool, Math.max(0.25, targetEL - 4));
    if (mook) for (let i = 0; i < count; i++) picks.push(mook);
    if (Dice.coinFlip()) { const leader = pickNearCR(pool.filter((m) => m !== mook), targetEL - 2) || pickNearCR(pool, targetEL - 2); if (leader) picks.push(leader); }
  }
  if (!picks.length) { const m = pickNearCR(pool, targetEL); if (m) picks.push(m); }
  return picks.length ? picks : null;
}
function tally(picks) {
  const map = new Map();
  picks.forEach((m) => { const e = map.get(m.name) || { m, n: 0 }; e.n++; map.set(m.name, e); });
  return [...map.values()];
}

export default function Encounters() {
  const ctx = useCtx();
  const log = useLog();
  const [source, setSource] = useState('db');
  const [region, setRegion] = useState('ptolus_dungeon');
  const [offset, setOffset] = useState(0);
  const [zone, setZone] = useState('street');
  const [district, setDistrict] = useState('Docks');
  const [time, setTime] = useState('day');
  let lastEncounter = null;
  const [, setTick] = useState(0);

  function generateDB() {
    const plevel = ctx.partyLevel;
    const targetEL = Math.max(1, plevel + offset);
    const picks = build(region, targetEL);
    const header = '[' + REGION_LABEL[region].toUpperCase() + ' — Party Lvl ' + plevel + ' — Target EL ' + targetEL + ']';
    if (!picks) {
      log.append('<span class="head">' + esc(header) + '</span>\n<span class="bad">No suitable monsters in database for this region.</span>');
      return;
    }
    lastEncounter = picks; setTick((t) => t + 1);
    window.__lastEnc = picks;
    const groups = tally(picks);
    const lines = groups.map((g) => '<b>' + esc(g.m.name) + '</b> (CR ' + g.m.cr + ')' + (g.n > 1 ? ' ×' + g.n : ''));
    const el = Tables.elFromCRs(picks.map((m) => m.cr_value));
    const t = Tables.treasureValueByEL(el);
    let out = '<span class="head">' + esc(header) + '</span>\n' + lines.join('\n') + '\n' +
      '<span class="muted">→ approx EL ' + el + '</span>\n' +
      '<span class="muted">→ Avg loot: ' + Tables.gp(t.coins_gp) + ' coins | ' + Tables.gp(t.goods_gp) + ' goods | ' + Tables.gp(t.items_gp) + ' items</span>';
    if (CITY_REGIONS.indexOf(region) !== -1) {
      const toughest = picks.slice().sort((a, b) => b.cr_value - a.cr_value)[0];
      const g = GRADES.classify(toughest.name, toughest.cr_value);
      if (g) out += '\n<span class="muted">→ Watch: ' + g.grade + ' (' + esc(toughest.name) + ') — ' + g.response.toLowerCase() + ' in ' + g.responseDice + '</span>';
    }
    log.append(out);
  }

  function entryLine(e) { return e.t + (e.cr ? ' <span class="muted">[CR ' + e.cr + ']</span>' : ''); }
  function generateTables() {
    if (zone === 'sewer') { const r = Dice.range(1, 20); log.append('<span class="head">[SEWERS — d20=' + r + ']</span>\n' + entryLine(PTOLUS_ENC.sewer[r - 1])); }
    else if (zone === 'labyrinth') { const r = Dice.range(1, 12); log.append("<span class=\"head\">[GHUL'S LABYRINTH — d12=" + r + ']</span>\n' + entryLine(PTOLUS_ENC.labyrinth[r - 1])); }
    else if (zone === 'necropolis') { const e = Dice.pick(PTOLUS_ENC.necropolis); log.append('<span class="head">[NECROPOLIS — night]</span>\n' + entryLine(e)); }
    else {
      const tone = PTOLUS_ENC.districtTone[district] || {};
      const weighted = Object.keys(tone).map((type) => { let w = tone[type]; if (time === 'night' && PTOLUS_ENC.nightBoost[type] != null) w *= PTOLUS_ENC.nightBoost[type]; return { value: type, weight: w }; }).filter((x) => x.weight > 0);
      const type = Dice.weightedPick(weighted);
      const text = Dice.pick(PTOLUS_ENC.street[type]);
      log.append('<span class="head">[CITY STREET — ' + district + ' — ' + (time === 'night' ? 'Night' : 'Day') + ']</span>\n<span class="muted">' + type + ':</span> ' + text);
    }
  }
  function generate() { source === 'tables' ? generateTables() : generateDB(); }

  function sendToCombat() {
    const enc = window.__lastEnc;
    if (!enc || !enc.length) { log.append('<span class="bad">Roll a database encounter first.</span>'); return; }
    const counts = {}; enc.forEach((m) => { counts[m.name] = (counts[m.name] || 0) + 1; });
    const seen = {};
    const combatants = enc.map((m) => {
      let hp = m.hp; try { if (m.hd) hp = Dice.d(m.hd.replace(/\s/g, '')); } catch { /* keep */ }
      hp = Math.max(1, hp);
      let name = m.name;
      if (counts[m.name] > 1) { seen[m.name] = (seen[m.name] || 0) + 1; name = m.name + ' ' + seen[m.name]; }
      return { name, srcName: m.name, hp, maxhp: hp, init: Dice.roll(20) + (m.initiative || 0), cr: m.cr };
    });
    try { localStorage.setItem('ptolus-pending-encounter', JSON.stringify({ combatants, ts: Date.now() })); } catch { /* quota */ }
    log.append('<span class="good">✓ Sent ' + combatants.length + ' combatant(s) to the Combat Tracker.</span>');
  }

  const poolCount = poolFor(region).length;

  return (
    <Layout title="Encounter Generator" sub="Database combats or canonical Ptolus tables">
      <div className="runner-main">
        <div className="panel">
          <h2>Encounter</h2>
          <label>Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="db">Monster Database (EL-targeted)</option>
            <option value="tables">Ptolus Tables (canonical / zone)</option>
          </select>

          {source === 'db' && (
            <>
              <label>Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <p className="hint">{poolCount} monsters tagged for {REGION_LABEL[region]}. Party level {ctx.partyLevel} (set in the bar above).</p>
              <label>Target EL offset</label>
              <select value={offset} onChange={(e) => setOffset(parseInt(e.target.value, 10))}>
                <option value={-2}>−2 (easy)</option><option value={-1}>−1</option><option value={0}>±0 (even)</option><option value={1}>+1</option><option value={2}>+2 (tough)</option>
              </select>
            </>
          )}

          {source === 'tables' && (
            <>
              <label>Zone / Table</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)}>
                <option value="street">City Street (by district)</option>
                <option value="sewer">Sewers (d20)</option>
                <option value="labyrinth">Ghul's Labyrinth (d12)</option>
                <option value="necropolis">Necropolis (night)</option>
              </select>
              {zone === 'street' && (
                <>
                  <label>District</label>
                  <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                    {PTOLUS_ENC.districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <label>Time</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)}><option value="day">Day</option><option value="night">Night</option></select>
                </>
              )}
            </>
          )}

          <button className="primary" onClick={generate}>Roll Encounter</button>
          <button style={{ width: '100%', marginTop: 8 }} onClick={sendToCombat}>⚔ Send last to Combat Tracker</button>
          <SeedControl />
        </div>
        <Log log={log} title="Encounter Log" />
      </div>
    </Layout>
  );
}
