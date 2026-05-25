import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CtxProvider } from '../state/ctx.jsx';
import { DATA } from '../data/index.js';
import Encounters from '../pages/Encounters.jsx';
import Combat from '../pages/Combat.jsx';
import Xp from '../pages/Xp.jsx';
import StreetScenes from '../pages/StreetScenes.jsx';
import Display from '../pages/Display.jsx';
import Whoswho from '../pages/Whoswho.jsx';
import Codex from '../pages/Codex.jsx';
import Divine from '../pages/Divine.jsx';

function wrap(ui, entries) {
  return <MemoryRouter initialEntries={entries || ['/']}><CtxProvider>{ui}</CtxProvider></MemoryRouter>;
}
beforeEach(() => localStorage.clear());

test('handoff: Encounters → Combat (pending-encounter import)', () => {
  const enc = render(wrap(<Encounters />));
  fireEvent.click(enc.getByText('Roll Encounter'));
  fireEvent.click(enc.getByText(/Send last to Combat/i));
  const pend = JSON.parse(localStorage.getItem('ptolus-pending-encounter'));
  expect(pend.combatants.length).toBeGreaterThan(0);
  enc.unmount();

  const cmb = render(wrap(<Combat />));
  fireEvent.click(cmb.getByText(/Import Encounter/i));
  const baseName = pend.combatants[0].name.replace(/ \d+$/, '');
  expect(cmb.container.textContent).toContain(baseName);
});

test('handoff: Combat → XP (defeated monsters → pending-xp → import)', () => {
  const mon = DATA.monsters.find((m) => m.cr_value >= 1 && m.cr_value <= 4);
  localStorage.setItem('ptolus-combat-v1', JSON.stringify({
    combatants: [{ id: 1, name: mon.name, srcName: mon.name, init: 10, hpCur: 0, hpMax: 10, conditions: [] }],
    effects: [], round: 1, activeId: null, seq: 1,
  }));
  const cmb = render(wrap(<Combat />));
  fireEvent.click(cmb.getByText(/Award XP/i));
  const px = JSON.parse(localStorage.getItem('ptolus-pending-xp'));
  expect(px.encounters.length).toBeGreaterThan(0);
  expect(px.encounters[0].el).toBeGreaterThan(0);
  cmb.unmount();

  const xp = render(wrap(<Xp />));
  // auto-import consumes the pending key on mount
  expect(localStorage.getItem('ptolus-pending-xp')).toBeNull();
  xp.unmount();
});

test('handoff: broadcast → Display', () => {
  const ss = render(wrap(<StreetScenes />));
  fireEvent.click(ss.getByText(/Generate Scene/i));
  const pv = ss.queryByText(/Player View/i);
  expect(pv).toBeTruthy();
  fireEvent.click(pv);
  const bc = JSON.parse(localStorage.getItem('ptolus-broadcast'));
  expect(bc && bc.text && bc.text.length).toBeGreaterThan(0);
  ss.unmount();

  const disp = render(wrap(<Display />));
  expect(disp.container.textContent).toContain(bc.text.slice(0, 12));
});

test('deep-link: Whoswho ?view=venues&q=ghostly', () => {
  const r = render(wrap(<Whoswho />, ['/whoswho?view=venues&q=ghostly']));
  expect(r.container.textContent.toLowerCase()).toContain('ghostly');
});

test('deep-link: Codex ?tab=monsters&q=ghoul', () => {
  const r = render(wrap(<Codex />, ['/codex?tab=monsters&q=ghoul']));
  expect(r.container.textContent.toLowerCase()).toContain('ghoul');
});

test('deep-link: Divine ?view=deities&q=lothian', () => {
  const r = render(wrap(<Divine />, ['/divine?view=deities&q=lothian']));
  expect(r.container.textContent.toLowerCase()).toContain('lothian');
});
