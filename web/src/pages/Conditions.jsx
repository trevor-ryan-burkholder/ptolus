import { useMemo, useState } from 'react';
import { Layout } from '../components/ui.jsx';

const C = [
  ['Blinded', "Can't see. −2 AC, lose Dex to AC. −4 on Search and most Str/Dex skills. 50% miss chance. Opponents have total concealment from you."],
  ['Confused', 'Roll d% each round: 01–10 normal / 11–20 babble / 21–50 deal 1d8+Str to self / 51–70 attack nearest / 71–100 flee. No AoOs.'],
  ['Cowering', 'Overcome by fear, can do nothing. −2 AC, lose Dex to AC.'],
  ['Dazed', 'Take no actions. No AC penalty.'],
  ['Dazzled', '−1 on attacks and sight-based Perception.'],
  ['Dead', 'HP at −10 or below (or 0 Con). Dead.'],
  ['Disabled', 'Exactly 0 HP. One move OR standard per round. A standard action is strenuous: take 1 damage after, become dying.'],
  ['Dying', 'Unconscious, losing HP. −1 HP/round. At −10, dead. Stabilize: DC 15 Heal or magical healing.'],
  ['Energy Drained', 'Each negative level: −1 to all checks, attacks, saves, effective level. Levels = total → dead. Negate with restoration.'],
  ['Entangled', 'Move halved. −2 attack, −4 Dex. Spellcasting needs Concentration DC 15.'],
  ['Exhausted', 'Half speed. −6 Str/Dex. No run/charge. 1 hour rest → fatigued.'],
  ['Fascinated', 'Watches the effect quietly. −4 Perception. Any obvious threat breaks it.'],
  ['Fatigued', '−2 Str/Dex. No run/charge. 8 hours rest to remove.'],
  ['Flat-Footed', 'Before your first turn. Lose Dex to AC. No AoOs.'],
  ['Frightened', '−2 attacks/saves/checks. Must flee if able; can attack if cornered.'],
  ['Grappled', 'No free movement. −4 Dex, −2 attack (light weapons OK). No ranged except crossbow. Cast: Concentration DC 20 + spell level.'],
  ['Helpless', 'Dex effectively 0. Attackers +4. Can be coup de graced (auto-crit + Fort DC 10+damage or die).'],
  ['Incorporeal', 'No body. Immune to nonmagical attacks. 50% to ignore magic. Hit only by incorporeal, +1 weapons, or effects that hit incorporeal.'],
  ['Invisible', "Can't be seen. Attackers 50% miss. You get +2 attack vs. those who can't see you; they lose Dex to AC."],
  ['Nauseated', 'Move actions only. No attacks, spells, or concentration.'],
  ['Panicked', '−2 saves/checks. Drops held items. Flees randomly. Defends only if cornered.'],
  ['Paralyzed', 'Str and Dex effectively 0. Helpless. Fliers fall; swimmers may sink.'],
  ['Petrified', 'Turned to stone. Unconscious, unaware. May suffer permanent damage if broken.'],
  ['Pinned', 'Held immobile in a grapple. Helpless but may try to break free.'],
  ['Prone', 'On the ground. −4 melee attack. +4 AC vs. ranged, −4 AC vs. adjacent melee. Standing provokes AoO.'],
  ['Shaken', '−2 attacks/saves/checks.'],
  ['Sickened', '−2 attacks/damage/saves/checks.'],
  ['Stable', 'Negative HP, no longer losing HP. Unconscious. Not dying without new damage.'],
  ['Staggered', 'Exactly 0 HP (or massive-damage stun). One move OR standard, not both.'],
  ['Stunned', 'Drops everything. No actions. −2 AC, lose Dex to AC. Attackers +2.'],
  ['Turned', "Undead fleeing a cleric's turning for 10 rounds. If cornered, −2 saves/checks."],
  ['Unconscious', 'Knocked out. Helpless. Falls prone.'],
];

const FIXED_DCS = [
  ['Stabilize a dying ally (Heal)', '15'],
  ['Defensive casting (avoid AoO)', '15 + spell level'],
  ['Cast while entangled (Concentration)', '15 + spell level'],
  ['Cast while grappling (Concentration)', '20 + spell level'],
  ['Cast after taking damage (Concentration)', '10 + damage + spell level'],
  ['Coup de grace Fort save (or die)', '10 + damage dealt'],
  ['Tumble past a foe (avoid AoO)', '15 (25 through their square)'],
  ['Break a simple wooden door', '13 (Str)'],
  ['Break a good wooden door', '18 (Str)'],
  ['Pry up a sewer grate', '22 (Str)'],
];

export default function Conditions() {
  const [tab, setTab] = useState('cond');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q ? C.filter((c) => c[0].toLowerCase().indexOf(q) !== -1) : C;
  }, [search]);

  return (
    <Layout title="Condition Quick Reference" sub="All 3.5e conditions, one page" contextBar={false}>
      <style>{`
        .cond-bar { padding:12px 20px; display:flex; gap:10px; align-items:center; border-bottom:1px solid var(--line); flex-wrap:wrap; }
        .cond-bar input { max-width:340px; }
        .cond-tabs button.active { background:var(--gold); color:#1a1a1a; }
        .cond-wrap { padding:16px 20px 60px; }
        .cond-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:12px; }
        .ccard { background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; padding:12px 14px; }
        .ccard h3 { margin:0 0 6px; color:var(--gold); font-size:18px; }
        .ccard p { margin:0; font-size:14px; line-height:1.4; }
        .cond-footer { color:var(--muted); font-size:13px; padding:0 20px 30px; }
      `}</style>
      <div className="cond-bar">
        <div className="cond-tabs btn-row" style={{ margin: 0 }}>
          <button className={tab === 'cond' ? 'active' : ''} onClick={() => setTab('cond')}>Conditions</button>
          <button className={tab === 'dc' ? 'active' : ''} onClick={() => setTab('dc')}>Save DCs</button>
        </div>
        <input
          placeholder="Filter conditions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ visibility: tab === 'cond' ? 'visible' : 'hidden' }}
        />
      </div>
      <div className="cond-wrap">
        {tab === 'cond' && (
          <div className="cond-grid">
            {filtered.map((c) => (
              <div className="ccard" key={c[0]}>
                <h3>{c[0]}</h3>
                <p>{c[1]}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'dc' && (
          <div>
            <h2 style={{ color: 'var(--gold)' }}>Save DCs at a Glance</h2>
            <p className="hint">Spell save DC = 10 + spell level + casting ability modifier. Common cases below.</p>
            <table className="ref">
              <tbody>
                <tr><th>Spell Lvl</th><th>Abil +2</th><th>+3</th><th>+4</th><th>+5</th><th>+6</th><th>+7</th></tr>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((L) => (
                  <tr key={L}>
                    <td>{L}</td>
                    {[2, 3, 4, 5, 6, 7].map((m) => <td key={m}>{10 + L + m}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 style={{ color: 'var(--gold)', marginTop: 18 }}>Common Fixed DCs</h2>
            <table className="ref">
              <tbody>
                <tr><th>Action</th><th>DC</th></tr>
                {FIXED_DCS.map((r) => (
                  <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="cond-footer">Source: PHB Appendix / Glossary. Combat conditions reference.</div>
    </Layout>
  );
}
