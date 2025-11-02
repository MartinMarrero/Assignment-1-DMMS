import { ParseTable, FormatDouble } from './tools.js';
import { Pessimistic } from './pessimistic.js';
import { Optimistic } from './optimistic.js';
import { Laplace } from './laplace.js';
import { Hurwitz } from './hurwitz.js';
export function run() {
    const fname = '../../how_to_expand.csv';
    const table = ParseTable(fname);
    console.log('Parsed alternatives:');
    for (const alt of table) {
        console.log(`${alt.name}: (${FormatDouble(alt.outcomes.first)}, ${FormatDouble(alt.outcomes.second)})`);
    }
    let method = new Pessimistic();
    console.log('Pessimistic:');
    {
        const result = method.Execute(table);
        console.log(`${result[0]}(${FormatDouble(result[1])})`);
    }
    console.log('Optimistic:');
    {
        method = new Optimistic();
        const result = method.Execute(table);
        console.log(`${result[0]}(${FormatDouble(result[1])})`);
    }
    console.log('Laplace:');
    {
        method = new Laplace();
        const result = method.Execute(table);
        console.log(`${result[0]}(${FormatDouble(result[1])})`);
    }
    console.log('Hurwitz:');
    {
        method = new Hurwitz();
        method.Execute(table);
    }
}
// Execute immediately when this module is loaded as a script
run();
