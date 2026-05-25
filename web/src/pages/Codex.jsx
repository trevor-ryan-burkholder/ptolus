import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DATA } from '../data/index.js';
import { Layout } from '../components/ui.jsx';

/* ---- helpers ---- */
function fmtGp(n) { return n == null ? '—' : Number(n).toLocaleString('en-US') + ' gp'; }
function crSort(a, b) { return (a.cr_value || 0) - (b.cr_value || 0) || a.name.localeCompare(b.name); }
function nameSort(a, b) { return a.name.localeCompare(b.name); }
function spellLevels(e) { return Object.keys(e.level || {}).map((k) => k + ' ' + e.level[k]).join(', '); }
function minLevel(e) { const v = Object.values(e.level || {}); return v.length ? Math.min.apply(null, v) : 99; }
function sgn(n) { return n == null ? '—' : (n >= 0 ? '+' + n : '' + n); }
function distinct(arr, fn) {
  const s = new Set();
  arr.forEach((e) => { const v = fn(e); (Array.isArray(v) ? v : [v]).forEach((x) => { if (x != null && x !== '') s.add(x); }); });
  return [...s].sort();
}
function crBand(cv, v) {
  if (v === '≤1') return cv <= 1;
  if (v === '2–5') return cv >= 2 && cv <= 5;
  if (v === '6–10') return cv >= 6 && cv <= 10;
  if (v === '11–15') return cv >= 11 && cv <= 15;
  return cv >= 16;
}

/* ---- detail field components ---- */
function Line({ k, v }) {
  if (v == null || v === '') return null;
  return <div className="line"><span className="k">{k}:</span> {v}</div>;
}
function ListLine({ k, arr }) {
  if (!arr || !arr.length) return null;
  return <Line k={k} v={arr.join(', ')} />;
}

/* ---- detail renderers (return JSX) ---- */
function MonsterDetail({ m }) {
  const ac = m.ac || {}, ab = m.abilities || {}, sv = m.saves || {}, at = m.attacks || {};
  return (
    <>
      <h2>{m.name}<span className="cr">CR {m.cr}</span></h2>
      <div className="line">
        {[m.size, m.type].filter(Boolean).join(' ')}
        {m.subtype ? ' (' + m.subtype + ')' : ''}
        {m.alignment ? ', ' + m.alignment : ''}
      </div>
      <hr />
      <Line k="Init" v={m.initiative != null ? (m.initiative >= 0 ? '+' : '') + m.initiative : null} />
      <Line k="AC" v={ac.total != null ? ac.total + ' (touch ' + ac.touch + ', flat-footed ' + ac.flat_footed + ')' + (ac.notes ? ' — ' + ac.notes : '') : null} />
      <Line k="hp" v={m.hp != null ? m.hp + (m.hd ? ' (' + m.hd + ')' : '') : null} />
      <Line k="Saves" v={'Fort ' + sgn(sv.fort) + ', Ref ' + sgn(sv.ref) + ', Will ' + sgn(sv.will)} />
      <Line k="Speed" v={m.speed} />
      <Line k="Melee" v={at.melee} />
      <Line k="Ranged" v={at.ranged} />
      <Line k="Full Attack" v={at.full_attack} />
      <Line k="Space/Reach" v={m.space_reach} />
      <ListLine k="Special Attacks" arr={m.special_attacks} />
      <ListLine k="Special Qualities" arr={m.special_qualities} />
      <Line k="Abilities" v={['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'].map((k) => k + ' ' + (ab[k.toLowerCase()] != null ? ab[k.toLowerCase()] : '—')).join(', ')} />
      <ListLine k="Skills" arr={m.skills} />
      <ListLine k="Feats" arr={m.feats} />
      <hr />
      <Line k="Environment" v={(m.environments || []).join(', ')} />
      <Line k="Organization" v={m.organization} />
      <Line k="Treasure" v={m.treasure} />
      <ListLine k="Languages" arr={m.languages} />
      {m.tags && m.tags.length > 0 && <div className="tag">{m.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>}
      <div className="src">{m.source || ''}</div>
    </>
  );
}
function SpellDetail({ s }) {
  return (
    <>
      <h2>{s.name}</h2>
      <div className="line">
        {s.school}
        {s.subschool ? ' (' + s.subschool + ')' : ''}
        {s.descriptors && s.descriptors.length ? ' [' + s.descriptors.join(', ') + ']' : ''}
      </div>
      <hr />
      <Line k="Level" v={spellLevels(s)} />
      <ListLine k="Components" arr={s.components} />
      <Line k="Casting Time" v={s.casting_time} />
      <Line k="Range" v={s.range} />
      <Line k="Target" v={s.target || s.area || s.effect} />
      <Line k="Duration" v={s.duration} />
      <Line k="Saving Throw" v={s.saving_throw} />
      <Line k="Spell Resistance" v={s.spell_resistance} />
      {s.description && <div className="desc">{s.description}</div>}
      <div className="src">{s.source || ''}</div>
    </>
  );
}
function MagicDetail({ it }) {
  return (
    <>
      <h2>{it.name}<span className="cr">{fmtGp(it.price_gp)}</span></h2>
      <div className="line">{it.category} · {it.tier}{it.subtier ? '/' + it.subtier : ''}</div>
      <hr />
      <Line k="Body Slot" v={it.body_slot} />
      <Line k="Caster Level" v={it.caster_level} />
      <Line k="Aura" v={it.aura} />
      {it.description && <div className="desc">{it.description}</div>}
      {it.tags && it.tags.length > 0 && <div className="tag">{it.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>}
      <div className="src">{it.source || ''}</div>
    </>
  );
}
function MundaneDetail({ it }) {
  const dmg = it.damage
    ? [it.damage.medium && 'M ' + it.damage.medium, it.damage.small && 'S ' + it.damage.small].filter(Boolean).join(' / ')
    : null;
  return (
    <>
      <h2>{it.name}<span className="cr">{fmtGp(it.price_gp)}</span></h2>
      <div className="line">{it.category}{it.subcategory ? ' · ' + it.subcategory : ''}</div>
      <hr />
      <Line k="Damage" v={dmg} />
      <Line k="Critical" v={it.critical} />
      <Line k="Damage Type" v={it.damage_type} />
      <Line k="Range" v={it.range_ft ? it.range_ft + ' ft' : null} />
      <Line k="Weight" v={it.weight_lb != null ? it.weight_lb + ' lb' : null} />
      {it.description && <div className="desc">{it.description}</div>}
      <div className="src">{it.source || ''}</div>
    </>
  );
}
function PowerDetail({ p }) {
  return (
    <>
      <h2>{p.name}</h2>
      <div className="line">{p.discipline || ''}{p.subdiscipline ? ' (' + p.subdiscipline + ')' : ''}</div>
      <hr />
      <Line k="Level" v={spellLevels(p)} />
      <Line k="Power Points" v={p.pp_cost != null ? p.pp_cost : p.display} />
      <Line k="Display" v={p.display} />
      <Line k="Manifesting Time" v={p.manifesting_time} />
      <Line k="Range" v={p.range} />
      <Line k="Target/Area" v={p.area_or_target || p.target || p.area} />
      <Line k="Duration" v={p.duration} />
      <Line k="Saving Throw" v={p.saving_throw} />
      <Line k="Power Resistance" v={p.power_resistance} />
      {p.description && <div className="desc">{p.description}</div>}
      {p.augment && <div className="desc"><span className="k">Augment:</span> {p.augment}</div>}
      <div className="src">{p.source || ''}</div>
    </>
  );
}

/* ---- tab definitions ---- */
const TABS = [
  {
    key: 'monsters', label: 'Monsters', data: () => DATA.monsters, sort: crSort, Detail: MonsterDetail,
    sub: (m) => 'CR ' + m.cr + ' · ' + (m.type || ''),
    text: (m) => (m.name + ' ' + (m.type || '') + ' ' + (m.tags || []).join(' ') + ' ' + (m.environments || []).join(' ')).toLowerCase(),
    filters: [
      { id: 'env', label: 'Environment', opts: (d) => distinct(d, (m) => m.environments), test: (m, v) => (m.environments || []).indexOf(v) !== -1 },
      { id: 'cr', label: 'CR band', opts: () => ['≤1', '2–5', '6–10', '11–15', '16+'], test: (m, v) => crBand(m.cr_value, v) },
    ],
  },
  {
    key: 'spells', label: 'Spells', data: () => DATA.spells, sort: nameSort, Detail: SpellDetail,
    sub: (s) => s.school + ' · ' + spellLevels(s),
    text: (s) => (s.name + ' ' + s.school + ' ' + (s.descriptors || []).join(' ') + ' ' + (s.tags || []).join(' ')).toLowerCase(),
    filters: [
      { id: 'class', label: 'Class', opts: (d) => distinct(d, (s) => Object.keys(s.level || {})), test: (s, v) => s.level && s.level[v] != null },
      { id: 'lvl', label: 'Level', opts: (d) => distinct(d, (s) => Object.values(s.level || {})).map(String), test: (s, v) => Object.values(s.level || {}).indexOf(+v) !== -1 },
    ],
  },
  {
    key: 'magicItems', label: 'Magic Items', data: () => DATA.magicItems, sort: (a, b) => (a.price_gp || 0) - (b.price_gp || 0) || nameSort(a, b), Detail: MagicDetail,
    sub: (it) => it.tier + ' · ' + fmtGp(it.price_gp),
    text: (it) => (it.name + ' ' + it.category + ' ' + (it.tags || []).join(' ') + ' ' + (it.description || '')).toLowerCase(),
    filters: [
      { id: 'tier', label: 'Tier', opts: (d) => distinct(d, (it) => it.tier), test: (it, v) => it.tier === v },
      { id: 'cat', label: 'Category', opts: (d) => distinct(d, (it) => it.category), test: (it, v) => it.category === v },
    ],
  },
  {
    key: 'mundane', label: 'Gear', data: () => DATA.mundaneItems, sort: (a, b) => nameSort(a, b), Detail: MundaneDetail,
    sub: (it) => it.category + ' · ' + fmtGp(it.price_gp),
    text: (it) => (it.name + ' ' + it.category + ' ' + (it.subcategory || '')).toLowerCase(),
    filters: [
      { id: 'cat', label: 'Category', opts: (d) => distinct(d, (it) => it.category), test: (it, v) => it.category === v },
    ],
  },
  {
    key: 'powers', label: 'Powers', data: () => DATA.powers, sort: (a, b) => minLevel(a) - minLevel(b) || nameSort(a, b), Detail: PowerDetail,
    sub: (p) => (p.discipline || '') + ' · ' + spellLevels(p),
    text: (p) => (p.name + ' ' + (p.discipline || '') + ' ' + (p.description || '')).toLowerCase(),
    filters: [
      { id: 'disc', label: 'Discipline', opts: (d) => distinct(d, (p) => p.discipline), test: (p, v) => p.discipline === v },
      { id: 'lvl', label: 'Level', opts: (d) => distinct(d, (p) => Object.values(p.level || {})).map(String), test: (p, v) => Object.values(p.level || {}).indexOf(+v) !== -1 },
    ],
  },
];

function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '');
  if (!raw) return { key: null, name: '' };
  const ci = raw.indexOf(':');
  const key = ci < 0 ? decodeURIComponent(raw) : raw.slice(0, ci);
  const name = ci < 0 ? '' : decodeURIComponent(raw.slice(ci + 1));
  return { key, name };
}

export default function Codex() {
  const location = useLocation();
  const hashInit = parseHash(location.hash);
  const initialTab = TABS.find((t) => t.key === hashInit.key) || TABS[0];

  const [tabKey, setTabKey] = useState(initialTab.key);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(hashInit.name || null);

  const tab = TABS.find((t) => t.key === tabKey) || TABS[0];

  // accept deep-link via hash on mount / hash change
  useEffect(() => {
    const { key, name } = parseHash(location.hash);
    if (key && TABS.some((t) => t.key === key)) {
      setTabKey(key);
      setSelected(name || null);
      setFilters({});
      setSearch('');
    }
  }, [location.hash]);

  function switchTab(key) {
    setTabKey(key);
    setSelected(null);
    setFilters({});
    setSearch('');
  }

  const items = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tab.data().filter((e) => {
      if (q && tab.text(e).indexOf(q) === -1) return false;
      for (const f of tab.filters) { if (filters[f.id] != null && filters[f.id] !== '' && !f.test(e, filters[f.id])) return false; }
      return true;
    }).slice().sort(tab.sort);
  }, [tab, search, filters]);

  const entry = selected ? tab.data().find((x) => x.name === selected) : null;
  const Detail = tab.Detail;

  return (
    <Layout title="Codex" sub="Monsters · spells · items · powers" contextBar={false}>
      <style>{`
        .codex-tabs { display:flex; gap:6px; padding:10px 20px 0; flex-wrap:wrap; }
        .codex-tabs button { font-size:14px; padding:7px 12px; width:auto; }
        .codex-tabs button.active { background:var(--gold); color:#1a1a1a; font-weight:bold; }
        .codex-grid { display:grid; grid-template-columns:320px 1fr; height:calc(100vh - 148px); }
        @media (max-width:760px){ .codex-grid{ grid-template-columns:1fr; height:auto; } .codex-side{ max-height:42vh; } }
        .codex-side { border-right:1px solid var(--line); overflow-y:auto; padding:12px; }
        .codex-side input, .codex-side select { margin-bottom:8px; }
        .codex-filters { display:flex; gap:6px; flex-wrap:wrap; }
        .codex-filters select { width:auto; flex:1; min-width:120px; }
        .codex-count { color:var(--muted); font-size:12px; margin:4px 0 8px; }
        .codex-row { display:block; padding:6px 8px; border-radius:5px; cursor:pointer; color:var(--text); font-size:14px; line-height:1.25; }
        .codex-row:hover { background:var(--bg-input); }
        .codex-row.active { background:var(--gold); color:#1a1a1a; }
        .codex-row .sub { color:var(--muted); font-size:12px; }
        .codex-row.active .sub { color:#3a3000; }
        .codex-detail { overflow-y:auto; padding:14px 28px 60px; }
        .statblock { max-width:760px; font-family:Georgia, serif; line-height:1.5; }
        .statblock h2 { color:var(--gold); margin:6px 0 2px; font-size:24px; display:flex; justify-content:space-between; align-items:baseline; text-transform:none; border:none; padding:0; letter-spacing:0; }
        .statblock h2 .cr { font-size:16px; color:var(--muted); }
        .statblock .line { margin:3px 0; }
        .statblock .k { color:var(--gold); font-weight:bold; }
        .statblock .desc { margin-top:10px; white-space:pre-wrap; }
        .statblock .src { color:var(--muted); font-size:13px; margin-top:12px; }
        .statblock hr { border:none; border-top:1px solid var(--line); margin:8px 0; }
        .statblock .tag { margin-top:8px; }
        .codex-nores { color:var(--muted); font-style:italic; padding:10px; }
      `}</style>
      <div className="codex-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={t.key === tabKey ? 'active' : ''} onClick={() => switchTab(t.key)}>
            {t.label} <span style={{ opacity: 0.6 }}>{t.data().length}</span>
          </button>
        ))}
      </div>
      <div className="codex-grid">
        <div className="codex-side">
          <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="codex-filters">
            {tab.filters.map((f) => (
              <select
                key={f.id}
                value={filters[f.id] || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, [f.id]: e.target.value }))}
              >
                <option value="">{f.label}: all</option>
                {f.opts(tab.data()).map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
          </div>
          <div className="codex-count">{items.length} of {tab.data().length}</div>
          <div>
            {items.length === 0
              ? <div className="codex-nores">No matches.</div>
              : items.map((e) => (
                <div
                  key={e.name}
                  className={'codex-row' + (selected === e.name ? ' active' : '')}
                  onClick={() => setSelected(e.name)}
                >
                  <div>{e.name}</div>
                  <div className="sub">{tab.sub(e)}</div>
                </div>
              ))}
          </div>
        </div>
        <div className="codex-detail">
          <div className="statblock">
            {entry ? <Detail {...{ [detailProp(tab.key)]: entry }} /> : <div className="codex-nores">Select an entry from the list.</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// map tab key → the prop name each Detail component expects
function detailProp(key) {
  if (key === 'monsters') return 'm';
  if (key === 'spells') return 's';
  if (key === 'powers') return 'p';
  return 'it';
}
