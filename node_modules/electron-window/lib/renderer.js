// executed in context of window renderer
function parseArgs () {
  if (!window.location.hash) {
    window.__args__ = {}
  } else {
    var hash = window.location.hash.slice(1)
    window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)))
  }
}

module.exports = {
  parseArgs: parseArgs
}
