"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncTaskManager = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

var _promise;

function _load_promise() {
    return _promise = require("./promise");
}

var _util;

function _load_util() {
    return _util = require("./util");
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AsyncTaskManager {
    constructor(cancellationToken) {
        this.cancellationToken = cancellationToken;
        this.tasks = [];
        this.errors = [];
    }
    add(task) {
        if (this.cancellationToken == null || !this.cancellationToken.cancelled) {
            this.addTask(task());
        }
    }
    addTask(promise) {
        if (this.cancellationToken.cancelled) {
            (0, (_util || _load_util()).debug)(`Async task not added because cancelled: ${new Error().stack}`);
            if ("cancel" in promise) {
                promise.cancel();
            }
            return;
        }
        this.tasks.push(promise.catch(it => {
            (0, (_util || _load_util()).debug)(`Async task error: ${it.stack || it}`);
            this.errors.push(it);
            return (_bluebirdLst2 || _load_bluebirdLst2()).default.resolve(null);
        }));
    }
    cancelTasks() {
        for (const task of this.tasks) {
            if ("cancel" in task) {
                task.cancel();
            }
        }
        this.tasks.length = 0;
    }
    awaitTasks() {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if (_this.cancellationToken.cancelled) {
                _this.cancelTasks();
                return [];
            }
            const checkErrors = function () {
                if (_this.errors.length > 0) {
                    _this.cancelTasks();
                    throwError(_this.errors);
                    return;
                }
            };
            checkErrors();
            let result = null;
            const tasks = _this.tasks;
            let list = tasks.slice();
            tasks.length = 0;
            while (list.length > 0) {
                const subResult = yield (_bluebirdLst2 || _load_bluebirdLst2()).default.all(list);
                result = result == null ? subResult : result.concat(subResult);
                checkErrors();
                if (tasks.length === 0) {
                    break;
                } else {
                    if (_this.cancellationToken.cancelled) {
                        _this.cancelTasks();
                        return [];
                    }
                    list = tasks.slice();
                    tasks.length = 0;
                }
            }
            return result || [];
        })();
    }
}
exports.AsyncTaskManager = AsyncTaskManager;
function throwError(errors) {
    if (errors.length === 1) {
        throw errors[0];
    } else if (errors.length > 1) {
        throw new (_promise || _load_promise()).NestedError(errors, "Cannot cleanup: ");
    }
}
//# sourceMappingURL=asyncTaskManager.js.map