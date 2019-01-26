'use strict'

const
  url = require('url'),
  path = require('path'),
  { exec } = require('child_process'),
  { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron')
let
  w, // BrowserWindow
  tray,
  API = require('../renderer/api')


app.commandLine.appendSwitch('ignore-gpu-blacklist')

// nani sore? 
// app.dock.hide()

app.on('activate', () => w === null && createWindow())
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

app.once('ready', () => {
  app.makeSingleInstance(() => { })

  /**
   * debug abit
   */
  console.info('__dirname: ', __dirname)
  console.info('path: ', path.join('resources/icons/tray', 'electron-icon.png'))
  console.info('appData: ', app.getPath('appData'))

  setupTray()
  createWindow()
})


function createWindow() {
  const wOptions = {
    center: false,
    autoHideMenuBar: true,
    scrollBounce: true,
    icon: path.resolve(__dirname, 'resources/icons/png/256x256.png'),
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
    pathname: path.join(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  w.on('move', saveWindowPosition)
  w.on('resize', saveWindowPosition)
  w.on('blur', () => w.hide())
  w.on('closed', () => w = null)
  w.once('ready-to-show', () => {
    w.show()
    w.focus()
  })

  function saveWindowPosition() {
    console.info('saveWindowPosition STUB, w.getBounds(): ', w.getBounds())
  }

  if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase().startsWith('dev'))
    w.webContents.openDevTools()
}

function setupTray() {
  /**
   * Setup Tray icon and TrayMenu
   */
  tray = new Tray(path.join(__dirname, 'resources/icons/tray', 'electron-icon.png'))

  // TODO: possibly register all events in one space-separated string
  tray.on('click', toggleWindow)
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('mouse-move', mouseMove => console.info('mouseMove: ', mouseMove))

  function toggleWindow() {
    if (w.isVisible())
      w.hide()
    else {
      w.show()
      w.focus()
    }
  }

  tray.setToolTip('Nyaa!:3')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      type: 'normal',
      click: toggleWindow
    },
    { type: 'separator' },
    { label: 'Update in background', type: 'checkbox', checked: true },
    { label: 'Quit', role: 'quit' },
  ]))
}

async function execAsync(command) {
  let child = exec(command)
  return new Promise((resolve, reject) => {
    let { stdout, stderr } = child
    stdout.on('data', console.info)
    stderr.on('data', console.error)
    // child.on('close', code => console.info('closing code: ' + code))
    child.addListener('error', reject)
    child.addListener('exit', resolve)
  })
}

