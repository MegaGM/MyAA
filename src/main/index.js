'use strict'
global.BUILD_TARGET = 'electron-main'
const path = require('path')
global.icon = path.resolve(__dirname, '../../resources/icons/tray/lock-1.png')

const
  { app } = require('electron'),
  { createWindow, showHideWindow, ensureSingleInstance } = require('./windowManagement.js'),
  { setupTray } = require('./setupTray.js'),
  { setupDevelopmentEnv } = require('./setupDevelopmentEnv.js'),
  { setupFileWatcher } = require('./setupFileWatcher.js'),
  { setupAPI } = require('./setupAPI.js'),
  { setupHotkeys } = require('./setupHotkeys.js'),
  { getOrCreateStore } = require('./store'),
  Nyaa = require('./nyaa-api/Nyaa.api.js'),
  qCycle = require('./qCycle.portable.js')

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

  app.on('activate', () => (w === null) && (w = createWindow()))
  app.on('window-all-closed', () => (process.platform !== 'darwin') && app.quit())
  app.once('ready', async () => {
    w = await createWindow()
    ensureSingleInstance({ w })

    // Order is important!
    setupDevelopmentEnv({ w })
    store = getOrCreateStore({ w })
    tray = setupTray({ w, store })
    setupHotkeys({ w, store })
    Nyaa.injectStore(store)
    setupAPI({ store })
    setupFileWatcher({ store })

    const cycle = new qCycle({
      stepTime: store.state.CYCLE_STEP,
      debug: store.state.CYCLE_DEBUG,
    })
    cycle.setJob(job.bind(void 0, store))
    cycle.start()

    // const Nyaa = require('../common/nyaa-api/Nyaa.api.js')
    // const filepath = '/new/trrnt/anime/done/[HorribleSubs] Kouya no Kotobuki Hikoutai - 03 [1080p].mkv'
    // const NyaaFile = new Nyaa.File(filepath)
    // store.commit('enqueue:markAsDone', NyaaFile)
  })
}


async function job(store) {
  if (!store || !store.state.UPDATE_IN_BACKGROUND)
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
  let MalEntry = store.getters.MalEntry__LRU
  if (!MalEntry)
    MalEntry = store.getters.MalEntry__Random

  await store.dispatch('fetchNyaaEpisodesForMalEntry', MalEntry)
}