'use strict';

var util = require('util')
  , stream = require('stream')
  , Readable = stream.Readable

module.exports = NumberReadable;

util.inherits(NumberReadable, Readable);

function NumberReadable (opts) {
  if (!(this instanceof NumberReadable)) return new NumberReadable(opts);
  Readable.call(this, opts);
  this.idx = 0;
  this.to = opts.to;
}

NumberReadable.prototype._read = function () {
  if (this.idx > this.to) return this.push(null);
  this.push('' + this.idx++);
}
