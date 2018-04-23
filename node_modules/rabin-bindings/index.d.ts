export function Rabin(): IRabin

export interface IRabin {
  configure(avgBits: number, min: number, max:  number): void

  fingerprint(inBuffers: Array<Buffer>, outSizes: Array<number>): void
}