export type ComputeCallback = (csv: string, method: string, opts?: any) => void;
export interface MethodResult {
    method: string;
    name: string;
    value: number;
}
export declare class DecisionView {
    onCompute: ComputeCallback | null;
    private container;
    private textarea;
    private select;
    private hurwitzInput;
    private button;
    private output;
    constructor(container?: HTMLElement);
    private handleCompute;
    showResults(results: MethodResult[]): void;
}
