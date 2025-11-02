export type ComputeHandler = (csv: string, method: string, opts?: any) => void;
export interface MethodResult {
    method: string;
    name: string;
    value: number;
}
export declare class DecisionController {
    private onResult;
    constructor(onResult: (results: MethodResult[]) => void);
    handleCompute(csv: string, method: string, opts?: any): void;
    private executeHurwitz;
    private parseCSV;
}
