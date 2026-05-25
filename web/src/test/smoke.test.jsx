import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CtxProvider } from '../state/ctx.jsx';
import { DATA, DIVINE, WHOSWHO, PTOLUS_ENC, DISTRICT_DATA } from '../data/index.js';

function wrap(ui) {
  return <MemoryRouter><CtxProvider>{ui}</CtxProvider></MemoryRouter>;
}

test('data bundles load with expected shape', () => {
  expect(DATA.monsters.length).toBeGreaterThan(100);
  expect(DATA.spells.length).toBeGreaterThan(100);
  expect(DIVINE.deities.length).toBeGreaterThan(20);
  expect(WHOSWHO.npcs.length).toBeGreaterThan(100);
  expect(PTOLUS_ENC.districts.length).toBeGreaterThan(5);
  expect(Object.keys(DISTRICT_DATA).length).toBeGreaterThan(5);
});

// render every ported page (mount smoke) — catches crashes-on-load across all tools
const pages = import.meta.glob('../pages/*.jsx', { eager: true });
for (const [path, mod] of Object.entries(pages)) {
  const name = path.split('/').pop().replace('.jsx', '');
  const Comp = mod.default;
  test('mounts + primary action ' + name, () => {
    const { container, unmount } = render(wrap(<Comp />));
    // exercise the main action button(s) — catches handler crashes, not just mount
    container.querySelectorAll('button.primary').forEach((b) => fireEvent.click(b));
    unmount();
  });
}
