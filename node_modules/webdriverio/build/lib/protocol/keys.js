'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _constants = require('../helpers/constants');

var _utilities = require('../helpers/utilities');

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function keys(value) {
    var _this = this;

    var key = [];

    /**
     * replace key with corresponding unicode character
     */
    if (typeof value === 'string') {
        key = checkUnicode(value);
    } else if (value instanceof Array) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var charSet = _step.value;

                key = key.concat(checkUnicode(charSet));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    } else {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with keys protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/keys', { value: key }).catch(function (err) {
        /**
         * use W3C path if old path failed
         */
        if ((0, _utilities.isUnknownCommand)(err)) {
            var keyDownActions = key.map(function (value) {
                return { type: 'keyDown', value };
            });
            var keyUpActions = key.map(function (value) {
                return { type: 'keyUp', value };
            });

            return _this.actions([{
                type: 'key',
                id: 'keys',
                actions: [].concat((0, _toConsumableArray3.default)(keyDownActions), (0, _toConsumableArray3.default)(keyUpActions))
            }]);
        }

        throw err;
    });
};

/*!
 * check for unicode character or split string into literals
 * @param  {String} value  text
 * @return {Array}         set of characters or unicode symbols
 */
/**
 *
 * Send a sequence of key strokes to the active element. This command is similar to the
 * send keys command in every aspect except the implicit termination: The modifiers are
 * *not* released at the end of the call. Rather, the state of the modifier keys is kept
 * between calls, so mouse interactions can be performed while modifier keys are depressed.
 *
 * You can also use characters like "Left arrow" or "Back space". WebdriverIO will take
 * care of translating them into unicode characters. You’ll find all supported characters
 * [here](https://w3c.github.io/webdriver/webdriver-spec.html#keyboard-actions).
 * To do that, the value has to correspond to a key from the table.
 *
 * This command is deprecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors.
 *
 * @param {String|String[]} value  The sequence of keys to type. An array must be provided. The server should flatten the array items to a single string to be typed.
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidkeys
 * @type protocol
 * @deprecated
 *
 */

function checkUnicode(value) {
    return _constants.UNICODE_CHARACTERS.hasOwnProperty(value) ? [_constants.UNICODE_CHARACTERS[value]] : value.split('');
}