import { AfterPackContext } from "./configuration";
import { Platform, Target } from "./core";
import { LinuxConfiguration } from "./options/linuxOptions";
import { Packager } from "./packager";
import { PlatformPackager } from "./platformPackager";
export declare class LinuxPackager extends PlatformPackager<LinuxConfiguration> {
    readonly executableName: string;
    constructor(info: Packager);
    readonly defaultTarget: Array<string>;
    createTargets(targets: Array<string>, mapper: (name: string, factory: (outDir: string) => Target) => void): void;
    readonly platform: Platform;
    protected postInitApp(packContext: AfterPackContext): Promise<any>;
}
