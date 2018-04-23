'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = context;
/**
 *
 * Retrieve current context or switch to the specified context
 *
 * @param {String=} id the context to switch to
 *
 * @see http://appium.io/slate/en/v1.1.0/?javascript#automating-hybrid-ios-apps
 * @see https://github.com/admc/wd/blob/master/lib/commands.js#L279
 * @type mobile
 * @for android, ios
 *
 */

function context(id) {
    var data = {};
    var requestOptions = {
        path: '/session/:sessionId/context',
        method: 'GET'
    };

    if (typeof id === 'string') {
        requestOptions.method = 'POST';
        data.name = id;
    }

    return this.requestHandler.create(requestOptions, data);
}
module.exports = exports['default'];