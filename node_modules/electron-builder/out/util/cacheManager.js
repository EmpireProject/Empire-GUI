"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.digest = exports.BuildCacheManager = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

let digest = exports.digest = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (hash, files) {
        // do not use pipe - better do bulk file read (https://github.com/yarnpkg/yarn/commit/7a63e0d23c46a4564bc06645caf8a59690f04d01)
        for (const content of yield (_bluebirdLst2 || _load_bluebirdLst2()).default.map(files, function (it) {
            return (0, (_fsExtraP || _load_fsExtraP()).readFile)(it);
        })) {
            hash.update(content);
        }
        hash.update(BuildCacheManager.VERSION);
        return hash.digest("base64");
    });

    return function digest(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=cacheManager.js.map


var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _promise;

function _load_promise() {
    return _promise = require("builder-util/out/promise");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BuildCacheManager {
    constructor(outDir, executableFile, arch) {
        this.executableFile = executableFile;
        this.cacheDir = _path.join(outDir, ".cache", (_builderUtil || _load_builderUtil()).Arch[arch]);
        this.cacheFile = _path.join(this.cacheDir, "app.exe");
        this.cacheInfoFile = _path.join(this.cacheDir, "info.json");
    }
    copyIfValid(digest) {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            _this.newDigest = digest;
            _this.cacheInfo = yield (0, (_promise || _load_promise()).orNullIfFileNotExist)((0, (_fsExtraP || _load_fsExtraP()).readJson)(_this.cacheInfoFile));
            const oldDigest = _this.cacheInfo == null ? null : _this.cacheInfo.executableDigest;
            if (oldDigest !== digest) {
                (0, (_builderUtil || _load_builderUtil()).debug)(`No valid cached executable found, old digest: ${oldDigest}, new digest: ${digest}`);
                return false;
            }
            (0, (_builderUtil || _load_builderUtil()).debug)(`Copy cached ${_this.cacheFile} executable to ${_this.executableFile}`);
            try {
                yield (0, (_fs || _load_fs()).copyFile)(_this.cacheFile, _this.executableFile, false);
                return true;
            } catch (e) {
                if (e.code === "ENOENT" || e.code === "ENOTDIR") {
                    (0, (_builderUtil || _load_builderUtil()).debug)(`Copy cached executable failed: ${e.code}`);
                } else {
                    (0, (_builderUtil || _load_builderUtil()).warn)(`Cannot copy cached executable: ${e.stack || e}`);
                }
            }
            return false;
        })();
    }
    save() {
        var _this2 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if (_this2.newDigest == null) {
                throw new Error("call copyIfValid before");
            }
            if (_this2.cacheInfo == null) {
                _this2.cacheInfo = { executableDigest: _this2.newDigest };
            } else {
                _this2.cacheInfo.executableDigest = _this2.newDigest;
            }
            try {
                yield (0, (_fsExtraP || _load_fsExtraP()).ensureDir)(_this2.cacheDir);
                yield (_bluebirdLst2 || _load_bluebirdLst2()).default.all([(0, (_fsExtraP || _load_fsExtraP()).writeJson)(_this2.cacheInfoFile, _this2.cacheInfo), (0, (_fs || _load_fs()).copyFile)(_this2.executableFile, _this2.cacheFile, false)]);
            } catch (e) {
                (0, (_builderUtil || _load_builderUtil()).warn)(`Cannot save build cache: ${e.stack || e}`);
            }
        })();
    }
}
exports.BuildCacheManager = BuildCacheManager;
BuildCacheManager.VERSION = "0";