"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NoOpTarget = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

exports.computeArchToTargetNamesMap = computeArchToTargetNamesMap;
exports.createTargets = createTargets;
exports.createCommonTarget = createCommonTarget;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _index;

function _load_index() {
    return _index = require("../index");
}

var _ArchiveTarget;

function _load_ArchiveTarget() {
    return _ArchiveTarget = require("./ArchiveTarget");
}

const archiveTargets = new Set(["zip", "7z", "tar.xz", "tar.lz", "tar.gz", "tar.bz2"]);
function computeArchToTargetNamesMap(raw, options, platform) {
    for (const targetNames of raw.values()) {
        if (targetNames.length > 0) {
            // https://github.com/electron-userland/electron-builder/issues/1355
            return raw;
        }
    }
    const defaultArchs = raw.size === 0 ? [platform === (_index || _load_index()).Platform.MAC ? "x64" : process.arch] : Array.from(raw.keys()).map(it => (_builderUtil || _load_builderUtil()).Arch[it]);
    const result = new Map(raw);
    for (const target of (0, (_builderUtil || _load_builderUtil()).asArray)(options.target).map(it => typeof it === "string" ? { target: it } : it)) {
        let name = target.target;
        let archs = target.arch;
        const suffixPos = name.lastIndexOf(":");
        if (suffixPos > 0) {
            name = target.target.substring(0, suffixPos);
            if (archs == null) {
                archs = target.target.substring(suffixPos + 1);
            }
        }
        for (const arch of archs == null ? defaultArchs : (0, (_builderUtil || _load_builderUtil()).asArray)(archs)) {
            (0, (_builderUtil || _load_builderUtil()).addValue)(result, (0, (_builderUtil || _load_builderUtil()).archFromString)(arch), name);
        }
    }
    if (result.size === 0) {
        for (const arch of defaultArchs) {
            result.set((0, (_builderUtil || _load_builderUtil()).archFromString)(arch), []);
        }
    }
    return result;
}
function createTargets(nameToTarget, rawList, outDir, packager) {
    const result = [];
    const mapper = (name, factory) => {
        let target = nameToTarget.get(name);
        if (target == null) {
            target = factory(outDir);
            nameToTarget.set(name, target);
        }
        result.push(target);
    };
    const targets = normalizeTargets(rawList, packager.defaultTarget);
    packager.createTargets(targets, mapper);
    return result;
}
function normalizeTargets(targets, defaultTarget) {
    const list = [];
    for (const t of targets) {
        const name = t.toLowerCase().trim();
        if (name === (_index || _load_index()).DEFAULT_TARGET) {
            list.push(...defaultTarget);
        } else {
            list.push(name);
        }
    }
    return list;
}
function createCommonTarget(target, outDir, packager) {
    if (archiveTargets.has(target)) {
        return new (_ArchiveTarget || _load_ArchiveTarget()).ArchiveTarget(target, outDir, packager);
    } else if (target === (_index || _load_index()).DIR_TARGET) {
        return new NoOpTarget((_index || _load_index()).DIR_TARGET);
    } else {
        throw new Error(`Unknown target: ${target}`);
    }
}
class NoOpTarget extends (_index || _load_index()).Target {
    constructor(name) {
        super(name);
        this.options = null;
    }
    get outDir() {
        throw new Error("NoOpTarget");
    }
    build(appOutDir, arch) {
        // no build

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {})();
    }
}
exports.NoOpTarget = NoOpTarget; //# sourceMappingURL=targetFactory.js.map