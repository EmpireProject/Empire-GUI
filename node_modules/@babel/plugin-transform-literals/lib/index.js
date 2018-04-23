"use strict";

exports.__esModule = true;
exports.default = _default;

function _default() {
  return {
    visitor: {
      NumericLiteral: function NumericLiteral(_ref) {
        var node = _ref.node;

        if (node.extra && /^0[ob]/i.test(node.extra.raw)) {
          node.extra = undefined;
        }
      },
      StringLiteral: function StringLiteral(_ref2) {
        var node = _ref2.node;

        if (node.extra && /\\[u]/gi.test(node.extra.raw)) {
          node.extra = undefined;
        }
      }
    }
  };
}