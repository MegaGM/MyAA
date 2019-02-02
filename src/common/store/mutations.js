'use strict'
const Vue = require('vue')

const mutations = {
  MalEntries: (state, payload) => state.MalEntries = payload,
  NyaaEpisodes: (state, payload) => state.NyaaEpisodes = payload,
  fetchTime: (state, { title, timestamp }) => state.fetchTime[title] = timestamp,
  'files.add': (state, file) => state.files[file.dir][file.filepath] = file,
  'files.unlink': (state, file) => Vue.delete(state.files[file.dir], file.filepath),
}

module.exports = mutations