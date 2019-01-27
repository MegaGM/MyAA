'use strict'

const
  url = require('url'),
  path = require('path'),
  { exec } = require('child_process'),
  { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron')
let
  w, // w: BrowserWindow
  tray
// API = require('../renderer/api')


// nani sore? 
// app.dock.hide()
app.commandLine.appendSwitch('ignore-gpu-blacklist')

{
  /**
   * Focus the window instead of launching second app
   */
  const firstInstance = app.requestSingleInstanceLock()
  if (!firstInstance)
    app.quit()
  else
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (w.isMinimized())
        w.restore()
      w.show()
      w.focus()
    })
}

app.on('activate', () => w === null && createWindow())
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

app.once('ready', () => {
  // app.makeSingleInstance(() => { })
  globalShortcut.register('CommandOrControl+Shift+Y', () => {
    showHideWindow()
  })

  /**
   * debug abit
   */
  console.info('__dirname: ', __dirname)
  // console.info('appData: ', app.getPath('appData'))

  setupTray()
  createWindow()
  devSetup()
})


/**
 * Flow and Utils
 */
function showHideWindow() {
  if (w.isVisible())
    w.hide()
  else {
    w.show()
    w.focus()
  }
}

function createWindow() {
  const wOptions = {
    center: false,
    autoHideMenuBar: true,
    scrollBounce: true,
    icon: path.resolve(__dirname, '../../resources/icons/png/256x256.png'),
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
  // w.on('blur', () => w.hide())
  w.on('closed', () => w = null)
  w.once('ready-to-show', () => {
    w.show()
    w.focus()
  })

  function saveWindowPosition(e) {
    // console.info('saveWindowPosition STUB, w.getBounds(): ', w.getBounds())
  }
}

function setupTray() {
  /**
   * Setup Tray icon and TrayMenu
   */
  // tray = new Tray(path.resolve(__dirname, '../../resources/icons/tray', 'electron-icon.png'))
  tray = new Tray(path.resolve(__dirname, '../../resources/icons/tray/lock-1.png'))

  // TODO: possibly register all events in one space-separated string
  tray.on('click', showHideWindow)
  tray.on('right-click', showHideWindow)
  tray.on('double-click', showHideWindow)
  tray.on('mouse-move', mouseMove => console.info('mouseMove: ', mouseMove))

  tray.setToolTip('Nyaa!:3')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      type: 'normal',
      click: showHideWindow
    },
    { type: 'separator' },
    { label: 'Update in background', type: 'checkbox', checked: true },
    { label: 'Quit', role: 'quit' },
  ]))
}

function devSetup() {
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


async function execAsync(command) {
  const child = exec(command)

  return new Promise((resolve, reject) => {
    const { stdout, stderr } = child
    stdout.on('data', console.info)
    stderr.on('data', console.error)
    // child.on('close', code => console.info('closing code: ' + code))
    child.addListener('error', reject)
    child.addListener('exit', resolve)
  })
}
