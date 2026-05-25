/* state.js — shared campaign context for the Adventure Runner.
 * Exposes a global `Ctx`: party level, party size, arc, district, IC date.
 * Backed by localStorage so every tool can default from one place.
 * No dependencies. Safe under file://.
 */
(function (global) {
  'use strict';
  const KEY = 'ptolus-ctx-v1';
  const DEFAULTS = { partyLevel: 4, partySize: 4, arc: 1, district: 'Docks', date: null, party: [] };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  let s = load();
  const subs = [];
  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} subs.forEach(f => { try { f(s); } catch (e) {} }); }

  // District (display name) -> encounter environment region tag
  const DISTRICT_REGION = {
    'Docks': 'ptolus_docks', 'Necropolis': 'ptolus_necropolis',
    'Warrens': 'ptolus_streets', 'Midtown': 'ptolus_streets', 'Oldtown': 'ptolus_streets',
    "Nobles' Quarter": 'ptolus_streets', 'Temple District': 'ptolus_streets',
    'Guildsman District': 'ptolus_streets', "Guildsman's": 'ptolus_streets',
    'South Market': 'ptolus_streets', 'North Market': 'ptolus_streets', 'Rivergate': 'ptolus_streets',
    'The Dungeon': 'ptolus_dungeon', 'Dungeon entrance': 'ptolus_dungeon', 'Undercity': 'ptolus_undercity',
  };
  // canonical district list used by the context bar / district generator
  const DISTRICTS = ['Nobles\' Quarter', 'Midtown', 'Temple District', 'South Market', 'North Market',
    'Guildsman District', 'Oldtown', 'Rivergate', 'Docks', 'Warrens', 'Necropolis'];

  function arcForLevel(lvl) { return lvl >= 20 ? 5 : Math.max(1, Math.min(4, Math.ceil(lvl / 5))); }

  global.Ctx = {
    get: function (k) { return s[k]; },
    set: function (k, v) { s[k] = v; if (k === 'partyLevel') s.arc = arcForLevel(v); save(); },
    setAll: function (o) { Object.assign(s, o); save(); },
    all: function () { return Object.assign({}, s); },
    subscribe: function (fn) { subs.push(fn); },
    regionFor: function (district) { return DISTRICT_REGION[district || s.district] || 'ptolus_streets'; },
    party: function () { return s.party || []; },
    setParty: function (arr) {
      s.party = arr || [];
      if (s.party.length) {
        s.partySize = s.party.length;
        s.partyLevel = Math.round(s.party.reduce(function (a, p) { return a + (p.level || 1); }, 0) / s.party.length);
        s.arc = arcForLevel(s.partyLevel);
      }
      save();
    },
    arcForLevel: arcForLevel,
    DISTRICTS: DISTRICTS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
