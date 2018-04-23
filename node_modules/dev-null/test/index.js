'use strict';
/*jshint asi: true */

var test = require('tap').test
var devnull = require('../');
var tapstream = require('tap-stream')
var numbers = require('./fixtures/number-readable')

test('\npiping without devnull', function (t) {
  var data = [];
  numbers({ to: 2 })
    .on('data', function (d) { data.push(d) })
    .on('end', function () { 
      t.equal(data.length, 3, 'streams 3 numbers')
      t.end()
    })
})

test('\npiping through devnull', function (t) {
  var data = [];
  numbers({ to: 2 })
    .on('end', function () { 
      t.equal(data.length, 0, 'streams 0 numbers')
      t.end()
    })
    .pipe(devnull())
    .on('data', function (d) { data.push(d) })
})
