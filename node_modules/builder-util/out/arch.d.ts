export declare enum Arch {
    ia32 = 0,
    x64 = 1,
    armv7l = 2,
}
export declare function toLinuxArchString(arch: Arch): "i386" | "amd64" | "armv7l";
export declare type ArchType = "x64" | "ia32" | "armv7l";
export declare function getArchSuffix(arch: Arch): string;
export declare function archFromString(name: string): Arch;
