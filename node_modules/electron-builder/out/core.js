"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DIR_TARGET = exports.DEFAULT_TARGET = exports.Target = exports.Platform = undefined;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

class Platform {
    constructor(name, buildConfigurationKey, nodeName) {
        this.name = name;
        this.buildConfigurationKey = buildConfigurationKey;
        this.nodeName = nodeName;
    }
    toString() {
        return this.name;
    }
    createTarget(type, ...archs) {
        if (type == null && (archs == null || archs.length === 0)) {
            return new Map([[this, new Map()]]);
        }
        const archToType = new Map();
        if (this === Platform.MAC) {
            archs = [(_builderUtil || _load_builderUtil()).Arch.x64];
        }
        for (const arch of archs == null || archs.length === 0 ? [(0, (_builderUtil || _load_builderUtil()).archFromString)(process.arch)] : archs) {
            archToType.set(arch, type == null ? [] : Array.isArray(type) ? type : [type]);
        }
        return new Map([[this, archToType]]);
    }
    static current() {
        return Platform.fromString(process.platform);
    }
    static fromString(name) {
        name = name.toLowerCase();
        switch (name) {
            case Platform.MAC.nodeName:
            case Platform.MAC.name:
                return Platform.MAC;
            case Platform.WINDOWS.nodeName:
            case Platform.WINDOWS.name:
            case Platform.WINDOWS.buildConfigurationKey:
                return Platform.WINDOWS;
            case Platform.LINUX.nodeName:
                return Platform.LINUX;
            default:
                throw new Error(`Unknown platform: ${name}`);
        }
    }
}
exports.Platform = Platform;
Platform.MAC = new Platform("mac", "mac", "darwin");
Platform.LINUX = new Platform("linux", "linux", "linux");
Platform.WINDOWS = new Platform("windows", "win", "win32");
// deprecated
//noinspection JSUnusedGlobalSymbols
Platform.OSX = Platform.MAC;
class Target {
    constructor(name, isAsyncSupported = true) {
        this.name = name;
        this.isAsyncSupported = isAsyncSupported;
    }
    finishBuild() {
        return Promise.resolve();
    }
}
exports.Target = Target;
const DEFAULT_TARGET = exports.DEFAULT_TARGET = "default";
const DIR_TARGET = exports.DIR_TARGET = "dir";
//# sourceMappingURL=core.js.map