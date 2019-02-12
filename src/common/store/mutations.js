'use strict'
const Vue = require('vue')
const fs = require('fs-extra')

const mutations = {
  MalEntries: (state, payload) => state.MalEntries = payload,
  NyaaEpisodes: (state, { title, NyaaEpisodes }) => state.NyaaEpisodes[title] = NyaaEpisodes,
  fetchTime: (state, { title, timestamp }) => state.fetchTime[title] = timestamp,

  'NYAA_QUALITY': (state, str) => setOption('NYAA_QUALITY', str),
  'UPDATE_IN_BACKGROUND': (state, bool) => setOption('UPDATE_IN_BACKGROUND', bool),
  'REMOVE_FILES_WHEN_DONE': (state, bool) => setOption('REMOVE_FILES_WHEN_DONE', bool),

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

function setOption(optionKey) {
  return (state, optionVal) => {
    state[optionKey] = optionVal
  }
}

function saveDefaultOptions({ state }) {
  const defaultOptions = {}

  for (const option of [
    'NYAA_QUALITY',
    'UPDATE_IN_BACKGROUND',
    'REMOVE_FILES_WHEN_DONE',
  ]) {
    defaultOptions[option] = state[option]
  }

  fs.outputFileSync('./options.json', JSON.stringify(defaultOptions))
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