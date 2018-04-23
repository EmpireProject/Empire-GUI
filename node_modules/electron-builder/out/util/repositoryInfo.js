"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

let getGitUrlFromGitConfig = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (projectDir) {
        const data = yield (0, (_promise || _load_promise()).orNullIfFileNotExist)((0, (_fsExtraP || _load_fsExtraP()).readFile)(_path.join(projectDir, ".git", "config"), "utf8"));
        if (data == null) {
            return null;
        }
        const conf = data.split(/\r?\n/);
        const i = conf.indexOf('[remote "origin"]');
        if (i !== -1) {
            let u = conf[i + 1];
            if (!u.match(/^\s*url =/)) {
                u = conf[i + 2];
            }
            if (u.match(/^\s*url =/)) {
                return u.replace(/^\s*url = /, "");
            }
        }
        return null;
    });

    return function getGitUrlFromGitConfig(_x) {
        return _ref.apply(this, arguments);
    };
})();

let _getInfo = (() => {
    var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (projectDir, repo) {
        if (repo != null) {
            return parseRepositoryUrl(typeof repo === "string" ? repo : repo.url);
        }
        let url = process.env.TRAVIS_REPO_SLUG;
        if (url == null) {
            const user = process.env.APPVEYOR_ACCOUNT_NAME || process.env.CIRCLE_PROJECT_USERNAME;
            const project = process.env.APPVEYOR_PROJECT_NAME || process.env.CIRCLE_PROJECT_REPONAME;
            if (user != null && project != null) {
                return {
                    user,
                    project
                };
            }
            url = yield getGitUrlFromGitConfig(projectDir);
        }
        return url == null ? null : parseRepositoryUrl(url);
    });

    return function _getInfo(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
})();

exports.getRepositoryInfo = getRepositoryInfo;

var _promise;

function _load_promise() {
    return _promise = require("builder-util/out/promise");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _hostedGitInfo;

function _load_hostedGitInfo() {
    return _hostedGitInfo = require("hosted-git-info");
}

var _path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getRepositoryInfo(projectDir, metadata, devMetadata) {
    return _getInfo(projectDir, (devMetadata == null ? null : devMetadata.repository) || (metadata == null ? null : metadata.repository));
}

function parseRepositoryUrl(url) {
    const info = (0, (_hostedGitInfo || _load_hostedGitInfo()).fromUrl)(url);
    if (info != null) {
        delete info.protocols;
        delete info.treepath;
        delete info.filetemplate;
        delete info.bugstemplate;
        delete info.gittemplate;
        delete info.tarballtemplate;
        delete info.sshtemplate;
        delete info.sshurltemplate;
        delete info.browsetemplate;
        delete info.docstemplate;
        delete info.httpstemplate;
        delete info.shortcuttemplate;
        delete info.pathtemplate;
        delete info.pathmatch;
        delete info.protocols_re;
        delete info.committish;
        delete info.default;
        delete info.opts;
    }
    return info;
}
//# sourceMappingURL=repositoryInfo.js.map