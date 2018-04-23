"use strict";

exports.__esModule = true;
exports.default = _default;

var _pluginSyntaxOptionalCatchBinding = _interopRequireDefault(require("@babel/plugin-syntax-optional-catch-binding"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    inherits: _pluginSyntaxOptionalCatchBinding.default,
    visitor: {
      CatchClause: function CatchClause(path) {
        if (!path.node.param) {
          var uid = path.scope.generateUidIdentifier("unused");
          var paramPath = path.get("param");
          paramPath.replaceWith(uid);
        }
      }
    }
  };
}