"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isCanSignDmg = exports.isMacOsHighSierra = exports.isMacOsSierra = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

let isOsVersionGreaterThanOrEqualTo = (() => {
    var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (input) {
        return (_semver || _load_semver()).gte((yield macOsVersion.value), clean(input));
    });

    return function isOsVersionGreaterThanOrEqualTo(_x) {
        return _ref2.apply(this, arguments);
    };
})();

let isMacOsSierra = exports.isMacOsSierra = (() => {
    var _ref3 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
        return process.platform === "darwin" && (yield isOsVersionGreaterThanOrEqualTo("10.12.0"));
    });

    return function isMacOsSierra() {
        return _ref3.apply(this, arguments);
    };
})();

let isMacOsHighSierra = exports.isMacOsHighSierra = (() => {
    var _ref4 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
        return process.platform === "darwin" && (yield isOsVersionGreaterThanOrEqualTo("10.13.0"));
    });

    return function isMacOsHighSierra() {
        return _ref4.apply(this, arguments);
    };
})();

let isCanSignDmg = exports.isCanSignDmg = (() => {
    var _ref5 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
        return process.platform === "darwin" && (yield isOsVersionGreaterThanOrEqualTo("10.11.5"));
    });

    return function isCanSignDmg() {
        return _ref5.apply(this, arguments);
    };
})();
//# sourceMappingURL=macosVersion.js.map


exports.getMacOsVersion = getMacOsVersion;

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _lazyVal;

function _load_lazyVal() {
    return _lazyVal = require("lazy-val");
}

var _semver;

function _load_semver() {
    return _semver = _interopRequireWildcard(require("semver"));
}

var _util;

function _load_util() {
    return _util = require("./util");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const macOsVersion = new (_lazyVal || _load_lazyVal()).Lazy((0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
    const file = yield (0, (_fsExtraP || _load_fsExtraP()).readFile)("/System/Library/CoreServices/SystemVersion.plist", "utf8");
    const matches = /<key>ProductVersion<\/key>[\s\S]*<string>([\d.]+)<\/string>/.exec(file);
    if (!matches) {
        throw new Error("Couldn't find the macOS version");
    }
    (0, (_util || _load_util()).debug)(`macOS version: ${matches[1]}`);
    return clean(matches[1]);
}));
function clean(version) {
    return version.split(".").length === 2 ? `${version}.0` : version;
}
function getMacOsVersion() {
    return macOsVersion.value;
}