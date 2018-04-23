"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createHelperDir = exports.StageDir = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

let createHelperDir = exports.createHelperDir = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (target, arch) {
        const tempDir = _path.join(target.outDir, `__${target.name}-temp-${(_builderUtil || _load_builderUtil()).Arch[arch]}`);
        yield (0, (_fsExtraP || _load_fsExtraP()).emptyDir)(tempDir);
        return new StageDir(tempDir);
    });

    return function createHelperDir(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=targetUtil.js.map


var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _path = _interopRequireWildcard(require("path"));

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class StageDir {
    constructor(tempDir) {
        this.tempDir = tempDir;
    }
    getTempFile(name) {
        return _path.join(this.tempDir, name);
    }
    cleanup() {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if (!(_builderUtil || _load_builderUtil()).debug.enabled) {
                yield (0, (_fsExtraP || _load_fsExtraP()).remove)(_this.tempDir);
            }
        })();
    }
}
exports.StageDir = StageDir;