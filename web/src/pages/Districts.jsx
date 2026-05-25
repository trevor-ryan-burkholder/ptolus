import { useState } from 'react';
import D from '../lib/dice.js';
import { DISTRICT_DATA } from '../data/index.js';
import { useCtx } from '../state/ctx.jsx';
import { Layout, SeedControl, Log, useLog, esc } from '../components/ui.jsx';

const DISTRICT_NAMES = Object.keys(DISTRICT_DATA);

const BEATS = [
  'A City Watch patrol works the corner, checking faces against a folded notice.',
  'Two locals argue in a doorway; it stops the instant the party is noticed.',
  'A child darts past with a stolen something and a grin.',
  'Bells from the Temple District drift over the rooftops.',
  'A hawker presses the party to buy, and won\'t take a polite no.',
  'A cloaked figure watches from across the way, then isn\'t there.',
  'Rain starts; the gutters and the smell rise together.',
  'A delver crew passes, gear dented, talking too loudly to seem calm.',
];

export default function Districts() {
  const ctx = useCtx();
  const log = useLog();
  // default to the campaign district if it exists in the data, else the first
  const initial = DISTRICT_DATA[ctx.district] ? ctx.district : DISTRICT_NAMES[0];
  const [cur, setCur] = useState(initial);

  const dd = () => DISTRICT_DATA[cur];

  function brief() {
    const d = dd(); if (!d) return;
    let out = '<span class="head">[' + esc(cur.toUpperCase()) + ' — district brief]</span>\n';
    out += '<span class="muted">Tone: ' + esc(d.tone) + '</span>\n\n' + esc(d.overview) + '\n\nNOTABLE VENUES:\n';
    out += d.venues.map((v) => '  • ' + esc(v.n) + ' — ' + esc(v.d)).join('\n');
    log.append(out);
  }
  function venue() {
    const d = dd(); if (!d) return;
    const v = D.pick(d.venues);
    log.append('<span class="head">[' + esc(cur) + ' — venue]</span>\n' +
      esc(v.n) + ' — ' + esc(v.d) + '\n<span class="muted">Hook: ' + esc(v.h) + '</span>');
  }
  function scene() {
    const d = dd(); if (!d) return;
    const v = D.pick(d.venues);
    log.append('<span class="head">[' + esc(cur) + ' — what\'s happening]</span>\n' +
      esc(D.pick(BEATS)) + '\n' +
      'Nearby: ' + esc(v.n) + ' — ' + esc(v.d) + '.\n' +
      '<span class="muted">Hook: ' + esc(v.h) + '</span>');
  }

  return (
    <Layout title="District Generator" sub="Where you are, who's here, what's the hook">
      <div className="runner-main">
        <div className="panel">
          <h2>District</h2>
          <label>District</label>
          <select value={cur} onChange={(e) => setCur(e.target.value)}>
            {DISTRICT_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <button className="primary" onClick={brief}>District Brief</button>
          <button style={{ width: '100%', marginTop: 8 }} onClick={venue}>Random Venue</button>
          <button style={{ width: '100%', marginTop: 8 }} onClick={scene}>What's Happening Here</button>
          <SeedControl />
          <p className="hint">Canonical venues, NPCs &amp; hooks from the Ptolus gazetteer.</p>
        </div>
        <Log log={log} title="District Log" />
      </div>
    </Layout>
  );
}
