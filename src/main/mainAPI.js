const { ipcMain } = require('electron')
const MAL = require('../common/mal-api/build/MAL.api.js')

module.exports = {
  setupAPI,
}

async function setupAPI({ store }) {
  ipcMain.on('enqueue:downloadNyaaEpisode', (event, NyaaEpisode) => {
    store.commit('enqueue:downloadNyaaEpisode', NyaaEpisode)
  })

  ipcMain.on('MAL.updateProgress', (event, options) => MAL.updateProgress(options))
  ipcMain.on('enqueue:markAsDone', (event, NyaaEpisode) => {
    store.commit('enqueue:markAsDone', NyaaEpisode)
  })

  ipcMain.on('COLD:MalEntries', (event, options) => store.dispatch('fetchMalEntries'))

  ipcMain.on('COLD:NyaaEpisodes', (event, options) => {
    for (const [title, NyaaEpisodes] of Object.entries(store.state.NyaaEpisodes)) {
      // imitate Vuex mutation
      event.sender.send(store.state.eventName, {
        type: 'NyaaEpisodes',
        payload: {
          title,
          NyaaEpisodes
        }
      })
    }
  })

  ipcMain.on('COLD:files', async (event, options) => {
    for (const file of Object.values(store.state.files.ongoings))
      event.sender.send(store.state.eventName, { type: 'files.add', payload: file })

    for (const file of Object.values(store.state.files.done))
      event.sender.send(store.state.eventName, { type: 'files.add', payload: file })
  })
}
