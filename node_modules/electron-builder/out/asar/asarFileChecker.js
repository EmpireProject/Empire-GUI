"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkFileInArchive = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

/** @internal */
let checkFileInArchive = exports.checkFileInArchive = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (asarFile, relativeFile, messagePrefix) {
        function error(text) {
            return new Error(`${messagePrefix} "${relativeFile}" in the "${asarFile}" ${text}`);
        }
        let fs;
        try {
            fs = yield (0, (_asar || _load_asar()).readAsar)(asarFile);
        } catch (e) {
            throw error(`is corrupted: ${e}`);
        }
        let stat;
        try {
            stat = fs.getFile(relativeFile);
        } catch (e) {
            const fileStat = yield (0, (_fs || _load_fs()).statOrNull)(asarFile);
            if (fileStat == null) {
                throw error(`does not exist. Seems like a wrong configuration.`);
            }
            // asar throws error on access to undefined object (info.link)
            stat = null;
        }
        if (stat == null) {
            throw error(`does not exist. Seems like a wrong configuration.`);
        }
        if (stat.size === 0) {
            throw error(`is corrupted: size 0`);
        }
    });

    return function checkFileInArchive(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=asarFileChecker.js.map


var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _asar;

function _load_asar() {
    return _asar = require("./asar");
}