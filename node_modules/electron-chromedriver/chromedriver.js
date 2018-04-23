#!/usr/bin/env node

var ChildProcess = require('child_process')
var path = require('path')

var command = path.join(__dirname, 'bin', 'chromedriver')
var args = process.argv.slice(2)
var options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit'
}

var chromeDriverProcess = ChildProcess.spawn(command, args, options)

var killChromeDriver = function () {
  try {
    chromeDriverProcess.kill()
  } catch (ignored) {
  }
}

process.on('exit', killChromeDriver)
process.on('SIGTERM', killChromeDriver)
