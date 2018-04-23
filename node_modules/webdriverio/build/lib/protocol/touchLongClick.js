'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = touchLongClick;

var _ErrorHandler = require('../utils/ErrorHandler');

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Long press on the touch screen using finger motion events.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors. Please use the
 * [`touchPerform`](http://webdriver.io/api/mobile/touchPerform.html) command instead.
 *
 * @param {String} id ID of the element to long press on
 *
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchlongclick
 * @type protocol
 * @for android
 * @deprecated
 *
 */

function touchLongClick(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with touchLongClick protocol command');
    }

    (0, _deprecationWarning2.default)('touchLongClick', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the touchAction command for this.');

    return this.requestHandler.create('/session/:sessionId/touch/longclick', {
        element: id.toString()
    });
}
module.exports = exports['default'];