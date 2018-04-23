'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = moveTo;

var _ErrorHandler = require('../utils/ErrorHandler');

var _eventSimulator = require('../scripts/eventSimulator');

var _eventSimulator2 = _interopRequireDefault(_eventSimulator);

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function moveTo(element, xoffset, yoffset) {
    var data = {};

    if (typeof element === 'string') {
        data.element = element;
    }

    if (typeof xoffset === 'number') {
        data.xoffset = xoffset;
    }

    if (typeof yoffset === 'number') {
        data.yoffset = yoffset;
    }

    /**
     * if no attribute is set, throw error
     */
    if ((0, _keys2.default)(data).length === 0) {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with moveTo command');
    }

    (0, _deprecationWarning2.default)('moveTo', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. It is recommended to use the actions command to ' + 'emulate pointer events.');

    /**
     * simulate event in safari
     */
    if (this.desiredCapabilities.browserName === 'safari') {
        xoffset = xoffset || 0;
        yoffset = yoffset || 0;

        var target = { x: xoffset, y: yoffset };
        return this.elementIdLocation(element).then(function (res) {
            target = { x: res.value.x + xoffset, y: res.value.y + yoffset };
        }).execute(_eventSimulator2.default).execute(function (elem, x, y) {
            return window._wdio_simulate(elem, 'mousemove', x, y);
        }, { ELEMENT: element }, target.x, target.y);
    }

    return this.requestHandler.create('/session/:sessionId/moveto', data);
} /**
   *
   * Move the mouse by an offset of the specified element. If no element is specified,
   * the move is relative to the current mouse cursor. If an element is provided but
   * no offset, the mouse will be moved to the center of the element. If the element
   * is not visible, it will be scrolled into view.
   *
   * This command is deprecated and will be removed soon. Make sure you don't use it in your
   * automation/test scripts anymore to avoid errors.
   *
   * @param {String} element  Opaque ID assigned to the element to move to, as described in the WebElement JSON Object. If not specified or is null, the offset is relative to current position of the mouse.
   * @param {Number} xoffset  X offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
   * @param {Number} yoffset  Y offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidmoveto
   * @type protocol
   * @deprecated
   *
   */

module.exports = exports['default'];