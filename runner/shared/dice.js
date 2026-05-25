/* dice.js — seedable dice library for the Adventure Runner.
 * Exposes a global `Dice`. Deterministic when seeded:
 *   Dice.seed(42); Dice.roll(20)  // same value every time for a given seed.
 * No dependencies. Safe under file://.
 */
(function (global) {
  'use strict';

  // mulberry32 — tiny, fast, seedable PRNG (returns float in [0,1)).
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  let _seed = null;
  let _rng = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);

  function seed(n) {
    _seed = n >>> 0;
    _rng = mulberry32(_seed);
    return _seed;
  }

  function randomSeed() {
    return seed((Math.random() * 0xffffffff) >>> 0);
  }

  function getSeed() {
    return _seed;
  }

  function rand() {
    return _rng();
  }

  // 1dN
  function roll(sides) {
    return Math.floor(rand() * sides) + 1;
  }

  // NdS (sum)
  function rollN(count, sides) {
    let sum = 0;
    for (let i = 0; i < count; i++) sum += roll(sides);
    return sum;
  }

  // Parse "2d6+3", "1d20", "d20", "3d6-1", "2d4×50", or a flat number "5".
  function d(expr) {
    if (typeof expr === 'number') return Math.round(expr);
    const s = String(expr).trim().toLowerCase().replace(/\s+/g, '');
    // flat number
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    const m = s.match(/^(\d*)d(\d+)([x×*]\d+)?([+-]\d+)?$/);
    if (!m) throw new Error('Dice.d: cannot parse "' + expr + '"');
    const count = m[1] === '' ? 1 : parseInt(m[1], 10);
    const sides = parseInt(m[2], 10);
    const mult = m[3] ? parseInt(m[3].slice(1), 10) : 1;
    const mod = m[4] ? parseInt(m[4], 10) : 0;
    return rollN(count, sides) * mult + mod;
  }

  // Uniform pick from an array.
  function pick(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  // Pick n distinct items (no replacement). Returns up to n if array is shorter.
  function pickN(arr, n) {
    const copy = arr.slice();
    const out = [];
    n = Math.min(n, copy.length);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(rand() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  }

  // Weighted pick. Accepts either:
  //   [{value, weight}, ...]  -> returns value
  //   [["text", 3], ["other", 1]] -> returns first element
  function weightedPick(arr) {
    let total = 0;
    const norm = arr.map(function (e) {
      if (Array.isArray(e)) return { value: e[0], weight: e[1] };
      if (e && typeof e === 'object' && 'weight' in e)
        return { value: 'value' in e ? e.value : e, weight: e.weight };
      return { value: e, weight: 1 };
    });
    norm.forEach(function (e) {
      total += e.weight;
    });
    let r = rand() * total;
    for (let i = 0; i < norm.length; i++) {
      r -= norm[i].weight;
      if (r < 0) return norm[i].value;
    }
    return norm[norm.length - 1].value;
  }

  // Inclusive integer in [min, max].
  function range(min, max) {
    return min + Math.floor(rand() * (max - min + 1));
  }

  function percent() {
    return roll(100);
  }

  function coinFlip() {
    return rand() < 0.5;
  }

  global.Dice = {
    seed: seed,
    randomSeed: randomSeed,
    getSeed: getSeed,
    rand: rand,
    roll: roll,
    rollN: rollN,
    d: d,
    pick: pick,
    pickN: pickN,
    weightedPick: weightedPick,
    range: range,
    percent: percent,
    coinFlip: coinFlip,
  };
})(typeof window !== 'undefined' ? window : globalThis);
