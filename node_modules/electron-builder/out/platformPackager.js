"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlatformPackager = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

exports.isSafeGithubName = isSafeGithubName;
exports.normalizeExt = normalizeExt;
exports.resolveFunction = resolveFunction;

var _asarIntegrity;

function _load_asarIntegrity() {
    return _asarIntegrity = require("asar-integrity");
}

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _fs;

function _load_fs() {
    return _fs = require("builder-util/out/fs");
}

var _promise;

function _load_promise() {
    return _promise = require("builder-util/out/promise");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _lazyVal;

function _load_lazyVal() {
    return _lazyVal = require("lazy-val");
}

var _path = _interopRequireWildcard(require("path"));

var _deepAssign;

function _load_deepAssign() {
    return _deepAssign = require("read-config-file/out/deepAssign");
}

var _asarFileChecker;

function _load_asarFileChecker() {
    return _asarFileChecker = require("./asar/asarFileChecker");
}

var _asarUtil;

function _load_asarUtil() {
    return _asarUtil = require("./asar/asarUtil");
}

var _core;

function _load_core() {
    return _core = require("./core");
}

var _fileMatcher;

function _load_fileMatcher() {
    return _fileMatcher = require("./fileMatcher");
}

var _fileTransformer;

function _load_fileTransformer() {
    return _fileTransformer = require("./fileTransformer");
}

var _dirPackager;

function _load_dirPackager() {
    return _dirPackager = require("./packager/dirPackager");
}

var _mac;

function _load_mac() {
    return _mac = require("./packager/mac");
}

var _appFileCopier;

function _load_appFileCopier() {
    return _appFileCopier = require("./util/appFileCopier");
}

var _AppFileCopierHelper;

function _load_AppFileCopierHelper() {
    return _AppFileCopierHelper = require("./util/AppFileCopierHelper");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlatformPackager {
    constructor(info) {
        this.info = info;
        this._resourceList = new (_lazyVal || _load_lazyVal()).Lazy(() => (0, (_promise || _load_promise()).orIfFileNotExist)((0, (_fsExtraP || _load_fsExtraP()).readdir)(this.buildResourcesDir), []));
        this.config = info.config;
        this.platformSpecificBuildOptions = PlatformPackager.normalizePlatformSpecificBuildOptions(this.config[this.platform.buildConfigurationKey]);
        this.appInfo = this.prepareAppInfo(info.appInfo);
        this.packagerOptions = info.options;
        this.projectDir = info.projectDir;
        this.buildResourcesDir = _path.resolve(this.projectDir, this.relativeBuildResourcesDirname);
    }
    get resourceList() {
        return this._resourceList.value;
    }
    get compression() {
        const compression = this.platformSpecificBuildOptions.compression;
        // explicitly set to null - request to use default value instead of parent (in the config)
        if (compression === null) {
            return "normal";
        }
        return compression || this.config.compression || "normal";
    }
    get debugLogger() {
        return this.info.debugLogger;
    }
    prepareAppInfo(appInfo) {
        return appInfo;
    }
    static normalizePlatformSpecificBuildOptions(options) {
        return options == null ? Object.create(null) : options;
    }
    getCscPassword() {
        const password = this.doGetCscPassword();
        if ((0, (_builderUtil || _load_builderUtil()).isEmptyOrSpaces)(password)) {
            (0, (_builderUtil || _load_builderUtil()).log)("CSC_KEY_PASSWORD is not defined, empty password will be used");
            return "";
        } else {
            return password.trim();
        }
    }
    doGetCscPassword() {
        const cscKeyPassword = this.packagerOptions.cscKeyPassword;
        // allow to specify as empty string
        return cscKeyPassword == null ? process.env.CSC_KEY_PASSWORD : cscKeyPassword;
    }
    get relativeBuildResourcesDirname() {
        return (0, (_builderUtil || _load_builderUtil()).use)(this.config.directories, it => it.buildResources) || "build";
    }
    computeAppOutDir(outDir, arch) {
        return this.packagerOptions.prepackaged || _path.join(outDir, `${this.platform.buildConfigurationKey}${(0, (_builderUtil || _load_builderUtil()).getArchSuffix)(arch)}${this.platform === (_core || _load_core()).Platform.MAC ? "" : "-unpacked"}`);
    }
    dispatchArtifactCreated(file, target, arch, safeArtifactName) {
        this.info.dispatchArtifactCreated({
            file, safeArtifactName, target, arch,
            packager: this
        });
    }
    pack(outDir, arch, targets, taskManager) {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const appOutDir = _this.computeAppOutDir(outDir, arch);
            yield _this.doPack(outDir, appOutDir, _this.platform.nodeName, arch, _this.platformSpecificBuildOptions, targets);
            _this.packageInDistributableFormat(appOutDir, arch, targets, taskManager);
        })();
    }
    packageInDistributableFormat(appOutDir, arch, targets, taskManager) {
        taskManager.addTask((_bluebirdLst2 || _load_bluebirdLst2()).default.map(targets, it => it.isAsyncSupported ? it.build(appOutDir, arch) : null).then(() => (_bluebirdLst2 || _load_bluebirdLst2()).default.each(targets, it => it.isAsyncSupported ? null : it.build(appOutDir, arch))));
    }
    getExtraFileMatchers(isResources, appOutDir, macroExpander, customBuildOptions) {
        const base = isResources ? this.getResourcesDir(appOutDir) : this.platform === (_core || _load_core()).Platform.MAC ? _path.join(appOutDir, `${this.appInfo.productFilename}.app`, "Contents") : appOutDir;
        return (0, (_fileMatcher || _load_fileMatcher()).getFileMatchers)(this.config, isResources ? "extraResources" : "extraFiles", this.projectDir, base, macroExpander, customBuildOptions);
    }
    get electronDistMacOsAppName() {
        return this.config.muonVersion == null ? "Electron.app" : "Brave.app";
    }
    get electronDistExecutableName() {
        return this.config.muonVersion == null ? "electron" : "brave";
    }
    get electronDistMacOsExecutableName() {
        return this.config.muonVersion == null ? "Electron" : "Brave";
    }
    doPack(outDir, appOutDir, platformName, arch, platformSpecificBuildOptions, targets) {
        var _this2 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if (_this2.packagerOptions.prepackaged != null) {
                return;
            }
            const asarOptions = yield _this2.computeAsarOptions(platformSpecificBuildOptions);
            const macroExpander = function (it) {
                return _this2.expandMacro(it, arch == null ? null : (_builderUtil || _load_builderUtil()).Arch[arch], { "/*": "{,/**/*}" });
            };
            const resourcesPath = _this2.platform === (_core || _load_core()).Platform.MAC ? _path.join(appOutDir, _this2.electronDistMacOsAppName, "Contents", "Resources") : _path.join(appOutDir, "resources");
            const muonVersion = _this2.config.muonVersion;
            const isElectron = muonVersion == null;
            const config = _this2.config;
            (0, (_builderUtil || _load_builderUtil()).log)(`Packaging for ${platformName} ${(_builderUtil || _load_builderUtil()).Arch[arch]} using ${isElectron ? `electron ${config.electronVersion}` : `muon ${muonVersion}`} to ${_path.relative(_this2.projectDir, appOutDir)}`);
            if (_this2.info.isPrepackedAppAsar) {
                yield (0, (_dirPackager || _load_dirPackager()).unpackElectron)(_this2, appOutDir, platformName, (_builderUtil || _load_builderUtil()).Arch[arch], config.electronVersion);
            } else {
                yield isElectron ? (0, (_dirPackager || _load_dirPackager()).unpackElectron)(_this2, appOutDir, platformName, (_builderUtil || _load_builderUtil()).Arch[arch], config.electronVersion) : (0, (_dirPackager || _load_dirPackager()).unpackMuon)(_this2, appOutDir, platformName, (_builderUtil || _load_builderUtil()).Arch[arch], muonVersion);
            }
            const excludePatterns = [];
            const computeParsedPatterns = function (patterns) {
                if (patterns != null) {
                    for (const pattern of patterns) {
                        pattern.computeParsedPatterns(excludePatterns, _this2.info.projectDir);
                    }
                }
            };
            const extraResourceMatchers = _this2.getExtraFileMatchers(true, appOutDir, macroExpander, platformSpecificBuildOptions);
            computeParsedPatterns(extraResourceMatchers);
            const extraFileMatchers = _this2.getExtraFileMatchers(false, appOutDir, macroExpander, platformSpecificBuildOptions);
            computeParsedPatterns(extraFileMatchers);
            const packContext = {
                appOutDir, outDir, arch, targets,
                packager: _this2,
                electronPlatformName: platformName
            };
            const taskManager = new (_builderUtil || _load_builderUtil()).AsyncTaskManager(_this2.info.cancellationToken);
            _this2.copyAppFiles(taskManager, asarOptions, resourcesPath, outDir, platformSpecificBuildOptions, excludePatterns, macroExpander);
            taskManager.addTask((0, (_fs || _load_fs()).unlinkIfExists)(_path.join(resourcesPath, "default_app.asar")));
            taskManager.addTask((0, (_fs || _load_fs()).unlinkIfExists)(_path.join(appOutDir, "version")));
            taskManager.addTask(_this2.postInitApp(packContext));
            if (_this2.platform !== (_core || _load_core()).Platform.MAC) {
                taskManager.addTask((0, (_fsExtraP || _load_fsExtraP()).rename)(_path.join(appOutDir, "LICENSE"), _path.join(appOutDir, "LICENSE.electron.txt")).catch(function () {}));
            }
            yield taskManager.awaitTasks();
            if (platformName === "darwin" || platformName === "mas") {
                yield (0, (_mac || _load_mac()).createMacApp)(_this2, appOutDir, asarOptions == null ? null : yield (0, (_asarIntegrity || _load_asarIntegrity()).computeData)(resourcesPath, asarOptions.externalAllowed ? { externalAllowed: true } : null));
            }
            yield (_bluebirdLst2 || _load_bluebirdLst2()).default.each([extraResourceMatchers, extraFileMatchers], function (it) {
                return (0, (_fileMatcher || _load_fileMatcher()).copyFiles)(it);
            });
            if (_this2.info.cancellationToken.cancelled) {
                return;
            }
            yield _this2.info.afterPack(packContext);
            yield _this2.sanityCheckPackage(appOutDir, asarOptions != null);
            yield _this2.signApp(packContext);
        })();
    }
    copyAppFiles(taskManager, asarOptions, resourcePath, outDir, platformSpecificBuildOptions, excludePatterns, macroExpander) {
        const appDir = this.info.appDir;
        const config = this.config;
        const isElectronCompile = asarOptions != null && (0, (_fileTransformer || _load_fileTransformer()).isElectronCompileUsed)(this.info);
        const defaultDestination = _path.join(resourcePath, "app");
        const mainMatchers = (0, (_fileMatcher || _load_fileMatcher()).getMainFileMatchers)(appDir, defaultDestination, macroExpander, platformSpecificBuildOptions, this, outDir, isElectronCompile);
        if (excludePatterns.length > 0) {
            for (const matcher of mainMatchers) {
                matcher.excludePatterns = excludePatterns;
            }
        }
        const transformer = (0, (_fileTransformer || _load_fileTransformer()).createTransformer)(appDir, isElectronCompile ? Object.assign({ originalMain: this.info.metadata.main, main: (_AppFileCopierHelper || _load_AppFileCopierHelper()).ELECTRON_COMPILE_SHIM_FILENAME }, config.extraMetadata) : config.extraMetadata);
        const _computeFileSets = matchers => {
            return (0, (_AppFileCopierHelper || _load_AppFileCopierHelper()).computeFileSets)(matchers, transformer, this.info, isElectronCompile).then(it => it.filter(it => it.files.length > 0));
        };
        if (this.info.isPrepackedAppAsar) {
            taskManager.addTask((_bluebirdLst2 || _load_bluebirdLst2()).default.each(_computeFileSets([new (_fileMatcher || _load_fileMatcher()).FileMatcher(appDir, resourcePath, macroExpander)]), it => (0, (_appFileCopier || _load_appFileCopier()).copyAppFiles)(it, this.info)));
        } else if (asarOptions == null) {
            taskManager.addTask((_bluebirdLst2 || _load_bluebirdLst2()).default.each(_computeFileSets(mainMatchers), it => (0, (_appFileCopier || _load_appFileCopier()).copyAppFiles)(it, this.info)));
        } else {
            const unpackPattern = (0, (_fileMatcher || _load_fileMatcher()).getFileMatchers)(config, "asarUnpack", appDir, defaultDestination, macroExpander, platformSpecificBuildOptions);
            const fileMatcher = unpackPattern == null ? null : unpackPattern[0];
            taskManager.addTask(_computeFileSets(mainMatchers).then(fileSets => new (_asarUtil || _load_asarUtil()).AsarPackager(appDir, resourcePath, asarOptions, fileMatcher == null ? null : fileMatcher.createFilter()).pack(fileSets, this)));
        }
    }
    // tslint:disable-next-line:no-empty
    postInitApp(packContext) {
        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {})();
    }
    signApp(packContext) {
        return (_bluebirdLst2 || _load_bluebirdLst2()).default.resolve();
    }
    getIconPath() {
        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            return null;
        })();
    }
    computeAsarOptions(customBuildOptions) {
        var _this3 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            function errorMessage(name) {
                return `${name} is deprecated is deprecated and not supported — please use asarUnpack`;
            }
            const buildMetadata = _this3.config;
            if (buildMetadata["asar-unpack"] != null) {
                throw new Error(errorMessage("asar-unpack"));
            }
            if (buildMetadata["asar-unpack-dir"] != null) {
                throw new Error(errorMessage("asar-unpack-dir"));
            }
            const platformSpecific = customBuildOptions.asar;
            const result = platformSpecific == null ? _this3.config.asar : platformSpecific;
            if (result === false) {
                const appAsarStat = yield (0, (_fs || _load_fs()).statOrNull)(_path.join(_this3.info.appDir, "app.asar"));
                //noinspection ES6MissingAwait
                if (appAsarStat == null || !appAsarStat.isFile()) {
                    (0, (_builderUtil || _load_builderUtil()).warn)("Packaging using asar archive is disabled — it is strongly not recommended.\n" + "Please enable asar and use asarUnpack to unpack files that must be externally available.");
                }
                return null;
            }
            if (result == null || result === true) {
                return {};
            }
            for (const name of ["unpackDir", "unpack"]) {
                if (result[name] != null) {
                    throw new Error(errorMessage(`asar.${name}`));
                }
            }
            return (0, (_deepAssign || _load_deepAssign()).deepAssign)({}, result);
        })();
    }
    getElectronSrcDir(dist) {
        return _path.resolve(this.projectDir, dist);
    }
    getElectronDestinationDir(appOutDir) {
        return appOutDir;
    }
    getResourcesDir(appOutDir) {
        return this.platform === (_core || _load_core()).Platform.MAC ? this.getMacOsResourcesDir(appOutDir) : _path.join(appOutDir, "resources");
    }
    getMacOsResourcesDir(appOutDir) {
        return _path.join(appOutDir, `${this.appInfo.productFilename}.app`, "Contents", "Resources");
    }
    checkFileInPackage(resourcesDir, file, messagePrefix, isAsar) {
        var _this4 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const relativeFile = _path.relative(_this4.info.appDir, _path.resolve(_this4.info.appDir, file));
            if (isAsar) {
                yield (0, (_asarFileChecker || _load_asarFileChecker()).checkFileInArchive)(_path.join(resourcesDir, "app.asar"), relativeFile, messagePrefix);
                return;
            }
            const pathParsed = _path.parse(file);
            // Even when packaging to asar is disabled, it does not imply that the main file can not be inside an .asar archive.
            // This may occur when the packaging is done manually before processing with electron-builder.
            if (pathParsed.dir.includes(".asar")) {
                // The path needs to be split to the part with an asar archive which acts like a directory and the part with
                // the path to main file itself. (e.g. path/arch.asar/dir/index.js -> path/arch.asar, dir/index.js)
                const pathSplit = pathParsed.dir.split(_path.sep);
                let partWithAsarIndex = 0;
                pathSplit.some(function (pathPart, index) {
                    partWithAsarIndex = index;
                    return pathPart.endsWith(".asar");
                });
                const asarPath = _path.join.apply(_path, pathSplit.slice(0, partWithAsarIndex + 1));
                let mainPath = pathSplit.length > partWithAsarIndex + 1 ? _path.join.apply(pathSplit.slice(partWithAsarIndex + 1)) : "";
                mainPath += _path.join(mainPath, pathParsed.base);
                yield (0, (_asarFileChecker || _load_asarFileChecker()).checkFileInArchive)(_path.join(resourcesDir, "app", asarPath), mainPath, messagePrefix);
            } else {
                const outStat = yield (0, (_fs || _load_fs()).statOrNull)(_path.join(resourcesDir, "app", relativeFile));
                if (outStat == null) {
                    throw new Error(`${messagePrefix} "${relativeFile}" does not exist. Seems like a wrong configuration.`);
                } else {
                    //noinspection ES6MissingAwait
                    if (!outStat.isFile()) {
                        throw new Error(`${messagePrefix} "${relativeFile}" is not a file. Seems like a wrong configuration.`);
                    }
                }
            }
        })();
    }
    sanityCheckPackage(appOutDir, isAsar) {
        var _this5 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const outStat = yield (0, (_fs || _load_fs()).statOrNull)(appOutDir);
            if (outStat == null) {
                throw new Error(`Output directory "${appOutDir}" does not exist. Seems like a wrong configuration.`);
            } else {
                //noinspection ES6MissingAwait
                if (!outStat.isDirectory()) {
                    throw new Error(`Output directory "${appOutDir}" is not a directory. Seems like a wrong configuration.`);
                }
            }
            const resourcesDir = _this5.getResourcesDir(appOutDir);
            yield _this5.checkFileInPackage(resourcesDir, _this5.info.metadata.main || "index.js", "Application entry file", isAsar);
            yield _this5.checkFileInPackage(resourcesDir, "package.json", "Application", isAsar);
        })();
    }
    computeSafeArtifactName(suggestedName, ext, arch, skipArchIfX64 = true) {
        // GitHub only allows the listed characters in file names.
        if (suggestedName != null && isSafeGithubName(suggestedName)) {
            return null;
        }
        // tslint:disable-next-line:no-invalid-template-strings
        return this.computeArtifactName("${name}-${version}-${arch}.${ext}", ext, skipArchIfX64 && arch === (_builderUtil || _load_builderUtil()).Arch.x64 ? null : arch);
    }
    expandArtifactNamePattern(targetSpecificOptions, ext, arch, defaultPattern, skipArchIfX64 = true) {
        let pattern = targetSpecificOptions == null ? null : targetSpecificOptions.artifactName;
        if (pattern == null) {
            // tslint:disable-next-line:no-invalid-template-strings
            pattern = this.platformSpecificBuildOptions.artifactName || this.config.artifactName || defaultPattern || "${productName}-${version}-${arch}.${ext}";
        }
        return this.computeArtifactName(pattern, ext, skipArchIfX64 && arch === (_builderUtil || _load_builderUtil()).Arch.x64 ? null : arch);
    }
    computeArtifactName(pattern, ext, arch) {
        let archName = arch == null ? null : (_builderUtil || _load_builderUtil()).Arch[arch];
        if (arch === (_builderUtil || _load_builderUtil()).Arch.x64) {
            if (ext === "AppImage" || ext === "rpm") {
                archName = "x86_64";
            } else if (ext === "deb") {
                archName = "amd64";
            }
        } else if (arch === (_builderUtil || _load_builderUtil()).Arch.ia32) {
            if (ext === "deb" || ext === "AppImage") {
                archName = "i386";
            } else if (ext === "pacman" || ext === "rpm") {
                archName = "i686";
            }
        }
        return this.expandMacro(pattern, this.platform === (_core || _load_core()).Platform.MAC ? null : archName, {
            ext
        });
    }
    expandMacro(pattern, arch, extra = {}, isProductNameSanitized = true) {
        if (arch == null) {
            pattern = pattern.replace("-${arch}", "").replace(" ${arch}", "").replace("_${arch}", "").replace("/${arch}", "");
        }
        const appInfo = this.appInfo;
        return pattern.replace(/\${([_a-zA-Z./*]+)}/g, (match, p1) => {
            switch (p1) {
                case "productName":
                    return isProductNameSanitized ? appInfo.productFilename : appInfo.productName;
                case "arch":
                    if (arch == null) {
                        // see above, we remove macro if no arch
                        return "";
                    }
                    return arch;
                case "os":
                    return this.platform.buildConfigurationKey;
                case "channel":
                    return appInfo.channel || "latest";
                default:
                    if (p1 in appInfo) {
                        return appInfo[p1];
                    }
                    if (p1.startsWith("env.")) {
                        const envName = p1.substring("env.".length);
                        const envValue = process.env[envName];
                        if (envValue == null) {
                            throw new Error(`Env ${envName} is not defined`);
                        }
                        return envValue;
                    }
                    const value = extra[p1];
                    if (value == null) {
                        throw new Error(`Macro ${p1} is not defined`);
                    } else {
                        return value;
                    }
            }
        });
    }
    generateName(ext, arch, deployment, classifier = null) {
        let c = null;
        let e = null;
        if (arch === (_builderUtil || _load_builderUtil()).Arch.x64) {
            if (ext === "AppImage") {
                c = "x86_64";
            } else if (ext === "deb") {
                c = "amd64";
            }
        } else if (arch === (_builderUtil || _load_builderUtil()).Arch.ia32 && ext === "deb") {
            c = "i386";
        } else if (ext === "pacman") {
            if (arch === (_builderUtil || _load_builderUtil()).Arch.ia32) {
                c = "i686";
            }
            e = "pkg.tar.xz";
        } else {
            c = (_builderUtil || _load_builderUtil()).Arch[arch];
        }
        if (c == null) {
            c = classifier;
        } else if (classifier != null) {
            c += `-${classifier}`;
        }
        if (e == null) {
            e = ext;
        }
        return this.generateName2(e, c, deployment);
    }
    generateName2(ext, classifier, deployment) {
        const dotExt = ext == null ? "" : `.${ext}`;
        const separator = ext === "deb" ? "_" : "-";
        return `${deployment ? this.appInfo.name : this.appInfo.productFilename}${separator}${this.appInfo.version}${classifier == null ? "" : `${separator}${classifier}`}${dotExt}`;
    }
    getDefaultIcon(ext) {
        var _this6 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const resourceList = yield _this6.resourceList;
            const name = `icon.${ext}`;
            if (resourceList.includes(name)) {
                return _path.join(_this6.buildResourcesDir, name);
            } else {
                (0, (_builderUtil || _load_builderUtil()).warn)("Application icon is not set, default Electron icon will be used");
                return null;
            }
        })();
    }
    getTempFile(suffix) {
        return this.info.tempDirManager.getTempFile({ suffix });
    }
    getTempDir(suffix) {
        return this.info.tempDirManager.getTempDir(suffix == null ? undefined : { suffix });
    }
    get fileAssociations() {
        return (0, (_builderUtil || _load_builderUtil()).asArray)(this.config.fileAssociations).concat((0, (_builderUtil || _load_builderUtil()).asArray)(this.platformSpecificBuildOptions.fileAssociations));
    }
    getResource(custom, ...names) {
        var _this7 = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            if (custom === undefined) {
                const resourceList = yield _this7.resourceList;
                for (const name of names) {
                    if (resourceList.includes(name)) {
                        return _path.join(_this7.buildResourcesDir, name);
                    }
                }
            } else if (custom != null && !(0, (_builderUtil || _load_builderUtil()).isEmptyOrSpaces)(custom)) {
                const resourceList = yield _this7.resourceList;
                if (resourceList.includes(custom)) {
                    return _path.join(_this7.buildResourcesDir, custom);
                }
                let p = _path.resolve(_this7.buildResourcesDir, custom);
                if ((yield (0, (_fs || _load_fs()).statOrNull)(p)) == null) {
                    p = _path.resolve(_this7.projectDir, custom);
                    if ((yield (0, (_fs || _load_fs()).statOrNull)(p)) == null) {
                        throw new Error(`Cannot find specified resource "${custom}", nor relative to "${_this7.buildResourcesDir}", neither relative to project dir ("${_this7.projectDir}")`);
                    }
                }
                return p;
            }
            return null;
        })();
    }
    get forceCodeSigning() {
        const forceCodeSigningPlatform = this.platformSpecificBuildOptions.forceCodeSigning;
        return (forceCodeSigningPlatform == null ? this.config.forceCodeSigning : forceCodeSigningPlatform) || false;
    }
}
exports.PlatformPackager = PlatformPackager;
function isSafeGithubName(name) {
    return (/^[0-9A-Za-z._-]+$/.test(name)
    );
}
// remove leading dot
function normalizeExt(ext) {
    return ext.startsWith(".") ? ext.substring(1) : ext;
}
function resolveFunction(executor) {
    if (typeof executor !== "string") {
        return executor;
    }
    let p = executor;
    if (p.startsWith(".")) {
        p = _path.resolve(p);
    }
    try {
        p = require.resolve(p);
    } catch (e) {
        (0, (_builderUtil || _load_builderUtil()).debug)(e);
        p = _path.resolve(p);
    }
    const m = require(p);
    return m.default || m;
}
//# sourceMappingURL=platformPackager.js.map