import { Target } from "../core";
import { Arch } from "builder-util";
export declare class StageDir {
    readonly tempDir: string;
    constructor(tempDir: string);
    getTempFile(name: string): string;
    cleanup(): Promise<void>;
}
export declare function createHelperDir(target: Target, arch: Arch): Promise<StageDir>;
