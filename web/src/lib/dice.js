/* dice.js — seedable dice library (ported from the vanilla runner).
 * Deterministic when seeded: seed(42); roll(20) is repeatable. */

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

export function seed(n) { _seed = n >>> 0; _rng = mulberry32(_seed); return _seed; }
export function randomSeed() { return seed((Math.random() * 0xffffffff) >>> 0); }
export function getSeed() { return _seed; }
export function rand() { return _rng(); }
export function roll(sides) { return Math.floor(rand() * sides) + 1; }
export function rollN(count, sides) { let s = 0; for (let i = 0; i < count; i++) s += roll(sides); return s; }

export function d(expr) {
  if (typeof expr === 'number') return Math.round(expr);
  const s = String(expr).trim().toLowerCase().replace(/\s+/g, '');
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  const m = s.match(/^(\d*)d(\d+)([x×*]\d+)?([+-]\d+)?$/);
  if (!m) throw new Error('Dice.d: cannot parse "' + expr + '"');
  const count = m[1] === '' ? 1 : parseInt(m[1], 10);
  const sides = parseInt(m[2], 10);
  const mult = m[3] ? parseInt(m[3].slice(1), 10) : 1;
  const mod = m[4] ? parseInt(m[4], 10) : 0;
  return rollN(count, sides) * mult + mod;
}

export function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

export function pickN(arr, n) {
  const copy = arr.slice(); const out = [];
  n = Math.min(n, copy.length);
  for (let i = 0; i < n; i++) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
}

export function weightedPick(arr) {
  let total = 0;
  const norm = arr.map((e) => {
    if (Array.isArray(e)) return { value: e[0], weight: e[1] };
    if (e && typeof e === 'object' && 'weight' in e) return { value: 'value' in e ? e.value : e, weight: e.weight };
    return { value: e, weight: 1 };
  });
  norm.forEach((e) => { total += e.weight; });
  let r = rand() * total;
  for (let i = 0; i < norm.length; i++) { r -= norm[i].weight; if (r < 0) return norm[i].value; }
  return norm[norm.length - 1].value;
}

export function range(min, max) { return min + Math.floor(rand() * (max - min + 1)); }
export function percent() { return roll(100); }
export function coinFlip() { return rand() < 0.5; }

const Dice = { seed, randomSeed, getSeed, rand, roll, rollN, d, pick, pickN, weightedPick, range, percent, coinFlip };
export default Dice;
