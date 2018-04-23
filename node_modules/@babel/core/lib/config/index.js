"use strict";

exports.__esModule = true;
exports.default = loadConfig;

var _optionManager = _interopRequireDefault(require("./option-manager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadConfig(opts) {
  if (opts != null && (typeof opts !== "object" || Array.isArray(opts))) {
    throw new Error("Babel options must be an object, null, or undefined");
  }

  return (0, _optionManager.default)(opts || {});
}