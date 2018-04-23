/// <reference types="node" />
import { FileCopier } from "builder-util/out/fs";
import { Stats } from "fs-extra-p";
export declare function copyFileOrData(fileCopier: FileCopier, data: string | Buffer | undefined | null, source: string, destination: string, stats: Stats): Promise<void>;
