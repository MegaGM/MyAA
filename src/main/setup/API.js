const MAL = require('../mal-api/build/MAL.api.js')
const { openFile } = require('../store/actions/torrentManagement.js')

module.exports = { setupAPI }

async function setupAPI({ scServer, store }) {
  scServer.on('connection', (socket) => {
    /**
     * Hot
     */
    socket.on('openFile', async (fileLink) => {
      await openFile(fileLink)
    })

    socket.on('enqueue:downloadNyaaEpisode', (NyaaEpisode) => {
      store.commit('enqueue:downloadNyaaEpisode', NyaaEpisode)
    })

    socket.on('enqueue:finishNyaaEpisode', (NyaaEpisode) => {
      store.commit('enqueue:markAsDone', NyaaEpisode)

      const probablyFinishedNyaaFiles = Object
        .values(store.state.files.ongoings)
        .filter(NyaaFile =>
          NyaaFile.title.toLowerCase() === NyaaEpisode.title.toLowerCase()
        )
        .filter(NyaaFile =>
          NyaaFile.episodeNumber < NyaaEpisode.episodeNumber
        )

      if (store.state.REMOVE_FILES_WHEN_DONE)
        probablyFinishedNyaaFiles.map(NyaaFile => {
          store.commit('enqueue:files.toRemove', NyaaFile)
        })
    })

    socket.on('enqueue:markAsDone', (NyaaEpisode) => {
      store.commit('enqueue:markAsDone', NyaaEpisode)
    })

    socket.on('MAL.updateProgress', (data, callback) => {
      MAL.updateProgress(options)
    })


    /**
     * Cold
     */
    // socket.on('COLD:state', (data, callback) => {
    //   socket.emit(store.state.eventName, {
    //     type: 'state',
    //     payload: store.state,
    //   })
    // })

    socket.on('COLD:MalEntries', (data, callback) => {
      socket.emit(store.state.eventName, {
        type: 'MalEntries',
        payload: store.state.MalEntries,
      })
    })

    socket.on('COLD:fetchTime', (data, callback) => {
      for (const [title, timestamp] of Object.entries(store.state.fetchTime)) {
        // imitate Vuex mutation
        socket.emit(store.state.eventName, {
          type: 'fetchTime',
          payload: { title, timestamp },
        })
      }
    })

    socket.on('COLD:NyaaEpisodes', (data, callback) => {
      for (const [title, NyaaEpisodes] of Object.entries(store.state.NyaaEpisodes)) {
        // imitate Vuex mutation
        socket.emit(store.state.eventName, {
          type: 'NyaaEpisodes',
          payload: { title, NyaaEpisodes },
        })
      }
    })

    socket.on('COLD:files', async (data, callback) => {
      for (const file of Object.values(store.state.files.ongoings))
        socket.emit(store.state.eventName, { type: 'files.add', payload: file })

      for (const file of Object.values(store.state.files.done))
        socket.emit(store.state.eventName, { type: 'files.add', payload: file })
    })
  })
}
