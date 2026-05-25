import { useState } from 'react';
import D from '../lib/dice.js';
import { Layout, SeedControl, Log, useLog } from '../components/ui.jsx';

const WEATHER = {
  Spring: [[2, 'Clear, warm. A bright, easy sky.'], [4, 'Partly cloudy, mild.'], [6, 'Light rain, steady drizzle.'], [8, 'Steady rain, puddling streets.'], [9, 'Wind, no rain — gusty and dry.'], [10, 'Thick fog rolling in.']],
  Summer: [[2, 'Clear and hot. Heat shimmers off the stone.'], [4, 'Partly cloudy, warm.'], [6, 'An afternoon storm building.'], [8, 'Humid and oppressive, still air.'], [9, 'Thunderstorm — sheets of rain and lightning.'], [10, 'Heat haze; the air wavers.']],
  Autumn: [[2, 'Clear and cold. Crisp.'], [4, 'Overcast, grey light.'], [6, 'Heavy overcast, no rain yet.'], [8, 'Cold rain, persistent.'], [9, 'Wind and rain together.'], [10, "Thick fog, can't see the Spire."]],
  Winter: [[2, 'Clear and bitter cold.'], [4, 'Overcast and grey, threatening.'], [6, 'Sleet and freezing rain.'], [8, 'Light snow drifting down.'], [9, 'Heavy snow, accumulating.'], [10, 'Blizzard — whiteout conditions.']],
};
const WIND = ['calm', 'a light breeze', 'a strong breeze — cloaks snap', 'strong wind (ranged −2, 1d6 cold/hr if unprotected)', 'a gale (no ranged attacks; Fly DC 15)'];
const SMELL_CITY = ['coal smoke', 'rain on stone', 'roasting meat from a nearby inn', 'salt off the harbor', 'garbage in the gutters', 'temple incense', "blood (don't explain it)", 'industrial smoke', 'horse manure', 'fresh bread', 'fish'];
const SOUND_NIGHT = ['distant bells from a City Watch tower', 'a single voice, singing somewhere', 'footsteps echoing — not yours', 'nothing at all', 'a door slamming', 'something skittering in an alley', 'a scream, far off, cut short'];
const SOUND_DAY = ['market noise', 'cart wheels on cobbles', 'an argument two streets over', "a herald's announcement", 'children at play', 'hammering from a workshop', 'bells', 'the press of crowds'];
const DETAIL = ['A City Watch patrol (1d4 guards + an officer) turns the corner ahead.', 'A delver team — packs and weapons — moves toward the Dungeon entrance.', 'A poster on the wall: a wanted notice, a guild announcement, a proclamation.', 'A Grade 3 monster visible at a distance — escorted, or moving alone.', 'A street shrine to a Ptolus deity, recently burned.', 'Someone watches from a window above — gone when you look again.'];
const MOOD = ["Cold, tense, observed. The city doesn't sleep, it just watches.", 'Ordinary — the day grinds on, indifferent.', 'Festive, loud, a little dangerous at the edges.', 'Eerie. Too quiet for the hour.', 'Electric — something is about to happen.', 'Exhausted. Everyone here is tired of something.', 'Oppressive. The Spire leans over it all.'];
const D_AIR = ['stale and warm — no airflow, the torch burns straight up', 'flowing — a faint draft from somewhere ahead', 'humid, close, hard to breathe', 'hot, almost volcanic', 'cold — deep water must be near', 'chemical — alchemical outgassing, eyes sting'];
const D_MOIST = ['dry — dust on everything', 'damp — walls weep, stone is dark', 'wet — standing water underfoot'];
const D_SOUND = ['distant dripping', 'total silence', "echoing footsteps that aren't yours", 'wind moaning through cracks', 'a distant rhythmic sound — machinery?', "nothing — and that's worse"];
const D_SMELL = ['old stone', 'rot', 'blood', 'alchemical reek', 'wet mineral', 'salt', 'nothing at all', "something that doesn't have a name"];
const NIGHT = ['Evening', 'Night', 'Deep Night'];
const LOCLABEL = { city: 'PTOLUS CITY', docks: 'THE DOCKS', necropolis: 'THE NECROPOLIS', dungeon: 'THE DUNGEON', wild: 'WILDERNESS' };

const isNight = (tod) => NIGHT.indexOf(tod) !== -1;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function pickByRoll(rows, roll) { for (const [max, txt] of rows) if (roll <= max) return txt; return rows[rows.length - 1][1]; }
function crowd(tod) {
  if (tod === 'Deep Night') return D.coinFlip() ? 'Empty.' : '1d4 figures in view, moving with purpose.';
  if (tod === 'Night' || tod === 'Evening') return 'Sparse — groups of 2–4 moving quickly.';
  if (tod === 'Dawn' || tod === 'Dusk') return 'Moderate and purposeful — the changeover crowd.';
  return 'Busy — full daytime foot traffic.';
}
function ambienceBlock(loc, tod) {
  const smell = loc === 'docks' ? 'saltwater and fish, ' + D.pick(SMELL_CITY) : D.pickN(SMELL_CITY, 2).join(', ');
  const sound = isNight(tod) ? D.pickN(SOUND_NIGHT, 2).join('; ') : D.pickN(SOUND_DAY, 2).join('; ');
  let out = 'AMBIENCE:\n';
  out += '  Smell: ' + smell + '\n';
  out += '  Sound: ' + sound + '\n';
  out += '  Detail: ' + D.pick(DETAIL) + '\n';
  out += '  Crowd: ' + crowd(tod) + '\n';
  out += '\n<span class="muted">MOOD: ' + D.pick(MOOD) + '</span>';
  return out;
}

export default function Weather() {
  const log = useLog();
  const [loc, setLoc] = useState('city');
  const [season, setSeason] = useState('Autumn');
  const [tod, setTod] = useState('Night');

  function rollWeather() {
    const head = '[' + LOCLABEL[loc] + ' — ' + season + ' — ' + tod + ']';
    let out = '<span class="head">' + head + '</span>\n';
    if (loc === 'dungeon') {
      out += '\nAIR: ' + cap(D.pick(D_AIR)) + '.\n';
      out += 'MOISTURE: ' + cap(D.pick(D_MOIST)) + '.\n';
      out += 'SOUND: ' + cap(D.pick(D_SOUND)) + '.\n';
      out += 'SMELL: ' + cap(D.pick(D_SMELL)) + '.\n';
      out += 'LIGHT: Torch radius normal. No ambient light.\n';
      out += '\n<span class="muted">MOOD: ' + D.pick(['Close and watchful.', 'Dead air, dead stone.', 'Something is aware of you down here.']) + '</span>';
      log.append(out); return;
    }
    let roll = D.roll(10);
    if (loc === 'docks' && (season === 'Spring' || season === 'Autumn')) roll = Math.min(10, roll + D.range(1, 2));
    const w = pickByRoll(WEATHER[season], roll);
    const wind = D.weightedPick([[WIND[0], 3], [WIND[1], 4], [WIND[2], 3], [WIND[3], 2], [WIND[4], 1]]);
    out += '\nWEATHER: ' + w + ' Wind: ' + wind + '.\n';
    const mech = [];
    if (/fog/i.test(w)) { out += '  Visibility: ~30 ft (fog).\n'; mech.push('Concealment 20%, Perception −6 (sight)'); }
    else if (/blizzard|whiteout/i.test(w)) { out += '  Visibility: ~10 ft.\n'; mech.push('ranged impossible, Perception −8'); }
    else if (/rain|storm|sleet/i.test(w)) { out += '  Visibility: half in the open.\n'; mech.push('Perception −4 (sight & hearing)'); }
    if (/strong wind|gale/.test(wind)) mech.push('ranged −2, Perception −4 (hearing)');
    if (/snow/i.test(w)) mech.push('Track DC −4 (easier), 3/4 speed in deep snow');
    if (mech.length) out += '  Mechanical: ' + mech.join('; ') + '.\n';
    if (loc === 'necropolis') out += '  <span class="muted">Necropolis: an unnatural stillness over it all. The wind feels wrong.</span>\n';
    out += '\n' + ambienceBlock(loc, tod);
    log.append(out);
  }
  function ambienceOnly() {
    log.append('<span class="head">[AMBIENCE — ' + tod + ']</span>\n' + ambienceBlock(loc, tod));
  }

  return (
    <Layout title="Weather & Ambience" sub="Read-aloud flavor, not a simulation" contextBar={false}>
      <div className="runner-main">
        <div className="panel">
          <h2>Weather & Ambience</h2>
          <label>Location</label>
          <select value={loc} onChange={(e) => setLoc(e.target.value)}>
            <option value="city">Ptolus City</option>
            <option value="docks">The Docks</option>
            <option value="necropolis">The Necropolis</option>
            <option value="dungeon">The Dungeon</option>
            <option value="wild">Wilderness (Faerûn coast)</option>
          </select>
          <label>Season</label>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            {['Spring', 'Summer', 'Autumn', 'Winter'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <label>Time of Day</label>
          <select value={tod} onChange={(e) => setTod(e.target.value)}>
            {['Dawn', 'Morning', 'Midday', 'Afternoon', 'Dusk', 'Evening', 'Night', 'Deep Night'].map((t) => <option key={t}>{t}</option>)}
          </select>
          <button className="primary" onClick={rollWeather}>Roll Weather & Ambience</button>
          <button style={{ width: '100%', marginTop: 8 }} onClick={ambienceOnly}>Ambience Only</button>
          <SeedControl />
        </div>
        <Log log={log} title="Weather Log" />
      </div>
    </Layout>
  );
}
