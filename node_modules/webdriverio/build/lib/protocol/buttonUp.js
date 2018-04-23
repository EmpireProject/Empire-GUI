'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonUp;

var _handleMouseButtonProtocol = require('../helpers/handleMouseButtonProtocol');

var _handleMouseButtonProtocol2 = _interopRequireDefault(_handleMouseButtonProtocol);

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Releases the mouse button previously held (where the mouse is currently at). Must
 * be called once for every buttondown command issued. See the note in click and
 * buttondown about implications of out-of-order commands.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors.
 *
 * @param {Number} button  Which button, enum: *{LEFT = 0, MIDDLE = 1 , RIGHT = 2}*. Defaults to the left mouse button if not specified.
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidbuttonup
 * @type protocol
 * @deprecated
 *
 */

function buttonUp(button) {
    (0, _deprecationWarning2.default)('buttonUp', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the action command as ' + 'a replacement for this.');

    return _handleMouseButtonProtocol2.default.call(this, '/session/:sessionId/buttonup', button);
}
module.exports = exports['default'];