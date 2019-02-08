'use strict'

const
  fs = require('fs-extra'),
  Nyaa = require('../Nyaa.api.js'),
  MAL = require('../mal-api/build/MAL.api.js')

const actions = {
  async markEpisodeWatched({ state, commit }, file) {
    const
      newEpisodeNumber = file.episodeNumber,
      MalEntry = state.MalEntries[file.title]

    if (newEpisodeNumber > MalEntry.progress.current) {
      var success = await MAL.updateProgress({
        newEpisodeNumber,
        MalEntry,
      })
    }

    if (global.REMOVE_FILES_WHEN_DONE && success)
      fs.removeSync(file.filepath)
  },
  async fetchNyaaEpisodesForMalEntry({ state, commit }, { title } = {}) {
    if (!title || !title.length)
      throw new TypeError('Invalid MalEntry in fetchNyaaEpisodesForMalEntry')

    const
      now = new Date().getTime(),
      NyaaEpisodes = await Nyaa.fetchEpisodes(title),
      episodesCount = NyaaEpisodes.length,
      sinceLastUpdate = now - state.fetchTime[title]

    console.info(`-${sinceLastUpdate} ${episodesCount} ${title}`)

    commit('NyaaEpisodes', { title, NyaaEpisodes })
    commit('fetchTime', { title, timestamp: now })
  },
  async fetchMalEntries({ state, commit }) {
    const
      now = new Date().getTime(),
      MAL = require('../mal-api/build/MAL.api.js'),
      MalEntries = {},
      MalEntriesArr = await MAL.getCW()

    for (const MalEntry of MalEntriesArr)
      MalEntries[MalEntry.title] = MalEntry

    if (!Object.keys(state.fetchTime).length)
      for (const MalEntry of MalEntriesArr)
        commit('fetchTime', {
          title: MalEntry.title,
          timestamp: now,
        })

    commit('MalEntries', MalEntries)
  },
}

module.exports = actions