'use strict'
global.BUILD_TARGET = 'electron-main'
const path = require('path')
global.icon = path.resolve(__dirname, 'resources/icons/tray/lock-1.png')

const
  { app } = require('electron'),
  { setupSCServer } = require('./setup/sc-server.js'),
  { createWindow, showHideWindow, ensureSingleInstance } = require('./setup/windowManagement.js'),
  { setupTray } = require('./setup/tray.js'),
  { setupDevelopmentEnv } = require('./setup/developmentEnv.js'),
  { setupFileWatcher } = require('./setup/fileWatcher.js'),
  { setupAPI } = require('./setup/API.js'),
  { setupHotkeys } = require('./setup/hotkeys.js'),
  { getOrCreateStore } = require('./store'),
  Nyaa = require('./nyaa-api/Nyaa.api.js'),
  qCycle = require('./qCycle.portable.js'),
  job = require('./job.js')

let
  w, //: Promise<BrowserWindow>
  tray, //: Tray
  store, //: Vuex.Store
  scServer //: SocketCluster


/**
 * Spawn electron app
 * Start cronjob cycle, once app is ready
 */
main()
function main() {
  app.commandLine.appendSwitch('ignore-gpu-blacklist')

  app.on('activate', () => (w === null) && (w = createWindow()))
  app.on('window-all-closed', () => (process.platform !== 'darwin') && app.quit())
  app.once('ready', async () => {
    w = await createWindow()
    ensureSingleInstance({ w })

    // Order is important!
    scServer = setupSCServer()
    setupDevelopmentEnv({ w })
    store = getOrCreateStore({ scServer, w })
    tray = setupTray({ w, store })
    setupHotkeys({ w, store })
    Nyaa.injectStore(store)
    setupAPI({ scServer, store })
    setupFileWatcher({ store })

    const cycle = new qCycle({
      stepTime: store.state.CYCLE_STEP,
      debug: store.state.CYCLE_DEBUG,
    })
    cycle.setJob(job.bind(void 0, store))
    cycle.start()
  })
}