"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildForge = buildForge;

var _path = _interopRequireWildcard(require("path"));

var _builder;

function _load_builder() {
    return _builder = require("../builder");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function buildForge(forgeOptions, options) {
    const appDir = forgeOptions.dir;
    return (0, (_builder || _load_builder()).build)(Object.assign({ prepackaged: appDir, config: {
            directories: {
                // https://github.com/electron-userland/electron-forge/blob/master/src/makers/generic/zip.js
                output: _path.resolve(appDir, "..", "make")
            }
        } }, options));
}
//# sourceMappingURL=forge-maker.js.map