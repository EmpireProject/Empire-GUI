'use strict'

const fs = require('fs-extra')
const { join, resolve } = require('path')
const window = require('electron-window')
const getOptions = require('mocha/bin/options')
const args = require('./args')
const mocha = require('./mocha')
const { app, ipcMain: ipc } = require('electron')
const { spawn } = require('child_process')

// load mocha.opts into process.argv
getOptions()

// parse args
const opts = args.parse(process.argv)

const tmpdir = fs.mkdtempSync(join(app.getPath('temp'), 'electron-mocha-'))
app.setPath('userData', tmpdir)

// Load `--require-main` script first
if (opts.requireMain.length === 1) {
  try {
    require(opts.requireMain[0])
  } catch (error) {
    fail(error)
  }
}

app.on('quit', () => {
  // Run cleanup in a separate process so that we're not trying to remove
  // Electron's data out from under it.
  const child = spawn(process.execPath, ['cleanup.js', tmpdir], {
    detached: true,
    stdio: 'ignore',
    env: { 'ELECTRON_RUN_AS_NODE': 1 },
    cwd: __dirname
  })
  child.unref()
})

// do not quit if tests open and close windows
app.on('window-all-closed', () => {})

app.on('ready', () => {
  if (opts.interactive) {
    opts.renderer = true
    opts.debug = true
    opts.colors = false
  }

  if (!opts.renderer) {
    try {
      mocha.run(opts, count => app.exit(count))
    } catch (error) {
      fail(error)
    }
  } else {
    const win = window.createWindow({
      height: 700,
      width: 1200,
      focusable: opts.debug,
      webPreferences: { webSecurity: false }
    })

    if (!opts.debug && process.platform === 'darwin') {
      app.dock.hide()
    }

    win.webContents.once('did-finish-load', () => {
      if (opts.debug) {
        win.show()
        win.webContents.openDevTools()
        win.webContents.on('devtools-opened', () => {
          // Debugger is not immediately ready!
          setTimeout(() => {
            win.webContents.send('mocha-start')
          }, 250)
        })

        // Called on reload in --interactive mode
        ipc.on('mocha-ready-to-run', () => {
          win.webContents.send('mocha-start')
        })
      } else {
        win.webContents.send('mocha-start')
      }
    })

    const indexPath = resolve(join(__dirname, './renderer/index.html'))
    // undocumented call in electron-window
    win._loadURLWithArgs(indexPath, opts, () => {})
    // win.showURL(indexPath, opts)
    ipc.on('mocha-done', (event, count) => {
      win.webContents.once('destroyed', () => app.exit(count))
      if (!opts.interactive) {
        win.close()
      }
    })
    ipc.on('mocha-error', (_, error) => fail(error))
  }
})

function fail (error) {
  console.error(error.message)
  console.error(error.stack)
  app.exit(1)
}
