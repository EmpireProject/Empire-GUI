'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = submit;

var _ErrorHandler = require('../utils/ErrorHandler');

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Submit a FORM element. The submit command may also be applied to any element
 * that is a descendant of a FORM element.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors.
 *
 * @param {String} ID ID of a `<form />` WebElement JSON object to route the command to
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidsubmit
 * @type protocol
 * @deprecated
 *
 */

function submit(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with submit protocol command');
    }

    (0, _deprecationWarning2.default)('submit', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to call the click command on the ' + 'submit button or use the actions command to emulate a key press action.');

    return this.requestHandler.create({
        path: `/session/:sessionId/element/${id}/submit`,
        method: 'POST'
    });
}
module.exports = exports['default'];