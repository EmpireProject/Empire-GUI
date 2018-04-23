export declare function getBinFromBintray(name: string, version: string, sha2: string): Promise<string>;
export declare function getBinFromGithub(name: string, version: string, checksum: string): Promise<string>;
export declare function getBin(name: string, dirName: string, url: string, checksum: string): Promise<string>;
