'use strict'
global.BUILD_TARGET = 'electron-main'
global.UPDATE_IN_BACKGROUND = true
global.REMOVE_FILES_WHEN_DONE = true
global.NYAA_QUALITY = '1080'

const
  { app, globalShortcut } = require('electron'),
  { setupDevelopmentEnv } = require('./development.js'),
  { createWindow, showHideWindow, ensureSingleInstance } = require('./windowManagement.js'),
  { createTray } = require('./tray.js'),
  { getOrCreateStore } = require('./store'),
  { setupAPI } = require('./mainAPI.js'),
  { setupFileWatcher } = require('./fileWatcher.js'),
  qCycle = require('../common/qCycle.portable.js'),
  cycle = new qCycle({ stepTime: 2, debug: false })

let
  w, //: Promise<BrowserWindow>
  tray, //: Tray
  store //: Vuex.Store


/**
 * Spawn electron app
 * Start cronjob cycle, once app is ready
 */
main()
function main() {
  app.commandLine.appendSwitch('ignore-gpu-blacklist')
  ensureSingleInstance({ w })

  app.on('activate', () => (w === null) && (w = createWindow()))
  app.on('window-all-closed', () => (process.platform !== 'darwin') && app.quit())
  app.once('ready', async () => {
    globalShortcut.register('CommandOrControl+Shift+Y', () => {
      showHideWindow({ w })
    })

    // TODO: change order tray/window

    w = await createWindow()
    setupDevelopmentEnv({ w })
    tray = createTray({ w })
    store = getOrCreateStore({ w })

    setupAPI({ store })
    setupFileWatcher({ store })

    cycle.setJob(job)
    cycle.start()

    // const Nyaa = require('../common/nyaa-api/Nyaa.api.js')
    // const filepath = '/new/trrnt/anime/done/[HorribleSubs] Kouya no Kotobuki Hikoutai - 03 [1080p].mkv'
    // const NyaaFile = new Nyaa.File(filepath)
    // store.commit('enqueue:markAsDone', NyaaFile)
  })
}


async function job() {
  if (!global.UPDATE_IN_BACKGROUND)
    return

  await store.dispatch('fetchMalEntries')

  /**
   * Check if there are some quests
   */
  const toDownload = store.state.files.toDownload
  if (toDownload.length) {
    await store.dispatch('downloadNyaaEpisode', toDownload[0])
    return // since it includes https GET to Nyaa.si
  }

  const toMarkAsDone = store.state.files.toMarkAsDone
  if (toMarkAsDone.length)
    await store.dispatch('markAsDone', toMarkAsDone[0])

  const toRemove = store.state.files.toRemove
  if (toRemove.length)
    await store.dispatch('removeFile', toRemove[0])


  /**
   * After all quests, update a single MalEntry
   */
  const MalEntry__LRU = store.getters.MalEntry__LRU
  if (MalEntry__LRU)
    await store.dispatch('fetchNyaaEpisodesForMalEntry', MalEntry__LRU)
}