const { ipcMain } = require('electron')
const MAL = require('main/mal-api/MAL.api.ts')

import http, { IncomingMessage, ServerResponse } from 'http'
import { attach, SCServerSocket } from 'socketcluster-server'
let httpServer, scServer

module.exports = {
  setupAPI,
}

async function setupAPI({ store }) {
  /**
   * Hot
   */
  ipcMain.on('enqueue:downloadNyaaEpisode', (event, NyaaEpisode) => {
    store.commit('enqueue:downloadNyaaEpisode', NyaaEpisode)
  })

  ipcMain.on('enqueue:finishNyaaEpisode', (event, NyaaEpisode) => {
    store.commit('enqueue:markAsDone', NyaaEpisode)

    const probablyFinishedNyaaFiles = store.state.files.ongoings
      .filter(f => f.title.toLowerCase() === NyaaFile.title.toLowerCase())
      .filter(f => f.episodeNumber < NyaaFile.episodeNumber)

    if (store.state.REMOVE_FILES_WHEN_DONE)
      probablyFinishedNyaaFiles.map(NyaaFile => {
        commit('enqueue:files.toRemove', NyaaFile)
      })
  })

  ipcMain.on('enqueue:markAsDone', (event, NyaaEpisode) => {
    store.commit('enqueue:markAsDone', NyaaEpisode)
  })

  ipcMain.on('MAL.updateProgress', (event, options) => {
    MAL.updateProgress(options)
  })

  /**
   * Cold
   */
  // ipcMain.on('COLD:state', (event, options) => {
  //   event.sender.send(store.state.eventName, {
  //     type: 'state',
  //     payload: store.state,
  //   })
  // })

  ipcMain.on('COLD:MalEntries', (event, options) => {
    event.sender.send(store.state.eventName, {
      type: 'MalEntries',
      payload: store.state.MalEntries,
    })
  })

  ipcMain.on('COLD:fetchTime', (event, options) => {
    for (const [title, timestamp] of Object.entries(store.state.fetchTime)) {
      // imitate Vuex mutation
      event.sender.send(store.state.eventName, {
        type: 'fetchTime',
        payload: { title, timestamp },
      })
    }
  })

  ipcMain.on('COLD:NyaaEpisodes', (event, options) => {
    for (const [title, NyaaEpisodes] of Object.entries(store.state.NyaaEpisodes)) {
      // imitate Vuex mutation
      event.sender.send(store.state.eventName, {
        type: 'NyaaEpisodes',
        payload: { title, NyaaEpisodes },
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
