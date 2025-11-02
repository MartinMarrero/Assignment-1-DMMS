export class DecisionMethod {
}
export class Pessimistic extends DecisionMethod {
    Execute(table) {
        if (table.length === 0)
            return ['', 0];
        let best = table[0];
        let bestVal = -Infinity;
        for (const alt of table) {
            if (alt.outcomes.first > bestVal) {
                best = alt;
                bestVal = alt.outcomes.first;
            }
        }
        return [best.name, bestVal];
    }
}
export class Optimistic extends DecisionMethod {
    Execute(table) {
        if (table.length === 0)
            return ['', 0];
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
export class Hurwitz extends DecisionMethod {
    // This simple browser version uses a default optimism degree of 0.5.
    // If you want a different degree, the controller can compute custom values.
    Execute(table) {
        const degree = 0.5;
        if (table.length === 0)
            return ['', 0];
        let best = table[0];
        let bestVal = -Infinity;
        for (const alt of table) {
            const val = degree * alt.outcomes.second + (1 - degree) * alt.outcomes.first;
            if (val > bestVal) {
                best = alt;
                bestVal = val;
            }
        }
        return [best.name, bestVal];
    }
}
