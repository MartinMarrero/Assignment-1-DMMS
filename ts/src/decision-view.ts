export type ComputeCallback = (csv: string, method: string, opts?: any) => void;

export interface MethodResult {
	method: string;
	name: string;
	value: number;
}

// Lightweight canvas renderer for the Hurwitz table.
function drawHurwitzChart(canvas: HTMLCanvasElement, ht: any) {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	const padding = { left: 48, right: 16, top: 24, bottom: 48 };
	const w = canvas.width;
	const h = canvas.height;
	// headers: array of alternative names; rows: [[h, v1, v2, ...], ...]
	const headers: string[] = ht.headers.slice();
	const rows: any[] = ht.rows.slice();

	// build series arrays
	const xs = rows.map(r => Number(r[0]));
	const series: number[][] = headers.map((_, i) => rows.map(r => Number(r[i + 1])));

	// compute y range
	let yMin = Infinity;
	let yMax = -Infinity;
	for (const s of series) {
		for (const v of s) {
			if (Number.isFinite(v)) {
				yMin = Math.min(yMin, v);
				yMax = Math.max(yMax, v);
			}
		}
	}
	if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) return;
	// add padding to range
	const span = yMax - yMin || 1;
	yMax += span * 0.08;
	yMin -= span * 0.08;

	// clear
	ctx.clearRect(0, 0, w, h);
	// background
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, w, h);

	// draw grid
	const plotW = w - padding.left - padding.right;
	const plotH = h - padding.top - padding.bottom;
	const originX = padding.left;
	const originY = padding.top + plotH;

	ctx.strokeStyle = '#e6e6e6';
	ctx.lineWidth = 1;
	// horizontal grid lines
	const yTicks = 6;
	ctx.beginPath();
	for (let i = 0; i <= yTicks; ++i) {
		const yy = padding.top + (plotH * i) / yTicks;
		ctx.moveTo(originX, yy);
		ctx.lineTo(originX + plotW, yy);
	}
	ctx.stroke();

	// vertical tick positions (based on xs)
	const n = xs.length;
	ctx.beginPath();
	for (let i = 0; i < n; ++i) {
		const x = originX + (plotW * i) / Math.max(1, n - 1);
		ctx.moveTo(x, padding.top);
		ctx.lineTo(x, originY);
	}
	ctx.stroke();

	// axes labels
	ctx.fillStyle = '#000';
	ctx.font = '12px sans-serif';
	ctx.textAlign = 'center';
	for (let i = 0; i < n; ++i) {
		const x = originX + (plotW * i) / Math.max(1, n - 1);
		ctx.fillText(String(xs[i]), x, originY + 18);
	}
	ctx.textAlign = 'right';
	ctx.fillText('Alternative scores', padding.left - 10, padding.top - 6);
	ctx.textAlign = 'center';
	ctx.fillText('h', originX + plotW + 12, originY + 4);

	// draw series lines
	const colors = ['#0b62f3', '#d9534f', '#32a852', '#f18f8f', '#ff9900', '#6a5acd'];
	for (let si = 0; si < series.length; ++si) {
		const s = series[si];
		ctx.beginPath();
		for (let i = 0; i < s.length; ++i) {
			const v = s[i];
			const x = originX + (plotW * i) / Math.max(1, n - 1);
			const y = padding.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
			if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
		}
		ctx.lineWidth = 2.5;
		ctx.strokeStyle = colors[si % colors.length];
		ctx.stroke();
		// markers
		for (let i = 0; i < s.length; ++i) {
			const v = s[i];
			const x = originX + (plotW * i) / Math.max(1, n - 1);
			const y = padding.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
			ctx.fillStyle = colors[si % colors.length];
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// legend
	const legendX = originX + 8;
	let ly = padding.top + 6;
	ctx.font = '12px sans-serif';
	for (let si = 0; si < headers.length; ++si) {
		const name = headers[si];
		const col = colors[si % colors.length];
		ctx.fillStyle = col;
		ctx.fillRect(legendX, ly - 10, 18, 8);
		ctx.fillStyle = '#000';
		ctx.textAlign = 'left';
		ctx.fillText(name, legendX + 24, ly - 1);
		ly += 18;
	}
}

export class DecisionView {
	public onCompute: ComputeCallback | null = null;
	private container: HTMLElement;
	private textarea: HTMLTextAreaElement;
	private button: HTMLButtonElement;
	private output: HTMLElement;

	constructor(container?: HTMLElement) {
		this.container = container || document.body;

		// create a centered content wrapper so UI floats above the canvas
		const wrapper = document.createElement('div');
		wrapper.className = 'container';
		this.textarea = document.createElement('textarea');
		this.textarea.rows = 8;
		this.textarea.cols = 60;
	// Provide a helpful example as the initial value so users who open the
	// page see a ready-to-compute CSV and the controller can read it via
	// `.value` when the Compute button is pressed. Keep placeholder as
	// fallback for empty cases.
	const sample = 'CSV format: header row with names, then two rows with outcomes.\nExample:\n,StatusQuo,Expansion,BuildingHQ,Collaboration\n10,20,30,40\n5,25,15,35';
	this.textarea.placeholder = sample;
	this.textarea.value = sample;



		this.button = document.createElement('button');
		this.button.textContent = 'Compute';
		this.button.className = 'btn primary';
		// Compute disabled until an example is loaded
		this.button.disabled = true;

		this.output = document.createElement('div');
		this.output.className = 'output';
		this.output.style.marginTop = '12px';

		const controls = document.createElement('div');
		controls.className = 'controls';
		controls.style.marginTop = '8px';
		// Only the Compute button and Load example are shown; methods and
		// degree selector were removed for a simpler UI that computes all
		// methods and shows the full Hurwitz table below.

		// Add a small "Load example" button that fetches the shipped CSV
		// (`ts/how_to_expand.csv`) so users can load the real dataset used in
		// the assignment without copying/pasting. Vite serves project files
		// at the site root during development, so fetch from './how_to_expand.csv'.
			const loadBtn = document.createElement('button');
			loadBtn.textContent = 'Load example';
			loadBtn.className = 'btn secondary';
			loadBtn.style.marginLeft = '8px';
			loadBtn.addEventListener('click', async () => {
				try {
					const resp = await fetch('./how_to_expand.csv');
					if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
					this.textarea.value = await resp.text();
					// enable compute once example successfully loaded
					this.button.disabled = false;
					this.button.focus();
				} catch (e) {
					console.error('Failed to load example CSV:', e);
					// leave textarea unchanged and keep compute disabled
				}
			});
			// Append Load example first, then Compute so compute is on the right
			controls.appendChild(loadBtn);
			controls.appendChild(this.button);

			const title = document.createElement('h2');
			title.textContent = 'Decision methods';

			wrapper.appendChild(title);
			wrapper.appendChild(this.textarea);
			wrapper.appendChild(controls);
			wrapper.appendChild(this.output);
			this.container.appendChild(wrapper);

			this.button.addEventListener('click', () => this.handleCompute());

			// expose the textarea on window for easier debugging in the console
			// (temporary - removed once parser is confirmed working)
			(window as any).__lastViewTextarea = this.textarea;
		}
	private handleCompute() {
		if (!this.onCompute) return;
		// read textarea value with resilient fallbacks: sometimes the DOM shows
		// the text as element content instead of the .value property depending
		// on how it was populated. Try several properties so we don't get an
		// empty string in some browsers/locales.
		const csv = (this.textarea.value && this.textarea.value.trim())
			|| (this.textarea.textContent && this.textarea.textContent.trim())
			|| (this.textarea.innerText && this.textarea.innerText.trim())
			|| (this.textarea.defaultValue && this.textarea.defaultValue.trim())
			|| '';
		// UI no longer exposes a method selector; compute all methods.
		this.onCompute(csv, '', undefined);
	}

	public showResults(results: MethodResult[]) {
		if (!results || results.length === 0) {
			this.output.innerHTML = '<em>No results</em>';
			return;
		}
		const table = document.createElement('table');
		table.style.borderCollapse = 'collapse';
		table.style.marginTop = '8px';
		const header = document.createElement('tr');
		['Method', 'Choice', 'Value'].forEach(h => {
			const th = document.createElement('th');
			th.textContent = h;
			th.style.border = '1px solid #ccc';
			th.style.padding = '4px 8px';
			header.appendChild(th);
		});
		table.appendChild(header);

		for (const r of results) {
			const tr = document.createElement('tr');
			const tdMethod = document.createElement('td');
			tdMethod.textContent = r.method;
			tdMethod.style.border = '1px solid #ccc';
			tdMethod.style.padding = '4px 8px';

			const tdName = document.createElement('td');
			tdName.textContent = r.name || '-';
			tdName.style.border = '1px solid #ccc';
			tdName.style.padding = '4px 8px';

			const tdValue = document.createElement('td');
			tdValue.textContent = typeof r.value === 'number' ? r.value.toFixed(2) : '-';
			tdValue.style.border = '1px solid #ccc';
			tdValue.style.padding = '4px 8px';

			tr.appendChild(tdMethod);
			tr.appendChild(tdName);
			tr.appendChild(tdValue);
			table.appendChild(tr);
		}

		// replace output
		this.output.innerHTML = '';
		this.output.appendChild(table);

		// If the controller exposed a full Hurwitz table, render it below
		try {
			const ht = (window as any).__hurwitzTable;
			if (ht && Array.isArray(ht.headers) && Array.isArray(ht.rows)) {
				const hdiv = document.createElement('div');
				hdiv.style.marginTop = '12px';
				const title = document.createElement('h3');
				title.textContent = 'Hurwitz (h from 0 to 1)';
				hdiv.appendChild(title);
				const htable = document.createElement('table');
				htable.style.borderCollapse = 'collapse';
				htable.style.marginTop = '8px';
				// header
				const thr = document.createElement('tr');
				['h', ...ht.headers].forEach(hh => {
					const th = document.createElement('th');
					th.textContent = String(hh);
					th.style.border = '1px solid #000';
					th.style.padding = '6px 10px';
					thr.appendChild(th);
				});
				htable.appendChild(thr);
				for (const r of ht.rows) {
					const tr = document.createElement('tr');
					for (const c of r) {
						const td = document.createElement('td');
						td.textContent = String(c);
						td.style.border = '1px solid #000';
						td.style.padding = '6px 10px';
						tr.appendChild(td);
					}
					htable.appendChild(tr);
				}
						hdiv.appendChild(htable);
						// render table and chart side-by-side
						const side = document.createElement('div');
						side.className = 'hurwitz-side';
						side.style.display = 'flex';
						side.style.flexDirection = 'row';
						side.style.alignItems = 'flex-start';
						side.style.gap = '24px';

						const left = document.createElement('div');
						left.style.flex = '0 0 auto';
						left.appendChild(htable);

						const right = document.createElement('div');
						right.style.flex = '1 1 auto';
						const canvas = document.createElement('canvas');
						canvas.style.width = '760px';
						canvas.style.height = '340px';
						canvas.width = 760;
						canvas.height = 340;
						canvas.style.display = 'block';
						canvas.style.marginTop = '6px';
						right.appendChild(canvas);

						side.appendChild(left);
						side.appendChild(right);

						hdiv.appendChild(side);
						try { drawHurwitzChart(canvas, ht); } catch (e) { /* ignore chart errors */ }
						this.output.appendChild(hdiv);
			}
		} catch (e) {
			// ignore
		}
	}
}

