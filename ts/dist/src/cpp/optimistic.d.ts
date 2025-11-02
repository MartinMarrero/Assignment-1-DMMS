import { Alternative } from './tools.js';
import { DecisionMethod } from './decisionmethod.js';
export declare class Optimistic extends DecisionMethod {
    Execute(table: Alternative[]): [string, number];
}
