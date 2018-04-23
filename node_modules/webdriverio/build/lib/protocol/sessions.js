'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = sessions;

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sessions() {
    (0, _deprecationWarning2.default)('sessions', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. There is currently no known replacement for this ' + 'command.');

    return this.requestHandler.create({
        path: '/sessions',
        method: 'GET',
        requiresSession: false
    });
} /**
   *
   * Returns a list of the currently active sessions. Each session will be returned
   * as a list of JSON objects with the following keys:
   *
   * | Key          | Type   | Description    |
   * |--------------|--------|----------------|
   * | id           | string | The session ID |
   * | capabilities | object | An object describing the [session capabilities](https://w3c.github.io/webdriver/webdriver-spec.html#capabilities) |
   *
   * This command is deprecated and will be removed soon. Make sure you don't use it in your
   * automation/test scripts anymore to avoid errors.
   *
   * @return {Object[]} a list of the currently active sessions
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessions
   * @type protocol
   * @deprecated
   *
   */

module.exports = exports['default'];