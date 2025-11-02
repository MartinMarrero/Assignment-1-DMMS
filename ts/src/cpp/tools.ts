import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export interface Alternative {
  name: string;
  outcomes: { first: number; second: number };
}

export function ParseTable(filename: string): Alternative[] {
  const table: Alternative[] = [];

  let data: string = '';
  try {
    data = fs.readFileSync(filename, { encoding: 'utf8' });
  } catch (e) {
    // Try a couple of sensible fallbacks when the provided filename is
    // relative and the current working directory isn't what the caller
    // expects (common when running compiled output from a different folder).
    const candidates: string[] = [];
    // resolve relative to process.cwd()
    candidates.push(path.resolve(process.cwd(), filename));
    // resolve relative to this source file (works for ESM via import.meta.url)
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      candidates.push(path.resolve(__dirname, filename));
      // also try one level up (in case filename was given relative to a sibling folder)
      candidates.push(path.resolve(__dirname, '..', filename));
    } catch {
      // ignore if import.meta.url isn't available for some loader
    }

    let read = false;
    for (const cand of candidates) {
      try {
        data = fs.readFileSync(cand, { encoding: 'utf8' });
        read = true;
        break;
      } catch {
        // try next
      }
    }

    if (!read) return table;
  }

  const lines = data.split(/\r?\n/);
  if (lines.length === 0) return table;

  const trim = (s: string) => s.replace(/^\s+|\s+$/g, '');

  const headerCells = lines[0].split(',').map(c => trim(c));
  if (headerCells.length < 2) return table;

  for (let i = 1; i < headerCells.length; ++i) {
    table.push({ name: headerCells[i], outcomes: { first: 0, second: 0 } });
  }

  let rowIndex = 0;
  for (let li = 1; li < lines.length && rowIndex < 2; ++li) {
    const line = lines[li];
    if (!line) continue;
    const cells = line.split(',').map(c => trim(c));
    if (cells.length < 2) continue;
    for (let i = 1; i < cells.length && i <= table.length; ++i) {
      // Allow floating point values and tolerate empty cells
      const raw = (cells[i] || '0').replace(/[^0-9+\-eE.]/g, '');
      const val = Number.parseFloat(raw) || 0;
      if (rowIndex === 0) table[i - 1].outcomes.first = val;
      else if (rowIndex === 1) table[i - 1].outcomes.second = val;
    }
    ++rowIndex;
  }

  return table;
}

export function FormatDouble(value: number): string {
  // Always round to one decimal place to match requested format
  return value.toFixed(1);
}
