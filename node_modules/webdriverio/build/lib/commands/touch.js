'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = touch;

var _ErrorHandler = require('../utils/ErrorHandler');

function touch(selector, longClick) {
  var _this = this;

  /**
   * we can't use default values for function parameter here because this would
   * break the ability to chain the command with an element if reverse is used
   */
  longClick = typeof longClick === 'boolean' ? longClick : false;

  var touchCommand = longClick ? 'touchLongClick' : 'touchClick';

  return this.element(selector).then(function (elem) {
    /**
     * check if element was found and throw error if not
     */
    if (!elem.value) {
      throw new _ErrorHandler.RuntimeError(7);
    }

    return _this[touchCommand](elem.value.ELEMENT);
  });
} /**
   * Put finger on an element (only in mobile context).
   *
   * @alias browser.touch
   * @param {String}  selector  element to put finger on
   * @param {Boolean} longClick if true touch click will be long (default: false)
   * @uses protocol/element, protocol/touchClick, protocol/touchLongClick
   * @type mobile
   * @uses android
   *
   */

module.exports = exports['default'];