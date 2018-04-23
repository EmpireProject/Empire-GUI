export declare class BitSet {
    private readonly words;
    constructor(nbits: number);
    clear(bitIndex: number): number;
    set(bitIndex: number): number;
    get(bitIndex: number): boolean;
    cardinality(): number;
}
