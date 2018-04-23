"use strict";

exports.__esModule = true;
exports.default = void 0;

var _sourceMap = _interopRequireDefault(require("source-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SourceMap = function () {
  function SourceMap(opts, code) {
    this._cachedMap = null;
    this._code = code;
    this._opts = opts;
    this._rawMappings = [];
  }

  var _proto = SourceMap.prototype;

  _proto.get = function get() {
    if (!this._cachedMap) {
      var map = this._cachedMap = new _sourceMap.default.SourceMapGenerator({
        file: this._opts.sourceMapTarget,
        sourceRoot: this._opts.sourceRoot
      });
      var code = this._code;

      if (typeof code === "string") {
        map.setSourceContent(this._opts.sourceFileName, code);
      } else if (typeof code === "object") {
        Object.keys(code).forEach(function (sourceFileName) {
          map.setSourceContent(sourceFileName, code[sourceFileName]);
        });
      }

      this._rawMappings.forEach(map.addMapping, map);
    }

    return this._cachedMap.toJSON();
  };

  _proto.getRawMappings = function getRawMappings() {
    return this._rawMappings.slice();
  };

  _proto.mark = function mark(generatedLine, generatedColumn, line, column, identifierName, filename) {
    if (this._lastGenLine !== generatedLine && line === null) return;

    if (this._lastGenLine === generatedLine && this._lastSourceLine === line && this._lastSourceColumn === column) {
      return;
    }

    this._cachedMap = null;
    this._lastGenLine = generatedLine;
    this._lastSourceLine = line;
    this._lastSourceColumn = column;

    this._rawMappings.push({
      name: identifierName || undefined,
      generated: {
        line: generatedLine,
        column: generatedColumn
      },
      source: line == null ? undefined : filename || this._opts.sourceFileName,
      original: line == null ? undefined : {
        line: line,
        column: column
      }
    });
  };

  return SourceMap;
}();

exports.default = SourceMap;