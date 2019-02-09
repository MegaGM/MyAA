'use strict'
const Vue = require('vue')

const mutations = {
  MalEntries: (state, payload) => state.MalEntries = payload,
  NyaaEpisodes: (state, { title, NyaaEpisodes }) => state.NyaaEpisodes[title] = NyaaEpisodes,
  fetchTime: (state, { title, timestamp }) => state.fetchTime[title] = timestamp,

  'files.add': (state, file) => state.files[file.dir][file.filepath] = file,
  'files.unlink': (state, file) => {
    const dirFiles = Object.assign({}, state.files[file.dir])
    delete dirFiles[file.filepath]
    state.files[file.dir] = dirFiles
  },

  'enqueue:files.toRemove': (state, file) => state.files['toRemove'].push(file),
  'unqueue:files.toRemove': (state, file) => unQueueFile({ state, file, dir: 'toRemove' }),

  'enqueue:markEpisodeWatched': (state, file) => state.files['toMarkWatched'].push(file),
  'unqueue:markEpisodeWatched': (state, file) => unQueueFile({ state, file, dir: 'toMarkWatched' }),
}

function unQueueFile({ state, file, dir }) {
  if (!['toRemove', 'toMarkWatched'].includes(dir))
    throw new RangeError('Invalid dir in unQueueFile helper in store.mutations')

  const fileIndex = state.files[dir].findIndex((f, i) => {
    if (file.title === f.title && file.episodeNumber === f.episodeNumber)
      return true
  })
  state.files[dir].splice(fileIndex, 1)
}

module.exports = mutations