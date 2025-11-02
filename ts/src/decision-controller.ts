import { Alternative, Pessimistic, Optimistic, Laplace } from './decisionmethod';

export type ComputeHandler = (csv: string, method: string, opts?: any) => void;

export interface MethodResult {
	method: string;
	name: string;
	value: number;
}

export class DecisionController {
	private onResult: (results: MethodResult[]) => void;

	constructor(onResult: (results: MethodResult[]) => void) {
		this.onResult = onResult;
	}

	// Computes all methods and returns an array of results.
	public handleCompute(csv: string, method: string, opts?: any) {
		console.log('DecisionController.handleCompute - raw CSV input (stringified):', JSON.stringify(csv));
		console.log('DecisionController.handleCompute - parsing CSV...');
		const table = this.parseCSV(csv);
		console.log('DecisionController.handleCompute - parsed table (json):', JSON.stringify(table));
		console.log('DecisionController.handleCompute - parsed table (table view):');
		console.table(table.map(t => ({ name: t.name, first: t.outcomes.first, second: t.outcomes.second })));

		// Extra DOM diagnostics: list all textarea elements and their values
		try {
			const tNodes = Array.from(document.querySelectorAll('textarea'));
			console.log('DOM textareas count:', tNodes.length);
			console.log('DOM textarea values:', tNodes.map(n => n.value));
			console.log('Controller textarea reference in view (if available):', (window as any).__lastViewTextarea || null);
		} catch (e) {
			console.log('Error while inspecting DOM textareas', e);
		}

		const results: MethodResult[] = [];

		const pess = new Pessimistic().Execute(table);
		results.push({ method: 'pessimistic', name: pess[0], value: pess[1] });

		const opt = new Optimistic().Execute(table);
		results.push({ method: 'optimistic', name: opt[0], value: opt[1] });

		const lap = new Laplace().Execute(table);
		results.push({ method: 'laplace', name: lap[0], value: lap[1] });

		// hurwitz uses opts.degree if provided, otherwise 0.5
		// For Hurwitz, compute both the single best for the given degree and
		// a full table of values for h in [0,1] step 0.1. The full table is
		// exposed on window.__hurwitzTable so the view can render it as the
		// requested complete table instead of just a single degree value.
		const degree = opts && typeof opts.degree === 'number' ? opts.degree : 0.5;
		// Do not push a separate 'hurwitz' row into the results table; the
		// full Hurwitz table is exposed on window.__hurwitzTable and will be
		// rendered separately by the view.
		this.executeHurwitz(table, degree);

		// Build full hurwitz table (h header plus a row per h value)
		try {
			const headers = table.map(t => t.name);
			const rows: Array<Array<number | string>> = [];
			for (let i = 0; i <= 10; ++i) {
				const h = +(i / 10).toFixed(1);
				const row: Array<number | string> = [h];
				for (const alt of table) {
					row.push(+(h * alt.outcomes.second + (1 - h) * alt.outcomes.first).toFixed(1));
				}
				rows.push(row);
			}
			// Expose for the view to pick up and render
			(window as any).__hurwitzTable = { headers, rows };
		} catch (e) {
			(window as any).__hurwitzTable = null;
		}

		this.onResult(results);
	}

	private executeHurwitz(table: Alternative[], degree: number): [string, number] {
		if (table.length === 0) return ['', 0];
		let best = table[0];
		let bestVal = -Infinity;
		for (const alt of table) {
			const v = degree * alt.outcomes.second + (1 - degree) * alt.outcomes.first;
			if (v > bestVal) {
				best = alt;
				bestVal = v;
			}
		}
		return [best.name, bestVal];
	}

		private parseCSV(text: string): Alternative[] {
			const table: Alternative[] = [];
			if (!text) return table;
			// strip BOM if present and split into non-empty trimmed lines
			text = text.replace(/^\uFEFF/, '');
			const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
			if (lines.length === 0) return table;
			// Support comma or semicolon separators (some locales use ';')
			const splitRE = /\s*[,;]\s*/;

			// Find the header line: skip any explanatory lines until we find a line
			// that looks like a CSV header (has at least two cells separated by ',' or ';').
			let headerIndex = -1;
			for (let i = 0; i < lines.length; ++i) {
				const rawLine = lines[i];
				const cells = rawLine.split(splitRE).map(c => c.trim());
				if (cells.length < 2) continue;

				// Skip obvious explanatory lines that may contain commas but are
				// not a CSV header (placeholders, examples). These often contain
				// words like "example" or "csv format".
				const low = rawLine.toLowerCase();
				if (/example|csv format|header row|then two rows/.test(low)) continue;

				// Prefer lines where at least one of the later cells contains
				// letters (a name like StatusQuo, Expansion, ...). This avoids
				// picking an explanatory sentence that happens to include commas.
				const hasNameLike = cells.slice(1).some(c => /[A-Za-z]/.test(c));
				if (hasNameLike) {
					headerIndex = i;
					break;
				}

				// As a fallback, accept the first line with >=2 cells.
				if (headerIndex === -1) headerIndex = i;
			}
			if (headerIndex === -1) return table;

			// Normalize the raw header line: some CSVs use backslash or other
			// separators in the first cell (e.g. "outcomes\\alternatives,...").
			// Replace backslashes with commas so splitRE catches them, then split.
			const rawHeaderLine = lines[headerIndex].replace(/\\+/g, ',');
			const header = rawHeaderLine.split(splitRE).map(c => c.trim());
			// header may have a leading empty cell (line begins with comma), or it may
			// contain a label like "outcomes" or "alternatives" in the first cell.
			// If the first cell looks like a label, skip it.
			let nameStart = 0;
			if (!header[0] || /outcome|alternativ|^\\/.test(header[0].toLowerCase())) nameStart = 1;
			for (let i = nameStart; i < header.length; ++i) {
				table.push({ name: header[i], outcomes: { first: 0, second: 0 } });
			}

			const parseNum = (s: string) => {
				if (!s) return 0;
				// accept comma or dot as decimal separator
				const normalized = s.replace(/\s+/g, '').replace(',', '.');
				const v = Number.parseFloat(normalized);
				return Number.isFinite(v) ? v : 0;
			};

			// next rows: expect two rows with outcomes (first and second), but support
			// rows that either include a leading label cell or not.
			let rowIndex = 0;
			// Start reading outcome rows after the detected header line
			for (let li = headerIndex + 1; li < lines.length && rowIndex < 2; ++li) {
				const cells = lines[li].split(splitRE).map(c => c.trim());
				if (cells.length === 0) continue;

				// If numeric row has exactly table.length values -> no leading label
				if (cells.length === table.length) {
					for (let i = 0; i < cells.length && i < table.length; ++i) {
						const val = parseNum(cells[i]);
						if (rowIndex === 0) table[i].outcomes.first = val;
						else table[i].outcomes.second = val;
					}
				} else if (cells.length === table.length + 1) {
					// Leading label present (like "first,10,20,30")
					for (let i = 1; i < cells.length && i <= table.length; ++i) {
						const val = parseNum(cells[i]);
						if (rowIndex === 0) table[i - 1].outcomes.first = val;
						else table[i - 1].outcomes.second = val;
					}
				} else {
					// Fallback: try to align numbers with the last columns (handles leading label or extra empty columns)
					const n = Math.min(cells.length, table.length);
					const offset = Math.max(0, cells.length - table.length);
					for (let i = 0; i < n; ++i) {
						const val = parseNum(cells[i + offset]);
						if (rowIndex === 0) table[i].outcomes.first = val;
						else table[i].outcomes.second = val;
					}
				}

				rowIndex++;
			}

			return table;
		}
}

