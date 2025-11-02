export interface Alternative {
	name: string;
	outcomes: { first: number; second: number };
}

export abstract class DecisionMethod {
	abstract Execute(table: Alternative[]): [string, number];
}

export class Pessimistic extends DecisionMethod {
	Execute(table: Alternative[]): [string, number] {
		if (table.length === 0) return ['', 0];
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

export class Laplace extends DecisionMethod {
	Execute(table: Alternative[]): [string, number] {
		if (table.length === 0) return ['', 0];
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
	Execute(table: Alternative[]): [string, number] {
		const degree = 0.5;
		if (table.length === 0) return ['', 0];
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

		for (const alt of table) {
			const r0 = max_state0 - alt.outcomes.first;
			const r1 = max_state1 - alt.outcomes.second;
			const maxRegret = Math.max(r0, r1);
			if (maxRegret < bestMaxRegret) {
				bestMaxRegret = maxRegret;
				best = alt;
			}
		}

		return [best.name, bestMaxRegret];
	}
}

