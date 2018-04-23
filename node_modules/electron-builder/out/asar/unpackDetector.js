"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.detectUnpackedDirs = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

/** @internal */
let detectUnpackedDirs = exports.detectUnpackedDirs = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (fileSet, autoUnpackDirs, unpackedDest, rootForAppFilesWithoutAsar) {
        const dirToCreate = new Map();
        const metadata = fileSet.metadata;
        function addParents(child, root) {
            child = _path.dirname(child);
            if (autoUnpackDirs.has(child)) {
                return;
            }
            do {
                autoUnpackDirs.add(child);
                const p = _path.dirname(child);
                // create parent dir to be able to copy file later without directory existence check
                addValue(dirToCreate, p, _path.basename(child));
                if (child === root || p === root || autoUnpackDirs.has(p)) {
                    break;
                }
                child = p;
            } while (true);
            autoUnpackDirs.add(root);
        }
        for (let i = 0, n = fileSet.files.length; i < n; i++) {
            const file = fileSet.files[i];
            const index = file.lastIndexOf((_AppFileCopierHelper || _load_AppFileCopierHelper()).NODE_MODULES_PATTERN);
            if (index < 0) {
                continue;
            }
            let nextSlashIndex = file.indexOf(_path.sep, index + (_AppFileCopierHelper || _load_AppFileCopierHelper()).NODE_MODULES_PATTERN.length + 1);
            if (nextSlashIndex < 0) {
                continue;
            }
            if (file[index + (_AppFileCopierHelper || _load_AppFileCopierHelper()).NODE_MODULES_PATTERN.length] === "@") {
                nextSlashIndex = file.indexOf(_path.sep, nextSlashIndex + 1);
            }
            if (!metadata.get(file).isFile()) {
                continue;
            }
            const packageDir = file.substring(0, nextSlashIndex);
            const packageDirPathInArchive = _path.relative(rootForAppFilesWithoutAsar, (0, (_appFileCopier || _load_appFileCopier()).getDestinationPath)(packageDir, fileSet));
            const pathInArchive = _path.relative(rootForAppFilesWithoutAsar, (0, (_appFileCopier || _load_appFileCopier()).getDestinationPath)(file, fileSet));
            if (autoUnpackDirs.has(packageDirPathInArchive)) {
                // if package dir is unpacked, any file also unpacked
                addParents(pathInArchive, packageDirPathInArchive);
                continue;
            }
            let shouldUnpack = false;
            if (file.endsWith(".dll") || file.endsWith(".exe")) {
                shouldUnpack = true;
            } else if (!file.includes(".", nextSlashIndex) && _path.extname(file) === "") {
                shouldUnpack = yield isBinaryFile(file);
            }
            if (!shouldUnpack) {
                continue;
            }
            if ((_builderUtil || _load_builderUtil()).debug.enabled) {
                (0, (_builderUtil || _load_builderUtil()).debug)(`${pathInArchive} is not packed into asar archive - contains executable code`);
            }
            addParents(pathInArchive, packageDirPathInArchive);
        }
        if (dirToCreate.size > 0) {
            yield (0, (_fsExtraP || _load_fsExtraP()).ensureDir)(unpackedDest + _path.sep + "node_modules");
            // child directories should be not created asynchronously - parent directories should be created first
            yield (_bluebirdLst2 || _load_bluebirdLst2()).default.map(dirToCreate.keys(), (() => {
                var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (parentDir) {
                    const base = unpackedDest + _path.sep + parentDir;
                    yield (0, (_fsExtraP || _load_fsExtraP()).ensureDir)(base);
                    yield (_bluebirdLst2 || _load_bluebirdLst2()).default.each(dirToCreate.get(parentDir), function (it) {
                        if (dirToCreate.has(parentDir + _path.sep + it)) {
                            // already created
                            return null;
                        } else {
                            return (0, (_fsExtraP || _load_fsExtraP()).ensureDir)(base + _path.sep + it);
                        }
                    });
                });

                return function (_x5) {
                    return _ref2.apply(this, arguments);
                };
            })(), (_fs || _load_fs()).CONCURRENCY);
        }
    });

    return function detectUnpackedDirs(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=unpackDetector.js.map


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

var _appFileCopier;

function _load_appFileCopier() {
    return _appFileCopier = require("../util/appFileCopier");
}

var _AppFileCopierHelper;

function _load_AppFileCopierHelper() {
    return _AppFileCopierHelper = require("../util/AppFileCopierHelper");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isBinaryFile = (_bluebirdLst2 || _load_bluebirdLst2()).default.promisify(require("isbinaryfile"));
function addValue(map, key, value) {
    let list = map.get(key);
    if (list == null) {
        list = [value];
        map.set(key, list);
    } else {
        list.push(value);
    }
}