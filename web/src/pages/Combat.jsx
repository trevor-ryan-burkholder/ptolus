import { useEffect, useRef, useState } from 'react';
import D from '../lib/dice.js';
import Tables from '../lib/tables.js';
import { DATA } from '../data/index.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, esc } from '../components/ui.jsx';

const CSS = `
  .cbt-topbar { display:flex; align-items:center; gap:12px; padding:12px 20px; background:var(--bg-panel); border-bottom:1px solid var(--line); flex-wrap:wrap; }
  .cbt-topbar .round { font-size:30px; color:var(--gold); font-weight:bold; }
  .cbt-topbar button { font-size:15px; padding:7px 12px; }
  .cbt-topbar .aoe { display:flex; gap:4px; align-items:center; margin-left:auto; }
  .cbt-topbar .aoe input { width:80px; }
  .cbt-wrap { padding:14px 20px 60px; }
  table.cbt { border-collapse:collapse; width:100%; }
  table.cbt th { text-align:left; color:var(--gold); font-size:13px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--line); padding:6px 8px; }
  table.cbt td { border-bottom:1px solid var(--line); padding:6px 8px; vertical-align:top; }
  tr.active td { background:#2b2616; }
  tr.dead td { opacity:0.5; }
  tr.pc td:nth-child(2) { border-left:3px solid #4a7aa0; }
  input.name { width:150px; } input.hp,input.init { text-align:center; }
  input.dmg { width:54px; text-align:center; margin-left:6px; }
  .conds .tag { cursor:default; }
  .tag b { cursor:pointer; margin-left:5px; color:var(--bad); }
  .tag input.dur { width:34px; padding:0 2px; font-size:12px; margin-left:4px; }
  .cond-red{color:#f0a0a0;border-color:#7a3030;} .cond-orange{color:#e8b878;border-color:#7a5520;}
  .cond-yellow{color:#e8dca0;border-color:#7a7020;} .cond-purple{color:#c8a8e8;border-color:#553070;}
  .cond-blue{color:#a0c0e8;border-color:#305570;}
  tr.statrow td { background:#15140f; font-size:14px; line-height:1.5; }
  tr.statrow b { color:var(--gold); }
  .rollbar { margin-top:6px; } .rollbar button { font-size:12px; padding:3px 8px; margin-right:4px; }
  .addrow { display:flex; gap:8px; flex-wrap:wrap; align-items:flex-end; margin-top:14px; padding:12px; background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; }
  .addrow .f { display:flex; flex-direction:column; }
  .addrow label { margin:0 0 3px; }
  .addrow input, .addrow select { width:auto; }
  details.effects { margin-top:18px; border:1px solid var(--line); border-radius:8px; background:var(--bg-panel); padding:0 14px 14px; }
  details.effects summary { cursor:pointer; color:var(--gold); font-size:15px; text-transform:uppercase; letter-spacing:1px; padding:12px 0; }
  .eff { border-bottom:1px solid var(--line); padding:7px 0; }
  .eff.expiring { color:#f0a0a0; font-weight:bold; }
  .eff.soon { color:#e8b878; }
  .eff.conc { border-left:3px solid #a060c8; padding-left:8px; }
  .eff.conc.flashing { animation: concflash 0.5s ease-in-out 4; }
  @keyframes concflash { 0%,100% { background:transparent; } 50% { background:#5a2a6a; } }
  #cbt-turninfo.warn { color:#f0a0a0; font-weight:bold; }
  .quickbuffs button { font-size:13px; padding:5px 9px; margin:0 4px 4px 0; }
  .muted2 { color:var(--muted); font-size:13px; }
`;

const CONDITIONS = [
  ['Blinded', 'red', '−2 AC, loses Dex bonus, −4 attack, 50% miss'],
  ['Confused', 'purple', 'Roll d% each round for action'],
  ['Cowering', 'red', "−2 AC, loses Dex, can't act"],
  ['Dazed', 'orange', "Can't act, no AC loss"],
  ['Dazzled', 'yellow', '−1 attack & sight Perception'],
  ['Dead', 'red', 'Dead'],
  ['Disabled', 'orange', '0 HP; one move OR standard; strenuous = dying'],
  ['Dying', 'red', '−1 HP/round, unconscious'],
  ['Entangled', 'yellow', '−2 attack, −4 Dex, half speed'],
  ['Exhausted', 'orange', 'Half speed, −6 Str/Dex'],
  ['Fascinated', 'purple', '−4 Perception vs other threats'],
  ['Fatigued', 'yellow', '−2 Str/Dex, no run/charge'],
  ['Flat-footed', 'blue', 'Loses Dex to AC, no AoO'],
  ['Frightened', 'orange', '−2 attack/saves/checks, must flee'],
  ['Grappled', 'blue', '−4 Dex, −2 attack, no move'],
  ['Helpless', 'red', 'Dex 0, coup de grace possible'],
  ['Invisible', 'blue', '+2 attack, foes lose Dex to AC'],
  ['Nauseated', 'orange', 'Move only, no attacks/spells'],
  ['Panicked', 'red', '−2 attack/saves, drops items, flees'],
  ['Paralyzed', 'red', 'Dex/Str 0, helpless'],
  ['Pinned', 'red', "Helpless, can't move"],
  ['Prone', 'yellow', '−4 melee, +4 AC vs ranged, −4 vs melee'],
  ['Shaken', 'yellow', '−2 attack/saves/checks'],
  ['Sickened', 'yellow', '−2 attack/damage/saves/checks'],
  ['Stable', 'orange', '0 HP, not losing HP, unconscious'],
  ['Staggered', 'orange', 'Standard OR move only'],
  ['Stunned', 'red', "Loses Dex, drops items, can't act"],
  ['Unconscious', 'red', 'Helpless, unaware'],
];
const CONDMAP = {}; CONDITIONS.forEach((c) => { CONDMAP[c[0]] = { color: c[1], rem: c[2] }; });

const QUICK = [
  ['Bless', 'minutes', (cl) => cl], ['Haste', 'rounds', (cl) => cl], ['Blur', 'minutes', (cl) => cl],
  ['Mirror Image', 'minutes', (cl) => cl], ['Hold Person', 'rounds', (cl) => cl], ['Invisibility', 'minutes', (cl) => cl],
  ['Heroism', 'minutes', (cl) => 10 * cl], ['Fly', 'minutes', (cl) => cl], ['Rage', 'rounds', () => 6],
];

const SAVE_KEY = 'ptolus-combat-v1';
const sgn = (n) => (n == null || n === '' ? '?' : n >= 0 ? '+' + n : '' + n);
const parseAtk = (str) => { const m = String(str || '').match(/([+-]\d+)/); return m ? parseInt(m[1], 10) : null; };
const statOf = (c) => (c.srcName ? DATA.monsters.find((x) => x.name === c.srcName) : null);
const findMonster = (name) => DATA.monsters.find((x) => x.name === name);
function parseAmt(v) {
  v = String(v).trim();
  if (!v) return null;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  try { return D.d(v); } catch { return null; }
}
function parseDuration(durStr, cl) {
  const s = (durStr || '').toLowerCase();
  if (/permanent/.test(s)) return { dur: 0, unit: 'perm' };
  if (/instantaneous/.test(s)) return { dur: 1, unit: 'rounds' };
  if (/dispelled/.test(s)) return { dur: 0, unit: 'dispel' };
  const per = /\/\s*level/.test(s) || /per level/.test(s);
  const m = s.match(/(\d+)\s*(round|min|hour)/);
  const base = m ? parseInt(m[1], 10) : 1;
  let unit = 'rounds';
  if (m && /min/.test(m[2])) unit = 'minutes';
  else if (m && /hour/.test(m[2])) unit = 'hours';
  return { dur: per ? base * cl : base, unit };
}

let SEQ_FALLBACK = 0;

const MONSTER_OPTIONS = DATA.monsters.slice().sort((a, b) => a.name.localeCompare(b.name));
const SPELL_NAMES = DATA.spells.slice().sort((a, b) => a.name.localeCompare(b.name)).map((s) => s.name);

function loadInitial() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.combatants) {
      return { combatants: s.combatants, effects: s.effects || [], round: s.round || 1, activeId: s.activeId || null, seq: s.seq || 0 };
    }
  } catch { /* ignore */ }
  return { combatants: [], effects: [], round: 1, activeId: null, seq: 0 };
}

export default function Combat() {
  const ctx = useCtx();
  const init = useRef(loadInitial());
  const [combatants, setCombatants] = useState(init.current.combatants);
  const [effects, setEffects] = useState(init.current.effects);
  const [round, setRound] = useState(init.current.round);
  const [activeId, setActiveId] = useState(init.current.activeId);
  const seqRef = useRef(init.current.seq);
  const [turnInfo, setTurnInfo] = useState('');
  const [turnWarn, setTurnWarn] = useState(false);
  const [flashIds, setFlashIds] = useState([]); // effect ids currently flashing

  // add-combatant inputs
  const [an, setAn] = useState('');
  const [ai, setAi] = useState('');
  const [ah, setAh] = useState('');
  const [monster, setMonster] = useState(MONSTER_OPTIONS.length ? MONSTER_OPTIONS[0].name : '');
  const [mcount, setMcount] = useState(1);
  const [aoe, setAoe] = useState('');

  // effect inputs
  const [en, setEn] = useState('');
  const [et, setEt] = useState('');
  const [ed, setEd] = useState(5);
  const [eu, setEu] = useState('rounds');
  const [ecl, setEcl] = useState(5);
  const [econc, setEconc] = useState(false);

  // import / xp button counts
  const [pendingEnc, setPendingEnc] = useState(0);

  const uid = () => ++seqRef.current;

  // persist whenever core state changes
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ combatants, effects, round, activeId, seq: seqRef.current }));
    } catch { /* quota */ }
  }, [combatants, effects, round, activeId]);

  // pending encounter button label
  function refreshImportCount() {
    let p = null; try { p = JSON.parse(localStorage.getItem('ptolus-pending-encounter')); } catch { /* ignore */ }
    setPendingEnc(p && p.combatants ? p.combatants.length : 0);
  }
  useEffect(() => { refreshImportCount(); }, []);

  function info(text, warn = false) { setTurnInfo(text); setTurnWarn(warn); }

  const sorted = () => combatants.slice().sort((a, b) => b.init - a.init || a.id - b.id);
  const find = (id) => combatants.find((c) => c.id === +id);

  function update(id, fn) {
    setCombatants((list) => list.map((c) => (c.id === +id ? fn({ ...c, conditions: c.conditions.map((x) => ({ ...x })) }) : c)));
  }

  function adjustHP(c) {
    const has = (n) => c.conditions.some((x) => x.name === n);
    const addOnce = (n) => { if (!has(n)) c.conditions.push({ name: n, dur: null }); };
    const rm = (n) => { c.conditions = c.conditions.filter((x) => x.name !== n); };
    if (c.hpCur <= -10) { addOnce('Dead'); }
    else if (c.hpCur < 0) { rm('Dead'); addOnce('Dying'); }
    else if (c.hpCur === 0) { rm('Dying'); rm('Dead'); addOnce('Disabled'); }
    else { rm('Dying'); rm('Dead'); rm('Disabled'); }
    return c;
  }

  function flashConc(c, dmg) {
    const conc = effects.filter((e) => e.conc);
    if (!conc.length) return;
    info('⚠ ' + c.name + ' took ' + dmg + ' dmg — if a concentrating caster was hit, Concentration DC ' + (10 + dmg) + ' (+spell level): ' +
      conc.map((e) => e.name + ' on ' + e.target).join(', '), true);
    setFlashIds(conc.map((e) => e.id));
    setTimeout(() => setFlashIds([]), 2500);
    setTimeout(() => setTurnWarn(false), 4000);
  }

  function addCombatant(name, initv, hpMax, opts) {
    const c = Object.assign({ id: uid(), name: name || 'Combatant', init: initv, hpCur: hpMax, hpMax, conditions: [], custom: '' }, opts || {});
    setCombatants((list) => [...list, c]);
    return c;
  }

  function rollFor(c, kind, mod) {
    const r = D.roll(20);
    let label, total = r;
    if (kind === 'd20') label = 'd20';
    else if (kind === 'atk') { total = r + (+mod || 0); label = 'Attack ' + sgn(+mod) + (r === 20 ? ' (nat 20!)' : r === 1 ? ' (nat 1)' : ''); }
    else { const sv = (statOf(c) || c).saves || {}; const m = sv[kind] || 0; total = r + m; label = kind.charAt(0).toUpperCase() + kind.slice(1) + ' save ' + sgn(m); }
    info(c.name + ' — ' + label + ': d20(' + r + ')' + (total !== r ? ' = ' + total : ''), false);
  }

  // ---- row actions ----
  function removeCombatant(c) {
    setCombatants((list) => list.filter((x) => x.id !== c.id));
    if (activeId === c.id) setActiveId(null);
  }
  function hpDelta(c, delta) {
    update(c.id, (x) => { x.hpCur += delta; return adjustHP(x); });
    if (delta < 0) flashConc(c, -delta);
  }
  function setHpCur(c, val) {
    const old = c.hpCur;
    const v = parseInt(val, 10) || 0;
    update(c.id, (x) => { x.hpCur = v; return adjustHP(x); });
    if (v < old) flashConc(c, old - v);
  }
  function applyDmg(c, val) {
    const amt = parseAmt(val);
    if (amt == null) return;
    update(c.id, (x) => { x.hpCur -= amt; return adjustHP(x); });
    if (amt > 0) flashConc(c, amt);
  }
  function toggleStat(c) { update(c.id, (x) => { x.expanded = !x.expanded; return x; }); }
  function bumpInit(c, dir) { update(c.id, (x) => { x.init += dir; return x; }); }
  function setInitVal(c, val) { update(c.id, (x) => { x.init = parseInt(val, 10) || 0; return x; }); }
  function setName(c, val) { update(c.id, (x) => { x.name = val; return x; }); }
  function setCustom(c, val) { update(c.id, (x) => { x.custom = val; return x; }); }
  function addCond(c, name) {
    if (!name) return;
    update(c.id, (x) => { if (!x.conditions.some((y) => y.name === name)) x.conditions.push({ name, dur: null }); return x; });
  }
  function delCond(c, name) { update(c.id, (x) => { x.conditions = x.conditions.filter((y) => y.name !== name); return x; }); }
  function setCondDur(c, name, val) {
    update(c.id, (x) => { const cond = x.conditions.find((y) => y.name === name); if (cond) cond.dur = val === '' ? null : (parseInt(val, 10) || 0); return x; });
  }

  // ---- add controls ----
  function addManual() {
    const name = an.trim() || 'Combatant';
    const initv = ai === '' ? D.roll(20) : (parseInt(ai, 10) || 0);
    const hp = parseInt(ah, 10) || 1;
    addCombatant(name, initv, hp);
    setAn(''); setAi(''); setAh('');
  }
  function addParty() {
    const party = ctx.party || [];
    if (!party.length) { info('No party roster yet — add PCs in the Party tool.'); return; }
    let added = 0;
    const existing = new Set(combatants.filter((c) => c.isPC).map((c) => c.name));
    const toAdd = [];
    party.forEach((pc) => {
      if (existing.has(pc.name)) return;
      const initv = D.roll(20) + (pc.init || 0);
      toAdd.push(Object.assign(
        { id: uid(), name: pc.name || 'PC', init: initv, hpCur: Math.max(1, pc.hp || 1), hpMax: Math.max(1, pc.hp || 1), conditions: [], custom: '' },
        { isPC: true, ac: pc.ac ? { total: pc.ac } : null, saves: { fort: pc.fort || 0, ref: pc.ref || 0, will: pc.will || 0 } }
      ));
      added++;
    });
    if (toAdd.length) setCombatants((list) => [...list, ...toAdd]);
    info(added ? 'Added ' + added + ' PC(s) from the roster.' : 'Party already in the tracker.');
  }
  function addMonsters() {
    const m = findMonster(monster);
    if (!m) return;
    const count = Math.max(1, Math.min(20, parseInt(mcount, 10) || 1));
    const toAdd = [];
    for (let i = 0; i < count; i++) {
      let hp = m.hp;
      try { if (m.hd) hp = D.d(m.hd.replace(/\s/g, '')); } catch { /* keep */ }
      const initv = D.roll(20) + (m.initiative || 0);
      toAdd.push(Object.assign(
        { id: uid(), name: count > 1 ? m.name + ' ' + (i + 1) : m.name, init: initv, hpCur: Math.max(1, hp), hpMax: Math.max(1, hp), conditions: [], custom: 'CR ' + m.cr },
        { srcName: m.name }
      ));
    }
    setCombatants((list) => [...list, ...toAdd]);
  }
  function aoeAll() {
    const amt = parseAmt(aoe);
    if (amt == null) { info('Enter AoE damage (a number or dice like 6d6).'); return; }
    let n = 0;
    setCombatants((list) => list.map((c) => {
      if (c.hpCur > -10) { n++; const x = adjustHP({ ...c, conditions: c.conditions.map((y) => ({ ...y })), hpCur: c.hpCur - amt }); return x; }
      return c;
    }));
    setAoe('');
    const conc = effects.filter((e) => e.conc).length;
    info('AoE: ' + amt + ' damage to ' + n + ' combatant(s)' + (conc ? ' — check concentration on ' + conc + ' effect(s)' : '') + '.');
  }

  // ---- round / turn ----
  function nextRound() {
    setRound((r) => r + 1);
    const expiring = [];
    setCombatants((list) => list.map((c) => {
      let conditions = c.conditions.filter((x) => x.name !== 'Flat-footed').map((x) => ({ ...x }));
      conditions.forEach((x) => { if (typeof x.dur === 'number') x.dur--; });
      conditions = conditions.filter((x) => !(typeof x.dur === 'number' && x.dur <= 0));
      const x = { ...c, conditions };
      if (x.hpCur < 0 && x.hpCur > -10) { x.hpCur--; adjustHP(x); }
      return x;
    }));
    setEffects((list) => {
      const next = list.map((ef) => ({ ...ef }));
      next.forEach((ef) => { if (ef.unit === 'rounds' && typeof ef.dur === 'number') { ef.dur--; if (ef.dur === 0) expiring.push(ef.name + ' on ' + ef.target); } });
      return next.filter((ef) => !(ef.unit === 'rounds' && ef.dur <= 0));
    });
    if (expiring.length) info('Expired: ' + expiring.join(', '), false);
  }
  function stepTurn(dir) {
    const list = sorted();
    if (!list.length) return;
    let i = list.findIndex((c) => c.id === activeId);
    if (i < 0) i = dir > 0 ? -1 : list.length;
    i = (i + dir + list.length) % list.length;
    setActiveId(list[i].id);
    setTurnWarn(false);
  }
  function resetAll() {
    if (combatants.length && !window.confirm('Clear all combatants and effects?')) return;
    setCombatants([]); setEffects([]); setRound(1); setActiveId(null);
    seqRef.current = 0;
    try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
    info('');
  }

  // ---- effects ----
  function addEffect(name, target, dur, unit, conc) {
    setEffects((list) => [...list, { id: uid(), name, target: target || '—', dur, unit, conc: !!conc }]);
  }
  function addEffectFromForm() {
    const name = en.trim();
    if (!name) return;
    addEffect(name, et.trim() || '—', parseInt(ed, 10) || 0, eu, econc);
    setEn(''); setEt('');
  }
  function fillFromSpell() {
    const name = en.trim();
    const sp = DATA.spells.find((s) => s.name.toLowerCase() === name.toLowerCase());
    const cl = parseInt(ecl, 10) || 5;
    if (!sp) { info('Spell "' + name + '" not in database — enter duration manually.'); return; }
    const dInfo = parseDuration(sp.duration, cl);
    setEd(dInfo.dur); setEu(dInfo.unit);
    info(sp.name + ': ' + sp.duration + ' → ' + dInfo.dur + ' ' + dInfo.unit + ' at CL ' + cl);
  }
  function addQuick(n, unit, fn) {
    const cl = parseInt(ecl, 10) || 5;
    addEffect(n, et.trim() || 'party', fn(cl), unit, false);
  }
  function delEffect(id) { setEffects((list) => list.filter((ef) => ef.id !== id)); }

  // ---- import encounter ----
  function importEncounter() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem('ptolus-pending-encounter')); } catch { /* ignore */ }
    if (!p || !p.combatants || !p.combatants.length) {
      info('No pending encounter. In the Encounter generator, roll one and click "Send to Combat Tracker".');
      return;
    }
    const toAdd = p.combatants.map((c) => {
      const hp = Math.max(1, c.maxhp || c.hp || 1);
      return Object.assign(
        { id: uid(), name: c.name, init: c.init || 0, hpCur: hp, hpMax: hp, conditions: [], custom: c.cr ? 'CR ' + c.cr : '' },
        { srcName: c.srcName || null }
      );
    });
    setCombatants((list) => [...list, ...toAdd]);
    try { localStorage.removeItem('ptolus-pending-encounter'); } catch { /* ignore */ }
    info('Imported ' + p.combatants.length + ' combatant(s) from the Encounter generator.');
    setPendingEnc(0);
  }

  // ---- Award XP ----
  function crValue(c) {
    if (c.srcName) { const m = findMonster(c.srcName); if (m && typeof m.cr_value === 'number') return m.cr_value; }
    const mm = String(c.custom || '').match(/CR\s*(\d+)\s*\/\s*(\d+)|CR\s*([\d.]+)/i);
    if (mm) return mm[3] != null ? parseFloat(mm[3]) : parseInt(mm[1], 10) / parseInt(mm[2], 10);
    return 0;
  }
  function isDefeated(c) {
    if (c.isPC) return false;
    if (c.hpCur <= 0) return true;
    return (c.conditions || []).some((x) => /^(Dead|Dying|Unconscious|Stable|Helpless)$/.test(x.name));
  }
  function sendToXP() {
    const defeated = combatants.filter(isDefeated);
    const crs = defeated.map(crValue).filter((v) => v > 0);
    if (!crs.length) {
      info('No defeated monsters with a known CR. (Drop a monster to ≤0 HP or mark it Dead, and use ones added from the Monster list / an imported encounter.)');
      return;
    }
    const el = Tables.elFromCRs(crs);
    let size = 4;
    let apl = ctx.partyLevel;
    if (ctx.partySize) size = ctx.partySize;
    const payload = { encounters: [{ el, mult: 1, crs }], size, ts: Date.now() };
    if (apl != null) payload.apl = apl;
    try { localStorage.setItem('ptolus-pending-xp', JSON.stringify(payload)); } catch { /* ignore */ }
    info('✦ Sent EL ' + el + ' (' + crs.length + ' defeated) to the XP Calculator. Open it → "Import from Combat".');
  }

  // ---- stat block markup ----
  function statRowHtml(c) {
    const m = statOf(c);
    const ac = m ? m.ac : c.ac;
    const sv = m ? m.saves : c.saves;
    const bits = [];
    if (ac) bits.push('<b>AC</b> ' + (ac.total != null ? ac.total + ' (touch ' + ac.touch + ', flat-footed ' + ac.flat_footed + ')' : ac));
    if (sv) bits.push('<b>Saves</b> Fort ' + sgn(sv.fort) + ', Ref ' + sgn(sv.ref) + ', Will ' + sgn(sv.will));
    if (m && m.speed) bits.push('<b>Speed</b> ' + esc(m.speed));
    let h = bits.join(' &nbsp;·&nbsp; ');
    if (m && m.attacks) {
      if (m.attacks.full_attack) h += '<br><b>Full Attack</b> ' + esc(m.attacks.full_attack);
      else if (m.attacks.melee) h += '<br><b>Melee</b> ' + esc(m.attacks.melee);
    }
    if (m && m.special_attacks && m.special_attacks.length) h += '<br><b>SA</b> ' + esc(m.special_attacks.join(', '));
    if (m && m.special_qualities && m.special_qualities.length) h += '<br><b>SQ</b> ' + esc(m.special_qualities.join(', '));
    return { html: h, m, sv };
  }

  const list = sorted();
  const activeC = list.find((c) => c.id === activeId);
  const displayInfo = !turnWarn && activeC ? 'Current turn: ' + activeC.name : turnInfo;

  // effects grouped by target
  const byTarget = {};
  effects.forEach((ef) => { (byTarget[ef.target] = byTarget[ef.target] || []).push(ef); });

  return (
    <Layout title="Combat Tracker" sub="Initiative · HP · conditions · effects · run the monster" contextBar={false}>
      <style>{CSS}</style>

      <div className="cbt-topbar">
        <span className="round">Round <span>{round}</span></span>
        <button className="primary" style={{ width: 'auto', margin: 0 }} onClick={nextRound}>Next Round ▶</button>
        <button onClick={() => stepTurn(-1)}>◀ Prev Turn</button>
        <button onClick={() => stepTurn(1)}>Next Turn ▶</button>
        <button onClick={sendToXP}>✦ Award XP</button>
        <button onClick={resetAll}>Reset</button>
        <span className="aoe">
          <label className="muted2" style={{ margin: 0 }}>AoE</label>
          <input placeholder="dmg / 6d6" value={aoe} onChange={(e) => setAoe(e.target.value)} />
          <button onClick={aoeAll}>→ all</button>
        </span>
        <span className={'muted2' + (turnWarn ? ' warn' : '')} id="cbt-turninfo" style={{ flexBasis: '100%' }}>{displayInfo}</span>
      </div>

      <div className="cbt-wrap">
        <table className="cbt">
          <thead>
            <tr><th></th><th>Name</th><th>Init</th><th>HP</th><th>Conditions</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const dead = c.conditions.some((x) => x.name === 'Dead');
              const canStat = c.srcName || c.ac || c.saves;
              const rows = [
                <tr className={'cbt' + (c.id === activeId ? ' active' : '') + (dead ? ' dead' : '') + (c.isPC ? ' pc' : '')} key={c.id}>
                  <td>
                    <button onClick={() => bumpInit(c, 1)}>▲</button>
                    <button onClick={() => bumpInit(c, -1)}>▼</button>
                  </td>
                  <td><input className="name" value={c.name} onChange={(e) => setName(c, e.target.value)} /></td>
                  <td><input className="init" type="number" value={c.init} onChange={(e) => setInitVal(c, e.target.value)} /></td>
                  <td>
                    HP <input className="hp" type="number" value={c.hpCur} onChange={(e) => setHpCur(c, e.target.value)} />/{c.hpMax}{' '}
                    <button onClick={() => hpDelta(c, -1)}>−</button><button onClick={() => hpDelta(c, 1)}>+</button>
                    <input className="dmg" placeholder="dmg" title="apply damage (number or 2d6); negative heals"
                      onKeyDown={(e) => { if (e.key === 'Enter') { applyDmg(c, e.target.value); e.target.value = ''; } }}
                      onBlur={(e) => { if (e.target.value) { applyDmg(c, e.target.value); e.target.value = ''; } }} />
                  </td>
                  <td className="conds">
                    {c.conditions.map((x) => (
                      <span className={'tag cond-' + (CONDMAP[x.name] ? CONDMAP[x.name].color : 'yellow')} title={CONDMAP[x.name] ? CONDMAP[x.name].rem : ''} key={x.name}>
                        {x.name}
                        <input className="dur" type="number" title="rounds" value={x.dur == null ? '' : x.dur} onChange={(e) => setCondDur(c, x.name, e.target.value)} />
                        <b onClick={() => delCond(c, x.name)}>×</b>
                      </span>
                    ))}{' '}
                    <select value="" onChange={(e) => { addCond(c, e.target.value); e.target.value = ''; }}>
                      <option value="">+ condition</option>
                      {CONDITIONS.map((cc) => <option key={cc[0]}>{cc[0]}</option>)}
                    </select>
                    <input className="custom" placeholder="custom…" value={c.custom || ''} onChange={(e) => setCustom(c, e.target.value)} />
                  </td>
                  <td>
                    {canStat ? <button title="stat block & rolls" onClick={() => toggleStat(c)}>ⓘ</button> : null}
                    <button onClick={() => removeCombatant(c)}>✕</button>
                  </td>
                </tr>,
              ];
              if (c.expanded && canStat) {
                const { html, m, sv } = statRowHtml(c);
                const atk = m && m.attacks ? parseAtk(m.attacks.full_attack || m.attacks.melee) : parseAtk(c.attack);
                rows.push(
                  <tr className="statrow" key={c.id + '-stat'}>
                    <td></td>
                    <td colSpan={5}>
                      <span dangerouslySetInnerHTML={{ __html: html }} />
                      <div className="rollbar">
                        <button onClick={() => rollFor(c, 'd20')}>d20</button>
                        {sv ? (
                          <>
                            <button onClick={() => rollFor(c, 'fort')}>Fort {sgn(sv.fort)}</button>
                            <button onClick={() => rollFor(c, 'ref')}>Ref {sgn(sv.ref)}</button>
                            <button onClick={() => rollFor(c, 'will')}>Will {sgn(sv.will)}</button>
                          </>
                        ) : null}
                        {atk != null ? <button onClick={() => rollFor(c, 'atk', atk)}>Atk {sgn(atk)}</button> : null}
                      </div>
                    </td>
                  </tr>
                );
              }
              return rows;
            })}
          </tbody>
        </table>
        {list.length === 0 ? <p className="muted2">No combatants. Add the party, add monsters, or import an encounter.</p> : null}

        <div className="addrow">
          <div className="f"><label>Name</label><input placeholder="Combatant" value={an} onChange={(e) => setAn(e.target.value)} /></div>
          <div className="f"><label>Init</label><input type="number" style={{ width: 64 }} placeholder="d20" value={ai} onChange={(e) => setAi(e.target.value)} /></div>
          <div className="f"><label>HP max</label><input type="number" style={{ width: 72 }} placeholder="HP" value={ah} onChange={(e) => setAh(e.target.value)} /></div>
          <button onClick={addManual}>Add</button>
          <button className="primary" style={{ margin: 0 }} onClick={addParty}>+ Party</button>
          <span style={{ width: 10 }} />
          <div className="f"><label>Add Monster</label>
            <select style={{ maxWidth: 240 }} value={monster} onChange={(e) => setMonster(e.target.value)}>
              {MONSTER_OPTIONS.map((m) => <option key={m.name} value={m.name}>{m.name + ' (CR ' + m.cr + ', ' + m.hp + ' hp)'}</option>)}
            </select>
          </div>
          <div className="f"><label>×</label><input type="number" min="1" max="20" style={{ width: 54 }} value={mcount} onChange={(e) => setMcount(e.target.value)} /></div>
          <button onClick={addMonsters}>Add Monster(s)</button>
          <button className={pendingEnc ? 'primary' : ''} onClick={importEncounter}>{pendingEnc ? 'Import Encounter (' + pendingEnc + ')' : 'Import Encounter'}</button>
          <div style={{ marginLeft: 'auto', border: 'none' }}><SeedControl /></div>
        </div>

        <details className="effects" open>
          <summary>Active Spells &amp; Effects</summary>
          <div className="quickbuffs">
            {QUICK.map(([n, unit, fn]) => <button key={n} onClick={() => addQuick(n, unit, fn)}>+ {n}</button>)}
          </div>
          <div className="addrow" style={{ marginTop: 6 }}>
            <div className="f"><label>Effect</label>
              <input placeholder="Haste" list="spelllist" value={en} onChange={(e) => setEn(e.target.value)} />
              <datalist id="spelllist">{SPELL_NAMES.map((n) => <option key={n} value={n} />)}</datalist>
            </div>
            <div className="f"><label>Target</label><input placeholder="who" style={{ width: 110 }} value={et} onChange={(e) => setEt(e.target.value)} /></div>
            <div className="f"><label>Dur</label><input type="number" style={{ width: 60 }} value={ed} onChange={(e) => setEd(e.target.value)} /></div>
            <div className="f"><label>Unit</label>
              <select value={eu} onChange={(e) => setEu(e.target.value)}>
                <option>rounds</option><option>minutes</option><option>hours</option>
                <option value="dispel">until dispelled</option><option value="perm">permanent</option>
              </select>
            </div>
            <div className="f"><label>CL</label><input type="number" style={{ width: 54 }} value={ecl} onChange={(e) => setEcl(e.target.value)} /></div>
            <div className="f"><label>Conc</label><input type="checkbox" style={{ width: 'auto' }} checked={econc} onChange={(e) => setEconc(e.target.checked)} /></div>
            <button onClick={addEffectFromForm}>Add Effect</button>
            <button onClick={fillFromSpell}>Fill from Spell</button>
          </div>
          <div>
            {effects.length === 0 ? <p className="muted2">No active effects.</p> : (
              Object.keys(byTarget).map((t) => (
                <div style={{ marginTop: 8 }} key={t}>
                  <strong style={{ color: 'var(--gold)' }}>{t}</strong>
                  {byTarget[t].map((ef) => {
                    let cls = 'eff';
                    if (ef.unit === 'rounds' && ef.dur === 1) cls += ' expiring';
                    else if (ef.unit === 'rounds' && ef.dur === 2) cls += ' soon';
                    if (ef.conc) cls += ' conc';
                    if (flashIds.indexOf(ef.id) !== -1) cls += ' flashing';
                    const durTxt = ef.unit === 'perm' ? 'permanent' : ef.unit === 'dispel' ? 'until dispelled' : ef.dur + ' ' + ef.unit;
                    return (
                      <div className={cls} key={ef.id}>
                        {ef.name} — {durTxt}{ef.conc ? ' [concentration]' : ''}{' '}
                        <b style={{ cursor: 'pointer', color: 'var(--bad)' }} onClick={() => delEffect(ef.id)}>×</b>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </details>
      </div>
    </Layout>
  );
}
