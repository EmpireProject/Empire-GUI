// fired from 'preload' in context of window renderer
if (require('is-electron-renderer')) {
  require('./renderer').parseArgs()
}
