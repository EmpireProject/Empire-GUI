import { LinuxPackager } from "../linuxPackager";
import { LinuxConfiguration, LinuxTargetSpecificOptions } from "../options/linuxOptions";
export declare const installPrefix = "/opt";
export interface IconInfo {
    file: string;
    size: number;
}
export declare class LinuxTargetHelper {
    private packager;
    readonly icons: Promise<Array<IconInfo>>;
    maxIconPath: string | null;
    constructor(packager: LinuxPackager);
    private computeDesktopIcons();
    private iconsFromDir(iconDir);
    private getIcns();
    getDescription(options: LinuxConfiguration): string;
    writeDesktopEntry(targetSpecificOptions: LinuxTargetSpecificOptions, exec?: string, destination?: string | null, extra?: {
        [key: string]: string;
    }): Promise<string>;
    computeDesktopEntry(targetSpecificOptions: LinuxTargetSpecificOptions, exec?: string, extra?: {
        [key: string]: string;
    }): Promise<string>;
    private createFromIcns(tempDir);
    private createMappings(tempDir);
}
