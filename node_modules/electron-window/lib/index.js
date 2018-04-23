if (require('is-electron-renderer')) {
  module.exports = require('./renderer')
} else {
  module.exports = require('./main')
}
