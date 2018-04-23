"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CopyElevateHelper = exports.AppPackageHelper = exports.NSIS_PATH = exports.nsisTemplatesDir = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _pathManager;

function _load_pathManager() {
    return _pathManager = require("../../util/pathManager");
}

var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _path = _interopRequireWildcard(require("path"));

var _lazyVal;

function _load_lazyVal() {
    return _lazyVal = require("lazy-val");
}

var _binDownload;

function _load_binDownload() {
    return _binDownload = require("builder-util/out/binDownload");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nsisTemplatesDir = exports.nsisTemplatesDir = (0, (_pathManager || _load_pathManager()).getTemplatePath)("nsis");
// noinspection SpellCheckingInspection
const NSIS_PATH = exports.NSIS_PATH = new (_lazyVal || _load_lazyVal()).Lazy(() => (0, (_binDownload || _load_binDownload()).getBinFromGithub)("nsis", "3.0.1.13", "2921dd404ce9b69679088a6f1409a56dd360da2077fe1019573c0712c9edf057"));
class AppPackageHelper {
    constructor(elevateHelper) {
        this.elevateHelper = elevateHelper;
        this.archToFileInfo = new Map();
        this.infoToIsDelete = new Map();
        /** @private */
        this.refCount = 0;
    }
    packArch(arch, target) {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            let infoPromise = _this.archToFileInfo.get(arch);
            if (infoPromise == null) {
                const appOutDir = target.archs.get(arch);
                infoPromise = _this.elevateHelper.copy(appOutDir, target).then(function () {
                    return target.buildAppPackage(appOutDir, arch);
                });
                _this.archToFileInfo.set(arch, infoPromise);
            }
            const info = yield infoPromise;
            if (target.isWebInstaller) {
                _this.infoToIsDelete.set(info, false);
            } else if (!_this.infoToIsDelete.has(info)) {
                _this.infoToIsDelete.set(info, true);
            }
            return info;
        })();
    }
    finishBuild() {
        var _this2 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if (--_this2.refCount > 0) {
                return;
            }
            const filesToDelete = [];
            for (const [info, isDelete] of _this2.infoToIsDelete.entries()) {
                if (isDelete) {
                    filesToDelete.push(info.path);
                }
            }
            yield (_bluebirdLst2 || _load_bluebirdLst2()).default.map(filesToDelete, function (it) {
                return (0, (_fsExtraP || _load_fsExtraP()).unlink)(it);
            });
        })();
    }
}
exports.AppPackageHelper = AppPackageHelper;
class CopyElevateHelper {
    constructor() {
        this.copied = new Map();
    }
    copy(appOutDir, target) {
        let isPackElevateHelper = target.options.packElevateHelper;
        if (isPackElevateHelper === false && target.options.perMachine === true) {
            isPackElevateHelper = true;
            (0, (_builderUtil || _load_builderUtil()).warn)("`packElevateHelper = false` is ignored, because `perMachine` is set to `true`");
        }
        if (isPackElevateHelper === false) {
            return (_bluebirdLst2 || _load_bluebirdLst2()).default.resolve();
        }
        let promise = this.copied.get(appOutDir);
        if (promise != null) {
            return promise;
        }
        promise = NSIS_PATH.value.then(it => (0, (_fs || _load_fs()).copyFile)(_path.join(it, "elevate.exe"), _path.join(appOutDir, "resources", "elevate.exe"), false));
        this.copied.set(appOutDir, promise);
        return promise;
    }
}
exports.CopyElevateHelper = CopyElevateHelper; //# sourceMappingURL=nsisUtil.js.map