"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addCustomMessageFileInclude = exports.LangConfigurator = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

let writeCustomLangFile = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (data, packager) {
        const file = yield packager.getTempFile("messages.nsh");
        yield (0, (_fsExtraP || _load_fsExtraP()).outputFile)(file, data);
        return file;
    });

    return function writeCustomLangFile(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

let addCustomMessageFileInclude = exports.addCustomMessageFileInclude = (() => {
    var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (input, packager, scriptGenerator, langConfigurator) {
        const data = (0, (_jsYaml || _load_jsYaml()).safeLoad)((yield (0, (_fsExtraP || _load_fsExtraP()).readFile)(_path.join((_nsisUtil || _load_nsisUtil()).nsisTemplatesDir, input), "utf-8")));
        const instructions = computeCustomMessageTranslations(data, langConfigurator).join("\n");
        debug(instructions);
        scriptGenerator.include((yield writeCustomLangFile(instructions, packager)));
    });

    return function addCustomMessageFileInclude(_x3, _x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
})();

exports.createAddLangsMacro = createAddLangsMacro;

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _langs;

function _load_langs() {
    return _langs = require("builder-util/out/langs");
}

var _debug2 = _interopRequireDefault(require("debug"));

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _jsYaml;

function _load_jsYaml() {
    return _jsYaml = require("js-yaml");
}

var _path = _interopRequireWildcard(require("path"));

var _nsisUtil;

function _load_nsisUtil() {
    return _nsisUtil = require("./nsisUtil");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug2.default)("electron-builder:nsis");
class LangConfigurator {
    constructor(options) {
        const rawList = options.installerLanguages;
        if (options.unicode === false || rawList === null || Array.isArray(rawList) && rawList.length === 0) {
            this.isMultiLang = false;
        } else {
            this.isMultiLang = options.multiLanguageInstaller !== false;
        }
        if (this.isMultiLang) {
            this.langs = rawList == null ? (_langs || _load_langs()).bundledLanguages.slice() : (0, (_builderUtil || _load_builderUtil()).asArray)(rawList).map(it => (0, (_langs || _load_langs()).toLangWithRegion)(it.replace("-", "_")));
        } else {
            this.langs = ["en_US"];
        }
    }
}
exports.LangConfigurator = LangConfigurator;
function createAddLangsMacro(scriptGenerator, langConfigurator) {
    const result = [];
    for (const langWithRegion of langConfigurator.langs) {
        let name;
        if (langWithRegion === "zh_CN") {
            name = "SimpChinese";
        } else if (langWithRegion === "zh_TW") {
            name = "TradChinese";
        } else if (langWithRegion === "nb_NO") {
            name = "Norwegian";
        } else if (langWithRegion === "pt_BR") {
            name = "PortugueseBR";
        } else {
            const lang = langWithRegion.substring(0, langWithRegion.indexOf("_"));
            name = (_langs || _load_langs()).langIdToName[lang];
            if (name == null) {
                throw new Error(`Language name is unknown for ${lang}`);
            }
            if (name === "Spanish") {
                name = "SpanishInternational";
            }
        }
        result.push(`!insertmacro MUI_LANGUAGE "${name}"`);
    }
    scriptGenerator.macro("addLangs", result);
}

function computeCustomMessageTranslations(messages, langConfigurator) {
    const result = [];
    const includedLangs = new Set(langConfigurator.langs);
    for (const messageId of Object.keys(messages)) {
        const langToTranslations = messages[messageId];
        const unspecifiedLangs = new Set(langConfigurator.langs);
        for (const lang of Object.keys(langToTranslations)) {
            const langWithRegion = (0, (_langs || _load_langs()).toLangWithRegion)(lang);
            if (!includedLangs.has(langWithRegion)) {
                continue;
            }
            result.push(`LangString ${messageId} ${(_langs || _load_langs()).lcid[langWithRegion]} "${langToTranslations[lang].replace(/\n/g, "$\\r$\\n")}"`);
            unspecifiedLangs.delete(langWithRegion);
        }
        if (langConfigurator.isMultiLang) {
            const defaultTranslation = langToTranslations.en.replace(/\n/g, "$\\r$\\n");
            for (const langWithRegion of unspecifiedLangs) {
                result.push(`LangString ${messageId} ${(_langs || _load_langs()).lcid[langWithRegion]} "${defaultTranslation}"`);
            }
        }
    }
    return result;
}
//# sourceMappingURL=nsisLang.js.map