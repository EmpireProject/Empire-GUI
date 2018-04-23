const Mocha = require('mocha')
const { join, resolve } = require('path')

function createFromArgs (args) {
  const utils = Mocha.utils
  const mocha = new Mocha()

  // infinite stack traces (this was pulled from Mocha source, may not be necessary)
  Error.stackTraceLimit = Infinity

  mocha.reporter(args.reporter, args.reporterOptions)
  mocha.ui(args.ui)

  if (args.inlineDiffs) mocha.useInlineDiffs(true)
  if (args.slow) mocha.suite.slow(args.slow)
  if (!args.timeouts) mocha.enableTimeouts(false)
  if (args.timeout) mocha.suite.timeout(args.timeout)
  if (args.bail) mocha.bail(args.bail)
  if (args.grep) mocha.grep(new RegExp(args.grep))
  if (args.fgrep) mocha.grep(args.fgrep)
  if (args.invert) mocha.invert()
  if (args.checkLeaks) mocha.checkLeaks()
  mocha.globals(args.globals)

  // --no-colors
  mocha.useColors(args.colors)

  // default files to test/*.js
  let files = []
  const extensions = ['js']
  if (!args.files.length) args.files.push('test')
  args.files.forEach((arg) => {
    files = files.concat(utils.lookupFiles(arg, extensions, args.recursive))
  })

  args.compilers.forEach((compilers) => {
    let [ext, mod] = compilers.split(':')

    if (mod[0] === '.') mod = join(process.cwd(), mod)
    require(mod)
    extensions.push(ext)
  })

  args.require.forEach((mod) => {
    require(mod)
  })

  files = files.map((file) => resolve(file))

  if (args.sort) {
    files.sort()
  }

  mocha.files = files

  return mocha
}

function run (args, callback) {
  const mocha = createFromArgs(args)
  /* const runner = */ mocha.run(callback)
  // process.on('SIGINT', function () { runner.abort() })
}

module.exports = {
  createFromArgs,
  run
}
