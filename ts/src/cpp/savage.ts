import { Alternative, FormatDouble } from './tools.js';
import { DecisionMethod } from './decisionmethod.js';

export class Savage extends DecisionMethod {
  Execute(table: Alternative[]): [string, number] {
    if (table.length === 0) return ['', 0];

    let max_state0 = -Infinity;
    let max_state1 = -Infinity;
    for (const alt of table) {
      if (alt.outcomes.first > max_state0) max_state0 = alt.outcomes.first;
      if (alt.outcomes.second > max_state1) max_state1 = alt.outcomes.second;
    }

    let best = table[0];
    let bestMaxRegret = Infinity;

    console.log('Regret matrix (alternative: (state0, state1))');
    for (const alt of table) {
      const r0 = max_state0 - alt.outcomes.first;
      const r1 = max_state1 - alt.outcomes.second;
      const maxRegret = Math.max(r0, r1);
      console.log(`${alt.name}: (${FormatDouble(r0)}, ${FormatDouble(r1)})`);
      if (maxRegret < bestMaxRegret) {
        bestMaxRegret = maxRegret;
        best = alt;
      }
    }

    return [best.name, bestMaxRegret];
  }
}
