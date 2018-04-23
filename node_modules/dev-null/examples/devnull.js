var devnull = require('../');
var numbers = require('../test/fixtures/number-readable');

numbers({ to: 3 })
  .pipe(devnull())
  .on('data', function (d) { console.log(d.toString()) });
