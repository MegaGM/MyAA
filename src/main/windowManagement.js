const
  url = require('url'),
  path = require('path'),
  { app, BrowserWindow } = require('electron')
// const { BrowserWindow, Tray, Menu, globalShortcut } = require('electron')

module.exports = {
  ensureSingleInstance,
  showHideWindow,
  createWindow,
}

function ensureSingleInstance({ w } = { w: null }) {
  /**
   * Focus the window instead of launching second app
   */
  function onSecondInstance(event, commandLine, workingDirectory) {
    // doesn't work, w is always undefined
    if (!w)
      return console.info('[second-instance] !w')
    else
      console.info('[second-instance] w is there')

    if (w.isMinimized())
      w.restore()
    w.show()
    w.focus()
  }

  const firstInstance = app.requestSingleInstanceLock()
  if (firstInstance)
    app.on('second-instance', onSecondInstance)
  else
    app.quit()
}

function showHideWindow({ w } = { w: null }) {
  if (w.isVisible()) {
    w.hide()
    // TODO: play with it on Windows
    // w.setSkipTaskbar()
  } else {
    w.show()
    w.focus()
  }
}

function createWindow({ w } = { w: null }) {
  const wOptions = {
    show: false,
    center: false,
    autoHideMenuBar: true,
    scrollBounce: true,
    icon: path.resolve(__dirname, '../../resources/icons/tray/lock-1.png'),
    webPreferences: {
      backgroundThrottling: false,
    },
    x: 0,
    y: 24,
    width: 1440,
    height: 876,
  }

  w = new BrowserWindow(wOptions)

  w.loadURL(url.format({
    pathname: path.resolve(__dirname, '../../build/renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  w.on('move', saveWindowPosition)
  w.on('resize', saveWindowPosition)
  function saveWindowPosition(e) {
    // console.info('saveWindowPosition STUB, w.getBounds(): ', w.getBounds())
  }

  // w.on('blur', () => w.hide())
  w.on('closed', () => w = null)
  w.once('ready-to-show', () => {
    w.show()
    w.focus()
  })

  return w
}