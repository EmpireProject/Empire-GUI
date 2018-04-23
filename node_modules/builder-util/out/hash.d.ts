import BluebirdPromise from "bluebird-lst";
export declare function hashFile(file: string, algorithm?: string, encoding?: "base64" | "hex", options?: any): BluebirdPromise<string>;
