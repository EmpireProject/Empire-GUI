"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.time = time;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

class DevTimer {
    constructor(label) {
        this.label = label;
        this.start = process.hrtime();
    }
    end() {
        const end = process.hrtime(this.start);
        console.info(`${this.label}: %ds %dms`, end[0], Math.round(end[1] / 1000000));
    }
}
class ProductionTimer {
    end() {
        // ignore
    }
}
function time(label) {
    return (_builderUtil || _load_builderUtil()).debug.enabled ? new DevTimer(label) : new ProductionTimer();
}
//# sourceMappingURL=timer.js.map