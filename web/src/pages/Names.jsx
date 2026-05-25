import { useState } from 'react';
import D from '../lib/dice.js';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

const C = {
  imperial: {
    label: 'Imperial',
    m: { pre: ['Mar', 'Kal', 'Vor', 'Jev', 'Ser', 'Arc', 'Thal', 'Cas', 'Del', 'Orin', 'Luc'], suf: ['an', 'us', 'ic', 'en', 'avar', 'ian', 'os', 'eth'] },
    f: { pre: ['Mir', 'Ser', 'Jul', 'Vel', 'Jev', 'Tess', 'Lyss', 'Aur', 'Cal'], suf: ['a', 'ia', 'aine', 'ella', 'ine', 'issa', 'aia'] },
    sur: ['Voss', 'Thann', 'Marcen', 'Orvain', 'Callante', 'Drath', 'Cassan', 'Rhyl', 'Forren', 'Thessaly', 'Kerris', 'Delvain'],
  },
  shoaln: {
    label: 'Shoaln',
    m: { pre: ['Ae', 'Syl', 'Eli', 'Cael', 'Aer', 'Oss', 'Tael', 'Mir', 'Fen'], suf: ['iss', 'an', 'oss', 'in', 'ath', 'iel', 'ynn', 'ael'] },
    f: { pre: ['Ae', 'Syl', 'Eli', 'Cael', 'Aer', 'Mir', 'Lyr'], suf: ['iel', 'wen', 'ynn', 'aith', 'ess', 'ara', 'iss'] },
    sur: ['Silverleaf', 'Dawnmantle', 'Greywater', 'Caelossyn', 'Fenriath', 'Moonvale', 'Nightbreeze'],
  },
  dwarven: {
    label: 'Dwarven',
    m: { pre: ['Thor', 'Brak', 'Gund', 'Rul', 'Keld', 'Durn', 'Var', 'Morl'], suf: ['in', 'an', 'ok', 'ur', 'im', 'ek', 'gar'] },
    f: { pre: ['Brun', 'Helga', 'Sig', 'Marg', 'Eld', 'Thora'], suf: ['a', 'in', 'dis', 'run', 'hild'] },
    sur: ['Ironhelm', 'Stonemantle', 'Copperforge', 'Gundrak', 'Brakken', 'Morlsson', 'Deepdelve'],
  },
  halfling: {
    label: 'Halfling',
    m: { pre: ['Meri', 'Pip', 'Ros', 'Will', 'Tob', 'Fen', 'Del', 'Bur'], suf: ['ias', 'win', 'o', 'ander', 'ic', 'win'] },
    f: { pre: ['Rosie', 'Meri', 'Lily', 'Pansy', 'Daisy', 'Nora', 'Pip'], suf: ['', 'a', 'ie', 'el'] },
    sur: ['Leafwick', 'Fenmore', 'Copperbrook', 'Goodbarrel', 'Greenfield', 'Underwood', 'Tealeaf', 'Highhill'],
  },
  gnome: {
    label: 'Gnome',
    adj: ['Copper', 'Wobble', 'Fizz', 'Tinker', 'Gear', 'Bright', 'Quick', 'Odd', 'Brass', 'Whirl'],
    noun: ['spring', 'salt', 'sprocket', 'fiz', 'crank', 'bolt', 'gleam', 'spark', 'whistle', 'cog'],
    sur: ['Cranksworth', 'Tinkersalt', 'Copperspring', 'Wheelwright', 'Sprokett', 'Gearloose', 'Fiddlewick'],
  },
  drow: {
    label: 'Drow',
    m: { whole: ['Szordrin', 'Vrinn', 'Kaeleth', 'Malaggar', 'Driszzt', 'Ysvith', 'Nalfir', 'Quenthel'] },
    f: { whole: ['Iymril', 'Zress', 'Talice', 'Vharelle', 'Shri', 'Phyrra', 'Quave', 'Nathra'] },
    house: ['Kilvis', 'Tharoth', 'Ssuviri', 'Mezzant', 'Droxan', 'Vandree', 'Hunzrin'],
  },
  fr: {
    label: 'Forgotten Realms',
    m: { pre: ['Mar', 'Kal', 'Vor', 'Aeg', 'Brom', 'Cor', 'Dag', 'Fal', 'Gar', 'Hen', 'Ilm', 'Jas', 'Ker'], suf: ['an', 'us', 'ric', 'win', 'wyn', 'ric', 'os', 'eth'] },
    f: { pre: ['Mir', 'Ser', 'Jul', 'Vel', 'Aeg', 'Cor', 'Fal'], suf: ['a', 'ia', 'wyn', 'aine', 'ine', 'ella'] },
    sur: ['Burnwick', 'Hatherton', 'Corwind', 'Dagford', 'Falburn', 'Ironford', 'Amblecrown', 'Hesketh'],
  },
  shou: {
    label: 'Shou',
    family: ['Chen', 'Han', 'Kuo', 'Lung', 'Sung', 'Tang', 'Wu', 'Zhen', 'Mei', 'Li'],
    m: { whole: ['Bo', 'Jin', 'Lei', 'Peng', 'Shan', 'Wei', 'Xian', 'Yong'] },
    f: { whole: ['Fen', 'Hui', 'Jing', 'Lan', 'Mei', 'Nuo', 'Ruo', 'Ting'] },
    familyFirst: true,
  },
};

function resolveGender(g) { return g === 'r' ? (D.coinFlip() ? 'm' : 'f') : (g === 'n' ? (D.coinFlip() ? 'm' : 'f') : g); }
function resolveCulture(c) { return c === 'random' ? D.pick(Object.keys(C)) : c; }

function syllableName(set) {
  let n = D.pick(set.pre) + D.pick(set.suf);
  // avoid awkward double letters at the seam
  n = n.replace(/([a-z])\1\1/g, '$1$1');
  return n.charAt(0).toUpperCase() + n.slice(1);
}

function makeName(cult, g, withSur) {
  const c = C[cult];
  const gen = resolveGender(g);
  // gnome: compound
  if (cult === 'gnome') {
    const given = D.pick(c.adj) + D.pick(c.noun);
    return withSur ? given + ' ' + D.pick(c.sur) : given;
  }
  // drow: given + house
  if (cult === 'drow') {
    const given = D.pick(c[gen].whole);
    return withSur ? given + ' ' + D.pick(c.house) : given;
  }
  // shou: family first
  if (cult === 'shou') {
    const given = D.pick(c[gen].whole);
    return withSur ? D.pick(c.family) + ' ' + given : given;
  }
  const given = syllableName(c[gen]);
  return withSur ? given + ' ' + D.pick(c.sur) : given;
}

export default function Names() {
  const log = useLog();
  const [culture, setCulture] = useState('imperial');
  const [gender, setGender] = useState('r');
  const [count, setCount] = useState('3');
  const [surname, setSurname] = useState(true);

  function generate() {
    const cultSel = culture;
    const g = gender;
    const cnt = parseInt(count, 10);
    const withSur = surname;

    const lines = [];
    const seen = new Set();
    let guard = 0;
    while (lines.length < cnt && guard < cnt * 12) {
      guard++;
      const cult = resolveCulture(cultSel);
      const n = makeName(cult, g, withSur);
      if (seen.has(n)) continue;
      seen.add(n);
      lines.push(cultSel === 'random' ? n + '  <span class="muted">(' + C[cult].label + ')</span>' : n);
    }
    const gLabel = { m: 'Male', f: 'Female', n: 'Neutral', r: 'Random' }[g];
    const cLabel = cultSel === 'random' ? 'Random' : C[cultSel].label;
    log.append('<span class="head">[' + cLabel.toUpperCase() + ' — ' + gLabel + ' — ' + cnt + ' names]</span>\n' + lines.join('\n'));
  }

  return (
    <Layout title="Name Generator" sub="Culture-keyed names for people & places" contextBar={false}>
      <div className="runner-main">
        <div className="panel">
          <h2>Names</h2>
          <label>Culture</label>
          <select value={culture} onChange={(e) => setCulture(e.target.value)}>
            <option value="imperial">Imperial (Ptolus standard)</option>
            <option value="shoaln">Shoaln (Ptolus elven)</option>
            <option value="dwarven">Dwarven (Ptolus)</option>
            <option value="halfling">Halfling</option>
            <option value="gnome">Gnome</option>
            <option value="drow">Drow (Ptolus)</option>
            <option value="fr">Forgotten Realms (generic)</option>
            <option value="shou">Shou (FR eastern)</option>
            <option value="random">Random</option>
          </select>

          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="m">Male</option>
            <option value="f">Female</option>
            <option value="n">Neutral</option>
            <option value="r">Random</option>
          </select>

          <label>Count</label>
          <select value={count} onChange={(e) => setCount(e.target.value)}>
            <option>1</option><option>3</option><option>5</option><option>10</option>
          </select>

          <label><input type="checkbox" checked={surname} onChange={(e) => setSurname(e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />Include surname</label>

          <button className="primary" onClick={generate}>Generate Names</button>
          <SeedControl />
        </div>
        <Log log={log} title="Name Log" />
      </div>
    </Layout>
  );
}
