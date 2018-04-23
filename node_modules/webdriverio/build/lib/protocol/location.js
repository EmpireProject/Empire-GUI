'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = location;

var _deprecationWarning = require('../helpers/deprecationWarning');

var _deprecationWarning2 = _interopRequireDefault(_deprecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function location(l) {
    var location = null;

    if (typeof l === 'object' && l.latitude !== undefined && l.longitude !== undefined && l.altitude !== undefined) {
        location = l;
    }

    (0, _deprecationWarning2.default)('location', this.options.deprecationWarnings, 'This command is not part of the W3C WebDriver spec and won\'t be supported in ' + 'future versions of the driver. There is currently no known replacement for this ' + 'action.');

    /**
     * get geo location
     */
    if (!location) {
        return this.requestHandler.create('/session/:sessionId/location');
    }

    /**
     * set geo location
     * @type {[type]}
     */
    return this.requestHandler.create('/session/:sessionId/location', { location });
} /**
   *
   * Protocol bindings for all geolocation operations.
   *
   * This command is deprecated and will be removed soon. Make sure you don't use it in your
   * automation/test scripts anymore to avoid errors.
   *
   * <example>
      :location.js
      it('should set geo location for device', function () {
          // set the current geo location
          client.location({latitude: 121.21, longitude: 11.56, altitude: 94.23})
  
          // get the current geo location
          client.location().then(function(res) { ... });
      });
   * </example>
   *
   * @param {Object} location  the new location
   * @return {Object}         the current geo location
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlocation
   * @type protocol
   * @deprecated
   *
   */

module.exports = exports['default'];