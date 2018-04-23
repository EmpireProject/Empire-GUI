"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ELECTRON_COMPILE_SHIM_FILENAME = exports.computeFileSets = exports.NODE_MODULES_PATTERN = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

let computeFileSets = exports.computeFileSets = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (matchers, transformer, packager, isElectronCompile) {
        const fileSets = [];
        let hoistedNodeModuleFileSets = null;
        let isHoistedNodeModuleChecked = false;
        for (const matcher of matchers) {
            const fileWalker = new (_AppFileWalker || _load_AppFileWalker()).AppFileWalker(matcher, packager);
            const fromStat = yield (0, (_fs || _load_fs()).statOrNull)(matcher.from);
            if (fromStat == null) {
                (0, (_builderUtil || _load_builderUtil()).debug)(`Directory ${matcher.from} doesn't exists, skip file copying`);
                continue;
            }
            const files = yield (0, (_fs || _load_fs()).walk)(matcher.from, fileWalker.filter, fileWalker);
            const metadata = fileWalker.metadata;
            // https://github.com/electron-userland/electron-builder/issues/2205 Support for hoisted node_modules (lerna + yarn workspaces)
            // if no node_modules in the app dir, it means that probably dependencies are hoisted
            // check that main node_modules doesn't exist in addition to isNodeModulesHandled because isNodeModulesHandled will be false if node_modules dir is ignored by filter
            // here isNodeModulesHandled is required only because of performance reasons (avoid stat call)
            if (!isHoistedNodeModuleChecked && matcher.from === packager.appDir && !fileWalker.isNodeModulesHandled) {
                isHoistedNodeModuleChecked = true;
                if ((yield (0, (_fs || _load_fs()).statOrNull)(_path.join(packager.appDir, "node_modules"))) == null) {
                    // in the prepacked mode no package.json
                    const packageJsonStat = yield (0, (_fs || _load_fs()).statOrNull)(_path.join(packager.appDir, "package.json"));
                    if (packageJsonStat != null && packageJsonStat.isFile()) {
                        hoistedNodeModuleFileSets = yield copyHoistedNodeModules(packager, matcher);
                    }
                }
            }
            const transformedFiles = new Map();
            yield (_bluebirdLst2 || _load_bluebirdLst2()).default.filter(files, function (it, index) {
                const fileStat = metadata.get(it);
                if (fileStat == null || !fileStat.isFile()) {
                    return false;
                }
                const transformedValue = transformer(it);
                if (transformedValue == null) {
                    return false;
                }
                if (typeof transformedValue === "object" && "then" in transformedValue) {
                    return transformedValue.then(function (it) {
                        if (it != null) {
                            transformedFiles.set(index, it);
                        }
                        return false;
                    });
                }
                transformedFiles.set(index, transformedValue);
                return false;
            }, (_fs || _load_fs()).CONCURRENCY);
            fileSets.push({ src: matcher.from, files, metadata, transformedFiles, destination: matcher.to });
        }
        if (isElectronCompile) {
            // cache files should be first (better IO)
            fileSets.unshift((yield compileUsingElectronCompile(fileSets[0], packager)));
        }
        if (hoistedNodeModuleFileSets != null) {
            return fileSets.concat(hoistedNodeModuleFileSets);
        }
        return fileSets;
    });

    return function computeFileSets(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
})();

let copyHoistedNodeModules = (() => {
    var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (packager, mainMatcher) {
        const productionDeps = yield packager.productionDeps.value;
        const rootPathToCopier = new Map();
        for (const dep of productionDeps) {
            const root = dep.path.substring(0, dep.path.indexOf(NODE_MODULES_PATTERN));
            let list = rootPathToCopier.get(root);
            if (list == null) {
                list = [];
                rootPathToCopier.set(root, list);
            }
            list.push(dep);
        }
        // mapSeries instead of map because copyNodeModules is concurrent and so, no need to increase queue/pressure
        return yield (_bluebirdLst2 || _load_bluebirdLst2()).default.mapSeries(rootPathToCopier.keys(), (() => {
            var _ref3 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (source) {
                // use main matcher patterns, so, user can exclude some files in such hoisted node modules
                const matcher = new (_fileMatcher || _load_fileMatcher()).FileMatcher(source, mainMatcher.to, mainMatcher.macroExpander, mainMatcher.patterns);
                const copier = new (_NodeModuleCopyHelper || _load_NodeModuleCopyHelper()).NodeModuleCopyHelper(matcher, packager);
                const files = yield copier.collectNodeModules(rootPathToCopier.get(source));
                return { src: matcher.from, destination: matcher.to, files, metadata: copier.metadata };
            });

            return function (_x7) {
                return _ref3.apply(this, arguments);
            };
        })());
    });

    return function copyHoistedNodeModules(_x5, _x6) {
        return _ref2.apply(this, arguments);
    };
})();

let compileUsingElectronCompile = (() => {
    var _ref4 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (mainFileSet, packager) {
        (0, (_builderUtil || _load_builderUtil()).log)("Compiling using electron-compile");
        const electronCompileCache = yield packager.tempDirManager.getTempDir({ prefix: "electron-compile-cache" });
        const cacheDir = _path.join(electronCompileCache, ".cache");
        // clear and create cache dir
        yield (0, (_fsExtraP || _load_fsExtraP()).ensureDir)(cacheDir);
        const compilerHost = yield (0, (_fileTransformer || _load_fileTransformer()).createElectronCompilerHost)(mainFileSet.src, cacheDir);
        const nextSlashIndex = mainFileSet.src.length + 1;
        // pre-compute electron-compile to cache dir - we need to process only subdirectories, not direct files of app dir
        yield (_bluebirdLst2 || _load_bluebirdLst2()).default.map(mainFileSet.files, function (file) {
            if (file.includes(NODE_MODULES_PATTERN) || file.includes(BOWER_COMPONENTS_PATTERN) || !file.includes(_path.sep, nextSlashIndex) // ignore not root files
            || !mainFileSet.metadata.get(file).isFile()) {
                return null;
            }
            return compilerHost.compile(file).then(function () {
                return null;
            });
        }, (_fs || _load_fs()).CONCURRENCY);
        yield compilerHost.saveConfiguration();
        const metadata = new Map();
        const cacheFiles = yield (0, (_fs || _load_fs()).walk)(cacheDir, function (file) {
            return !file.startsWith(".");
        }, {
            consume: function (file, fileStat) {
                if (fileStat.isFile()) {
                    metadata.set(file, fileStat);
                }
                return null;
            }
        });
        // add shim
        const shimPath = `${mainFileSet.src}/${ELECTRON_COMPILE_SHIM_FILENAME}`;
        mainFileSet.files.push(shimPath);
        mainFileSet.metadata.set(shimPath, { isFile: function () {
                return true;
            }, isDirectory: function () {
                return false;
            } });
        if (mainFileSet.transformedFiles == null) {
            mainFileSet.transformedFiles = new Map();
        }
        mainFileSet.transformedFiles.set(mainFileSet.files.length - 1, `
'use strict';
require('electron-compile').init(__dirname, require('path').resolve(__dirname, '${packager.metadata.main || "index"}'), true);
`);
        return { src: electronCompileCache, files: cacheFiles, metadata, destination: mainFileSet.destination };
    });

    return function compileUsingElectronCompile(_x8, _x9) {
        return _ref4.apply(this, arguments);
    };
})();
// sometimes, destination may not contain path separator in the end (path to folder), but the src does. So let's ensure paths have path separators in the end


exports.ensureEndSlash = ensureEndSlash;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _path = _interopRequireWildcard(require("path"));

var _fileMatcher;

function _load_fileMatcher() {
    return _fileMatcher = require("../fileMatcher");
}

var _fileTransformer;

function _load_fileTransformer() {
    return _fileTransformer = require("../fileTransformer");
}

var _AppFileWalker;

function _load_AppFileWalker() {
    return _AppFileWalker = require("./AppFileWalker");
}

var _NodeModuleCopyHelper;

function _load_NodeModuleCopyHelper() {
    return _NodeModuleCopyHelper = require("./NodeModuleCopyHelper");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @internal */
const NODE_MODULES_PATTERN = exports.NODE_MODULES_PATTERN = `${_path.sep}node_modules${_path.sep}`;

const BOWER_COMPONENTS_PATTERN = `${_path.sep}bower_components${_path.sep}`;
/** @internal */
const ELECTRON_COMPILE_SHIM_FILENAME = exports.ELECTRON_COMPILE_SHIM_FILENAME = "__shim.js";
function ensureEndSlash(s) {
    return s === "" || s.endsWith(_path.sep) ? s : s + _path.sep;
}
//# sourceMappingURL=AppFileCopierHelper.js.map