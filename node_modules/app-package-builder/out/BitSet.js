"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const SHIFTS_OF_A_WORD = 5;
const ADDRESS_BITS_PER_WORD = 6;
class BitSet {
    constructor(nbits) {
        this.words = new Array(wordIndex(nbits - 1) + 1);
    }
    clear(bitIndex) {
        const which = whichWord(bitIndex);
        return this.words[which] = this.words[which] & ~mask(bitIndex);
    }
    set(bitIndex) {
        if (bitIndex < 0) {
            throw new Error(`bitIndex < 0: ${bitIndex}`);
        }
        const which = whichWord(bitIndex);
        return this.words[which] = this.words[which] | mask(bitIndex);
    }
    get(bitIndex) {
        const wordIndex = whichWord(bitIndex);
        return wordIndex < this.words.length && (this.words[wordIndex] & mask(bitIndex)) !== 0;
    }
    cardinality() {
        let next;
        let sum = 0;
        const arrOfWords = this.words;
        const maxWords = this.words.length;
        for (next = 0; next < maxWords; next += 1) {
            const nextWord = arrOfWords[next] || 0;
            //this loops only the number of set bits, not 32 constant all the time!
            for (let bits = nextWord; bits !== 0; bits &= bits - 1) {
                sum += 1;
            }
        }
        return sum;
    }
}
exports.BitSet = BitSet;
function wordIndex(bitIndex) {
    return bitIndex >> ADDRESS_BITS_PER_WORD;
}
/**
 * @return {Number} the index at the words array
 */
function whichWord(bitIndex) {
    return bitIndex >> SHIFTS_OF_A_WORD;
}
/**
 * @return {Number} a bit mask of 32 bits, 1 bit set at pos % 32, the rest being 0
 */
function mask(bitIndex) {
    return 1 << (bitIndex & 31);
}
//# sourceMappingURL=BitSet.js.map