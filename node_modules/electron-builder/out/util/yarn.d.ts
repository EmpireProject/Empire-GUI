import { Lazy } from "lazy-val";
import { Dependency } from "./packageDependencies";
export interface RebuildOptions {
    frameworkInfo: DesktopFrameworkInfo;
    productionDeps?: Lazy<Array<Dependency>>;
    platform?: string;
    arch?: string;
    buildFromSource?: boolean;
    additionalArgs?: Array<string> | null;
}
