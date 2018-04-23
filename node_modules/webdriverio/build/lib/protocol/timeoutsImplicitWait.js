'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = timeoutsImplicitWait;

var _ErrorHandler = require('../utils/ErrorHandler');

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Set the amount of time the driver should wait when searching for elements. When searching for a single element,
 * the driver should poll the page until an element is found or the timeout expires, whichever occurs first. When
 * searching for multiple elements, the driver should poll the page until at least one element is found or the
 * timeout expires, at which point it should return an empty list.
 *
 * If this command is never sent, the driver should default to an implicit wait of 0ms.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors. Please use the
 * [`timeouts`](http://webdriver.io/api/protocol/timeouts.html) command instead.
 *
 * @param {Number} ms   The amount of time to wait, in milliseconds. This value has a lower bound of 0.
 *
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtimeoutsimplicit_wait
 * @type protocol
 * @deprecated
 *
 */

function timeoutsImplicitWait(ms) {
    /*!
     * parameter check
     */
    if (typeof ms !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with timeoutsImplicitWait protocol command');
    }

    (0, _deprecationWarning2.default)('timeoutsImplicitWait', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the timeout command for this.');
    return this.requestHandler.create('/session/:sessionId/timeouts/implicit_wait', { ms });
}
module.exports = exports['default'];