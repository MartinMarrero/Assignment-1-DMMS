import { Alternative } from './tools.js';
import { DecisionMethod } from './decisionmethod.js';
export declare class Laplace extends DecisionMethod {
    Execute(table: Alternative[]): [string, number];
}
