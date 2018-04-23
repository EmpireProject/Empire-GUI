'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * check if current platform is mobile device
 *
 * @param  {Object}  caps  capabilities
 * @return {Boolean}       true if platform is mobile device
 */
var mobileDetector = function mobileDetector(caps) {
    var isMobile = Boolean(typeof caps['appium-version'] !== 'undefined' || typeof caps['device-type'] !== 'undefined' || typeof caps['deviceType'] !== 'undefined' || typeof caps['device-orientation'] !== 'undefined' || typeof caps['deviceOrientation'] !== 'undefined' || typeof caps.deviceName !== 'undefined' ||
    // Check browserName for specific values
    caps.browserName === '' || caps.browserName !== undefined && (caps.browserName.toLowerCase() === 'ipad' || caps.browserName.toLowerCase() === 'iphone' || caps.browserName.toLowerCase() === 'android'));

    var isIOS = Boolean(caps.platformName && caps.platformName.match(/iOS/i) || caps.deviceName && caps.deviceName.match(/(iPad|iPhone)/i));

    var isAndroid = Boolean(caps.platformName && caps.platformName.match(/Android/i) || caps.browserName && caps.browserName.match(/Android/i));

    return { isMobile, isIOS, isAndroid };
};

exports.default = mobileDetector;
module.exports = exports['default'];