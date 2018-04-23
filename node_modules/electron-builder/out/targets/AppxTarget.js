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

exports.quoteString = quoteString;

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

var _deepAssign;

function _load_deepAssign() {
    return _deepAssign = require("read-config-file/out/deepAssign");
}

var _core;

function _load_core() {
    return _core = require("../core");
}

var _pathManager;

function _load_pathManager() {
    return _pathManager = require("../util/pathManager");
}

var _windowsCodeSign;

function _load_windowsCodeSign() {
    return _windowsCodeSign = require("../windowsCodeSign");
}

var _targetUtil;

function _load_targetUtil() {
    return _targetUtil = require("./targetUtil");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const APPX_ASSETS_DIR_NAME = "appx";
const vendorAssetsForDefaultAssets = {
    "StoreLogo.png": "SampleAppx.50x50.png",
    "Square150x150Logo.png": "SampleAppx.150x150.png",
    "Square44x44Logo.png": "SampleAppx.44x44.png",
    "Wide310x150Logo.png": "SampleAppx.310x150.png"
};
const DEFAULT_RESOURCE_LANG = "en-US";
class AppXTarget extends (_core || _load_core()).Target {
    constructor(packager, outDir) {
        super("appx");
        this.packager = packager;
        this.outDir = outDir;
        this.options = (0, (_deepAssign || _load_deepAssign()).deepAssign)({}, this.packager.platformSpecificBuildOptions, this.packager.config.appx);
        if (process.platform !== "darwin" && (process.platform !== "win32" || (0, (_windowsCodeSign || _load_windowsCodeSign()).isOldWin6)())) {
            throw new Error("AppX is supported only on Windows 10 or Windows Server 2012 R2 (version number 6.3+)");
        }
    }
    // https://docs.microsoft.com/en-us/windows/uwp/packaging/create-app-package-with-makeappx-tool#mapping-files
    build(appOutDir, arch) {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const packager = _this.packager;
            const vendorPath = yield (0, (_windowsCodeSign || _load_windowsCodeSign()).getSignVendorPath)();
            const vm = yield packager.vm.value;
            const stageDir = yield (0, (_targetUtil || _load_targetUtil()).createHelperDir)(_this, arch);
            const mappingFile = stageDir.getTempFile("mapping.txt");
            const artifactName = packager.expandArtifactNamePattern(_this.options, "appx", arch);
            const artifactPath = _path.join(_this.outDir, artifactName);
            const makeAppXArgs = ["pack", "/o" /* overwrite the output file if it exists */
            , "/f", vm.toVmFile(mappingFile), "/p", vm.toVmFile(artifactPath)];
            if (packager.compression === "store") {
                makeAppXArgs.push("/nc");
            }
            const mappingList = [];
            mappingList.push((yield (_bluebirdLst2 || _load_bluebirdLst2()).default.map((0, (_fs || _load_fs()).walk)(appOutDir), function (file) {
                let appxPath = file.substring(appOutDir.length + 1);
                if (_path.sep !== "\\") {
                    appxPath = appxPath.replace(/\//g, "\\");
                }
                return `"${vm.toVmFile(file)}" "app\\${appxPath}"`;
            })));
            const userAssetDir = yield _this.packager.getResource(undefined, APPX_ASSETS_DIR_NAME);
            const assetInfo = yield AppXTarget.computeUserAssets(vm, vendorPath, userAssetDir);
            const userAssets = assetInfo.userAssets;
            const manifestFile = stageDir.getTempFile("AppxManifest.xml");
            yield _this.writeManifest((0, (_pathManager || _load_pathManager()).getTemplatePath)("appx"), manifestFile, arch, (yield _this.computePublisherName()), userAssets);
            mappingList.push(assetInfo.mappings);
            mappingList.push([`"${vm.toVmFile(manifestFile)}" "AppxManifest.xml"`]);
            if (isScaledAssetsProvided(userAssets)) {
                const outFile = vm.toVmFile(stageDir.getTempFile("resources.pri"));
                const makePriPath = vm.toVmFile(_path.join(vendorPath, "windows-10", (_builderUtil || _load_builderUtil()).Arch[arch], "makepri.exe"));
                const assetRoot = _path.join(stageDir.tempDir, "appx/assets");
                yield (0, (_fsExtraP || _load_fsExtraP()).emptyDir)(assetRoot);
                yield (_bluebirdLst2 || _load_bluebirdLst2()).default.map(assetInfo.allAssets, function (it) {
                    return (0, (_fs || _load_fs()).copyOrLinkFile)(it, _path.join(assetRoot, _path.basename(it)));
                });
                yield vm.exec(makePriPath, ["new", "/Overwrite", "/Manifest", vm.toVmFile(manifestFile), "/ProjectRoot", vm.toVmFile(_path.dirname(assetRoot)), "/ConfigXml", vm.toVmFile(_path.join((0, (_pathManager || _load_pathManager()).getTemplatePath)("appx"), "priconfig.xml")), "/OutputFile", outFile]);
                // in addition to resources.pri, resources.scale-140.pri and other such files will be generated
                for (const resourceFile of (yield (0, (_fsExtraP || _load_fsExtraP()).readdir)(stageDir.tempDir)).filter(function (it) {
                    return it.startsWith("resources.");
                }).sort()) {
                    mappingList.push([`"${vm.toVmFile(_path.join(stageDir.tempDir, resourceFile))}" "${resourceFile}"`]);
                }
                makeAppXArgs.push("/l");
            }
            let mapping = "[Files]";
            for (const list of mappingList) {
                mapping += "\r\n" + list.join("\r\n");
            }
            yield (0, (_fsExtraP || _load_fsExtraP()).writeFile)(mappingFile, mapping);
            packager.debugLogger.add("appx.mapping", mapping);
            if (_this.options.makeappxArgs != null) {
                makeAppXArgs.push(..._this.options.makeappxArgs);
            }
            yield vm.exec(vm.toVmFile(_path.join(vendorPath, "windows-10", (_builderUtil || _load_builderUtil()).Arch[arch], "makeappx.exe")), makeAppXArgs);
            yield packager.sign(artifactPath);
            yield stageDir.cleanup();
            packager.info.dispatchArtifactCreated({
                file: artifactPath,
                packager,
                arch,
                safeArtifactName: packager.computeSafeArtifactName(artifactName, "appx"),
                target: _this,
                isWriteUpdateInfo: _this.options.electronUpdaterAware
            });
        })();
    }
    static computeUserAssets(vm, vendorPath, userAssetDir) {
        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const mappings = [];
            let userAssets;
            const allAssets = [];
            if (userAssetDir == null) {
                userAssets = [];
            } else {
                userAssets = (yield (0, (_fsExtraP || _load_fsExtraP()).readdir)(userAssetDir)).filter(function (it) {
                    return !it.startsWith(".") && !it.endsWith(".db") && it.includes(".");
                });
                for (const name of userAssets) {
                    mappings.push(`"${vm.toVmFile(userAssetDir)}${vm.pathSep}${name}" "assets\\${name}"`);
                    allAssets.push(_path.join(userAssetDir, name));
                }
            }
            for (const defaultAsset of Object.keys(vendorAssetsForDefaultAssets)) {
                if (userAssets.length === 0 || !isDefaultAssetIncluded(userAssets, defaultAsset)) {
                    const file = _path.join(vendorPath, "appxAssets", vendorAssetsForDefaultAssets[defaultAsset]);
                    mappings.push(`"${vm.toVmFile(file)}" "assets\\${defaultAsset}"`);
                    allAssets.push(file);
                }
            }
            // we do not use process.arch to build path to tools, because even if you are on x64, ia32 appx tool must be used if you build appx for ia32
            return { userAssets, mappings, allAssets };
        })();
    }
    // https://github.com/electron-userland/electron-builder/issues/2108#issuecomment-333200711
    computePublisherName() {
        var _this2 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if ((yield _this2.packager.cscInfo.value) == null) {
                (0, (_builderUtil || _load_builderUtil()).log)("AppX is not signed (Windows Store only build)");
                return _this2.options.publisher || "CN=ms";
            }
            const publisher = yield _this2.packager.computedPublisherSubjectOnWindowsOnly.value;
            if (!publisher) {
                throw new Error("Internal error: cannot compute subject using certificate info");
            }
            return publisher;
        })();
    }
    writeManifest(templatePath, outFile, arch, publisher, userAssets) {
        var _this3 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const appInfo = _this3.packager.appInfo;
            const options = _this3.options;
            const manifest = (yield (0, (_fsExtraP || _load_fsExtraP()).readFile)(_path.join(templatePath, "appxmanifest.xml"), "utf8")).replace(/\$\{([a-zA-Z0-9]+)\}/g, function (match, p1) {
                switch (p1) {
                    case "publisher":
                        return publisher;
                    case "publisherDisplayName":
                        const name = options.publisherDisplayName || appInfo.companyName;
                        if (name == null) {
                            throw new Error(`Please specify "author" in the application package.json — it is required because "appx.publisherDisplayName" is not set.`);
                        }
                        return name;
                    case "version":
                        return appInfo.versionInWeirdWindowsForm;
                    case "applicationId":
                        const result = options.applicationId || options.identityName || appInfo.name;
                        if (!isNaN(parseInt(result[0], 10))) {
                            let message = `AppX Application.Id can’t start with numbers: "${result}"`;
                            if (options.applicationId == null) {
                                message += `\nPlease set appx.applicationId (or correct appx.identityName or name)`;
                            }
                            throw new Error(message);
                        }
                        return result;
                    case "identityName":
                        return options.identityName || appInfo.name;
                    case "executable":
                        return `app\\${appInfo.productFilename}.exe`;
                    case "displayName":
                        return options.displayName || appInfo.productName;
                    case "description":
                        return appInfo.description || appInfo.productName;
                    case "backgroundColor":
                        return options.backgroundColor || "#464646";
                    case "logo":
                        return "assets\\StoreLogo.png";
                    case "square150x150Logo":
                        return "assets\\Square150x150Logo.png";
                    case "square44x44Logo":
                        return "assets\\Square44x44Logo.png";
                    case "lockScreen":
                        return lockScreenTag(userAssets);
                    case "defaultTile":
                        return defaultTileTag(userAssets);
                    case "splashScreen":
                        return splashScreenTag(userAssets);
                    case "arch":
                        return arch === (_builderUtil || _load_builderUtil()).Arch.ia32 ? "x86" : "x64";
                    case "resourceLanguages":
                        return resourceLanguageTag((0, (_builderUtil || _load_builderUtil()).asArray)(options.languages));
                    default:
                        throw new Error(`Macro ${p1} is not defined`);
                }
            });
            yield (0, (_fsExtraP || _load_fsExtraP()).writeFile)(outFile, manifest);
        })();
    }
}
exports.default = AppXTarget; // get the resource - language tag, see https://docs.microsoft.com/en-us/windows/uwp/globalizing/manage-language-and-region#specify-the-supported-languages-in-the-apps-manifest

function resourceLanguageTag(userLanguages) {
    if (userLanguages == null || userLanguages.length === 0) {
        userLanguages = [DEFAULT_RESOURCE_LANG];
    }
    return userLanguages.map(it => `<Resource Language="${it.replace(/_/g, "-")}" />`).join("\n");
}
function lockScreenTag(userAssets) {
    if (isDefaultAssetIncluded(userAssets, "BadgeLogo.png")) {
        return '<uap:LockScreen Notification="badgeAndTileText" BadgeLogo="assets\\BadgeLogo.png" />';
    } else {
        return "";
    }
}
function defaultTileTag(userAssets) {
    const defaultTiles = ["<uap:DefaultTile", 'Wide310x150Logo="assets\\Wide310x150Logo.png"'];
    if (isDefaultAssetIncluded(userAssets, "LargeTile.png")) {
        defaultTiles.push('Square310x310Logo="assets\\LargeTile.png"');
    }
    if (isDefaultAssetIncluded(userAssets, "SmallTile.png")) {
        defaultTiles.push('Square71x71Logo="assets\\SmallTile.png"');
    }
    defaultTiles.push("/>");
    return defaultTiles.join(" ");
}
function splashScreenTag(userAssets) {
    if (isDefaultAssetIncluded(userAssets, "SplashScreen.png")) {
        return '<uap:SplashScreen Image="assets\\SplashScreen.png" />';
    } else {
        return "";
    }
}
function isDefaultAssetIncluded(userAssets, defaultAsset) {
    const defaultAssetName = defaultAsset.substring(0, defaultAsset.indexOf("."));
    return userAssets.some(it => it.includes(defaultAssetName));
}
function isScaledAssetsProvided(userAssets) {
    return userAssets.some(it => it.includes(".scale-") || it.includes(".targetsize-"));
}
function quoteString(s) {
    if (!s.includes(",") && !s.includes('"')) {
        return s;
    }
    return `"${s.replace(/"/g, '\\"')}"`;
}
//# sourceMappingURL=AppxTarget.js.map