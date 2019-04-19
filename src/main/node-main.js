'use strict'
global.BUILD_TARGET = 'node-main'

const
  { setupSCServer } = require('./setup/sc-server.js'),
  { getOrCreateStore } = require('./store'),
  { setupAPI } = require('./setup/API.js'),
  { setupFileWatcher } = require('./setup/fileWatcher.js'),
  Nyaa = require('./nyaa-api/Nyaa.api.js'),
  qCycle = require('./qCycle.portable.js'),
  job = require('./job.js')

let store //: Vuex.Store
let scServer


/**
 * Spawn electron app
 * Start cronjob cycle, once app is ready
 */
main()
function main() {
  // Order is important!
  scServer = setupSCServer()
  store = getOrCreateStore({ scServer })
  Nyaa.injectStore(store)
  setupAPI({ scServer, store })
  setupFileWatcher({ store })

  const cycle = new qCycle({
    stepTime: store.state.CYCLE_STEP,
    debug: store.state.CYCLE_DEBUG,
  })
  cycle.setJob(job.bind(void 0, store))
  cycle.start()
}