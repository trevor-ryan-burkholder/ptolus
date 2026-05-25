/* tables.js — EL math + DMG Table 7-4 treasure values + d% table roller.
 * Exposes a global `Tables`. Depends on Dice (for rollOnTable).
 */
(function (global) {
  'use strict';

  // DMG Table 7-4 average values per encounter: [coins_gp, goods_gp, items_gp]
  const TREASURE_7_4 = {
    1: [170, 0, 0],
    2: [170, 170, 0],
    3: [340, 170, 170],
    4: [340, 340, 340],
    5: [680, 340, 340],
    6: [680, 680, 680],
    7: [1360, 680, 680],
    8: [1360, 1360, 1360],
    9: [2720, 1360, 1360],
    10: [2720, 2720, 2720],
    11: [5450, 2720, 2720],
    12: [5450, 5450, 5450],
    13: [10900, 5450, 5450],
    14: [10900, 10900, 10900],
    15: [21800, 10900, 10900],
    16: [21800, 21800, 21800],
    17: [43500, 21800, 21800],
    18: [43500, 43500, 43500],
    19: [87000, 43500, 43500],
    20: [87000, 87000, 87000],
  };

  function treasureValueByEL(el) {
    const k = Math.max(1, Math.min(20, Math.round(el)));
    const row = TREASURE_7_4[k];
    return { coins_gp: row[0], goods_gp: row[1], items_gp: row[2], el: k };
  }

  /* EL from a set of creature CRs (as numeric cr_value floats).
   * Uses the "encounter power" model where every +2 CR doubles power and
   * doubling the creature count adds +2 EL. A single creature of CR n -> EL n.
   *   power(cr) = 2^(cr/2);  EL = round( 2 * log2(sum power) )
   * This matches the DMG doubling rule and handles mixed groups smoothly.
   */
  function elFromCRs(crValues) {
    if (!crValues || crValues.length === 0) return 0;
    if (crValues.length === 1) return Math.max(1, Math.round(crValues[0]));
    let totalPower = 0;
    for (let i = 0; i < crValues.length; i++) {
      totalPower += Math.pow(2, crValues[i] / 2);
    }
    return Math.max(1, Math.round(2 * Math.log2(totalPower)));
  }

  /* Roll on a d% (or any-dice) table.
   * table: [{min, max, result}, ...]; dice: e.g. "1d100" (default).
   * Returns the matching row's `result`, or null if nothing matches.
   */
  function rollOnTable(table, dice) {
    const r = global.Dice ? global.Dice.d(dice || '1d100') : 1;
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      if (r >= row.min && r <= row.max) return row.result;
    }
    return null;
  }

  // Format a gp number with thousands separators.
  function gp(n) {
    return Math.round(n).toLocaleString('en-US') + ' gp';
  }

  global.Tables = {
    TREASURE_7_4: TREASURE_7_4,
    treasureValueByEL: treasureValueByEL,
    elFromCRs: elFromCRs,
    rollOnTable: rollOnTable,
    gp: gp,
  };
})(typeof window !== 'undefined' ? window : globalThis);
