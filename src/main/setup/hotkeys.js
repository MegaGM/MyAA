'use strict'

const
  { globalShortcut } = require('electron'),
  { showHideWindow } = require('./windowManagement.js')

module.exports = {
  setupHotkeys,
}

function setupHotkeys({ w, store }) {
  globalShortcut.register('CommandOrControl+Shift+Y', () => {
    showHideWindow({ w })
  })
}
