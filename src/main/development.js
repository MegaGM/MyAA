'use strict'

module.exports = { setupDevelopmentEnv }

function setupDevelopmentEnv({ w }) {
  const env = process.env.NODE_ENV
  if (!env || !env.toLowerCase().startsWith('dev'))
    return

  {
    /**
     * Extensions
     */
    // const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
    // installExtension(VUEJS_DEVTOOLS)
    // BrowserWindow.removeDevToolsExtension('Lubuntu Scrollbars')
    // const installedExtensions = BrowserWindow.getDevToolsExtensions()
    // console.info('installedExtensions: ', installedExtensions)
  }

  w.webContents.openDevTools()
}
