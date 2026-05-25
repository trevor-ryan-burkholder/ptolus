/* ui.js — shared chrome helpers for Adventure Runner pages.
 * Exposes a global `UI`. Depends on Dice for the seed control.
 *
 * Typical use in a generator:
 *   <header class="runner-head">...</header>
 *   <div class="runner-main">
 *     <div class="panel"> controls... <div id="seed"></div> </div>
 *     <div> <div class="log-head">...<button id="clear">Clear</button></div>
 *           <div class="log" id="log"></div> </div>
 *   </div>
 *   <script> UI.seedControl('seed'); const log = UI.logger('log','clear'); </script>
 */
(function (global) {
  'use strict';

  function el(id) {
    return document.getElementById(id);
  }

  // Build a seed control (number input + Apply + Random) into container `id`.
  // Returns { get, set }.
  function seedControl(id, onApply) {
    const box = typeof id === 'string' ? el(id) : id;
    box.className = (box.className ? box.className + ' ' : '') + 'seed-box';
    box.innerHTML =
      '<label>RNG Seed</label>' +
      '<div class="seed-input-row">' +
      '  <input type="number" id="_seedval" placeholder="(random)">' +
      '  <button id="_seedapply">Apply</button>' +
      '  <button id="_seedrand">Random</button>' +
      '</div>' +
      '<div class="seed-now" id="_seednow">Seed: (unseeded — random each load)</div>';
    const input = box.querySelector('#_seedval');
    const now = box.querySelector('#_seednow');
    function show(s) {
      now.textContent = 'Seed: ' + (s == null ? '(unseeded)' : s);
    }
    box.querySelector('#_seedapply').addEventListener('click', function () {
      const v = parseInt(input.value, 10);
      if (!isNaN(v)) {
        Dice.seed(v);
        show(v);
        if (onApply) onApply(v);
      }
    });
    box.querySelector('#_seedrand').addEventListener('click', function () {
      const s = Dice.randomSeed();
      input.value = s;
      show(s);
      if (onApply) onApply(s);
    });
    return {
      get: function () {
        return Dice.getSeed();
      },
      set: function (v) {
        input.value = v;
        Dice.seed(v);
        show(v);
      },
    };
  }

  // Create a logger bound to a .log element. Optional clear button id.
  // append(content) accepts an HTML string or a DOM node.
  function logger(logId, clearId) {
    const logEl = typeof logId === 'string' ? el(logId) : logId;
    function empty() {
      logEl.innerHTML = '<div class="empty">No results yet. Roll something.</div>';
    }
    empty();
    if (clearId) {
      const c = typeof clearId === 'string' ? el(clearId) : clearId;
      if (c) c.addEventListener('click', empty);
    }
    return {
      append: function (content) {
        if (logEl.querySelector('.empty')) logEl.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'entry';
        if (typeof content === 'string') div.innerHTML = content;
        else div.appendChild(content);
        logEl.appendChild(div);
        logEl.scrollTop = logEl.scrollHeight;
        return div;
      },
      clear: empty,
      el: logEl,
    };
  }

  // Escape text for safe insertion as HTML (keeps copy-paste plain).
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Standard page header. mountHead('Encounter Generator','Roll by region + level')
  function mountHead(title, sub) {
    const h = document.createElement('header');
    h.className = 'runner-head';
    h.innerHTML =
      '<h1>' + esc(title) + '</h1>' +
      (sub ? '<span class="sub">' + esc(sub) + '</span>' : '') +
      '<a class="home" href="../index.html">← Runner Home</a>';
    document.body.insertBefore(h, document.body.firstChild);
  }

  // ---- Shared campaign-context bar (requires state.js / global Ctx) ----
  // Auto-binds Ctx to whatever standard inputs the page has:
  //   #plevel #apl #el ← partyLevel ; #size ← partySize ; #arc ← arc ;
  //   #district ← district ; #region ← Ctx.regionFor(district)
  function contextBar() {
    if (typeof Ctx === 'undefined') return;
    let syncing = false;
    const bar = document.createElement('div');
    bar.className = 'ctx-bar';
    const districtOpts = Ctx.DISTRICTS.map(d => '<option value="' + esc(d) + '">' + esc(d) + '</option>').join('');
    bar.innerHTML =
      '<span class="ctx-label">Campaign:</span>' +
      ' <label>Lvl <input type="number" id="_ctxLvl" min="1" max="20" style="width:50px"></label>' +
      ' <label>Arc <select id="_ctxArc"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label>' +
      ' <label>District <select id="_ctxDist">' + districtOpts + '</select></label>' +
      ' <span class="ctx-date" id="_ctxDate"></span>' +
      ' <span class="ctx-hint">shared across tools</span>';
    const head = document.querySelector('header.runner-head');
    if (head && head.nextSibling) head.parentNode.insertBefore(bar, head.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);

    const lvl = el('_ctxLvl'), arc = el('_ctxArc'), dist = el('_ctxDist'), dateEl = el('_ctxDate');

    function regionMatch(sel, region) { return [].some.call(sel.options, o => o.value === region); }
    function pushToInputs() {
      const c = Ctx.all();
      ['plevel', 'apl'].forEach(id => { const e = el(id); if (e) { e.value = c.partyLevel; fire(e); } });
      const sz = el('size'); if (sz) { sz.value = c.partySize; fire(sz); }
      const a = el('arc'); if (a) { a.value = String(c.arc); fire(a); }
      const d = el('district'); if (d && [].some.call(d.options, o => o.value === c.district)) { d.value = c.district; fire(d); }
      const r = el('region'); if (r) { const reg = Ctx.regionFor(c.district); if (regionMatch(r, reg)) { r.value = reg; fire(r); } }
    }
    function fire(e) { try { e.dispatchEvent(new Event('change', { bubbles: true })); } catch (x) { try { e.dispatchEvent({ type: 'change', target: e }); } catch (y) {} } }

    function syncBar() {
      const c = Ctx.all();
      lvl.value = c.partyLevel; arc.value = String(c.arc); dist.value = c.district;
      dateEl.textContent = c.date ? '· ' + c.date : '';
    }
    bar.addEventListener('change', e => {
      if (syncing) return; syncing = true;
      if (e.target === lvl) Ctx.set('partyLevel', parseInt(lvl.value, 10) || 1);
      else if (e.target === arc) Ctx.set('arc', parseInt(arc.value, 10));
      else if (e.target === dist) Ctx.set('district', dist.value);
      syncBar(); pushToInputs(); syncing = false;
    });
    // write-back when the page's own primary inputs change
    ['plevel', 'apl', 'size', 'arc', 'district'].forEach(id => {
      const e = el(id); if (!e) return;
      e.addEventListener('change', () => {
        if (syncing) return; syncing = true;
        if (id === 'size') Ctx.set('partySize', parseInt(e.value, 10) || 1);
        else if (id === 'arc') Ctx.set('arc', parseInt(e.value, 10));
        else if (id === 'district') Ctx.set('district', e.value);
        else Ctx.set('partyLevel', parseInt(e.value, 10) || 1);
        syncBar(); syncing = false;
      });
    });
    syncBar();
    syncing = true; pushToInputs(); syncing = false;
  }

  // ---- Floating dice tray (independent RNG; never touches Dice's seeded stream) ----
  function rollExpr(expr) {
    const s = String(expr).toLowerCase().replace(/\s/g, '');
    if (/^-?\d+$/.test(s)) return { total: +s, rolls: [+s] };
    const m = s.match(/^(\d*)d(\d+)([x*]\d+)?([+-]\d+)?$/);
    if (!m) return null;
    const n = m[1] ? +m[1] : 1, sides = +m[2], mult = m[3] ? +m[3].slice(1) : 1, mod = m[4] ? +m[4] : 0;
    const rolls = []; let sum = 0;
    for (let i = 0; i < n; i++) { const r = Math.floor(Math.random() * sides) + 1; rolls.push(r); sum += r; }
    return { total: sum * mult + mod, rolls: rolls };
  }
  function diceTray() {
    const btn = document.createElement('button');
    btn.id = '_diceBtn'; btn.className = 'dice-fab'; btn.textContent = '🎲';
    btn.title = 'Dice tray';
    const panel = document.createElement('div');
    panel.id = '_dicePanel'; panel.className = 'dice-panel'; panel.style.display = 'none';
    const quick = ['d20', 'd100', 'd12', 'd10', 'd8', 'd6', 'd4', '2d6', '1d8+5'];
    panel.innerHTML =
      '<div class="dice-quick">' + quick.map(q => '<button data-roll="' + q + '">' + q + '</button>').join('') + '</div>' +
      '<div class="dice-in"><input id="_diceExpr" placeholder="e.g. 3d6+2"><button id="_diceGo">Roll</button></div>' +
      '<div class="dice-log" id="_diceLog"></div>';
    document.body.appendChild(btn); document.body.appendChild(panel);
    const logEl = panel.querySelector('#_diceLog');
    function append(expr) {
      const r = rollExpr(expr);
      if (!r) { return; }
      const d = document.createElement('div');
      d.innerHTML = '<b>' + esc(expr) + '</b> = <span class="dice-tot">' + r.total + '</span>' +
        (r.rolls.length > 1 ? ' <span class="dice-rolls">[' + r.rolls.join(', ') + ']</span>' : '');
      logEl.insertBefore(d, logEl.firstChild);
    }
    btn.addEventListener('click', () => { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; });
    panel.addEventListener('click', e => {
      const q = e.target.closest('[data-roll]'); if (q) { append(q.getAttribute('data-roll')); return; }
      if (e.target.id === '_diceGo') append(el('_diceExpr').value || 'd20');
    });
    panel.querySelector('#_diceExpr').addEventListener('keydown', e => { if (e.key === 'Enter') append(el('_diceExpr').value || 'd20'); });
  }

  // Push text to the player display (display/index.html reads this key).
  function broadcast(text) {
    try { localStorage.setItem('ptolus-broadcast', JSON.stringify({ text: String(text || ''), ts: Date.now() })); } catch (e) {}
  }
  // Wire a "📺 Player View" button (by id) to broadcast a logger's latest entry.
  function broadcastButton(btnId, log) {
    const b = el(btnId); if (!b) return;
    b.addEventListener('click', function () {
      const last = log && log.el && log.el.lastElementChild ? log.el.lastElementChild.textContent : '';
      broadcast(last);
      b.textContent = '📺 Sent'; setTimeout(function () { b.textContent = '📺 Player View'; }, 1500);
    });
  }

  global.UI = {
    el: el,
    seedControl: seedControl,
    logger: logger,
    esc: esc,
    mountHead: mountHead,
    contextBar: contextBar,
    diceTray: diceTray,
    broadcast: broadcast,
    broadcastButton: broadcastButton,
  };
})(typeof window !== 'undefined' ? window : globalThis);
