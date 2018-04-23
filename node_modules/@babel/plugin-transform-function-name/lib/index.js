"use strict";

exports.__esModule = true;
exports.default = _default;

var _helperFunctionName = _interopRequireDefault(require("@babel/helper-function-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    visitor: {
      FunctionExpression: {
        exit: function exit(path) {
          if (path.key !== "value" && !path.parentPath.isObjectProperty()) {
            var replacement = (0, _helperFunctionName.default)(path);
            if (replacement) path.replaceWith(replacement);
          }
        }
      },
      ObjectProperty: function ObjectProperty(path) {
        var value = path.get("value");

        if (value.isFunction()) {
          var newNode = (0, _helperFunctionName.default)(value);
          if (newNode) value.replaceWith(newNode);
        }
      }
    }
  };
}