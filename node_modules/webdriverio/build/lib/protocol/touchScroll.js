'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = touchScroll;

var _ErrorHandler = require('../utils/ErrorHandler');

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Scroll on the touch screen using finger based motion events. If
 * element ID is given start scrolling at a particular screen location.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors. Please use the
 * [`touchPerform`](http://webdriver.io/api/mobile/touchPerform.html) command instead.
 *
 * @param {String} id       the element where the scroll starts.
 * @param {Number} xoffset  in pixels to scroll by
 * @param {Number} yoffset  in pixels to scroll by
 *
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchscroll
 * @type protocol
 * @deprecated
 *
 */

function touchScroll(id, xoffset, yoffset) {
    var data = {};

    /*!
     * start scrolling at a particular screen location
     */
    if (arguments.length === 3 && id && typeof xoffset === 'number' && typeof yoffset === 'number') {
        data = { element: id, xoffset, yoffset

            /*!
             * if you don't care where the scroll starts on the screen
             */
        };
    } else if (arguments.length === 3 && !id && typeof xoffset === 'number' && typeof yoffset === 'number') {
        data = { xoffset, yoffset

            /*!
             * if you don't care where the scroll starts on the screen
             */
        };
    } else if (arguments.length === 2 && typeof id === 'number' && typeof xoffset === 'number') {
        data = {
            xoffset: id,
            yoffset: xoffset
        };
    } else {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with touchScroll command');
    }

    (0, _deprecationWarning2.default)('touchScroll', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the touchAction command for this.');

    return this.requestHandler.create('/session/:sessionId/touch/scroll', data);
}
module.exports = exports['default'];