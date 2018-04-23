"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileMatcher = exports.excludedNames = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

exports.getMainFileMatchers = getMainFileMatchers;
exports.getFileMatchers = getFileMatchers;
exports.copyFiles = copyFiles;

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

var _minimatch;

function _load_minimatch() {
    return _minimatch = require("minimatch");
}

var _path = _interopRequireWildcard(require("path"));

var _core;

function _load_core() {
    return _core = require("./core");
}

var _filter;

function _load_filter() {
    return _filter = require("./util/filter");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/electron-userland/electron-builder/issues/733
const minimatchOptions = { dot: true };
// noinspection SpellCheckingInspection
const excludedNames = exports.excludedNames = ".git,.hg,.svn,CVS,RCS,SCCS," + "__pycache__,.DS_Store,thumbs.db,.gitignore,.gitkeep,.gitattributes,.npmignore," + ".idea,.vs,.flowconfig,.jshintrc,.eslintrc,.circleci," + ".yarn-integrity,.yarn-metadata.json,yarn-error.log,yarn.lock,package-lock.json,npm-debug.log," + "appveyor.yml,.travis.yml,circle.yml,.nyc_output";
/** @internal */
class FileMatcher {
    constructor(from, to, macroExpander, patterns) {
        this.macroExpander = macroExpander;
        this.excludePatterns = null;
        this.from = macroExpander(from);
        this.to = macroExpander(to);
        this.patterns = (0, (_builderUtil || _load_builderUtil()).asArray)(patterns).map(it => this.normalizePattern(it));
        this.isSpecifiedAsEmptyArray = Array.isArray(patterns) && patterns.length === 0;
    }
    normalizePattern(pattern) {
        if (pattern.startsWith("./")) {
            pattern = pattern.substring("./".length);
        }
        return _path.posix.normalize(this.macroExpander(pattern.replace(/\\/g, "/")));
    }
    addPattern(pattern) {
        this.patterns.push(this.normalizePattern(pattern));
    }
    prependPattern(pattern) {
        this.patterns.unshift(this.normalizePattern(pattern));
    }
    isEmpty() {
        return this.patterns.length === 0;
    }
    containsOnlyIgnore() {
        return !this.isEmpty() && this.patterns.find(it => !it.startsWith("!")) == null;
    }
    computeParsedPatterns(result, fromDir) {
        const relativeFrom = fromDir == null ? null : _path.relative(fromDir, this.from);
        if (this.patterns.length === 0 && relativeFrom != null) {
            // file mappings, from here is a file
            result.push(new (_minimatch || _load_minimatch()).Minimatch(relativeFrom, minimatchOptions));
            return;
        }
        for (let pattern of this.patterns) {
            if (relativeFrom != null) {
                pattern = _path.join(relativeFrom, pattern);
            }
            const parsedPattern = new (_minimatch || _load_minimatch()).Minimatch(pattern, minimatchOptions);
            result.push(parsedPattern);
            // do not add if contains dot (possibly file if has extension)
            if (!pattern.includes(".") && !(0, (_filter || _load_filter()).hasMagic)(parsedPattern)) {
                // https://github.com/electron-userland/electron-builder/issues/545
                // add **/*
                result.push(new (_minimatch || _load_minimatch()).Minimatch(`${pattern}/**/*`, minimatchOptions));
            }
        }
    }
    createFilter() {
        const parsedPatterns = [];
        this.computeParsedPatterns(parsedPatterns);
        return (0, (_filter || _load_filter()).createFilter)(this.from, parsedPatterns, this.excludePatterns);
    }
    toString() {
        return `from: ${this.from}, to: ${this.to}, patterns: ${this.patterns.join(", ")}`;
    }
}
exports.FileMatcher = FileMatcher; /** @internal */

function getMainFileMatchers(appDir, destination, macroExpander, platformSpecificBuildOptions, packager, outDir, isElectronCompile) {
    const buildResourceDir = _path.resolve(packager.info.projectDir, packager.buildResourcesDir);
    let matchers = packager.info.isPrepackedAppAsar ? null : getFileMatchers(packager.info.config, "files", appDir, destination, macroExpander, platformSpecificBuildOptions);
    if (matchers == null) {
        matchers = [new FileMatcher(appDir, destination, macroExpander)];
    }
    const matcher = matchers[0];
    // add default patterns, but only if from equals to app dir
    if (matcher.from !== appDir) {
        return matchers;
    }
    // https://github.com/electron-userland/electron-builder/issues/1741#issuecomment-311111418 so, do not use inclusive patterns
    const patterns = matcher.patterns;
    const customFirstPatterns = [];
    // electron-webpack - we need to copy only package.json and node_modules from root dir (and these files are added by default), so, explicit empty array is specified
    if (!matcher.isSpecifiedAsEmptyArray && (matcher.isEmpty() || matcher.containsOnlyIgnore())) {
        customFirstPatterns.push("**/*");
    } else {
        // prependPattern - user pattern should be after to be able to override
        // do not use **/node_modules/**/* because if pattern starts with **, all not explicitly excluded directories will be traversed (performance + empty dirs will be included into the asar)
        customFirstPatterns.push("node_modules/**/*");
        if (!patterns.includes("package.json")) {
            patterns.push("package.json");
        }
    }
    // https://github.com/electron-userland/electron-builder/issues/1482
    const relativeBuildResourceDir = _path.relative(matcher.from, buildResourceDir);
    if (relativeBuildResourceDir.length !== 0 && !relativeBuildResourceDir.startsWith(".")) {
        customFirstPatterns.push(`!${relativeBuildResourceDir}{,/**/*}`);
    }
    const relativeOutDir = matcher.normalizePattern(_path.relative(packager.info.projectDir, outDir));
    if (!relativeOutDir.startsWith(".")) {
        customFirstPatterns.push(`!${relativeOutDir}{,/**/*}`);
    }
    // add our default exclusions after last user possibly defined "all"/permissive pattern
    let insertIndex = 0;
    for (let i = patterns.length - 1; i >= 0; i--) {
        if (patterns[i].startsWith("**/")) {
            insertIndex = i + 1;
            break;
        }
    }
    patterns.splice(insertIndex, 0, ...customFirstPatterns);
    // not moved to copyNodeModules because depends on platform packager (for now, not easy)
    if (packager.platform !== (_core || _load_core()).Platform.WINDOWS) {
        // https://github.com/electron-userland/electron-builder/issues/1738
        patterns.push("!**/node_modules/**/*.{dll,exe}");
    }
    patterns.push(`!**/*.{iml,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,suo,xproj,cc,pdb}`);
    patterns.push("!**/._*");
    patterns.push("!**/electron-builder.{yaml,yml,json,json5,toml}");
    //noinspection SpellCheckingInspection
    patterns.push(`!**/{${excludedNames}}`);
    if (isElectronCompile) {
        patterns.push("!.cache{,/**/*}");
    }
    // https://github.com/electron-userland/electron-builder/issues/1969
    // exclude ony for app root, use .yarnclean to clean node_modules
    patterns.push("!.editorconfig");
    const debugLogger = packager.info.debugLogger;
    if (debugLogger.enabled) {
        //tslint:disable-next-line:no-invalid-template-strings
        debugLogger.add(`${macroExpander("${arch}")}.firstOrDefaultFilePatterns`, patterns);
    }
    return matchers;
}
/** @internal */
function getFileMatchers(config, name, defaultSrc, defaultDestination, macroExpander, customBuildOptions) {
    const globalPatterns = config[name];
    const platformSpecificPatterns = customBuildOptions[name];
    const defaultMatcher = new FileMatcher(defaultSrc, defaultDestination, macroExpander);
    const fileMatchers = [];
    function addPatterns(patterns) {
        if (patterns == null) {
            return;
        } else if (!Array.isArray(patterns)) {
            if (typeof patterns === "string") {
                defaultMatcher.addPattern(patterns);
                return;
            }
            patterns = [patterns];
        }
        for (const pattern of patterns) {
            if (typeof pattern === "string") {
                // use normalize to transform ./foo to foo
                defaultMatcher.addPattern(pattern);
            } else if (name === "asarUnpack") {
                throw new Error(`Advanced file copying not supported for "${name}"`);
            } else {
                const from = pattern.from == null ? defaultSrc : _path.resolve(defaultSrc, pattern.from);
                const to = pattern.to == null ? defaultDestination : _path.resolve(defaultDestination, pattern.to);
                fileMatchers.push(new FileMatcher(from, to, macroExpander, pattern.filter));
            }
        }
    }
    addPatterns(globalPatterns);
    addPatterns(platformSpecificPatterns);
    if (!defaultMatcher.isEmpty()) {
        // default matcher should be first in the array
        fileMatchers.unshift(defaultMatcher);
    }
    return fileMatchers.length === 0 ? null : fileMatchers;
}
/** @internal */
function copyFiles(matchers) {
    if (matchers == null || matchers.length === 0) {
        return (_bluebirdLst2 || _load_bluebirdLst2()).default.resolve();
    }
    return (_bluebirdLst2 || _load_bluebirdLst2()).default.map(matchers, (() => {
        var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (matcher) {
            const fromStat = yield (0, (_fs || _load_fs()).statOrNull)(matcher.from);
            if (fromStat == null) {
                (0, (_builderUtil || _load_builderUtil()).warn)(`File source ${matcher.from} doesn't exist`);
                return;
            }
            if (fromStat.isFile()) {
                const toStat = yield (0, (_fs || _load_fs()).statOrNull)(matcher.to);
                // https://github.com/electron-userland/electron-builder/issues/1245
                if (toStat != null && toStat.isDirectory()) {
                    return yield (0, (_fs || _load_fs()).copyOrLinkFile)(matcher.from, _path.join(matcher.to, _path.basename(matcher.from)), fromStat);
                }
                yield (0, (_fsExtraP || _load_fsExtraP()).mkdirs)(_path.dirname(matcher.to));
                return yield (0, (_fs || _load_fs()).copyOrLinkFile)(matcher.from, matcher.to, fromStat);
            }
            if (matcher.isEmpty() || matcher.containsOnlyIgnore()) {
                matcher.prependPattern("**/*");
            }
            if ((_builderUtil || _load_builderUtil()).debug.enabled) {
                (0, (_builderUtil || _load_builderUtil()).debug)(`Copying files using pattern: ${matcher}`);
            }
            return yield (0, (_fs || _load_fs()).copyDir)(matcher.from, matcher.to, { filter: matcher.createFilter() });
        });

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    })());
}
//# sourceMappingURL=fileMatcher.js.map