"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

let unpack = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (packager, out, platform, options) {
        let dist = packager.config.electronDist;
        if (dist != null) {
            const zipFile = `electron-v${options.version}-${platform}-${options.arch}.zip`;
            const resolvedDist = _path.resolve(packager.projectDir, dist);
            if ((yield (0, (_fs || _load_fs()).statOrNull)(_path.join(resolvedDist, zipFile))) != null) {
                options.cache = resolvedDist;
                dist = null;
            }
        }
        if (dist == null) {
            const zipPath = (yield (_bluebirdLst2 || _load_bluebirdLst2()).default.all([downloadElectron(options), (0, (_fsExtraP || _load_fsExtraP()).emptyDir)(out)]))[0];
            if (process.platform === "darwin" || (0, (_builderUtil || _load_builderUtil()).isEnvTrue)(process.env.USE_UNZIP)) {
                // on mac unzip faster than 7za (1.1 sec vs 1.6 see)
                yield (0, (_builderUtil || _load_builderUtil()).exec)("unzip", ["-oqq", "-d", out, zipPath]);
            } else {
                yield (0, (_builderUtil || _load_builderUtil()).spawn)((_zipBin || _load_zipBin()).path7za, (0, (_builderUtil || _load_builderUtil()).debug7zArgs)("x").concat(zipPath, "-aoa", `-o${out}`));
                if (platform === "linux") {
                    // https://github.com/electron-userland/electron-builder/issues/786
                    // fix dir permissions — opposite to extract-zip, 7za creates dir with no-access for other users, but dir must be readable for non-root users
                    yield (_bluebirdLst2 || _load_bluebirdLst2()).default.all([(0, (_fsExtraP || _load_fsExtraP()).chmod)(_path.join(out, "locales"), "0755"), (0, (_fsExtraP || _load_fsExtraP()).chmod)(_path.join(out, "resources"), "0755")]);
                }
            }
        } else {
            const source = packager.getElectronSrcDir(dist);
            const destination = packager.getElectronDestinationDir(out);
            (0, (_builderUtil || _load_builderUtil()).log)(`Copying Electron from "${source}" to "${destination}"`);
            yield (0, (_fsExtraP || _load_fsExtraP()).emptyDir)(out);
            yield (0, (_fs || _load_fs()).copyDir)(source, destination, {
                isUseHardLink: (_fs || _load_fs()).DO_NOT_USE_HARD_LINKS
            });
        }
    });

    return function unpack(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=dirPackager.js.map


exports.unpackElectron = unpackElectron;
exports.unpackMuon = unpackMuon;

var _zipBin;

function _load_zipBin() {
    return _zipBin = require("7zip-bin");
}

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const downloadElectron = (_bluebirdLst2 || _load_bluebirdLst2()).default.promisify(require("electron-download-tf"));
function createDownloadOpts(opts, platform, arch, electronVersion) {
    return Object.assign({ platform,
        arch, version: electronVersion }, opts.electronDownload);
}
/** @internal */
function unpackElectron(packager, out, platform, arch, version) {
    return unpack(packager, out, platform, createDownloadOpts(packager.config, platform, arch, version));
}
/** @internal */
function unpackMuon(packager, out, platform, arch, version) {
    return unpack(packager, out, platform, Object.assign({ mirror: "https://github.com/brave/muon/releases/download/v", customFilename: `brave-v${version}-${platform}-${arch}.zip`, verifyChecksum: false }, createDownloadOpts(packager.config, platform, arch, version)));
}