import { Arch, AsyncTaskManager } from "builder-util";
import { SignOptions } from "electron-osx-sign";
import { AppInfo } from "./appInfo";
import { CodeSigningInfo, Identity } from "./codeSign";
import { Platform, Target } from "./core";
import { MacConfiguration } from "./options/macOptions";
import { Packager } from "./packager";
import { PlatformPackager } from "./platformPackager";
export default class MacPackager extends PlatformPackager<MacConfiguration> {
    readonly codeSigningInfo: Promise<CodeSigningInfo>;
    constructor(info: Packager);
    readonly defaultTarget: Array<string>;
    protected prepareAppInfo(appInfo: AppInfo): AppInfo;
    getIconPath(): Promise<string | null>;
    createTargets(targets: Array<string>, mapper: (name: string, factory: (outDir: string) => Target) => void): void;
    readonly platform: Platform;
    pack(outDir: string, arch: Arch, targets: Array<Target>, taskManager: AsyncTaskManager): Promise<any>;
    private sign(appPath, outDir, masOptions);
    private adjustSignOptions(signOptions, masOptions);
    protected doSign(opts: SignOptions): Promise<any>;
    protected doFlat(appPath: string, outFile: string, identity: Identity, keychain: string | null | undefined): Promise<any>;
    getElectronSrcDir(dist: string): string;
    getElectronDestinationDir(appOutDir: string): string;
}
