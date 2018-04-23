var path = require('path')
var BrowserWindow = require('electron').BrowserWindow
var wargs = require('./args')

// retain global references, if not, window will be closed automatically when
// garbage collected
var _windows = {}

function _createWindow (options) {
  var opts = Object.assign({
    show: false
  }, options)

  opts.webPreferences = Object.assign({
    preload: path.join(__dirname, 'renderer-preload')
  }, options.webPreferences)

  var window = new BrowserWindow(opts)
  _windows[window.id] = window

  return window
}

// should not need to be called directly, but just in case
// window.destroy() is ever called
function _unref () {
  delete _windows[this.id]
}

function _loadURLWithArgs (httpOrFileUrl, args, callback) {
  if (typeof args === 'function') {
    callback = args
    args = null
  }

  var win = this
  win.webContents.once('did-finish-load', function () {
    callback.apply(this, arguments)
  })

  var url = wargs.urlWithArgs(httpOrFileUrl, args)

  win.loadURL(url)
}

function createWindow (options) {
  var window = _createWindow(options)
  window.unref = _unref.bind(window)
  window.once('close', window.unref)
  window._loadURLWithArgs = _loadURLWithArgs.bind(window)

  window.showURL = function (httpOrFileUrl, args, callback) {
    if (typeof args === 'function') {
      callback = args
      args = null
    }

    window._loadURLWithArgs(httpOrFileUrl, args, function () {
      window.show()
      callback && callback.apply(this, arguments)
    })
  }

  window.showUrl = window.showURL // backwards-compatibility

  return window
}

module.exports = {
  createWindow: createWindow,
  windows: _windows,
  _createWindow: _createWindow,
  _loadURLWithArgs: _loadURLWithArgs,
  _loadUrlWithArgs: _loadURLWithArgs, // backwards-compatibility
  _unref: _unref
}
