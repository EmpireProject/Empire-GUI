/// <reference types="node" />
export declare class LittleEndianBuffer {
    private readonly buffer;
    private index;
    constructor(buffer: Buffer, index?: number);
    /**
     * Creates a new byte buffer whose content is a shared subsequence of this buffer's content.
     */
    slice(): Buffer;
    readByte(): number;
    readUnsignedByte(): number;
    readLong(): number;
    readInt(): number;
    readUnsignedInt(): number;
    get(dst: Buffer): void;
    skip(count: number): void;
    remaining(): number;
}
