import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Layout } from '../components/ui.jsx';

const GROUPS = { campaign: 'Your Campaign', docs: 'Runner Design Docs', rules: 'Rules', classes: 'Classes', races: 'Races', ptolus: 'Ptolus' };
// 'campaign' is populated locally by scripts/sync-campaign.mjs (off in prod by default).
const GROUP_ORDER = ['campaign', 'ptolus', 'rules', 'classes', 'races', 'docs'];

const FILES = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true });

const DOCS = Object.entries(FILES).map(([path, body]) => {
  const m = path.match(/content\/([^/]+)\/(.+)\.md$/);
  const group = m ? m[1] : 'docs';
  const id = m ? m[2] : path;
  const h = String(body).match(/^#\s+(.+)$/m);
  const title = h ? h[1].trim() : id;
  return { id: group + '/' + id, group, title, body: String(body) };
}).sort((a, b) => a.title.localeCompare(b.title));

const MD_CSS = `
.md-body { padding: 8px 24px 60px; max-width: 900px; }
.md-body h1 { color: var(--gold); border-bottom: 1px solid var(--gold-dim); padding-bottom: 6px; }
.md-body h2, .md-body h3 { color: var(--gold); }
.md-body a { color: var(--gold); }
.md-body code { background: #141414; padding: 1px 5px; border-radius: 4px; font-size: 0.9em; }
.md-body pre { background: #141414; padding: 12px; border-radius: 8px; overflow-x: auto; }
.md-body table { border-collapse: collapse; margin: 10px 0; }
.md-body th, .md-body td { border: 1px solid var(--line); padding: 6px 10px; text-align: left; }
.md-body th { background: #2a2a2a; color: var(--gold); }
.md-body blockquote { border-left: 3px solid var(--gold-dim); margin: 8px 0; padding-left: 12px; color: var(--muted); }
.lib-list { max-height: 82vh; overflow-y: auto; }
.lib-list .lg { color: var(--gold); font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin: 12px 0 4px; }
.lib-list a { display: block; padding: 4px 8px; color: var(--text); text-decoration: none; font-size: 14px; border-radius: 5px; cursor: pointer; }
.lib-list a:hover, .lib-list a.sel { background: var(--bg-input); color: var(--gold); }
`;

export default function Library() {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(DOCS[0] ? DOCS[0].id : null);
  const ql = q.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!ql) return DOCS;
    return DOCS.filter((d) => d.title.toLowerCase().includes(ql) || d.body.toLowerCase().includes(ql));
  }, [ql]);

  const byGroup = useMemo(() => {
    const m = {};
    filtered.forEach((d) => { (m[d.group] = m[d.group] || []).push(d); });
    return m;
  }, [filtered]);

  const current = DOCS.find((d) => d.id === sel) || filtered[0];

  return (
    <Layout title="Reference Library" sub="Every doc — Ptolus lore, 3.5e rules, specs" contextBar={false}>
      <style>{MD_CSS}</style>
      <div className="runner-main">
        <div className="panel">
          <input placeholder="Search docs…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="lib-list">
            {GROUP_ORDER.filter((g) => byGroup[g]).map((g) => (
              <div key={g}>
                <div className="lg">{GROUPS[g] || g}</div>
                {byGroup[g].map((d) => (
                  <a key={d.id} className={d.id === (current && current.id) ? 'sel' : ''} onClick={() => setSel(d.id)}>{d.title}</a>
                ))}
              </div>
            ))}
            {filtered.length === 0 && <p className="hint">No docs match.</p>}
          </div>
        </div>
        <div className="md-body">
          {current ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{current.body}</ReactMarkdown> : <p className="hint">Select a doc.</p>}
        </div>
      </div>
    </Layout>
  );
}
