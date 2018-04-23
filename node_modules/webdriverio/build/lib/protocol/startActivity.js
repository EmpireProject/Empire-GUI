'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = startActivity;

var _ErrorHandler = require('../utils/ErrorHandler');

function startActivity(appPackage, appActivity, appWaitPackage, appWaitActivity) {
    if (typeof appPackage !== 'string' || typeof appActivity !== 'string') {
        throw new _ErrorHandler.ProtocolError('startActivity command requires two parameter (appPackage, appActivity) from type string');
    }

    var data = { appPackage, appActivity };

    if (typeof appWaitPackage === 'string') {
        data.appWaitPackage = appWaitPackage;
    }
    if (typeof appWaitActivity === 'string') {
        data.appWaitActivity = appWaitActivity;
    }

    return this.requestHandler.create('/session/:sessionId/appium/device/start_activity', data);
} /**
   *
   * Start an arbitrary Android activity during a session.
   *
   * <example>
      :startActivity.js
      browser.startActivity({
          appPackage: 'io.appium.android.apis',
          appActivity: '.view.DragAndDropDemo'
      });
   * </example>
   *
   * @param {String} appPackage       name of app
   * @param {String} appActivity      name of activity
   * @param {String=} appWaitPackage  name of app to wait for
   * @param {String=} appWaitActivity name of activity to wait for
   * @type mobile
   * @for android
   *
   */
module.exports = exports['default'];