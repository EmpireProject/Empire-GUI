/// <reference types="node" />
import { Arch } from "builder-util";
import { GithubOptions } from "builder-util-runtime";
import { ClientRequest } from "http";
import { HttpPublisher, PublishContext, PublishOptions } from "./publisher";
export interface Release {
    id: number;
    tag_name: string;
    draft: boolean;
    prerelease: boolean;
    published_at: string;
    upload_url: string;
}
export declare class GitHubPublisher extends HttpPublisher {
    private readonly info;
    private readonly version;
    private readonly options;
    private tag;
    private _releasePromise;
    private readonly token;
    readonly providerName: string;
    private readonly releaseType;
    /** @private */
    readonly releasePromise: Promise<Release | null>;
    constructor(context: PublishContext, info: GithubOptions, version: string, options?: PublishOptions);
    private getOrCreateRelease();
    protected doUpload(fileName: string, arch: Arch, dataLength: number, requestProcessor: (request: ClientRequest, reject: (error: Error) => void) => void): Promise<any>;
    private createRelease();
    getRelease(): Promise<any>;
    deleteRelease(): Promise<any>;
    private githubRequest<T>(path, token, data?, method?);
    toString(): string;
}
