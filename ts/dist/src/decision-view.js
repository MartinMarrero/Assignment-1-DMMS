export class DecisionView {
    onCompute = null;
    container;
    textarea;
    select;
    hurwitzInput;
    button;
    output;
    constructor(container) {
        this.container = container || document.body;
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
        this.select = document.createElement('select');
        ['pessimistic', 'optimistic', 'laplace', 'hurwitz'].forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            this.select.appendChild(opt);
        });
        this.hurwitzInput = document.createElement('input');
        this.hurwitzInput.type = 'text';
        this.hurwitzInput.placeholder = '0.5';
        this.hurwitzInput.value = '0.5';
        this.button = document.createElement('button');
        this.button.textContent = 'Compute';
        this.output = document.createElement('div');
        this.output.style.marginTop = '12px';
        const controls = document.createElement('div');
        controls.style.marginTop = '8px';
        controls.appendChild(this.select);
        const hurwitzLabel = document.createElement('label');
        hurwitzLabel.textContent = ' Hurwitz degree: ';
        hurwitzLabel.appendChild(this.hurwitzInput);
        controls.appendChild(hurwitzLabel);
        controls.appendChild(this.button);
        // Add a small "Load example" button that fetches the shipped CSV
        // (`ts/how_to_expand.csv`) so users can load the real dataset used in
        // the assignment without copying/pasting. Vite serves project files
        // at the site root during development, so fetch from './how_to_expand.csv'.
        const loadBtn = document.createElement('button');
        loadBtn.textContent = 'Load example';
        loadBtn.style.marginLeft = '8px';
        loadBtn.addEventListener('click', async () => {
            try {
                const resp = await fetch('./how_to_expand.csv');
                if (!resp.ok)
                    throw new Error(`HTTP ${resp.status}`);
                this.textarea.value = await resp.text();
            }
            catch (e) {
                console.error('Failed to load example CSV:', e);
                // leave textarea unchanged
            }
        });
        controls.appendChild(loadBtn);
        const title = document.createElement('h2');
        title.textContent = 'Decision methods (MVC demo)';
        this.container.appendChild(title);
        this.container.appendChild(this.textarea);
        this.container.appendChild(controls);
        this.container.appendChild(this.output);
        this.button.addEventListener('click', () => this.handleCompute());
        // expose the textarea on window for easier debugging in the console
        // (temporary - removed once parser is confirmed working)
        window.__lastViewTextarea = this.textarea;
    }
    handleCompute() {
        if (!this.onCompute)
            return;
        // read textarea value with resilient fallbacks: sometimes the DOM shows
        // the text as element content instead of the .value property depending
        // on how it was populated. Try several properties so we don't get an
        // empty string in some browsers/locales.
        const csv = (this.textarea.value && this.textarea.value.trim())
            || (this.textarea.textContent && this.textarea.textContent.trim())
            || (this.textarea.innerText && this.textarea.innerText.trim())
            || (this.textarea.defaultValue && this.textarea.defaultValue.trim())
            || '';
        const method = this.select.value;
        // parse degree accepting comma or dot decimal separators (some locales show comma)
        const raw = this.hurwitzInput.value || '0.5';
        const degree = parseFloat(raw.replace(',', '.')) || 0.5;
        this.onCompute(csv, method, { degree });
    }
    showResults(results) {
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
            const ht = window.__hurwitzTable;
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
                this.output.appendChild(hdiv);
            }
        }
        catch (e) {
            // ignore
        }
    }
}
