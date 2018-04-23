'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = imeActivated;

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function imeActivated() {
    (0, _deprecationWarning2.default)('imeActivated', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. There is currently no known replacement for this ' + 'action.');
    return this.requestHandler.create('/session/:sessionId/ime/activated');
} /**
   *
   * Indicates whether IME input is active at the moment (not if it's available).
   *
   * This command is deprecated and will be removed soon. Make sure you don't use it in your
   * automation/test scripts anymore to avoid errors.
   *
   * @return {boolean}  true if IME input is available and currently active, false otherwise
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeactivated
   * @type protocol
   * @deprecated
   *
   */

module.exports = exports['default'];