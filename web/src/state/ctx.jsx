/* ctx.jsx — shared campaign context (ported from state.js) as a React context.
 * Same localStorage key + shape, so it interops with the legacy data. */
import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';

const KEY = 'ptolus-ctx-v1';
const DEFAULTS = { partyLevel: 4, partySize: 4, arc: 1, district: 'Docks', date: null, party: [] };

const DISTRICT_REGION = {
  Docks: 'ptolus_docks', Necropolis: 'ptolus_necropolis',
  Warrens: 'ptolus_streets', Midtown: 'ptolus_streets', Oldtown: 'ptolus_streets',
  "Nobles' Quarter": 'ptolus_streets', 'Temple District': 'ptolus_streets',
  'Guildsman District': 'ptolus_streets', "Guildsman's": 'ptolus_streets',
  'South Market': 'ptolus_streets', 'North Market': 'ptolus_streets', Rivergate: 'ptolus_streets',
  'The Dungeon': 'ptolus_dungeon', 'Dungeon entrance': 'ptolus_dungeon', Undercity: 'ptolus_undercity',
};

export const DISTRICTS = ["Nobles' Quarter", 'Midtown', 'Temple District', 'South Market', 'North Market',
  'Guildsman District', 'Oldtown', 'Rivergate', 'Docks', 'Warrens', 'Necropolis'];

export function arcForLevel(lvl) { return lvl >= 20 ? 5 : Math.max(1, Math.min(4, Math.ceil(lvl / 5))); }
export function regionFor(district) { return DISTRICT_REGION[district] || 'ptolus_streets'; }

function load() {
  try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
  catch { return { ...DEFAULTS }; }
}

const CtxContext = createContext(null);

export function CtxProvider({ children }) {
  const [state, setState] = useState(load);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  // cross-tab / cross-page sync (other vanilla pages still write this key)
  useEffect(() => {
    function onStorage(e) { if (e.key === KEY) setState(load()); }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const set = useCallback((k, v) => {
    setState((s) => { const n = { ...s, [k]: v }; if (k === 'partyLevel') n.arc = arcForLevel(v); return n; });
  }, []);
  const setAll = useCallback((o) => setState((s) => ({ ...s, ...o })), []);
  const setParty = useCallback((arr) => {
    setState((s) => {
      const party = arr || [];
      const n = { ...s, party };
      if (party.length) {
        n.partySize = party.length;
        n.partyLevel = Math.round(party.reduce((a, p) => a + (p.level || 1), 0) / party.length);
        n.arc = arcForLevel(n.partyLevel);
      }
      return n;
    });
  }, []);

  const value = { ...state, set, setAll, setParty, regionFor, arcForLevel, DISTRICTS };
  return <CtxContext.Provider value={value}>{children}</CtxContext.Provider>;
}

export function useCtx() {
  const c = useContext(CtxContext);
  if (!c) throw new Error('useCtx must be used within CtxProvider');
  return c;
}
