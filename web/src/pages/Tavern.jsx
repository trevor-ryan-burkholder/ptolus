import { useState } from 'react';
import D from '../lib/dice.js';
import { DATA } from '../data/index.js';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

const DISTRICTS = ['Midtown', 'Oldtown', 'Warrens', 'Docks', "Nobles' Quarter", "Guildsman's District", 'Temple District', 'Necropolis Gate'];
const ADJ = {
  Docks: ['Bilge', 'Salt', 'Iron', 'Harbor', 'Drowned', 'Trawl', 'Anchor', 'Fog'],
  Warrens: ['Broken', 'Rusty', 'Hollow', 'Crooked', 'Grey', 'Cracked'],
  Midtown: ['Silver', 'Copper', 'Red', 'Three', 'Old', 'Crossed', 'Gilded'],
  Oldtown: ['Old', 'Grey', 'Ancient', 'First', 'Stone', 'Worn'],
  "Nobles' Quarter": ['Golden', 'Crown', 'Marble', 'First', 'High', 'Ivory'],
  'Temple District': ['Blessed', 'Sacred', 'Ember', 'Dawn', 'Evening', 'Holy'],
  "Guildsman's District": ['Hammer', 'Anvil', 'Wheel', 'Bronze', 'Trade', 'Craft'],
  'Necropolis Gate': ['Last', 'Quiet', 'Pale', 'Ash', 'Mourning', 'Grave'],
};
const NOUN = ['Barrel', 'Lantern', 'Coin', 'Cup', 'Gate', 'Bell', 'Crown', 'Helm', 'Wheel', 'Flask', 'Blade', 'Candle', 'Ring', 'Shield', 'Chain', 'Key', 'Tap', 'Flagon'];
const SIGN = ['A {n} with a drowned face inside it.', 'A cracked {n}, painted gold long ago.', 'A {n} crossed with a sword.', 'A {n} that swings and creaks in any wind.', 'A {n} above the door, freshly repainted.', 'A {n} burned black on one side.'];

const RACE_BY_DISTRICT = {
  Docks: [['human', 5], ['half-orc', 3], ['halfling', 2]],
  Warrens: [['human', 5], ['gnome', 2], ['halfling', 3]],
  "Nobles' Quarter": [['human', 6], ['elf', 3]],
  default: [['human', 6], ['dwarf', 2], ['halfling', 1], ['gnome', 1]],
};
const BACKGROUND = ['ex-soldier', 'ex-sailor', 'ex-delver', 'former guild member', 'born into it', 'ran away from something'];
const PERSONALITY = ['blunt', 'cheerful under pressure', 'paranoid', 'overly formal', 'world-weary', 'ambitious', 'genuinely kind', 'calculating', 'jaded'];
const FEATURE = ['missing two fingers on the left hand', 'a livid scar across one cheek', 'a shaved head', 'an old guild tattoo', 'a glass eye', 'always wiping the counter'];
const OWNER_NAMES = { m: ['Harkon', 'Vorin', 'Galt', 'Brennan', 'Sael', 'Dorn', 'Kervis', 'Tobias'], f: ['Sella', 'Mira', 'Vessa', 'Junia', 'Grethel', 'Lyssa', 'Cora', 'Wynn'], sur: ['Tull', 'Voss', 'Marek', 'Brack', 'Caine', 'Thann', 'Holt', 'Drey'] };

const CROWD = ['Empty', 'A few regulars', 'Moderate', 'Packed', 'Hostile crowd'];
const LIGHT = ['Dark — a few guttering candles', 'Dim — firelight only', 'Well-lit with oil lamps', 'Bright (faint magical light)'];
const SOUND = ['Quiet', 'Low murmuring', 'Lively', 'Loud and rowdy', 'A musician — {i}'];
const INSTR = ['lute', 'fiddle', 'drums', 'a passable bard'];
const DETAIL = ['a fight-scar gouged into one wall', 'a wanted poster nailed by the door', 'a cage in the corner with something in it', 'a suspicious dark stain by the hearth', 'a small shrine in the corner', 'a chalkboard menu', 'quality unusually good for the district'];

const MENUS = {
  Squalid: { ale: '1 cp', food: 'gruel (1 cp)', room: 'floor space (1 sp)' },
  Poor: { ale: '2 cp', food: 'stew (2 cp)', room: '2 sp' },
  Modest: { ale: '4 cp', food: '3–5 cp', room: '4–8 sp' },
  Comfortable: { ale: '5 cp', food: '1–3 sp', room: '1–2 gp' },
  Wealthy: { ale: '2 sp', food: '3–10 sp', room: '3–5 gp' },
  Aristocratic: { ale: '5 sp', food: '5 sp–2 gp', room: '5–20 gp' },
};
const FOOD_NAMES = ['Salt Fish Stew', 'Brown Bread & Drippings', 'Pickled Eggs', 'Mutton Pie', 'Harbor Chowder', 'Roast Fowl', 'Barley Pottage', 'Smoked Sausage'];
const ALE_NAMES = ['Brackwater Ale', 'Spire Stout', 'Harbor Bitter', 'Old Crossed Porter', 'Dwarven Black', 'Common Table Ale'];

const RUMORS = {
  Docks: [
    "A merchant captain is paying double for guards on a southern run. Won't say why.",
    'Three delvers drowned in the harbor last week. City Watch says accident. Nobody believes it.',
    "Someone's moving chaositech through the harbor at night. Not the Balacazars — someone new.",
    "A ship came in from the south with something in the hold the crew won't discuss.",
    'There\'s a Grade 2 monster working as a dockhand. Nobody wants to be the one to report it.',
    'A City Watch officer is taking bribes from two factions. Both are about to find out.',
    'One of the noble houses is quietly buying up dock warehouse leases.',
    "Someone's recruiting ex-sailors for an expedition — strange destination, strange pay.",
  ],
  Warrens: [
    'A City Watch sweep is coming — someone tipped them about a hideout.',
    'A new crime operation is moving in — not Balacazar-affiliated. Yet.',
    'A Dungeon entrance nobody officially knows about opened under a building here.',
    'Someone in the Warrens can sell you any permit, if you have the coin.',
    'A family vanished last week. House still there. Belongings still there.',
    'A healer here works on anyone, no questions — but wants favors, not gold.',
    'The Balacazars put a low-price contract on someone here. Low price means personal.',
    'A Grade 3 monster has lived under a building here for years. The neighbors know.',
  ],
  generic: [
    'The Spire was doing something strange last night. Not moving — just... responding.',
    'Someone with money is hunting a specific delver team. Not for work — for what they found.',
    'The Inverted Pyramid is buying something from the black market. No one knows what.',
    'A noble family lost their entire street to a debt call. The Balacazars own it now.',
  ],
};

function rumorsFor(district) {
  return (RUMORS[district] || []).concat(RUMORS.generic);
}
function ownerName() { const m = D.coinFlip(); return (m ? D.pick(OWNER_NAMES.m) : D.pick(OWNER_NAMES.f)) + ' ' + D.pick(OWNER_NAMES.sur) + '|' + (m ? 'male' : 'female'); }
function pickRace(district) { return D.weightedPick(RACE_BY_DISTRICT[district] || RACE_BY_DISTRICT.default); }
function magicCat(cat) { return DATA.magicItems.filter((i) => i.category === cat); }

function shorten(s) { return s.length > 60 ? s.slice(0, 57) + '…' : s; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function ownerBlock(district) {
  const nm = ownerName().split('|');
  const race = pickRace(district);
  const bg = D.pick(BACKGROUND);
  return nm[0] + ' — ' + nm[1] + ' ' + race + ', ' + bg + ', ' + D.pick(FEATURE) + '. ' + cap(D.pick(PERSONALITY)) + '.';
}
function atmosphere() {
  let snd = D.pick(SOUND).replace('{i}', D.pick(INSTR));
  return D.pick(CROWD) + ' crowd. ' + D.pick(LIGHT) + '. ' + snd + '. Notable: ' + D.pick(DETAIL) + '.';
}

function stockBlock(type) {
  let out = 'STOCK HIGHLIGHTS:\n';
  function line(it, markup) { return '  ' + it.name + ' (' + Math.round((it.price_gp || 0) * (markup || 1)) + ' gp)' + (it.source ? ' [' + it.source + ']' : ''); }
  if (type === 'general') {
    D.pickN(DATA.mundaneItems.filter((i) => ['Gear', 'Alchemical', 'Shield'].indexOf(i.category) !== -1), D.range(2, 4)).forEach((i) => { out += line(i, 1.1) + '\n'; });
    out += '  <span class="muted">(prices ~10% above PHB)</span>\n';
  } else if (type === 'smith') {
    const weps = DATA.mundaneItems.filter((i) => /Weapon/.test(i.category));
    const arm = DATA.mundaneItems.filter((i) => /Armor|Shield/.test(i.category));
    D.pickN(weps, 2).forEach((i) => { out += line(i) + '\n'; });
    D.pickN(arm, 2).forEach((i) => { out += line(i) + '\n'; });
    const ex = D.pick(DATA.mundaneItems.filter((i) => i.category === 'Exotic Weapon' || /Special/.test(i.category)));
    out += '  Masterwork available (+300 gp weapons / +150 gp armor).\n';
    if (ex) out += '  Unusual: ' + ex.name + ' (' + ex.price_gp + ' gp)\n';
  } else if (type === 'alchemist') {
    D.pickN(magicCat('Potion').filter((i) => i.tier === 'minor' || i.tier === 'trivial'), D.range(2, 4)).forEach((i) => { out += line(i) + '\n'; });
    D.pickN(DATA.mundaneItems.filter((i) => i.category === 'Alchemical'), D.range(1, 3)).forEach((i) => { out += line(i) + '\n'; });
    out += '  <span class="muted">Common spell components in stock.</span>\n';
  } else if (type === 'mage') {
    D.pickN(magicCat('Scroll'), D.range(2, 6)).forEach((i) => { out += line(i) + '\n'; });
    const wand = D.pick(magicCat('Wand'));
    if (wand) out += line(wand) + '\n';
    out += '  <span class="muted">Components and inks available; identify on request (extra fee).</span>\n';
  } else if (type === 'fence') {
    const stolen = D.pick(DATA.magicItems.filter((i) => i.tier === 'minor' || i.tier === 'medium'));
    out += '  Stolen: ' + stolen.name + ' (' + stolen.price_gp + ' gp, provenance unclear)' + (stolen.source ? ' [' + stolen.source + ']' : '') + '\n';
    out += '  <span class="muted">' + (D.percent() <= 30 ? 'Balacazar connection — they take a cut.' : 'Independent operator, nervous about it.') + '</span>\n';
  }
  return out;
}

export default function Tavern() {
  const log = useLog();
  const [typeSel, setTypeSel] = useState('inn');
  const [districtSel, setDistrictSel] = useState('Docks');
  const [quality, setQuality] = useState('Modest');

  function generate() {
    let type = typeSel;
    let district = districtSel;
    if (district === 'random') district = D.pick(DISTRICTS);
    if (type === 'exotic') type = D.pick(['general', 'smith', 'alchemist', 'mage', 'fence']);

    const name = D.pick(ADJ[district] || ADJ.Midtown) + ' ' + D.pick(NOUN);
    const isTav = type === 'inn' || type === 'tavern';
    const typeLabel = { inn: 'TAVERN/INN', tavern: 'TAVERN', general: 'GENERAL STORE', smith: 'SMITH', alchemist: 'ALCHEMIST', mage: "MAGE'S SHOP", fence: 'BLACK MARKET' }[type];

    let out = '<span class="head">[' + typeLabel + ' — ' + district + ' — ' + quality + ']</span>\n\n';
    out += 'NAME: The ' + name + '\n';
    out += 'SIGN: ' + D.pick(SIGN).replace('{n}', D.pick(NOUN).toLowerCase()) + '\n';
    out += 'OWNER: ' + ownerBlock(district) + '\n';
    out += '       → Knows: ' + D.pickN(rumorsFor(district), 2).map(shorten).join(' | ') + '\n\n';
    out += 'ATMOSPHERE: ' + atmosphere() + '\n\n';

    if (isTav) {
      const m = MENUS[quality];
      out += 'MENU HIGHLIGHTS:\n';
      out += '  ' + D.pick(ALE_NAMES) + ' (' + m.ale + ')\n';
      out += '  ' + D.pick(FOOD_NAMES) + ' (' + m.food + ')\n';
      out += '  ' + D.pick(FOOD_NAMES) + ' (' + m.food + ')\n';
      if (type === 'inn') out += '\nROOMS: ' + D.range(4, 12) + ' rooms (' + m.room + '). Lock on door: ' + D.pick(['solid', 'simple', 'broken', 'none']) + '.\n';
    } else {
      out += stockBlock(type);
    }

    const rumors = rumorsFor(district);
    const rIdx = D.range(1, rumors.length);
    out += '\nCURRENT RUMOR (rolled ' + rIdx + '):\n  "' + rumors[rIdx - 1] + '"\n';

    // notable patron / customer
    const pn = ownerName().split('|');
    out += '\nNOTABLE ' + (isTav ? 'PATRON' : 'CUSTOMER') + ': ' + pn[0] + ' — ' + pn[1] + ' ' + pickRace(district) + ', ' +
      D.pick(['nervous, keeps checking the door', 'too well-dressed for this place', 'drinking alone, fast', 'asking quiet questions', "clearly waiting for someone who isn't coming"]) + '.';
    log.append(out);
  }

  return (
    <Layout title="Tavern & Shop Generator" sub="Named, keyed, ready to run">
      <div className="runner-main">
        <div className="panel">
          <h2>Tavern &amp; Shop</h2>
          <label>Type</label>
          <select value={typeSel} onChange={(e) => setTypeSel(e.target.value)}>
            <option value="inn">Tavern / Inn</option>
            <option value="tavern">Tavern (no rooms)</option>
            <option value="general">General Store</option>
            <option value="smith">Weapon / Armor Smith</option>
            <option value="alchemist">Alchemist / Apothecary</option>
            <option value="mage">Mage's Shop</option>
            <option value="fence">Black Market (fence)</option>
            <option value="exotic">Exotic / Ptolus (roll)</option>
          </select>

          <label>District</label>
          <select value={districtSel} onChange={(e) => setDistrictSel(e.target.value)}>
            <option>Midtown</option><option>Oldtown</option><option>Warrens</option>
            <option>Docks</option><option>Nobles' Quarter</option>
            <option>Guildsman's District</option><option>Temple District</option>
            <option>Necropolis Gate</option><option value="random">Random</option>
          </select>

          <label>Quality</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option>Squalid</option><option>Poor</option><option>Modest</option><option>Comfortable</option><option>Wealthy</option><option>Aristocratic</option>
          </select>

          <button className="primary" onClick={generate}>Generate</button>
          <SeedControl />
        </div>
        <Log log={log} title="Establishment Log" />
      </div>
    </Layout>
  );
}
