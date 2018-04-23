import BluebirdPromise from "bluebird-lst";
export declare function setPrinter(value: ((message: string) => void) | null): void;
export declare function warn(message: string): void;
export declare function log(message: string): void;
export declare function task(title: string, promise: BluebirdPromise<any> | Promise<any>): BluebirdPromise<any>;
