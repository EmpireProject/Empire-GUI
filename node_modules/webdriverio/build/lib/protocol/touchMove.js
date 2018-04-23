'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = touchMove;

var _ErrorHandler = require('../utils/ErrorHandler');

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Finger move on the screen.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors. Please use the
 * [`touchPerform`](http://webdriver.io/api/mobile/touchPerform.html) command instead.
 *
 * @param {Number} x  coordinate on the screen
 * @param {Number} y  coordinate on the screen
 *
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchmove
 * @type protocol
 * @deprecated
 *
 */

function touchMove(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with touchMove command');
    }

    (0, _deprecationWarning2.default)('touchMove', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the touchAction command for this.');

    return this.requestHandler.create('/session/:sessionId/touch/move', { x, y });
}
module.exports = exports['default'];