'use strict'
global.BUILD_TARGET = 'node-main'

const
  { setupFileWatcher } = require('./setup/fileWatcher.js'),
  { setupAPI } = require('./setup/API.js'),
  { getOrCreateStore } = require('./store'),
  Nyaa = require('./nyaa-api/Nyaa.api.js'),
  qCycle = require('./qCycle.portable.js'),
  job = require('./job.js')

let store //: Vuex.Store


/**
 * Spawn electron app
 * Start cronjob cycle, once app is ready
 */
main()
function main() {
  // Order is important!
  store = getOrCreateStore({ w })
  Nyaa.injectStore(store)
  setupAPI({ store })
  setupFileWatcher({ store })

  const cycle = new qCycle({
    stepTime: store.state.CYCLE_STEP,
    debug: store.state.CYCLE_DEBUG,
  })
  cycle.setJob(job.bind(void 0, store))
  cycle.start()
}