import { Arch } from "builder-util";
import { Target } from "../core";
import { WinPackager } from "../winPackager";
import { AppXOptions } from "../";
export default class AppXTarget extends Target {
    private readonly packager;
    readonly outDir: string;
    readonly options: AppXOptions;
    constructor(packager: WinPackager, outDir: string);
    build(appOutDir: string, arch: Arch): Promise<any>;
    private static computeUserAssets(vm, vendorPath, userAssetDir);
    private computePublisherName();
    private writeManifest(templatePath, outFile, arch, publisher, userAssets);
}
export declare function quoteString(s: string): string;
