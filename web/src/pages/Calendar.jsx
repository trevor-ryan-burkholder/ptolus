import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { Layout, esc } from '../components/ui.jsx';

const CSS = `
  .cal-wrap { padding:16px 20px 60px; max-width:900px; }
  .today { background:linear-gradient(90deg,#2a2412,var(--bg-panel)); border:1px solid var(--gold-dim); border-radius:8px; padding:18px 22px; }
  .today .date { font-size:30px; color:var(--gold); font-weight:bold; }
  .today .meta { color:var(--muted); margin-top:4px; }
  .today .holy { color:var(--good); font-weight:bold; margin-top:8px; }
  .cal-controls { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:14px 0; }
  .cal-controls button { padding:8px 12px; }
  .setrow { display:flex; gap:8px; align-items:flex-end; flex-wrap:wrap; margin:10px 0; padding:12px; background:var(--bg-panel); border:1px solid var(--line); border-radius:8px; }
  .setrow .f { display:flex; flex-direction:column; }
  .setrow label { margin:0 0 3px; } .setrow input, .setrow select { width:auto; }
  h2.sec { color:var(--gold); font-size:14px; text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid var(--line); margin:22px 0 10px; padding-bottom:5px; }
  .hint2 { color:var(--muted); font-size:13px; }
`;

const MONTHS = [
  { n: 'Newyear', len: 31, season: 'Midwinter', note: 'Cold and dark; the new year.' },
  { n: 'Birth', len: 28, season: 'Late winter', note: 'Ice begins to break.' },
  { n: 'Wind', len: 31, season: 'Early spring', note: 'Frequent storms off the Whitewind Sea.' },
  { n: 'Rain', len: 30, season: 'Spring', note: 'Rainy season begins; heaviest rainfall.' },
  { n: 'Bloom', len: 31, season: 'Late spring', note: 'Flowers; the most pleasant shoulder season.' },
  { n: 'Sun', len: 30, season: 'Early summer', note: 'Warmest, brightest stretch.' },
  { n: 'Growth', len: 31, season: 'Midsummer', note: 'Long days; midsummer festivals.' },
  { n: 'Blessing', len: 31, season: 'Late summer', note: 'High ~69°F / Low ~53°F; ~1.2 in. rain.' },
  { n: 'Toil', len: 30, season: 'Early fall', note: 'High ~60°F / Low ~48°F; ~1.9 in. rain.' },
  { n: 'Harvest', len: 31, season: 'Fall', note: 'High ~51°F / Low ~41°F; ~3.3 in. rain.' },
  { n: 'Moons', len: 30, season: 'Late fall', note: 'High ~48°F / Low ~39°F; ~5.7 in. rain; gloomy.' },
  { n: 'Yearsend', len: 31, season: 'Early winter', note: 'High ~46°F / Low ~31°F; ~6.0 in. rain; harshest month. It rains more than it snows.' },
];
const WEEKDAYS = ['Theoday', 'Kingsday', 'Airday', 'Waterday', 'Earthday', 'Fireday', 'Queensday'];
const YEARLEN = MONTHS.reduce((a, m) => a + m.len, 0); // 365
const HOLY = [
  { m: 1, d: 1, name: "Newyear's Day", grp: 'City', desc: 'Celebration; babies born today are lucky.' },
  { m: 1, d: 21, name: 'Litorian Great Feast (midwinter)', grp: 'Litorian', desc: 'Feasting and contests; a Chieftain of the Feast is named.' },
  { m: 4, d: 5, name: 'Godsday', grp: 'City', desc: 'Holiest day in most religions; huge Temple District festival, many get the day off.' },
  { m: 6, d: 10, name: 'Day of Joining', grp: 'City', desc: 'Lucky for ventures, alliances, marriages, new adventuring parties.' },
  { m: 7, d: 21, name: 'Litorian Great Feast (midsummer)', grp: 'Litorian', desc: 'Tribes gather for feasting and storytelling.' },
  { m: 8, d: 14, name: "Brightfather's Day", grp: 'City', desc: 'Church of Lothian high holy day. Feasting, family, peace with enemies. Watch thins around the Temple District; crime spikes elsewhere.' },
  { m: 9, d: 12, name: 'Litorian Days of Memory (12th–14th)', grp: 'Litorian', desc: 'Warriors honor fallen enemies; spoils go to the dead.' },
  { m: 10, d: 31, name: 'Harvest Festival', grp: 'City', desc: 'Feasting, dancing, masked historical plays. Secular and joyful.' },
  { m: 11, d: 2, name: 'Litorian Winter Fast (2nd–5th)', grp: 'Litorian', desc: 'Blooded warriors fast four days, then hunt and eat raw.' },
  { m: 11, d: 23, name: 'Festival of Cold Moons (Chaokaemus)', grp: 'City', desc: 'Humans: ill omens, warding the dead. Elves: rejuvenation and good omens. Celebrated separately.' },
  { m: 12, d: 28, name: 'Cursed Day', grp: 'City', desc: 'Babies born on the 28th of Yearsend are considered cursed.' },
];

const DEFAULT_STATE = { cur: { y: 721, m: 1, d: 1 }, start: { y: 721, m: 1, d: 1 } };

function monthStartOffset(m) { let o = 0; for (let i = 0; i < m - 1; i++) o += MONTHS[i].len; return o; }
function absDays(dt) { return dt.y * YEARLEN + monthStartOffset(dt.m) + (dt.d - 1); }
function fromAbs(t) {
  const y = Math.floor(t / YEARLEN); let rem = t - y * YEARLEN; let m = 1;
  while (rem >= MONTHS[m - 1].len) { rem -= MONTHS[m - 1].len; m++; }
  return { y, m, d: rem + 1 };
}
const ANCHOR = absDays({ y: 721, m: 1, d: 1 });
function weekday(dt) { return WEEKDAYS[(((absDays(dt) - ANCHOR) % 7) + 7) % 7]; }
function ord(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function fmt(dt) { return ord(dt.d) + ' of ' + MONTHS[dt.m - 1].n + ', ' + dt.y + ' IA'; }
function holyOn(dt) { return HOLY.filter((h) => h.m === dt.m && h.d === dt.d); }

export default function Calendar() {
  const [state, setState] = useLocalStorage('ptolus-calendar-v1', DEFAULT_STATE);
  const cur = state.cur || DEFAULT_STATE.cur;
  const start = state.start || DEFAULT_STATE.start;

  // Set-date inputs
  const [sd, setSd] = useState(cur.d);
  const [sm, setSm] = useState(cur.m);
  const [sy, setSy] = useState(cur.y);
  const [advn, setAdvn] = useState(7);

  function syncInputs(c) { setSd(c.d); setSm(c.m); setSy(c.y); }

  function advance(days) {
    let next = fromAbs(absDays(cur) + days);
    const len = MONTHS[next.m - 1].len;
    if (next.d > len) next.d = len;
    if (next.d < 1) next.d = 1;
    setState({ ...state, cur: next });
  }
  function setDate() {
    const m = parseInt(sm, 10) || 1;
    const next = { y: parseInt(sy, 10) || 721, m, d: Math.min(parseInt(sd, 10) || 1, MONTHS[m - 1].len) };
    setState({ ...state, cur: next });
  }
  function setStart() { setState({ ...state, start: { ...cur } }); }
  function reset() { setState(DEFAULT_STATE); syncInputs(DEFAULT_STATE.cur); }

  function nextOccurrence(h) {
    const today = absDays(cur);
    let a = absDays({ y: cur.y, m: h.m, d: h.d });
    if (a < today) a = absDays({ y: cur.y + 1, m: h.m, d: h.d });
    return a - today;
  }
  function nextYearMark(h) { return absDays({ y: cur.y, m: h.m, d: h.d }) >= absDays(cur) ? 9999 : 0; }

  const mo = MONTHS[cur.m - 1];
  const todayHoly = holyOn(cur);
  const dayN = absDays(cur) - absDays(start) + 1;
  const thisMonthHoly = HOLY.filter((h) => h.m === cur.m).map((h) => ord(h.d) + ' ' + h.name).join('; ') || 'none';
  const upcoming = HOLY.map((h) => ({ h, inDays: nextOccurrence(h) })).sort((a, b) => a.inDays - b.inDays).slice(0, 7);

  return (
    <Layout title="Imperial Calendar" sub="Track the date, holy days, and campaign time" contextBar={false}>
      <style>{CSS}</style>
      <div className="cal-wrap">
        <div className="today">
          <div className="date">{weekday(cur)}, {fmt(cur)}</div>
          <div className="meta">{mo.season} · {mo.note}</div>
          <div className="holy">{todayHoly.length ? '★ ' + todayHoly.map((h) => h.name).join(' · ') + ' — ' + todayHoly[0].desc : ''}</div>
        </div>

        <div className="cal-controls">
          <button onClick={() => advance(-1)}>− 1 day</button>
          <button className="primary" style={{ width: 'auto', margin: 0 }} onClick={() => advance(1)}>+ 1 day</button>
          <button onClick={() => advance(7)}>+ 1 week</button>
          <button onClick={() => advance(MONTHS[cur.m - 1].len)}>+ 1 month</button>
          <input type="number" value={advn} style={{ width: 70 }} onChange={(e) => setAdvn(e.target.value)} />
          <button onClick={() => advance(parseInt(advn, 10) || 0)}>Advance days</button>
          <span style={{ marginLeft: 'auto' }} />
          <span className="hint2">Campaign day {dayN} (start: {fmt(start)})</span>
        </div>

        <div className="setrow">
          <div className="f"><label>Day</label><input type="number" min="1" max="31" style={{ width: 60 }} value={sd} onChange={(e) => setSd(e.target.value)} /></div>
          <div className="f"><label>Month</label>
            <select value={sm} onChange={(e) => setSm(parseInt(e.target.value, 10))}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{(i + 1) + '. ' + m.n}</option>)}
            </select>
          </div>
          <div className="f"><label>Year (IA)</label><input type="number" style={{ width: 90 }} value={sy} onChange={(e) => setSy(e.target.value)} /></div>
          <button onClick={setDate}>Set Date</button>
          <button onClick={setStart}>Set as Campaign Start</button>
          <button onClick={reset}>Reset (1 Newyear 721)</button>
        </div>

        <h2 className="sec">This Month</h2>
        <div>
          <div className="line"><b style={{ color: 'var(--gold)' }}>{mo.n}</b> — {mo.season}, {mo.len} days. {mo.note}</div>
          <div className="hint2">Holy/special days this month: {thisMonthHoly}</div>
        </div>

        <h2 className="sec">Upcoming Holy &amp; Special Days</h2>
        <table className="ref">
          <tbody>
            <tr><th>In</th><th>Date</th><th>Day</th><th>Observance</th></tr>
            {upcoming.map((u, i) => (
              <tr key={i}>
                <td>{u.inDays === 0 ? 'today' : u.inDays + ' d'}</td>
                <td>{ord(u.h.d) + ' of ' + MONTHS[u.h.m - 1].n}</td>
                <td>{weekday({ y: u.inDays < nextYearMark(u.h) ? cur.y : cur.y + 1, m: u.h.m, d: u.h.d })}</td>
                <td dangerouslySetInnerHTML={{ __html: esc(u.h.name) + ' <span class="hint2">(' + u.h.grp + ')</span><br><span class="hint2">' + esc(u.h.desc) + '</span>' }} />
              </tr>
            ))}
          </tbody>
        </table>

        <p className="hint2" style={{ marginTop: 16 }}>
          Year 721 IA. Months map to real-world Jan–Dec lengths so canonical holy days (e.g. 31st of Harvest) land correctly.
          Weekday anchored to 1st of Newyear, 721 IA = Theoday. Source: Ptolus pp. 28–29, 547. Saved in this browser.
        </p>
      </div>
    </Layout>
  );
}
