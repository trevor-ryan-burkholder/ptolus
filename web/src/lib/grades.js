/* grades.js — Ptolus Monster Grade system (ported). See docs/08-monster-grades.md. */

export const grades = [
  { grade: 'Grade 4', crMin: 0.25, crMax: 1, crLabel: 'CR 1/4–1', status: 'Tolerated in designated zones', response: 'Patrol sweep', responseDice: '1d6×10 min', permit: 'Movement permit (cheap, easy)', social: "An ordinary sight — part of the city's texture." },
  { grade: 'Grade 3', crMin: 2, crMax: 5, crLabel: 'CR 2–5', status: 'Restricted — must register', response: 'Full patrol response', responseDice: '1d6×5 min', permit: 'Residency permit (expensive, background check)', social: 'Visibly monitored; shopkeepers lock doors when they pass.' },
  { grade: 'Grade 2', crMin: 6, crMax: 10, crLabel: 'CR 6–10', status: 'Heavily restricted', response: 'Rapid response squad (8–12 guards + a specialist)', responseDice: '1d4 min', permit: 'Special dispensation from city council', social: 'Civilians cross the street.' },
  { grade: 'Grade 1', crMin: 11, crMax: 15, crLabel: 'CR 11–15', status: 'Exclusion default — case-by-case exemptions', response: 'City Watch Elite + backup (treat as named NPC encounter)', responseDice: '2d4 rounds', permit: 'Council vote required', social: 'A block empties in minutes.' },
  { grade: 'Special Grade', crMin: 16, crMax: 99, crLabel: 'CR 16+', status: 'No legal integration — shoot on sight default', response: 'Full mobilization; districts may go into lockdown', responseDice: 'immediate', permit: 'Not available', social: 'A district empties.' },
];

export const examples = {
  Goblin: 'Grade 4', Kobold: 'Grade 4', Gnoll: 'Grade 3', Ogre: 'Grade 3', Bugbear: 'Grade 3',
  Troll: 'Grade 2', 'Mind Flayer': 'Grade 2', Illithid: 'Grade 2', Beholder: 'Grade 1', Vampire: 'Grade 1',
  Aboleth: 'Special Grade', Lich: 'Special Grade', Dracolich: 'Special Grade',
};

export const permits = {
  'Grade 4': 'Movement Permit — day travel only, designated routes. 5 gp/month.',
  'Grade 3': 'Residency Permit — registered address, annual review. 50 gp/yr + references.',
  'Grade 2': 'Special Dispensation — sponsor required (noble/guild/church). 500 gp, 1 year.',
  'Grade 1': 'Council Exception — full council vote. Political capital. Rarely granted.',
  'Special Grade': 'No permit available.',
};

export function get(gradeName) { return grades.find((g) => g.grade === gradeName) || null; }

export function byName(name) {
  if (!name) return null;
  if (examples[name]) return get(examples[name]);
  const key = Object.keys(examples).find((k) => name.toLowerCase().indexOf(k.toLowerCase()) !== -1);
  return key ? get(examples[key]) : null;
}

export function byCR(crValue) {
  if (crValue == null || isNaN(crValue)) return null;
  if (crValue <= 1) return get('Grade 4');
  if (crValue <= 5) return get('Grade 3');
  if (crValue <= 10) return get('Grade 2');
  if (crValue <= 15) return get('Grade 1');
  return get('Special Grade');
}

export function classify(name, crValue) { return byName(name) || (crValue != null ? byCR(crValue) : null); }

const GRADES = { grades, examples, permits, byName, byCR, get, classify };
export default GRADES;
