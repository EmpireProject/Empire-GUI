"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

/** @internal */
let start = exports.start = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
        require("electron-webpack/dev-runner");
    });

    return function start() {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=start.js.map