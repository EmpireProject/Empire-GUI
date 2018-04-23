/// <reference types="node" />
/**
 * We use not solid archive. Folder represent the packed stream. It means, that if we have 117 files (regular files, not directories), we will have 117 folders.
 *
 * Each folder has 1-n packed streams. Even for non-solid archive. For our purposes indices in the packedStreams is not required, only count of packed streams is important.
 * Because packed streams for folder located in series (grouped).
 */
export declare class Folder {
    hasCrc: boolean;
    crc: number;
    totalInputStreams: number;
    totalOutputStreams: number;
    unpackSizes: Array<number>;
    coders: Array<Coder>;
    bindPairs: Array<BindPair>;
    packedStreams: Array<number>;
    numUnpackSubStreams: number;
    firstPackedStreamIndex: number;
    findBindPairForInStream(index: number): number;
    private findBindPairForOutStream(index);
    getUnpackSize(): number;
    getPackedSize(): number;
}
export declare class BindPair {
    inIndex: number;
    outIndex: number;
    toString(): string;
}
export declare class Coder {
    decompressionMethodId: Buffer;
    numInStreams: number;
    numOutStreams: number;
    properties: Buffer;
}
