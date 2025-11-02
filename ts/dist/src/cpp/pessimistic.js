import { DecisionMethod } from './decisionmethod.js';
export class Pessimistic extends DecisionMethod {
    Execute(table) {
        if (table.length === 0)
            return ['', 0];
        let best = table[0];
        let bestVal = -Infinity;
        // In C++ code best_alternative->outcomes.first initialized to -1,
        // so we simply pick the maximum of outcomes.first
        for (const alt of table) {
            if (alt.outcomes.first > bestVal) {
                best = alt;
                bestVal = alt.outcomes.first;
            }
        }
        return [best.name, bestVal];
    }
}
