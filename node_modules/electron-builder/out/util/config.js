"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.computeDefaultAppDirectory = exports.validateConfig = exports.getConfig = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

/** @internal */
let getConfig = exports.getConfig = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (projectDir, configPath, configFromOptions, packageMetadata = new (_lazyVal || _load_lazyVal()).Lazy(function () {
        return (0, (_readConfigFile || _load_readConfigFile()).orNullIfFileNotExist)((0, (_fsExtraP || _load_fsExtraP()).readJson)(_path.join(projectDir, "package.json")));
    })) {
        const configRequest = { packageKey: "build", configFilename: "electron-builder", projectDir, packageMetadata, log: (_builderUtil || _load_builderUtil()).log };
        const config = yield (0, (_readConfigFile || _load_readConfigFile()).getConfig)(configRequest, configPath);
        if (configFromOptions != null) {
            mergePublish(config, configFromOptions);
        }
        let extendsSpec = config.extends;
        if (extendsSpec == null && extendsSpec !== null) {
            const devDependencies = ((yield packageMetadata.value) || {}).devDependencies;
            if (devDependencies != null) {
                if ("react-scripts" in devDependencies) {
                    extendsSpec = "react-cra";
                    config.extends = extendsSpec;
                } else if ("electron-webpack" in devDependencies) {
                    extendsSpec = "electron-webpack/electron-builder.yml";
                    config.extends = extendsSpec;
                }
            }
        }
        if (extendsSpec == null) {
            return config;
        }
        let parentConfig;
        if (extendsSpec === "react-cra") {
            parentConfig = yield (0, (_rectCra || _load_rectCra()).reactCra)(projectDir);
        } else {
            parentConfig = yield (0, (_readConfigFile || _load_readConfigFile()).loadParentConfig)(configRequest, extendsSpec);
        }
        // electron-webpack and electrify client config - want to exclude some files
        // we add client files configuration to main parent file matcher
        if (parentConfig.files != null && config.files != null && (Array.isArray(config.files) || typeof config.files === "string") && Array.isArray(parentConfig.files) && parentConfig.files.length > 0) {
            const mainFileSet = parentConfig.files[0];
            if (typeof mainFileSet === "object" && (mainFileSet.from == null || mainFileSet.from === ".")) {
                mainFileSet.filter = (0, (_builderUtil || _load_builderUtil()).asArray)(mainFileSet.filter);
                mainFileSet.filter.push(...(0, (_builderUtil || _load_builderUtil()).asArray)(config.files));
                delete config.files;
            }
        }
        return (0, (_deepAssign || _load_deepAssign()).deepAssign)(parentConfig, config);
    });

    return function getConfig(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

/** @internal */
let validateConfig = exports.validateConfig = (() => {
    var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (config, debugLogger) {
        const extraMetadata = config.extraMetadata;
        if (extraMetadata != null) {
            if (extraMetadata.build != null) {
                throw new Error(`--em.build is deprecated, please specify as -c"`);
            }
            if (extraMetadata.directories != null) {
                throw new Error(`--em.directories is deprecated, please specify as -c.directories"`);
            }
        }
        // noinspection JSDeprecatedSymbols
        if (config.npmSkipBuildFromSource === false) {
            config.buildDependenciesFromSource = false;
        }
        yield (0, (_readConfigFile || _load_readConfigFile()).validateConfig)(config, schemeDataPromise, function (message, errors) {
            if (debugLogger.enabled) {
                debugLogger.add("invalidConfig", JSON.stringify(errors, null, 2));
            }
            return `${message}

How to fix:
1. Open https://electron.build/configuration/configuration
2. Search the option name on the page.
  * Not found? The option was deprecated or not exists (check spelling).
  * Found? Check that the option in the appropriate place. e.g. "title" only in the "dmg", not in the root.
`;
        });
    });

    return function validateConfig(_x4, _x5) {
        return _ref2.apply(this, arguments);
    };
})();

/** @internal */
let computeDefaultAppDirectory = exports.computeDefaultAppDirectory = (() => {
    var _ref3 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (projectDir, userAppDir) {
        if (userAppDir != null) {
            const absolutePath = _path.resolve(projectDir, userAppDir);
            const stat = yield (0, (_fs || _load_fs()).statOrNull)(absolutePath);
            if (stat == null) {
                throw new Error(`Application directory ${userAppDir} doesn't exists`);
            } else if (!stat.isDirectory()) {
                throw new Error(`Application directory ${userAppDir} is not a directory`);
            } else if (projectDir === absolutePath) {
                (0, (_builderUtil || _load_builderUtil()).warn)(`Specified application directory "${userAppDir}" equals to project dir — superfluous or wrong configuration`);
            }
            return absolutePath;
        }
        for (const dir of DEFAULT_APP_DIR_NAMES) {
            const absolutePath = _path.join(projectDir, dir);
            const packageJson = _path.join(absolutePath, "package.json");
            const stat = yield (0, (_fs || _load_fs()).statOrNull)(packageJson);
            if (stat != null && stat.isFile()) {
                return absolutePath;
            }
        }
        return projectDir;
    });

    return function computeDefaultAppDirectory(_x6, _x7) {
        return _ref3.apply(this, arguments);
    };
})();
//# sourceMappingURL=config.js.map


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

var _lazyVal;

function _load_lazyVal() {
    return _lazyVal = require("lazy-val");
}

var _path = _interopRequireWildcard(require("path"));

var _readConfigFile;

function _load_readConfigFile() {
    return _readConfigFile = require("read-config-file");
}

var _deepAssign;

function _load_deepAssign() {
    return _deepAssign = require("read-config-file/out/deepAssign");
}

var _rectCra;

function _load_rectCra() {
    return _rectCra = require("../presets/rectCra");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://github.com/electron-userland/electron-builder/issues/1847
function mergePublish(config, configFromOptions) {
    // if config from disk doesn't have publish (or object), no need to handle, it will be simply merged by deepAssign
    const publish = Array.isArray(config.publish) ? configFromOptions.publish : null;
    if (publish != null) {
        delete configFromOptions.publish;
    }
    (0, (_deepAssign || _load_deepAssign()).deepAssign)(config, configFromOptions);
    if (publish == null) {
        return;
    }
    const listOnDisk = config.publish;
    if (listOnDisk.length === 0) {
        config.publish = publish;
    } else {
        // apply to first
        Object.assign(listOnDisk[0], publish);
    }
}
const schemeDataPromise = new (_lazyVal || _load_lazyVal()).Lazy(() => (0, (_fsExtraP || _load_fsExtraP()).readJson)(_path.join(__dirname, "..", "..", "scheme.json")));
const DEFAULT_APP_DIR_NAMES = ["app", "www"];