'use strict'

const fs = require('fs-extra')
const filepath = './database.json'

module.exports = function init(store) {
  try {
    const stateFS = fs.readJSONSync(filepath)
    if (stateFS)
      store.replaceState(stateFS)
  } catch (err) {
    console.warn(`[persistentOptions.vuex.plugin] No ${filepath}`, err.message)
  }

  store.subscribe(({ type, payload }, state) => {
    const shouldUpdate = state.onChangeOfTheseSettingsDumpVuexStateToFS.includes(type)
    if (!shouldUpdate)
      return

    const stateDump = { ...state }

    // also apply current mutation since it's not in the state yet
    if (type === 'NyaaEpisodes')
      stateDump.NyaaEpisodes[payload.title] = payload.NyaaEpisodes
    else
      stateDump[type] = payload

    fs.outputJSONSync(filepath, stateDump)
  })
}