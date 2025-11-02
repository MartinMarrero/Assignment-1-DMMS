import { Alternative } from './tools.js';
export declare abstract class DecisionMethod {
    abstract Execute(table: Alternative[]): [string, number];
}
