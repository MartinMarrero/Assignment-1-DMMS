export interface Alternative {
    name: string;
    outcomes: {
        first: number;
        second: number;
    };
}
export declare function ParseTable(filename: string): Alternative[];
export declare function FormatDouble(value: number): string;
