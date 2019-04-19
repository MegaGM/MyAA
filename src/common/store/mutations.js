'use strict'

const mutations = {
  // 'state': (state, payload) => {
  //   const newState = JSON.parse(JSON.stringify(payload))
  //   for (const key of Object.keys(newState))
  //     state[key] = newState[key]
  // },

  MalEntries: (state, payload) => state.MalEntries = payload,
  NyaaEpisodes: (state, { title, NyaaEpisodes }) => {
    if (!state.NyaaEpisodes) { state.NyaaEpisodes = {} }
    state.NyaaEpisodes[title] = NyaaEpisodes
  },
  fetchTime: (state, { title, timestamp }) => {
    if (!state.fetchTime) { state.fetchTime = {} }
    state.fetchTime[title] = timestamp
  },

  'CYCLE_STEP': setOption('CYCLE_STEP'),
  'CYCLE_DEBUG': setOption('CYCLE_DEBUG'),

  'NYAA_QUALITY': setOption('NYAA_QUALITY'),
  'UPDATE_IN_BACKGROUND': setOption('UPDATE_IN_BACKGROUND'),
  'REMOVE_FILES_WHEN_DONE': setOption('REMOVE_FILES_WHEN_DONE'),

  'files.add': (state, file) => {
    if (!state.files) { state.files = {} }
    if (!state.files[file.dir]) { state.files[file.dir] = {} }
    state.files[file.dir][file.filepath] = file
  },
  'files.unlink': (state, file) => {
    const newFiles = Object.assign({}, state.files[file.dir])
    delete newFiles[file.filepath]
    state.files[file.dir] = newFiles
  },

  'enqueue:files.toRemove': (state, file) => {
    if (!state.files['toRemove']) { state.files['toRemove'] = [] }
    state.files['toRemove'].push(file)
  },
  'unqueue:files.toRemove': (state, file) => unQueueFile({ state, file, dir: 'toRemove' }),

  'enqueue:markAsDone': (state, file) => {
    if (!state.files['toMarkAsDone']) { state.files['toMarkAsDone'] = [] }
    state.files['toMarkAsDone'].push(file)
  },
  'unqueue:markAsDone': (state, file) => unQueueFile({ state, file, dir: 'toMarkAsDone' }),

  'enqueue:downloadNyaaEpisode': (state, file) => {
    if (!state.files['toDownload']) { state.files['toDownload'] = [] }
    state.files['toDownload'].push(file)
  },
  'unqueue:downloadNyaaEpisode': (state, file) => unQueueFile({ state, file, dir: 'toDownload' }),

}

function setOption(optionKey) {
  return (state, optionVal) => {
    state[optionKey] = optionVal

    // in order to update client-side immediatelly
    if (optionKey === 'NYAA_QUALITY')
      for (const key in state.NyaaEpisodes)
        state.NyaaEpisodes[key] = []
  }
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