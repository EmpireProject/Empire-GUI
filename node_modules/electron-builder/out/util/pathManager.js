"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTemplatePath = getTemplatePath;
exports.getVendorPath = getVendorPath;

var _path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const root = _path.join(__dirname, "..", "..");
function getTemplatePath(file) {
    return _path.join(root, "templates", file);
}
function getVendorPath(file) {
    return file == null ? _path.join(root, "vendor") : _path.join(root, "vendor", file);
}
//# sourceMappingURL=pathManager.js.map