# dev-null [![build status](https://secure.travis-ci.org/thlorenz/dev-null.png)](http://travis-ci.org/thlorenz/dev-null)

`/dev/null` for node streams

Use it whenever you need to interrupt stream flow for instance if you want to log the state of a stream instead of its
output.

```js
// without devnull
var numbers = require('../test/fixtures/number-readable')

numbers({ to: 2 })
  .on('data', function (d) { console.log(d.toString()) });
// => 
// 0
// 1
// 2
```

```js
// piping into devnull
var devnull = require('dev-null');
var numbers = require('../test/fixtures/number-readable');

numbers({ to: 2 })
  .pipe(devnull())
  .on('data', function (d) { console.log(d.toString()) });

// => (no output)
```

## Installation

    npm install dev-null

## License

MIT
