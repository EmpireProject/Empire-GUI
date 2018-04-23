import { Arch } from "builder-util";
import { Identity } from "../codeSign";
import { Target } from "../core";
import MacPackager from "../macPackager";
import { PkgOptions } from "../options/macOptions";
export declare class PkgTarget extends Target {
    private readonly packager;
    readonly outDir: string;
    readonly options: PkgOptions;
    constructor(packager: MacPackager, outDir: string);
    build(appPath: string, arch: Arch): Promise<any>;
    private customizeDistributionConfiguration(distInfoFile, appPath);
    private buildComponentPackage(appPath, outFile);
}
export declare function prepareProductBuildArgs(identity: Identity | null, keychain: string | null | undefined): Array<string>;
