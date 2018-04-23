'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdLocationInView;

var _ErrorHandler = require('../utils/ErrorHandler');

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Determine an element's location on the screen once it has been scrolled into view.
 *
 * *Note:* This is considered an internal command and should only be used to determine
 * an element's location for correctly generating native events.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors. Please use the
 * [`elementIdRect`](http://webdriver.io/api/protocol/elementIdRect.html) command instead.
 *
 * @param {String} ID ID of a WebElement JSON object to route the command to
 * @return {Object} The X and Y coordinates for the element (`{x:number, y:number}`)
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidlocation_in_view
 * @type protocol
 * @deprecated
 *
 */

function elementIdLocationInView(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdLocationInView protocol command');
    }

    (0, _deprecationWarning2.default)('elementIdLocationInView', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. There is currently no known replacement for this ' + 'action. You can use the execute command to get a custom position of an element ' + 'using JavaScript.');
    return this.requestHandler.create(`/session/:sessionId/element/${id}/location_in_view`);
}
module.exports = exports['default'];