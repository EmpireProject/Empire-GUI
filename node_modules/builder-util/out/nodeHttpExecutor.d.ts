/// <reference types="node" />
import { DownloadOptions, HttpExecutor } from "builder-util-runtime";
import { ClientRequest } from "http";
export declare class NodeHttpExecutor extends HttpExecutor<ClientRequest> {
    private httpsAgentPromise;
    download(url: string, destination: string, options?: DownloadOptions): Promise<string>;
    doRequest(options: any, callback: (response: any) => void): any;
}
export declare const httpExecutor: NodeHttpExecutor;
