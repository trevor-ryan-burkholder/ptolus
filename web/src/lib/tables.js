/* tables.js — EL math + DMG Table 7-4 treasure values + d% roller (ported). */
import Dice from './dice.js';

export const TREASURE_7_4 = {
  1: [170, 0, 0], 2: [170, 170, 0], 3: [340, 170, 170], 4: [340, 340, 340],
  5: [680, 340, 340], 6: [680, 680, 680], 7: [1360, 680, 680], 8: [1360, 1360, 1360],
  9: [2720, 1360, 1360], 10: [2720, 2720, 2720], 11: [5450, 2720, 2720], 12: [5450, 5450, 5450],
  13: [10900, 5450, 5450], 14: [10900, 10900, 10900], 15: [21800, 10900, 10900], 16: [21800, 21800, 21800],
  17: [43500, 21800, 21800], 18: [43500, 43500, 43500], 19: [87000, 43500, 43500], 20: [87000, 87000, 87000],
};

export function treasureValueByEL(el) {
  const k = Math.max(1, Math.min(20, Math.round(el)));
  const row = TREASURE_7_4[k];
  return { coins_gp: row[0], goods_gp: row[1], items_gp: row[2], el: k };
}

export function elFromCRs(crValues) {
  if (!crValues || crValues.length === 0) return 0;
  if (crValues.length === 1) return Math.max(1, Math.round(crValues[0]));
  let totalPower = 0;
  for (let i = 0; i < crValues.length; i++) totalPower += Math.pow(2, crValues[i] / 2);
  return Math.max(1, Math.round(2 * Math.log2(totalPower)));
}

export function rollOnTable(table, dice) {
  const r = Dice.d(dice || '1d100');
  for (let i = 0; i < table.length; i++) { const row = table[i]; if (r >= row.min && r <= row.max) return row.result; }
  return null;
}

export function gp(n) { return Math.round(n).toLocaleString('en-US') + ' gp'; }

const Tables = { TREASURE_7_4, treasureValueByEL, elFromCRs, rollOnTable, gp };
export default Tables;
