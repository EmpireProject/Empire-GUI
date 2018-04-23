'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = doDoubleClick;

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doDoubleClick() {
    (0, _deprecationWarning2.default)('doDoubleClick', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to just call the click command ' + 'on the same element twice in the row.');

    return this.requestHandler.create({
        path: '/session/:sessionId/doubleclick',
        method: 'POST'
    });
} /**
   *
   * Double-clicks at the current mouse coordinates (set by moveto.
   *
   * This command is deprecated and will be removed soon. Make sure you don't use it in your
   * automation/test scripts anymore to avoid errors.
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessioniddoubleclick
   * @type protocol
   * @deprecated
   *
   */

module.exports = exports['default'];