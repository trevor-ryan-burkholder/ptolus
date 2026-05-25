import { useState } from 'react';
import D from '../lib/dice.js';
import Tables from '../lib/tables.js';
import { DATA } from '../data/index.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, Log, useLog, esc } from '../components/ui.jsx';

const gp = Tables.gp;
function itemName(name) { return '<b>' + esc(name) + '</b>'; }

// Ptolus-specific caches: roll items by setting tag
const CACHE_TAG = { mrathrach: 'mrathrach', chaos: 'chaos-cult', imperial: 'imperial-relic', dwarven: 'dwarven-forge' };
const CACHE_LABEL = { mrathrach: 'MRATHRACH CACHE', chaos: 'CHAOS-CULT CONTRABAND', imperial: 'IMPERIAL RELICS', dwarven: 'DWARVEN FORGE GEAR' };

/* ---- gem & art tables (weighted low) ---- */
const GEM_TIERS = [
  { weight: 6, min: 5, max: 50, step: 5, names: ['agate', 'hematite', 'obsidian', 'rose quartz', 'turquoise', 'malachite', 'tiger eye', 'lapis lazuli', 'moonstone', 'bloodstone', 'onyx', 'azurite'] },
  { weight: 3, min: 50, max: 120, step: 10, names: ['amber', 'amethyst', 'garnet', 'jade', 'jasper', 'citrine', 'coral', 'pearl', 'peridot', 'chrysoprase'] },
  { weight: 1.5, min: 100, max: 600, step: 50, names: ['deep blue spinel', 'aquamarine', 'golden topaz', 'fire opal', 'black opal', 'oriental amethyst', 'violet garnet'] },
  { weight: 0.4, min: 500, max: 2000, step: 100, names: ['emerald', 'blue sapphire', 'ruby', 'clear diamond', 'jacinth', 'star sapphire'] },
];
const ART_TIERS = [
  { weight: 5, min: 20, max: 120, step: 10, names: ['silver comb', 'painted miniature', 'embroidered handkerchief', 'engraved tin flask', 'small bronze idol', 'ivory dice set'] },
  { weight: 3, min: 100, max: 500, step: 25, names: ['gold ring with citrine', 'ivory statuette', 'jeweled goblet', 'silver-chased dagger', 'gilded holy icon', 'enameled music box', 'brass astrolabe'] },
  { weight: 1, min: 500, max: 2500, step: 50, names: ['embroidered Thessiran tapestry', 'platinum signet ring', 'jade funerary mask', 'masterwork harp inlaid with gems', 'ceremonial crown (minor)'] },
];

function rollFromTiers(tiers) {
  const tier = D.weightedPick(tiers.map((t) => ({ value: t, weight: t.weight })));
  const span = (tier.max - tier.min) / tier.step;
  const value = tier.min + D.range(0, Math.round(span)) * tier.step;
  return { name: D.pick(tier.names), value: value };
}

/* ---- goods ---- */
const GOODS = ['bolt of Thessiran silk', "masterwork thieves' tools", 'set of silver eating utensils', 'fine fur-lined cloak', 'ornate hand mirror', 'cask of dwarven spirits', 'illuminated holy text', 'masterwork lute', 'brass spyglass', 'chess set (onyx & alabaster)', 'crate of exotic spices', 'embroidered ceremonial robe', 'bottle of Ptolus vintage', 'set of alchemical glassware', 'tooled-leather map case'];
const GOODS_PTOLUS = ['delver permit (expired — valuable to a fence)', 'chaositech component (inert, ~1d6×50 gp to the right buyer)', 'Inverted Pyramid token (membership, tier unknown)', 'property deed (Docks tenement)', 'letter of credit from a Ptolus trading house', 'Dungeon-salvage manifest (partial map of level 3)', 'sealed phial of prohibited alchemical reagent', 'sealed contract bearing a noble house seal'];

/* ---- magic item tier selection by EL ---- */
function tiersForEL(el) {
  if (el <= 4) return ['trivial', 'minor'];
  if (el <= 8) return ['minor'];
  if (el <= 12) return ['minor', 'medium'];
  if (el <= 16) return ['medium', 'major'];
  return ['major'];
}
const PTOLUS_ITEM_FLAVOR = ['marked with a faded district seal — Ptolus military issue', 'engraved with Inverted Pyramid sigils', 'salvaged from the Dungeon; faint chaos residue', "bears a Delvers' Guild assay stamp", 'wrapped in cloth from a Necropolis crypt', "stamped with the mint-mark of the Commissar's armory"];

function fillItems(budget, el) {
  const allowed = tiersForEL(el);
  const pool = DATA.magicItems.filter((i) => allowed.indexOf(i.tier) !== -1 && i.price_gp);
  const out = [];
  let remaining = budget;
  let guard = 0;
  if (!pool.length) return out;
  const cheapest = Math.min.apply(null, pool.map((i) => i.price_gp));
  while (remaining >= cheapest * 0.6 && guard < 12) {
    guard++;
    const affordable = pool.filter((i) => i.price_gp <= remaining * 1.15);
    if (!affordable.length) break;
    const item = D.pick(affordable);
    out.push({ item: item, over: false });
    remaining -= item.price_gp;
  }
  if (!out.length) {
    const item = D.pick(pool);
    out.push({ item: item, over: item.price_gp > budget });
  }
  return out;
}

export default function Loot() {
  const ctx = useCtx();
  const log = useLog();
  const [el, setEl] = useState(String(ctx.partyLevel || 7));
  const [ttype, setTtype] = useState('standard');
  const [flavor, setFlavor] = useState(true);
  const [singletier, setSingletier] = useState('minor');

  function rollCache(key) {
    const tag = CACHE_TAG[key];
    const pool = DATA.magicItems.filter((i) => (i.tags || []).indexOf(tag) !== -1);
    let out = '<span class="head">[' + CACHE_LABEL[key] + ']</span>\n';
    if (!pool.length) { out += '<span class="bad">No items tagged "' + tag + '" yet. Add some to srd/items/magic-items.json.</span>'; log.append(out); return; }
    const picks = D.pickN(pool, Math.min(D.range(1, 3), pool.length));
    let total = 0;
    picks.forEach((it) => { total += it.price_gp || 0; out += '  → ' + itemName(it.name) + ' (' + gp(it.price_gp) + ')' + (it.source ? ' [' + esc(it.source) + ']' : '') + '\n'; });
    const coins = D.range(1, 6) * 100;
    total += coins;
    out += '  → ' + gp(coins) + ' in mixed coin and oddments\n';
    if (key === 'chaos') out += '<span class="bad">⚠ Handling chaos-cult contraband risks corruption (see the Pits of Insanity / Corruption tracker).</span>\n';
    out += '\n<span class="muted">TOTAL: ~' + gp(total) + (key === 'chaos' || key === 'mrathrach' ? ' — illegal above-ground; the Watch confiscates it' : '') + '</span>';
    log.append(out);
  }

  function rollTreasure() {
    const elN = Math.max(1, Math.min(20, parseInt(el, 10) || 1));
    const type = ttype;
    if (type.indexOf('cache_') === 0) { rollCache(type.slice(6)); return; }
    const fl = flavor;
    const base = Tables.treasureValueByEL(elN);
    let mult = 1, label = 'Standard';
    let doCoins = true, doGoods = true, doItems = true;
    if (type === 'hoard') { mult = 2; label = 'Hoard (2×)'; }
    else if (type === 'incidental') { mult = 0.25; label = 'Incidental (¼×)'; }
    else if (type === 'coins') { doGoods = doItems = false; label = 'Coins Only'; }
    else if (type === 'items') { doCoins = doGoods = false; label = 'Items Only'; }

    const coinBudget = Math.round(base.coins_gp * mult);
    const goodsBudget = Math.round(base.goods_gp * mult);
    const itemBudget = Math.round(base.items_gp * mult);

    let out = '<span class="head">[TREASURE — EL ' + elN + ' — ' + label + ']</span>\n';
    let total = 0;

    if (doCoins && coinBudget > 0) {
      // split: ~60% mixed coin, ~25% pouch, ~15% gems/art
      const mixed = Math.round(coinBudget * 0.6);
      const pouch = Math.round(coinBudget * 0.25);
      let valuablesBudget = coinBudget - mixed - pouch;
      const gems = [];
      let ng = D.range(1, 4), spent = 0, guard = 0;
      while (gems.length < ng && spent < valuablesBudget && guard < 20) {
        guard++;
        const g = rollFromTiers(GEM_TIERS);
        if (spent + g.value > valuablesBudget * 1.4 && gems.length) break;
        gems.push(g); spent += g.value;
      }
      const art = [];
      if (D.coinFlip() && spent < valuablesBudget) {
        const a = rollFromTiers(ART_TIERS); art.push(a); spent += a.value;
      }
      const coinTotal = mixed + pouch + spent;
      total += coinTotal;
      out += '\n<span class="good">COINS: ' + gp(coinTotal) + '</span>\n';
      out += '  → ' + gp(mixed) + ' in mixed coin, ' + gp(pouch) + ' in a pouch' + (fl ? ' (Ptolus mint)' : '') + ', ' + gp(spent) + ' in gems/art\n';
      if (gems.length) out += '    Gems: ' + gems.map((g) => g.name + ' (' + gp(g.value) + ')').join(', ') + '\n';
      if (art.length) out += '    Art: ' + art.map((a) => a.name + ' (' + gp(a.value) + ')').join(', ') + '\n';
    }

    if (doGoods && goodsBudget > 0) {
      const items = [];
      let spent = 0, n = D.range(1, 4), guard = 0;
      const pool = GOODS.slice();
      while (items.length < n && guard < 12) {
        guard++;
        const name = D.pick(pool);
        const val = Math.max(20, Math.round((goodsBudget / n) * (0.6 + D.rand())));
        if (spent + val > goodsBudget * 1.3 && items.length) break;
        items.push({ name: name, val: val }); spent += val;
      }
      if (fl) {
        const pv = Math.max(30, Math.round(goodsBudget * (0.15 + D.rand() * 0.2)));
        items.push({ name: D.pick(GOODS_PTOLUS), val: pv }); spent += pv;
      }
      total += spent;
      out += '\n<span class="good">GOODS: ' + gp(spent) + '</span>\n';
      out += items.map((g) => '  → ' + g.name + ' (' + gp(g.val) + ')').join('\n') + '\n';
    }

    if (doItems && itemBudget > 0) {
      const got = fillItems(itemBudget, elN);
      let spent = 0;
      out += '\n<span class="good">ITEMS: ' + gp(itemBudget) + ' budget</span>\n';
      if (!got.length) {
        out += '  → <span class="muted">(no magic items in database for this tier)</span>\n';
      } else {
        got.forEach((g) => {
          const it = g.item;
          spent += it.price_gp;
          let line = '  → ' + itemName(it.name) + ' (' + gp(it.price_gp) + ')';
          if (it.source) line += ' [' + esc(it.source) + ']';
          if (g.over) line += ' <span class="bad">[exceeds budget — partial find / IOU?]</span>';
          if (fl && D.rand() < 0.4) line += '\n      ' + D.pick(PTOLUS_ITEM_FLAVOR);
          out += line + '\n';
        });
      }
      total += spent;
    }

    // "Items Only" also yields a few notable mundane pieces (sometimes masterwork)
    if (type === 'items') {
      const mpool = DATA.mundaneItems.filter((i) => i.price_gp >= 5 && i.price_gp <= 400);
      if (mpool.length) {
        const picks = D.pickN(mpool, D.range(1, 3));
        let spent = 0;
        out += '\n<span class="good">MUNDANE GEAR:</span>\n';
        picks.forEach((i) => {
          let name = i.name, price = i.price_gp;
          if (/Weapon|Armor|Shield/i.test(i.category || '') && !/Masterwork/i.test(name) && D.rand() < 0.4) {
            name = 'Masterwork ' + i.name; price += /Armor|Shield/i.test(i.category) ? 150 : 300;
          }
          spent += price;
          out += '  → ' + esc(name) + ' (' + gp(price) + ')' + (i.category ? ' [' + esc(i.category) + ']' : '') + '\n';
        });
        total += spent;
      }
    }

    out += '\n<span class="muted">TOTAL: ~' + gp(total) + '</span>';
    log.append(out);
  }

  function addSingle() {
    const tier = singletier;
    const pool = DATA.magicItems.filter((i) => i.tier === tier);
    if (!pool.length) { log.append('<span class="bad">No ' + tier + ' items in database.</span>'); return; }
    const it = D.pick(pool);
    let out = '<span class="head">[SINGLE ITEM — ' + tier + ']</span>\n' +
      itemName(it.name) + ' (' + gp(it.price_gp) + ')' + (it.source ? ' [' + esc(it.source) + ']' : '') + '\n';
    if (it.body_slot) out += '<span class="muted">slot: ' + esc(it.body_slot) + (it.aura ? ' · ' + esc(it.aura) : '') + '</span>\n';
    if (it.description) out += '<span class="muted">' + esc(it.description) + '</span>';
    log.append(out);
  }

  return (
    <Layout title="Treasure / Loot Generator" sub="Parcels by EL — DMG Table 7-4">
      <div className="runner-main">
        <div className="panel">
          <h2>Treasure</h2>
          <label>Encounter Level (1–20)</label>
          <input type="number" min="1" max="20" value={el} onChange={(e) => setEl(e.target.value)} />

          <label>Treasure Type</label>
          <select value={ttype} onChange={(e) => setTtype(e.target.value)}>
            <option value="standard">Standard (coins + goods + items)</option>
            <option value="coins">Coins Only</option>
            <option value="items">Items Only (magic + mundane)</option>
            <option value="hoard">Hoard (2× — lair/boss)</option>
            <option value="incidental">Incidental (¼× — pockets)</option>
            <option value="cache_mrathrach">Ptolus: Mrathrach cache</option>
            <option value="cache_chaos">Ptolus: Chaos-cult contraband</option>
            <option value="cache_imperial">Ptolus: Imperial relics</option>
            <option value="cache_dwarven">Ptolus: Dwarven forge gear</option>
          </select>

          <label><input type="checkbox" checked={flavor} onChange={(e) => setFlavor(e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />Ptolus flavor</label>

          <button className="primary" onClick={rollTreasure}>Roll Treasure</button>

          <div className="seed-box" style={{ borderTop: '1px dashed var(--line)', marginTop: 14, paddingTop: 12 }}>
            <label>Add Single Magic Item</label>
            <div className="btn-row">
              <select value={singletier} onChange={(e) => setSingletier(e.target.value)} style={{ flex: 2 }}>
                <option value="minor">Minor</option>
                <option value="medium">Medium</option>
                <option value="major">Major</option>
              </select>
              <button onClick={addSingle} style={{ flex: 1 }}>Add</button>
            </div>
          </div>

          <SeedControl />
        </div>
        <Log log={log} title="Treasure Log" />
      </div>
    </Layout>
  );
}
