'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = touchFlick;

var _ErrorHandler = require('../utils/ErrorHandler');

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Flick on the touch screen using finger motion events. This flick command starts
 * at a particular screen location.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors. Please use the
 * [`touchPerform`](http://webdriver.io/api/mobile/touchPerform.html) command instead.
 *
 * @param {String} ID      ID of the element where the flick starts
 * @param {Number} xoffset the x offset in pixels to flick by
 * @param {Number} yoffset the y offset in pixels to flick by
 * @param {Number} speed   the speed in pixels per seconds
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchflick
 * @type protocol
 * @deprecated
 *
 */

function touchFlick(id, xoffset, yoffset, speed) {
    var data = {};

    if (typeof id === 'number' && typeof xoffset === 'number') {
        data = {
            xoffset: id,
            yoffset: xoffset
        };
    } else if (!id && typeof xoffset === 'number' && typeof yoffset === 'number') {
        data = { xoffset, yoffset };
    } else if (typeof id === 'string' && typeof xoffset === 'number' && typeof yoffset === 'number' && typeof speed === 'number') {
        data = { element: id, xoffset, yoffset, speed };
    } else {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with touchFlick command');
    }

    (0, _deprecationWarning2.default)('touchFlick', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the touchAction command for this.');

    return this.requestHandler.create('/session/:sessionId/touch/flick', data);
}
module.exports = exports['default'];