"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

let modifyMainPackageJson = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (file, extraMetadata) {
        const mainPackageData = yield (0, (_fsExtraP || _load_fsExtraP()).readJson)(file);
        if (extraMetadata != null) {
            (0, (_deepAssign || _load_deepAssign()).deepAssign)(mainPackageData, extraMetadata);
        }
        // https://github.com/electron-userland/electron-builder/issues/1212
        const serializedDataIfChanged = cleanupPackageJson(mainPackageData, true);
        if (serializedDataIfChanged != null) {
            return serializedDataIfChanged;
        } else if (extraMetadata != null) {
            return JSON.stringify(mainPackageData, null, 2);
        }
        return null;
    });

    return function modifyMainPackageJson(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=fileTransformer.js.map


exports.isElectronCompileUsed = isElectronCompileUsed;
exports.hasDep = hasDep;
exports.createTransformer = createTransformer;
exports.createElectronCompilerHost = createElectronCompilerHost;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _path = _interopRequireWildcard(require("path"));

var _deepAssign;

function _load_deepAssign() {
    return _deepAssign = require("read-config-file/out/deepAssign");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/** @internal */
function isElectronCompileUsed(info) {
    if (info.config.electronCompile != null) {
        return info.config.electronCompile;
    }
    // if in devDependencies - it means that babel is used for precompilation or for some reason user decided to not use electron-compile for production
    return hasDep("electron-compile", info);
}
/** @internal */
function hasDep(name, info) {
    const deps = info.metadata.dependencies;
    return deps != null && name in deps;
}
/** @internal */
function createTransformer(srcDir, extraMetadata) {
    const mainPackageJson = _path.join(srcDir, "package.json");
    return file => {
        if (file === mainPackageJson) {
            return modifyMainPackageJson(file, extraMetadata);
        } else if (file.endsWith("/package.json") && file.includes("/node_modules/")) {
            return (0, (_fsExtraP || _load_fsExtraP()).readJson)(file).then(it => cleanupPackageJson(it, false)).catch(e => (0, (_builderUtil || _load_builderUtil()).warn)(e));
        } else {
            return null;
        }
    };
}
/** @internal */
function createElectronCompilerHost(projectDir, cacheDir) {
    const electronCompilePath = _path.join(projectDir, "node_modules", "electron-compile", "lib");
    return require(_path.join(electronCompilePath, "config-parser")).createCompilerHostFromProjectRoot(projectDir, cacheDir);
}
const ignoredPackageMetadataProperties = new Set(["dist", "gitHead", "keywords", "build", "scripts", "jspm", "ava", "xo", "nyc", "eslintConfig"]);
function cleanupPackageJson(data, isMain) {
    const deps = data.dependencies;
    // https://github.com/electron-userland/electron-builder/issues/507#issuecomment-312772099
    const isRemoveBabel = deps != null && typeof deps === "object" && !Object.getOwnPropertyNames(deps).some(it => it.startsWith("babel"));
    try {
        let changed = false;
        for (const prop of Object.getOwnPropertyNames(data)) {
            // removing devDependencies from package.json breaks levelup in electron, so, remove it only from main package.json
            if (prop[0] === "_" || ignoredPackageMetadataProperties.has(prop) || isMain && prop === "devDependencies" || isRemoveBabel && prop === "babel") {
                delete data[prop];
                changed = true;
            }
        }
        if (changed) {
            return JSON.stringify(data, null, 2);
        }
    } catch (e) {
        (0, (_builderUtil || _load_builderUtil()).debug)(e);
    }
    return null;
}