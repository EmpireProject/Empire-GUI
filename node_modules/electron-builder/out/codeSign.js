"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findIdentityRawResult = exports.createKeychain = exports.downloadCertificate = exports.reportError = exports.appleCertificatePrefixes = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

let reportError = exports.reportError = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (isMas, certificateType, qualifier, keychainName, isForceCodeSigning) {
        let message;
        if (qualifier == null) {
            message = `App is not signed`;
            if ((0, (_flags || _load_flags()).isAutoDiscoveryCodeSignIdentity)()) {
                const postfix = isMas ? "" : ` or custom non-Apple code signing certificate`;
                message += `: cannot find valid "${certificateType}" identity${postfix}`;
            }
            message += ", see https://electron.build/code-signing";
            if (!(0, (_flags || _load_flags()).isAutoDiscoveryCodeSignIdentity)()) {
                message += `\n(CSC_IDENTITY_AUTO_DISCOVERY=false)`;
            }
        } else {
            message = `Identity name "${qualifier}" is specified, but no valid identity with this name in the keychain`;
        }
        const args = ["find-identity"];
        if (keychainName != null) {
            args.push(keychainName);
        }
        if (qualifier != null || (0, (_flags || _load_flags()).isAutoDiscoveryCodeSignIdentity)()) {
            const allIdentities = (yield (0, (_builderUtil || _load_builderUtil()).exec)("security", args)).trim().split("\n").filter(function (it) {
                return !(it.includes("Policy: X.509 Basic") || it.includes("Matching identities"));
            }).join("\n");
            message += "\n\nAll identities:\n" + allIdentities;
        }
        if (isMas || isForceCodeSigning) {
            throw new Error(message);
        } else {
            (0, (_builderUtil || _load_builderUtil()).warn)(message);
        }
    });

    return function reportError(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
    };
})();
/** @private */


let downloadCertificate = exports.downloadCertificate = (() => {
    var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (urlOrBase64, tmpDir, currentDir) {
        urlOrBase64 = urlOrBase64.trim();
        let file = null;
        if (urlOrBase64.length > 3 && urlOrBase64[1] === ":" || urlOrBase64.startsWith("/") || urlOrBase64.startsWith(".")) {
            file = urlOrBase64;
        } else if (urlOrBase64.startsWith("file://")) {
            file = urlOrBase64.substring("file://".length);
        } else if (urlOrBase64.startsWith("~/")) {
            file = _path.join((0, (_os || _load_os()).homedir)(), urlOrBase64.substring("~/".length));
        } else {
            const isUrl = urlOrBase64.startsWith("https://");
            if (isUrl || urlOrBase64.length > 2048 || urlOrBase64.endsWith("=")) {
                const tempFile = yield tmpDir.getTempFile({ suffix: ".p12" });
                if (isUrl) {
                    yield (_nodeHttpExecutor || _load_nodeHttpExecutor()).httpExecutor.download(urlOrBase64, tempFile);
                } else {
                    yield (0, (_fsExtraP || _load_fsExtraP()).outputFile)(tempFile, Buffer.from(urlOrBase64, "base64"));
                }
                return tempFile;
            } else {
                file = urlOrBase64;
            }
        }
        file = _path.resolve(currentDir, file);
        const stat = yield (0, (_fs || _load_fs()).statOrNull)(file);
        if (stat == null) {
            throw new Error(`${file} doesn't exist`);
        } else if (!stat.isFile()) {
            throw new Error(`${file} not a file`);
        } else {
            return file;
        }
    });

    return function downloadCertificate(_x6, _x7, _x8) {
        return _ref2.apply(this, arguments);
    };
})();

// "Note that filename will not be searched to resolve the signing identity's certificate chain unless it is also on the user's keychain search list."
// but "security list-keychains" doesn't support add - we should 1) get current list 2) set new list - it is very bad http://stackoverflow.com/questions/10538942/add-a-keychain-to-search-list
// "overly complicated and introduces a race condition."
// https://github.com/electron-userland/electron-builder/issues/398
let createCustomCertKeychain = (() => {
    var _ref3 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
        // copy to temp and then atomic rename to final path
        const tmpKeychainPath = _path.join((0, (_builderUtil || _load_builderUtil()).getCacheDirectory)(), (0, (_tempFile || _load_tempFile()).getTempName)("electron-builder-root-certs"));
        const keychainPath = _path.join((0, (_builderUtil || _load_builderUtil()).getCacheDirectory)(), "electron-builder-root-certs.keychain");
        const results = yield (_bluebirdLst2 || _load_bluebirdLst2()).default.all([listUserKeychains(), (0, (_fs || _load_fs()).copyFile)(_path.join(__dirname, "..", "certs", "root_certs.keychain"), tmpKeychainPath).then(function () {
            return (0, (_fsExtraP || _load_fsExtraP()).rename)(tmpKeychainPath, keychainPath);
        })]);
        const list = results[0];
        if (!list.includes(keychainPath)) {
            yield (0, (_builderUtil || _load_builderUtil()).exec)("security", ["list-keychains", "-d", "user", "-s", keychainPath].concat(list));
        }
    });

    return function createCustomCertKeychain() {
        return _ref3.apply(this, arguments);
    };
})();

let removeKeychain = (() => {
    var _ref4 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (keychainFile) {
        try {
            yield (0, (_builderUtil || _load_builderUtil()).exec)("security", ["delete-keychain", keychainFile]);
        } catch (e) {
            console.warn(`Cannot delete keychain ${keychainFile}: ${e.stack || e}`);
            yield (0, (_fs || _load_fs()).unlinkIfExists)(keychainFile);
        }
    });

    return function removeKeychain(_x9) {
        return _ref4.apply(this, arguments);
    };
})();

let createKeychain = exports.createKeychain = (() => {
    var _ref5 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* ({ tmpDir, cscLink, cscKeyPassword, cscILink, cscIKeyPassword, currentDir }) {
        // travis has correct AppleWWDRCA cert
        if (process.env.TRAVIS !== "true") {
            yield bundledCertKeychainAdded.value;
        }
        const keychainFile = yield tmpDir.getTempFile({ suffix: ".keychain", disposer: removeKeychain });
        const certLinks = [cscLink];
        if (cscILink != null) {
            certLinks.push(cscILink);
        }
        const certPaths = new Array(certLinks.length);
        const keychainPassword = (0, (_crypto || _load_crypto()).randomBytes)(8).toString("base64");
        const securityCommands = [["create-keychain", "-p", keychainPassword, keychainFile], ["unlock-keychain", "-p", keychainPassword, keychainFile], ["set-keychain-settings", keychainFile]];
        // https://stackoverflow.com/questions/42484678/codesign-keychain-gets-ignored
        // https://github.com/electron-userland/electron-builder/issues/1457
        const list = yield listUserKeychains();
        if (!list.includes(keychainFile)) {
            securityCommands.push(["list-keychains", "-d", "user", "-s", keychainFile].concat(list));
        }
        yield (_bluebirdLst2 || _load_bluebirdLst2()).default.all([
        // we do not clear downloaded files - will be removed on tmpDir cleanup automatically. not a security issue since in any case data is available as env variables and protected by password.
        (_bluebirdLst2 || _load_bluebirdLst2()).default.map(certLinks, function (link, i) {
            return downloadCertificate(link, tmpDir, currentDir).then(function (it) {
                return certPaths[i] = it;
            });
        }), (_bluebirdLst2 || _load_bluebirdLst2()).default.mapSeries(securityCommands, function (it) {
            return (0, (_builderUtil || _load_builderUtil()).exec)("security", it);
        })]);
        return yield importCerts(keychainFile, certPaths, [cscKeyPassword, cscIKeyPassword].filter(function (it) {
            return it != null;
        }));
    });

    return function createKeychain(_x10) {
        return _ref5.apply(this, arguments);
    };
})();

let importCerts = (() => {
    var _ref6 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (keychainName, paths, keyPasswords) {
        for (let i = 0; i < paths.length; i++) {
            const password = keyPasswords[i];
            yield (0, (_builderUtil || _load_builderUtil()).exec)("security", ["import", paths[i], "-k", keychainName, "-T", "/usr/bin/codesign", "-T", "/usr/bin/productbuild", "-P", password]);
            // https://stackoverflow.com/questions/39868578/security-codesign-in-sierra-keychain-ignores-access-control-settings-and-ui-p
            // https://github.com/electron-userland/electron-packager/issues/701#issuecomment-322315996
            if (yield (0, (_builderUtil || _load_builderUtil()).isMacOsSierra)()) {
                yield (0, (_builderUtil || _load_builderUtil()).exec)("security", ["set-key-partition-list", "-S", "apple-tool:,apple:", "-s", "-k", password, keychainName]);
            }
        }
        return {
            keychainName
        };
    });

    return function importCerts(_x11, _x12, _x13) {
        return _ref6.apply(this, arguments);
    };
})();
/** @private */


let getValidIdentities = (() => {
    var _ref7 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (keychain) {
        function addKeychain(args) {
            if (keychain != null) {
                args.push(keychain);
            }
            return args;
        }
        let result = findIdentityRawResult;
        if (result == null || keychain != null) {
            // https://github.com/electron-userland/electron-builder/issues/481
            // https://github.com/electron-userland/electron-builder/issues/535
            result = (_bluebirdLst2 || _load_bluebirdLst2()).default.all([(0, (_builderUtil || _load_builderUtil()).exec)("security", addKeychain(["find-identity", "-v"])).then(function (it) {
                return it.trim().split("\n").filter(function (it) {
                    for (const prefix of appleCertificatePrefixes) {
                        if (it.includes(prefix)) {
                            return true;
                        }
                    }
                    return false;
                });
            }), (0, (_builderUtil || _load_builderUtil()).exec)("security", addKeychain(["find-identity", "-v", "-p", "codesigning"])).then(function (it) {
                return it.trim().split("\n");
            })]).then(function (it) {
                const array = it[0].concat(it[1]).filter(function (it) {
                    return !it.includes("(Missing required extension)") && !it.includes("valid identities found") && !it.includes("iPhone ") && !it.includes("com.apple.idms.appleid.prd.");
                }).map(function (it) {
                    return it.substring(it.indexOf(")") + 1).trim();
                });
                return Array.from(new Set(array));
            });
            if (keychain == null) {
                exports.findIdentityRawResult = findIdentityRawResult = result;
            }
        }
        return result;
    });

    return function getValidIdentities(_x14) {
        return _ref7.apply(this, arguments);
    };
})();

let _findIdentity = (() => {
    var _ref8 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (type, qualifier, keychain) {
        // https://github.com/electron-userland/electron-builder/issues/484
        //noinspection SpellCheckingInspection
        const lines = yield getValidIdentities(keychain);
        const namePrefix = `${type}:`;
        for (const line of lines) {
            if (qualifier != null && !line.includes(qualifier)) {
                continue;
            }
            if (line.includes(namePrefix)) {
                return parseIdentity(line);
            }
        }
        if (type === "Developer ID Application") {
            // find non-Apple certificate
            // https://github.com/electron-userland/electron-builder/issues/458
            l: for (const line of lines) {
                if (qualifier != null && !line.includes(qualifier)) {
                    continue;
                }
                if (line.includes("Mac Developer:")) {
                    continue;
                }
                for (const prefix of appleCertificatePrefixes) {
                    if (line.includes(prefix)) {
                        continue l;
                    }
                }
                return parseIdentity(line);
            }
        }
        return null;
    });

    return function _findIdentity(_x15, _x16, _x17) {
        return _ref8.apply(this, arguments);
    };
})();

exports.isSignAllowed = isSignAllowed;
exports.sign = sign;
exports.findIdentity = findIdentity;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _nodeHttpExecutor;

function _load_nodeHttpExecutor() {
    return _nodeHttpExecutor = require("builder-util/out/nodeHttpExecutor");
}

var _crypto;

function _load_crypto() {
    return _crypto = require("crypto");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _lazyVal;

function _load_lazyVal() {
    return _lazyVal = require("lazy-val");
}

var _os;

function _load_os() {
    return _os = require("os");
}

var _path = _interopRequireWildcard(require("path"));

var _tempFile;

function _load_tempFile() {
    return _tempFile = require("temp-file");
}

var _flags;

function _load_flags() {
    return _flags = require("./util/flags");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const appleCertificatePrefixes = exports.appleCertificatePrefixes = ["Developer ID Application:", "Developer ID Installer:", "3rd Party Mac Developer Application:", "3rd Party Mac Developer Installer:"];
function isSignAllowed(isPrintWarn = true) {
    if (process.platform !== "darwin") {
        if (isPrintWarn) {
            (0, (_builderUtil || _load_builderUtil()).warn)("macOS application code signing is supported only on macOS, skipping.");
        }
        return false;
    }
    const buildForPrWarning = "There are serious security concerns with CSC_FOR_PULL_REQUEST=true (see the  CircleCI documentation (https://circleci.com/docs/1.0/fork-pr-builds/) for details)" + "\nIf you have SSH keys, sensitive env vars or AWS credentials stored in your project settings and untrusted forks can make pull requests against your repo, then this option isn't for you.";
    if ((0, (_builderUtil || _load_builderUtil()).isPullRequest)()) {
        if ((0, (_builderUtil || _load_builderUtil()).isEnvTrue)(process.env.CSC_FOR_PULL_REQUEST)) {
            if (isPrintWarn) {
                (0, (_builderUtil || _load_builderUtil()).warn)(buildForPrWarning);
            }
        } else {
            if (isPrintWarn) {
                // https://github.com/electron-userland/electron-builder/issues/1524
                (0, (_builderUtil || _load_builderUtil()).warn)("Current build is a part of pull request, code signing will be skipped." + "\nSet env CSC_FOR_PULL_REQUEST to true to force code signing." + `\n${buildForPrWarning}`);
            }
            return false;
        }
    }
    return true;
}

const bundledCertKeychainAdded = new (_lazyVal || _load_lazyVal()).Lazy(createCustomCertKeychain);
function listUserKeychains() {
    return (0, (_builderUtil || _load_builderUtil()).exec)("security", ["list-keychains", "-d", "user"]).then(it => it.split("\n").map(it => {
        const r = it.trim();
        return r.substring(1, r.length - 1);
    }).filter(it => it.length > 0));
}
function sign(path, name, keychain) {
    const args = ["--deep", "--force", "--sign", name, path];
    if (keychain != null) {
        args.push("--keychain", keychain);
    }
    return (0, (_builderUtil || _load_builderUtil()).exec)("codesign", args);
}
let findIdentityRawResult = exports.findIdentityRawResult = null;

const _Identity = require("electron-osx-sign/util-identities").Identity;
function parseIdentity(line) {
    const firstQuoteIndex = line.indexOf('"');
    const name = line.substring(firstQuoteIndex + 1, line.lastIndexOf('"'));
    const hash = line.substring(0, firstQuoteIndex - 1);
    return new _Identity(name, hash);
}
function findIdentity(certType, qualifier, keychain) {
    let identity = qualifier || process.env.CSC_NAME;
    if ((0, (_builderUtil || _load_builderUtil()).isEmptyOrSpaces)(identity)) {
        if ((0, (_flags || _load_flags()).isAutoDiscoveryCodeSignIdentity)()) {
            return _findIdentity(certType, null, keychain);
        } else {
            return (_bluebirdLst2 || _load_bluebirdLst2()).default.resolve(null);
        }
    } else {
        identity = identity.trim();
        for (const prefix of appleCertificatePrefixes) {
            checkPrefix(identity, prefix);
        }
        return _findIdentity(certType, identity, keychain);
    }
}
function checkPrefix(name, prefix) {
    if (name.startsWith(prefix)) {
        throw new Error(`Please remove prefix "${prefix}" from the specified name — appropriate certificate will be chosen automatically`);
    }
}
//# sourceMappingURL=codeSign.js.map