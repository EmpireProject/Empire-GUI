"use strict";

exports.__esModule = true;
exports.default = _default;

function _default() {
  return {
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("optionalCatchBinding");
    }
  };
}