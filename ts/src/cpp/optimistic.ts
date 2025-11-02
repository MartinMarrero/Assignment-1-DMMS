import { Alternative } from './tools.js';
import { DecisionMethod } from './decisionmethod.js';

export class Optimistic extends DecisionMethod {
  Execute(table: Alternative[]): [string, number] {
    if (table.length === 0) return ['', 0];
    let best = table[0];
    let bestVal = -Infinity;
    for (const alt of table) {
      if (alt.outcomes.second > bestVal) {
        best = alt;
        bestVal = alt.outcomes.second;
      }
    }
    return [best.name, bestVal];
  }
}
