var fs = require('fs')
var path = require('path')
var electronDownload = require('electron-download')
var extractZip = require('extract-zip')

var versionSegments = require('./package').version.split('.')

electronDownload({
  version: versionSegments[0] + '.' + versionSegments[1] + '.0',
  chromedriver: true,
  platform: process.env.npm_config_platform,
  arch: process.env.npm_config_arch,
  strictSSL: process.env.npm_config_strict_ssl === 'true',
  quiet: ['info', 'verbose', 'silly', 'http'].indexOf(process.env.npm_config_loglevel) === -1
}, function (error, zipPath) {
  if (error != null) throw error

  extractZip(zipPath, {dir: path.join(__dirname, 'bin')}, function (error) {
    if (error != null) throw error

    if (process.platform !== 'win32') {
      fs.chmod(path.join(__dirname, 'bin', 'chromedriver'), '755', function (error) {
        if (error != null) throw error
      })
    }
  })
})
