"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reactCra = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

/** @internal */
let reactCra = exports.reactCra = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (projectDir) {
        if ((yield (0, (_fs || _load_fs()).statOrNull)(_path.join(projectDir, "public", "electron.js"))) == null) {
            (0, (_builderUtil || _load_builderUtil()).warn)("public/electron.js not found. Please see https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3");
        }
        return {
            directories: {
                buildResources: "assets"
            },
            files: ["build/**/*"],
            extraMetadata: {
                main: "build/electron.js"
            }
        };
    });

    return function reactCra(_x) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=rectCra.js.map


var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }