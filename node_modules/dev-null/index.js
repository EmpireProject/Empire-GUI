'use strict';

var util         =  require('util')
  , stream       =  require('stream')
  , Writable     =  stream.Writable
  , setImmediate =  setImmediate || function (fn) { setTimeout(fn, 0) }
  ;

module.exports = DevNull;

util.inherits(DevNull, Writable);

function DevNull (opts) {
  if (!(this instanceof DevNull)) return new DevNull(opts);

  opts = opts || {};
  Writable.call(this, opts);
}

DevNull.prototype._write = function (chunk, encoding, cb) {
  setImmediate(cb);
}
