var numbers = require('../test/fixtures/number-readable')

numbers({ to: 3 })
  .on('data', function (d) { console.log(d.toString()) });
