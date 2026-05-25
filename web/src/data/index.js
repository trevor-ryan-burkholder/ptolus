/* data/index.js — single import point for all bundled game data.
 * JSON is imported natively by Vite (no more file:// inlining). */
import monsters from './monsters.json';
import magicItems from './magic-items.json';
import mundaneItems from './mundane-equipment.json';
import spells from './spells.json';
import powers from './powers.json';

export const DATA = { monsters, magicItems, mundaneItems, spells, powers };

export { default as DIVINE } from './divine.js';
export { default as WHOSWHO } from './whoswho.js';
export { default as PTOLUS_ENC } from './ptolus-encounters.js';
export { default as DISTRICT_DATA } from './districts.js';

export default DATA;
