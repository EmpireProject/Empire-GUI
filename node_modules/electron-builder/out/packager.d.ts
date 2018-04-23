/// <reference types="node" />
import { DebugLogger, TmpDir } from "builder-util";
import { CancellationToken } from "builder-util-runtime";
import { EventEmitter } from "events";
import { Lazy } from "lazy-val";
import { AppInfo } from "./appInfo";
import { AfterPackContext, Configuration } from "./configuration";
import { Platform, SourceRepositoryInfo, Target } from "./core";
import { Metadata } from "./options/metadata";
import { ArtifactCreated, PackagerOptions } from "./packagerApi";
import { Dependency } from "./util/packageDependencies";
export declare class Packager {
    readonly cancellationToken: CancellationToken;
    readonly projectDir: string;
    appDir: string;
    metadata: Metadata;
    private _isPrepackedAppAsar;
    readonly isPrepackedAppAsar: boolean;
    devMetadata: Metadata;
    private _configuration;
    readonly config: Configuration;
    isTwoPackageJsonProjectLayoutUsed: boolean;
    readonly eventEmitter: EventEmitter;
    appInfo: AppInfo;
    readonly tempDirManager: TmpDir;
    private _repositoryInfo;
    private readonly afterPackHandlers;
    readonly options: PackagerOptions;
    readonly debugLogger: DebugLogger;
    readonly repositoryInfo: Promise<SourceRepositoryInfo | null>;
    private _productionDeps;
    readonly productionDeps: Lazy<Array<Dependency>>;
    constructor(options: PackagerOptions, cancellationToken: CancellationToken);
    addAfterPackHandler(handler: (context: AfterPackContext) => Promise<any> | null): void;
    artifactCreated(handler: (event: ArtifactCreated) => void): Packager;
    dispatchArtifactCreated(event: ArtifactCreated): void;
    build(): Promise<BuildResult>;
    private readProjectMetadataIfTwoPackageStructureOrPrepacked(appPackageFile);
    private doBuild(outDir);
    private createHelper(platform);
    private installAppDependencies(platform, arch);
    afterPack(context: AfterPackContext): Promise<any>;
}
export declare function normalizePlatforms(rawPlatforms: Array<string | Platform> | string | Platform | null | undefined): Array<Platform>;
export interface BuildResult {
    readonly outDir: string;
    readonly platformToTargets: Map<Platform, Map<string, Target>>;
}
