import { Alternative, FormatDouble } from './tools.js';
import { DecisionMethod } from './decisionmethod.js';

export class Hurwitz extends DecisionMethod {
  Execute(table: Alternative[]): [string, number] {
    console.log('h   | status quo | expansion | building HQ | collaboration');
    console.log('----------------------------------------------------------');
    for (let optimism_degree = 0.0; optimism_degree < 1.0; optimism_degree += 0.1) {
      const status_quo = optimism_degree * table[0].outcomes.second + (1 - optimism_degree) * table[0].outcomes.first;
      const expansion = optimism_degree * table[1].outcomes.second + (1 - optimism_degree) * table[1].outcomes.first;
      const building_hq = optimism_degree * table[2].outcomes.second + (1 - optimism_degree) * table[2].outcomes.first;
      const collaboration = optimism_degree * table[3].outcomes.second + (1 - optimism_degree) * table[3].outcomes.first;
      console.log(
        `${FormatDouble(Number(optimism_degree.toFixed(1)))} | ${FormatDouble(status_quo)}       | ${FormatDouble(expansion)}      | ${FormatDouble(
          building_hq,
        )}        | ${FormatDouble(collaboration)}`,
      );
    }
    // Return placeholder to match C++ signature; real choice may depend on additional logic
    return ['hurwitz', 0];
  }
}
