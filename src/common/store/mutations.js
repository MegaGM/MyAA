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
}

module.exports = mutations