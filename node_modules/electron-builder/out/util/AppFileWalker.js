"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppFileWalker = undefined;

var _path = _interopRequireWildcard(require("path"));

var _NodeModuleCopyHelper;

function _load_NodeModuleCopyHelper() {
    return _NodeModuleCopyHelper = require("./NodeModuleCopyHelper");
}

var _packageDependencies;

function _load_packageDependencies() {
    return _packageDependencies = require("./packageDependencies");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const nodeModulesSystemDependentSuffix = `${_path.sep}node_modules`;
function addAllPatternIfNeed(matcher) {
    if (!matcher.isSpecifiedAsEmptyArray && (matcher.isEmpty() || matcher.containsOnlyIgnore())) {
        matcher.prependPattern("**/*");
    }
    return matcher;
}
/** @internal */
class AppFileWalker extends (_NodeModuleCopyHelper || _load_NodeModuleCopyHelper()).NodeModuleCopyHelper {
    constructor(matcher, packager) {
        super(addAllPatternIfNeed(matcher), packager);
        this.isNodeModulesHandled = false;
    }
    // noinspection JSUnusedGlobalSymbols
    consume(file, fileStat, parent, siblingNames) {
        if (fileStat.isDirectory()) {
            // https://github.com/electron-userland/electron-builder/issues/1539
            // but do not filter if we inside node_modules dir
            if (file.endsWith(nodeModulesSystemDependentSuffix) && !parent.includes("node_modules") && siblingNames.includes("package.json")) {
                return this.handleNodeModulesDir(file, parent);
            }
        } else {
            // save memory - no need to store stat for directory
            this.metadata.set(file, fileStat);
        }
        return this.handleFile(file, fileStat);
    }
    handleNodeModulesDir(nodeModulesDir, parent) {
        const packager = this.packager;
        const isMainNodeModules = parent === packager.appDir;
        if (isMainNodeModules) {
            this.isNodeModulesHandled = true;
        }
        return (isMainNodeModules ? packager.productionDeps.value : (0, (_packageDependencies || _load_packageDependencies()).getProductionDependencies)(parent)).then(it => {
            if (packager.debugLogger.enabled) {
                packager.debugLogger.add(`productionDependencies.${parent}`, it.filter(it => it.path.startsWith(nodeModulesDir)).map(it => _path.relative(nodeModulesDir, it.path)));
            }
            return this.collectNodeModules(it);
        });
    }
}
exports.AppFileWalker = AppFileWalker; //# sourceMappingURL=AppFileWalker.js.map