"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.copyAppFiles = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

let copyAppFiles = exports.copyAppFiles = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (fileSet, packager) {
        const metadata = fileSet.metadata;
        const transformedFiles = fileSet.transformedFiles;
        // search auto unpacked dir
        const taskManager = new (_builderUtil || _load_builderUtil()).AsyncTaskManager(packager.cancellationToken);
        const createdParentDirs = new Set();
        const fileCopier = new (_fs || _load_fs()).FileCopier();
        const links = [];
        for (let i = 0, n = fileSet.files.length; i < n; i++) {
            const sourceFile = fileSet.files[i];
            const stat = metadata.get(sourceFile);
            if (stat == null) {
                // dir
                continue;
            }
            const destinationFile = getDestinationPath(sourceFile, fileSet);
            if (stat.isFile()) {
                const fileParent = _path.dirname(destinationFile);
                if (!createdParentDirs.has(fileParent)) {
                    createdParentDirs.add(fileParent);
                    yield (0, (_fsExtraP || _load_fsExtraP()).ensureDir)(fileParent);
                }
                taskManager.addTask((0, (_asarUtil || _load_asarUtil()).copyFileOrData)(fileCopier, transformedFiles == null ? null : transformedFiles.get(i), sourceFile, destinationFile, stat));
                if (taskManager.tasks.length > (_fs || _load_fs()).MAX_FILE_REQUESTS) {
                    yield taskManager.awaitTasks();
                }
            } else if (stat.isSymbolicLink()) {
                links.push({ file: destinationFile, link: yield (0, (_fsExtraP || _load_fsExtraP()).readlink)(sourceFile) });
            }
        }
        if (taskManager.tasks.length > (_fs || _load_fs()).MAX_FILE_REQUESTS) {
            yield taskManager.awaitTasks();
        }
        if (links.length > 0) {
            (_bluebirdLst2 || _load_bluebirdLst2()).default.map(links, function (it) {
                return (0, (_fsExtraP || _load_fsExtraP()).symlink)(it.link, it.file);
            }, (_fs || _load_fs()).CONCURRENCY);
        }
    });

    return function copyAppFiles(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=appFileCopier.js.map


exports.getDestinationPath = getDestinationPath;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _path = _interopRequireWildcard(require("path"));

var _asarUtil;

function _load_asarUtil() {
    return _asarUtil = require("../asar/asarUtil");
}

var _AppFileCopierHelper;

function _load_AppFileCopierHelper() {
    return _AppFileCopierHelper = require("./AppFileCopierHelper");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDestinationPath(file, fileSet) {
    if (file === fileSet.src) {
        return fileSet.destination;
    } else {
        const src = (0, (_AppFileCopierHelper || _load_AppFileCopierHelper()).ensureEndSlash)(fileSet.src);
        const dest = (0, (_AppFileCopierHelper || _load_AppFileCopierHelper()).ensureEndSlash)(fileSet.destination);
        if (file.startsWith(src)) {
            return dest + file.substring(src.length);
        } else {
            // hoisted node_modules
            const index = file.lastIndexOf((_AppFileCopierHelper || _load_AppFileCopierHelper()).NODE_MODULES_PATTERN);
            if (index < 0) {
                throw new Error(`File "${file}" not under the source directory "${fileSet.src}"`);
            }
            return dest + file.substring(index + 1 /* leading slash */);
        }
    }
}