const fs = require('fs')
const { join, resolve } = require('path')
const program = require('commander')
const cwd = process.cwd()

function parse (argv) {
  program._name = 'electron-mocha'
  program
    .version(require('./package').version)
    .usage('[options] [files]')
    .option('-C, --no-colors', 'force disabling of colors')
    .option('-O, --reporter-options <k=v,k2=v2,...>', 'reporter-specific options')
    .option('-R, --reporter <name>', 'specify the reporter to use', 'spec')
    .option('-S, --sort', 'sort test files')
    .option('-b, --bail', 'bail after first test failure')
    .option('-g, --grep <pattern>', 'only run tests matching <pattern>')
    .option('-f, --fgrep <string>', 'only run tests containing <string>')
    .option('-i, --invert', 'inverts --grep and --fgrep matches')
    .option('-r, --require <name>', 'require the given module', modules, [])
    .option('-s, --slow <ms>', '"slow" test threshold in milliseconds [75]')
    .option('-t, --timeout <ms>', 'set test-case timeout in milliseconds [2000]')
    .option('-u, --ui <name>', 'specify user-interface (bdd|tdd|exports)', 'bdd')
    .option('--check-leaks', 'check for global variable leaks')
    .option('--compilers <ext>:<module>,...', 'use the given module(s) to compile files', list, [])
    .option('--debug', 'enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools')
    .option('--debug-brk', 'like --debug but pauses the script on the first line')
    .option('--globals <names>', 'allow the given comma-delimited global [names]', list, [])
    .option('--inline-diffs', 'display actual/expected differences inline within each string')
    .option('--interactive', 'run tests in renderer process in a visible window that can be reloaded to re-run tests')
    .option('--interfaces', 'display available interfaces')
    .option('--no-timeouts', 'disables timeouts')
    .option('--opts <path>', 'specify opts path', 'test/mocha.opts')
    .option('--recursive', 'include sub directories')
    .option('--renderer', 'run tests in renderer process')
    .option('--preload <name>', 'preload the given script in renderer process', modules, [])
    .option('--require-main <name>', 'load the given script in main process before executing tests', modules, [])

  module.paths.push(cwd, join(cwd, 'node_modules'))

  program.parse(argv)
  const argData = JSON.parse(JSON.stringify(program))
  argData.files = argData.args

  if (argData.debugBrk) {
    argData.debug = true
  }

  // reporter options
  var reporterOptions = {}
  if (program.reporterOptions !== undefined) {
    program.reporterOptions.split(',').forEach(function (opt) {
      var L = opt.split('=')
      if (L.length > 2 || L.length === 0) {
        throw new Error("invalid reporter option '" + opt + "'")
      } else if (L.length === 2) {
        reporterOptions[L[0]] = L[1]
      } else {
        reporterOptions[L[0]] = true
      }
    })
  }
  argData['reporterOptions'] = reporterOptions

  // delete unused
  ;['commands', 'options', '_execs', '_args', '_name', '_events', '_usage', '_version', '_eventsCount', 'args'].forEach(function (key) {
    delete argData[key]
  })

  return argData
}

function list (str) {
  return str.split(/ *, */)
}

function modules (mod, memo) {
  const abs = fs.existsSync(mod) || fs.existsSync(mod + '.js')
  if (abs) mod = resolve(mod)
  memo.push(mod)
  return memo
}

module.exports = {
  parse
}
