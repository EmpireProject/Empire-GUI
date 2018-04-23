import { Packager } from "../packager";
import { ResolvedFileSet } from "./AppFileCopierHelper";
export declare function getDestinationPath(file: string, fileSet: ResolvedFileSet): string;
export declare function copyAppFiles(fileSet: ResolvedFileSet, packager: Packager): Promise<void>;
