import { useState } from 'react';
import D from '../lib/dice.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

const DISTRICTS = ['Midtown', 'Oldtown', 'the Warrens', 'the Docks', "the Nobles' Quarter", 'the Guildsman District', 'the Temple District', 'Rivergate'];
const HOUSES = ['Abanar', 'Dallimothan', 'Erthuo', 'Kath', 'Khatru', 'Nagel', 'Rau', 'Sadar', 'Shever', 'Vladaam'];
const FACTIONS = ['the Inverted Pyramid', "the Delver's Guild", 'the Church of Lothian', 'the Balacazars'];
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

// e: {t, who, where, urg, arc(min), hook}
const E = {
  faction: [
    { t: 'The Balacazars have quietly bought out three warehouses in {district} over two weeks. Street word: a large shipment is coming from the south.', who: 'Balacazars', where: 'the Docks', urg: 'Low', arc: 1, hook: "What's in the shipment?" },
    { t: 'An Inverted Pyramid mage was spotted outside the tower, meeting someone unhooded.', who: 'Inverted Pyramid', where: 'Oldtown', urg: 'Low', arc: 1 },
    { t: "The Delver's Guild is posting unusually high rewards for Level 1–2 content. Something is down there.", who: "Delver's Guild", where: 'Undercity Market', urg: 'Medium', arc: 1, hook: 'Why the sudden interest in shallow levels?' },
    { t: 'The Church of Lothian has begun a "purification sweep" of {district}.', who: 'Church of Lothian', where: '{district}', urg: 'Medium', arc: 1 },
    { t: "Two criminal crews are arguing over territory in the Warrens. It hasn't turned violent. Yet.", who: 'rival crews', where: 'the Warrens', urg: 'Medium', arc: 1 },
    { t: "A faction has openly challenged a rival's claim to {district}. Both are arming.", who: 'two factions', where: '{district}', urg: 'High', arc: 2 },
    { t: 'A Guild leader has gone missing — no announcement yet, but the silence is loud.', who: '{faction}', urg: 'Medium', arc: 2, hook: 'Who benefits from the silence?' },
    { t: 'The Inverted Pyramid has sealed its tower. No explanation.', who: 'Inverted Pyramid', where: 'Oldtown', urg: 'High', arc: 2 },
    { t: 'The Balacazars called in multiple debts simultaneously — they need something big, fast.', who: 'Balacazars', urg: 'High', arc: 2 },
  ],
  civic: [
    { t: 'A new permit regulation was announced — it specifically affects delvers.', who: 'City Watch', urg: 'Low', arc: 1 },
    { t: 'City Watch has begun a crackdown on unlicensed weapon-carrying in {district}.', who: 'City Watch', where: '{district}', urg: 'Medium', arc: 1 },
    { t: 'A road in {district} is closed for "structural reasons." Rumor says something broke through from below.', who: 'city engineers', where: '{district}', urg: 'Medium', arc: 1, hook: 'What came up?' },
    { t: 'A public execution is scheduled — the crime was monster-related violence. Public sympathy is divided.', who: 'City Watch', urg: 'Medium', arc: 1 },
    { t: 'A city council session ended in open argument — unusual, and noted.', who: 'City Council', urg: 'Low', arc: 1 },
    { t: '{district} has been placed under partial curfew. The official reason is vague.', who: 'City Watch', where: '{district}', urg: 'High', arc: 3 },
    { t: 'City infrastructure is failing in an unexpected area — sewers, water, or walls.', who: 'city engineers', urg: 'High', arc: 3 },
    { t: 'Emergency City Watch conscription — off-duty guards are being pulled back in.', who: 'City Watch', urg: 'Urgent', arc: 3 },
  ],
  monster: [
    { t: 'A Grade 3 monster was found dead under suspicious circumstances.', where: 'the Warrens', urg: 'Medium', arc: 1, hook: 'Who killed it, and why?' },
    { t: 'A Grade 4 monster is applying for a residency permit — controversial in {district}.', where: '{district}', urg: 'Low', arc: 1 },
    { t: 'A Grade 3 has gone missing from its registered address.', urg: 'Medium', arc: 1 },
    { t: 'A minor Grade 4 riot in the Warrens was contained — three injured.', where: 'the Warrens', urg: 'Medium', arc: 1 },
    { t: 'An unregistered monster was sighted in Midtown — Grade 3 or 4, unclear.', where: 'Midtown', urg: 'Medium', arc: 1 },
    { t: "A Grade 2 monster's permit was revoked after an incident — now unregistered and loose. City Watch offering 500 gp for information.", urg: 'High', arc: 2 },
    { t: 'A Grade 1 was sighted near the city walls — not yet inside.', where: 'the walls', urg: 'High', arc: 2 },
    { t: 'A monster-rights protest has been organized by the integrated community.', urg: 'Medium', arc: 2 },
    { t: 'A Special Grade threat was detected near the Dungeon entrance — City Watch sealed the block.', urg: 'Urgent', arc: 3 },
    { t: 'Multiple unconnected Grade 2 incidents in one week — someone is releasing them.', urg: 'Urgent', arc: 3 },
  ],
  dungeon: [
    { t: "A team came up with something sealed in a lead box and went straight to {faction}. Didn't come out for two days.", urg: 'Low', arc: 1, hook: "What's in the box?" },
    { t: 'An entrance nobody officially knew about opened up under a building.', urg: 'Medium', arc: 1 },
    { t: 'A level known to be "cleared" has monster activity again — something moved in.', urg: 'Medium', arc: 1 },
    { t: "A delver team hasn't surfaced in days — past their stated return window.", urg: 'Medium', arc: 1 },
    { t: 'Seismic activity reported in a mid-level — unusual sounds heard by teams in adjacent levels.', urg: 'Low', arc: 1 },
    { t: "Something came UP from a level no team has reached. The Delver's Guild is not commenting.", urg: 'High', arc: 2, hook: 'What frightened the Guild?' },
  ],
  noble: [
    { t: 'House {house} and House {house2} are in public dispute over a collapsed trade agreement. Each is quietly hiring "security."', where: "the Nobles' Quarter", urg: 'Medium', arc: 1 },
    { t: 'A noble of House {house} has been hiring adventurers in unusual quantities — quietly.', urg: 'Low', arc: 1 },
    { t: 'Scandal: a member of House {house} was found in the wrong district, in the wrong company.', urg: 'Low', arc: 1 },
    { t: 'House {house} is calling in favors — multiple parties are being contacted at once.', urg: 'Medium', arc: 1 },
    { t: 'A succession question has opened in House {house} — the heir is missing or contested.', urg: 'Medium', arc: 2 },
  ],
  church: [
    { t: 'The Church of Lothian is increasing its presence in {district} — residents are nervous.', where: '{district}', urg: 'Low', arc: 1 },
    { t: 'A relic was stolen from the Necropolis — the Church is furious and not reporting it to the City Watch.', where: 'the Necropolis', urg: 'Medium', arc: 1 },
    { t: 'A schism: two Church factions openly disagree about monster-integration policy.', urg: 'Low', arc: 1 },
    { t: 'A new cult is operating in the city — not yet identified by the City Watch.', urg: 'High', arc: 2, hook: 'Which cult, and what do they want?' },
  ],
  criminal: [
    { t: 'The Balacazars clashed with a newcomer crew in the Warrens. Brief, bloody, unfinished.', where: 'the Warrens', urg: 'Medium', arc: 1 },
    { t: 'A fence everyone relied on has vanished — and so has his stock.', urg: 'Low', arc: 1 },
    { t: 'A smuggling ring has rerouted through the Docks under cover of night.', where: 'the Docks', urg: 'Medium', arc: 1 },
    { t: "A contract is out on someone — and the price is oddly low. That means it's personal.", urg: 'Medium', arc: 1 },
  ],
  weird: [
    { t: 'The Spire emitted a sound last night. Once. Nobody is talking about it officially.', urg: 'Medium', arc: 1 },
    { t: 'A street in Oldtown was found completely empty this morning — residents and all their possessions, gone.', where: 'Oldtown', urg: 'High', arc: 1, hook: 'Where did they go?' },
    { t: 'A Dungeon artifact appeared in a Midtown market. No one knows how it reached the surface.', where: 'Midtown', urg: 'Medium', arc: 1 },
    { t: 'Three unconnected people had the same dream last night and reported it to the Church.', urg: 'Medium', arc: 1 },
    { t: 'Something in the sewer system is organizing. The City Watch dismisses it. Delvers do not.', urg: 'Medium', arc: 1 },
  ],
};
const CATS = Object.keys(E);
const LABEL = { faction: 'FACTION', civic: 'CIVIC', monster: 'MONSTER', dungeon: 'DUNGEON', noble: 'NOBLE', church: 'CHURCH', criminal: 'CRIMINAL', weird: 'WEIRD' };

function fill(s) {
  let h2 = D.pick(HOUSES), h1 = D.pick(HOUSES); while (h1 === h2) h1 = D.pick(HOUSES);
  return (s || '').replace(/\{district\}/g, D.pick(DISTRICTS)).replace(/\{house2\}/g, h2)
    .replace(/\{house\}/g, h1).replace(/\{faction\}/g, D.pick(FACTIONS));
}
function poolFor(cat, arc) {
  const cats = cat === 'any' ? CATS : [cat];
  const out = [];
  cats.forEach((c) => E[c].forEach((e) => { if (e.arc <= arc) out.push({ cat: c, e }); }));
  return out;
}
function urgencyWeight(urg, arc) {
  const base = { Low: 3, Medium: 3, High: 2, Urgent: 1 }[urg] || 2;
  if (arc >= 3 && (urg === 'High' || urg === 'Urgent')) return base + 3;
  if (arc >= 2 && urg === 'High') return base + 1;
  return base;
}
function renderEvent(item, n) {
  const e = item.e;
  let out = (n != null ? CIRCLED[n] + ' ' : '→ ') + '<span class="head">' + LABEL[item.cat] + '</span> — ' + fill(e.t) + '\n';
  const meta = [];
  if (e.who) meta.push('Who: ' + fill(e.who));
  if (e.where) meta.push('Where: ' + fill(e.where));
  meta.push('Urgency: ' + (e.urg || 'Low'));
  let line = '   → ' + meta.join(' | ');
  if (e.hook) line += '\n   <span class="muted">Hook: ' + fill(e.hook) + '</span>';
  return out + line;
}
function roman(a) { return ['', 'I', 'II', 'III', 'IV', 'V'][a] || a; }

export default function CityEvents() {
  const ctx = useCtx();
  const log = useLog();
  const [cat, setCat] = useState('any');

  function week() {
    const arc = ctx.arc;
    const pool = poolFor('any', arc);
    const n = D.roll(4) + 2;
    const picks = [];
    const used = new Set();
    let guard = 0;
    while (picks.length < n && guard < 100) {
      guard++;
      const item = D.weightedPick(pool.map((p) => ({ value: p, weight: urgencyWeight(p.e.urg, arc) })));
      const key = item.cat + '|' + item.e.t;
      if (used.has(key)) continue;
      used.add(key); picks.push(item);
    }
    let out = '<span class="head">[PTOLUS — THIS WEEK — Arc ' + roman(arc) + ']</span>\n';
    picks.forEach((p, i) => { out += '\n' + renderEvent(p, i); });
    log.append(out);
  }
  function single() {
    const arc = ctx.arc;
    const pool = poolFor(cat, arc);
    if (!pool.length) { log.append('<span class="bad">No events for that category/arc.</span>'); return; }
    const item = D.weightedPick(pool.map((p) => ({ value: p, weight: urgencyWeight(p.e.urg, arc) })));
    log.append('<span class="head">[PTOLUS EVENT — Arc ' + roman(arc) + ']</span>\n' + renderEvent(item, null));
  }

  return (
    <Layout title="City Event Generator" sub="What's happening in Ptolus this week">
      <div className="runner-main">
        <div className="panel">
          <h2>City Events</h2>
          <label>Campaign Arc</label>
          <select value={ctx.arc} onChange={(e) => ctx.set('arc', parseInt(e.target.value, 10))}>
            <option value={1}>Arc I (lvl 1–5)</option>
            <option value={2}>Arc II (6–10)</option>
            <option value={3}>Arc III (11–15)</option>
            <option value={4}>Arc IV (16–19)</option>
            <option value={5}>Arc V (20+)</option>
          </select>
          <label>Category (for Single Event)</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="any">Any</option>
            <option value="faction">Faction</option><option value="civic">Civic</option>
            <option value="monster">Monster</option><option value="dungeon">Dungeon</option>
            <option value="noble">Noble</option><option value="church">Church</option>
            <option value="criminal">Criminal</option><option value="weird">Weird</option>
          </select>
          <button className="primary" onClick={week}>Generate Week (1d4+2)</button>
          <button style={{ width: '100%', marginTop: 8 }} onClick={single}>Single Event</button>
          <SeedControl />
        </div>
        <Log log={log} title="City Log" />
      </div>
    </Layout>
  );
}
