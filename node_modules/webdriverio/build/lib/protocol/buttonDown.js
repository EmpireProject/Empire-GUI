'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonDown;

var _handleMouseButtonProtocol = require('../helpers/handleMouseButtonProtocol');

var _handleMouseButtonProtocol2 = _interopRequireDefault(_handleMouseButtonProtocol);

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Click and hold the left mouse button (at the coordinates set by the last moveto
 * command). Note that the next mouse-related command that should follow is buttonup.
 * Any other mouse command (such as click or another call to buttondown) will yield
 * undefined behaviour.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors.
 *
 * @param {Number} button  Which button, enum: *{LEFT = 0, MIDDLE = 1 , RIGHT = 2}*. Defaults to the left mouse button if not specified.
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidbuttondown
 * @type protocol
 * @deprecated
 *
 */

function buttonDown(button) {
    (0, _deprecationWarning2.default)('buttonDown', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the action command as ' + 'a replacement for this.');

    return _handleMouseButtonProtocol2.default.call(this, '/session/:sessionId/buttondown', button);
}
module.exports = exports['default'];