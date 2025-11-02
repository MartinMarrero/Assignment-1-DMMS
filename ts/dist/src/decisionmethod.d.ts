export interface Alternative {
    name: string;
    outcomes: {
        first: number;
        second: number;
    };
}
export declare abstract class DecisionMethod {
    abstract Execute(table: Alternative[]): [string, number];
}
export declare class Pessimistic extends DecisionMethod {
    Execute(table: Alternative[]): [string, number];
}
export declare class Optimistic extends DecisionMethod {
    Execute(table: Alternative[]): [string, number];
}
export declare class Laplace extends DecisionMethod {
    Execute(table: Alternative[]): [string, number];
}
export declare class Hurwitz extends DecisionMethod {
    Execute(table: Alternative[]): [string, number];
}
