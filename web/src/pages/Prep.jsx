import { useEffect, useState } from 'react';
import { useCtx } from '../state/ctx.jsx';
import { Layout, esc } from '../components/ui.jsx';

const MONTHS = ['Newyear', 'Birth', 'Wind', 'Rain', 'Bloom', 'Sun', 'Growth', 'Blessing', 'Toil', 'Harvest', 'Moons', 'Yearsend'];
function ord(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function icDate() {
  try { const c = JSON.parse(localStorage.getItem('ptolus-calendar-v1')); if (c && c.cur) return ord(c.cur.d) + ' of ' + MONTHS[c.cur.m - 1] + ', ' + c.cur.y + ' IA'; } catch { /* ignore */ }
  return '[Imperial date]';
}

export default function Prep() {
  const ctx = useCtx();
  const [num, setNum] = useState('1');
  const [rdate, setRdate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [md, setMd] = useState('');
  const [fname, setFname] = useState('');
  const [copied, setCopied] = useState(false);

  function gen() {
    const n = String(parseInt(num, 10) || 1).padStart(2, '0');
    const rd = (rdate || '').trim() || '[date]';
    const t = (title || '').trim();
    const ic = icDate();
    const lvl = ctx.partyLevel;
    const arc = ctx.arc;
    const file = rd + '-session-' + n + '.md';
    const text =
'# Session ' + n + (t ? ' — ' + t : '') + '\n\n' +
'- **Real date:** ' + rd + '\n' +
'- **In-world date:** ' + ic + '\n' +
'- **Party level / arc:** APL ' + lvl + ' · Arc ' + ['', 'I', 'II', 'III', 'IV', 'V'][arc] + '\n\n' +
'## Prep\n\n' +
'### Where we left off\n[1–2 sentences from last session\'s recap. Open questions the players have.]\n\n' +
'### Scenes prepped\n1. **[Scene name]** — [goal / what it reveals / how it can go]\n2. **[Scene name]** — [...]\n3. **[Scene name]** — [...]\n\n' +
'### Set-piece\n[The one big moment: location, stakes, the twist. Map/encounter ready?]\n\n' +
'### NPCs likely to appear\n- [Name] — [want / what they know] (stat block: [link or "peaceful only"])\n- [Name] — [...]\n\n' +
'### Likely combats\n- [EL ? — creatures] (rolled in the Encounter tool; sent to Combat Tracker)\n\n' +
'### Fail-forward branches\n- If the party [does X] → [consequence, not a dead end]\n- If they skip [Y] → [it comes back later]\n\n' +
'### Clocks / threads in motion\n- [Faction clock advanced this session? see City Turn]\n- [Plot thread touched]\n\n' +
'---\n\n' +
'## Recap (fill after the session)\n\n' +
'**What happened:** \n\n' +
'**Decisions made:** \n\n' +
'**Threads opened / closed:** \n\n' +
'**XP awarded:** [per-character — use the XP tool]\n\n' +
'**Loose ends for next time:** \n';
    setMd(text);
    setFname(file);
  }

  // generate once on mount and whenever inputs change (matches vanilla auto-render)
  useEffect(() => { gen(); /* eslint-disable-next-line */ }, [num, rdate, title, ctx.partyLevel, ctx.arc]);

  function copy() {
    if (md && navigator.clipboard) {
      navigator.clipboard.writeText(md).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  const css = `
  .prep .out { white-space:pre-wrap; font-family:'Courier New',monospace; font-size:14px; }
  .prep .fname { color:var(--gold); font-weight:bold; }
  .prep .check { list-style:none; padding-left:0; }
  .prep .check li { padding:3px 0; } .prep .check li::before { content:'☐ '; color:var(--gold); }
  `;

  return (
    <Layout title="Session Prep Scaffolder" sub="A ready-to-fill session file" contextBar={false}>
      <style>{css}</style>
      <div className="prep">
        <div className="runner-main">
          <div className="panel">
            <h2>Session Prep</h2>
            <label htmlFor="num">Session #</label>
            <input type="number" id="num" min="1" value={num} onChange={(e) => setNum(e.target.value)} />
            <label htmlFor="rdate">Real date (file name)</label>
            <input type="text" id="rdate" value={rdate} onChange={(e) => setRdate(e.target.value)} />
            <label htmlFor="title">Working title (optional)</label>
            <input type="text" id="title" placeholder="e.g. Into the Ossuary" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button className="primary" onClick={gen}>Generate Prep File</button>
            <button style={{ width: '100%', marginTop: 8 }} onClick={copy}>{copied ? 'Copied!' : 'Copy Markdown'}</button>
            <p className="hint">Scaffolds a <code>campaign/sessions/</code> file per the project template, dated to the Imperial Calendar. Fill the brackets before play.</p>
          </div>

          <div>
            <h2 style={{ color: 'var(--gold)', fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Pre-session checklist</h2>
            <ul className="check">
              <li>Re-read the last 1–2 session files</li>
              <li>Review <code>campaign/plot-threads.md</code> — what's live?</li>
              <li>Advance faction clocks (City Turn) for time passed</li>
              <li>Prep 2–3 scenes + one set-piece</li>
              <li>Note NPCs likely to appear (pull stat blocks)</li>
              <li>Roll a few encounters / a treasure parcel in advance</li>
              <li>Set the Imperial Calendar to the in-world date</li>
            </ul>
            <div className="log-head" style={{ marginTop: 14 }}><h2>Generated File</h2></div>
            <div className="log"><div className="entry"><div className="out"
              dangerouslySetInnerHTML={{ __html: md ? '<span class="fname">→ save as: campaign/sessions/' + esc(fname) + '</span>\n\n' + esc(md) : 'Generate a prep file to see it here.' }} /></div></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
