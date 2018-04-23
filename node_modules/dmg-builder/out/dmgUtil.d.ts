import { PackageBuilder } from "builder-util/out/api";
import { AsyncTaskManager } from "builder-util/out/asyncTaskManager";
export declare function getDmgTemplatePath(): string;
export declare function getDmgVendorPath(): string;
export declare function attachAndExecute(dmgPath: string, readWrite: boolean, task: () => Promise<any>): Promise<any>;
export declare function detach(name: string): Promise<void>;
export declare function computeBackgroundColor(rawValue: string): any;
export declare function computeBackground(packager: PackageBuilder): Promise<string>;
export declare function applyProperties(entries: any, env: any, asyncTaskManager: AsyncTaskManager, packager: PackageBuilder): Promise<void>;
