'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utilities = require('../helpers/utilities');

var windowHandleMaximize = function windowHandleMaximize() {
    var _this = this;

    var windowHandle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'current';

    var requestOptions = {
        path: `/session/:sessionId/window/${windowHandle}/maximize`,
        method: 'POST'
    };

    return this.requestHandler.create(requestOptions).catch(function (err) {
        /**
         * use W3C path if old path failed
         */
        if ((0, _utilities.isUnknownCommand)(err)) {
            requestOptions.path = '/session/:sessionId/window/maximize';
            return _this.requestHandler.create(requestOptions);
        }

        throw err;
    });
}; /**
    *
    * Maximize the specified window if not already maximized. If the :windowHandle URL parameter is "current",
    * the currently active window will be maximized.
    *
    * @param {String=} windowHandle window to maximize (if parameter is falsy the currently active window will be maximized)
    *
    * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-maximize-window
    * @type protocol
    *
    */

exports.default = windowHandleMaximize;
module.exports = exports['default'];