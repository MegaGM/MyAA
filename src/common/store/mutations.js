'use strict'
const Vue = require('vue')

const mutations = {
  MalEntries: (state, payload) => state.MalEntries = payload,
  NyaaEpisodes: (state, { title, NyaaEpisodes }) => state.NyaaEpisodes[title] = NyaaEpisodes,
  fetchTime: (state, { title, timestamp }) => state.fetchTime[title] = timestamp,

  'files.add': (state, file) => state.files[file.dir][file.filepath] = file,
  'files.unlink': (state, file) => {
    const newFiles = Object.assign({}, state.files[file.dir])
    delete newFiles[file.filepath]
    state.files[file.dir] = newFiles
  },

  'enqueue:files.toRemove': (state, file) => state.files['toRemove'].push(file),
  'unqueue:files.toRemove': (state, file) => unQueueFile({ state, file, dir: 'toRemove' }),

  'enqueue:markAsDone': (state, file) => state.files['toMarkAsDone'].push(file),
  'unqueue:markAsDone': (state, file) => unQueueFile({ state, file, dir: 'toMarkAsDone' }),

  'enqueue:downloadNyaaEpisode': (state, file) => state.files['toDownload'].push(file),
  'unqueue:downloadNyaaEpisode': (state, file) => unQueueFile({ state, file, dir: 'toDownload' }),
}

function unQueueFile({ state, file, dir }) {
  if (!['toDownload', 'toRemove', 'toMarkAsDone'].includes(dir))
    throw new RangeError('Invalid dir in unQueueFile helper in store.mutations')

  const fileIndex = state.files[dir].findIndex((f, i) => {
    if (file.title === f.title && file.episodeNumber === f.episodeNumber)
      return true
  })
  if (fileIndex > -1)
    state.files[dir].splice(fileIndex, 1)
}

module.exports = mutations