import { DecisionMethod } from './decisionmethod.js';
export class Laplace extends DecisionMethod {
    Execute(table) {
        if (table.length === 0)
            return ['', 0];
        let best = table[0];
        let bestMean = -Infinity;
        for (const alt of table) {
            const mean = (alt.outcomes.first + alt.outcomes.second) / 2;
            if (mean > bestMean) {
                best = alt;
                bestMean = mean;
            }
        }
        return [best.name, bestMean];
    }
}
