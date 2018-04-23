import { Arch } from "builder-util";
import { Target } from "../core";
import MacPackager from "../macPackager";
import { DmgOptions } from "../options/macOptions";
export declare class DmgTarget extends Target {
    private readonly packager;
    readonly outDir: string;
    readonly options: DmgOptions;
    constructor(packager: MacPackager, outDir: string);
    build(appPath: string, arch: Arch): Promise<void>;
    private signDmg(artifactPath);
    computeVolumeName(custom?: string | null): string;
    computeDmgOptions(): Promise<DmgOptions>;
}
