import { CliOptions } from "../builder";
export interface ForgeOptions {
    readonly dir: string;
}
export declare function buildForge(forgeOptions: ForgeOptions, options: CliOptions): Promise<string[]>;
