import { Alternative } from './tools.js';

export abstract class DecisionMethod {
  abstract Execute(table: Alternative[]): [string, number];
}
