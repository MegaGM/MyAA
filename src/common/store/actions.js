'use strict'

const
  fs = require('fs-extra'),
  Nyaa = require('../nyaa-api/Nyaa.api.js'),
  MAL = require('../mal-api/build/MAL.api.js')

const
  episodless = {}

const actions = {
  async removeFile({ state, commit }, file) {
    try {
      const res = await fs.remove(file.filepath)
      console.info('removeFile res: ', res)
    } catch (err) {
      console.error('[store.actions] removeFile() catched: ', err)
    }

    commit('unqueue:files.toRemove', file)
  },
  async markEpisodeAsWatched({ state, commit }, file) {
    const
      newEpisodeNumber = file.episodeNumber,
      diff = Nyaa.diffMap.find(diff => diff.titleNyaa === file.title),
      MalEntry = state.MalEntries[diff && diff.titleMAL || file.title]

    if (!MalEntry)
      throw new RangeError('[markEpisodeAsWatched] No MalEntry in MalEntries for file.title: ' + file.title)

    if (newEpisodeNumber > MalEntry.progress.current) {
      const success = await MAL.updateProgress({
        newEpisodeNumber,
        MalEntry,
      })
      if (!success)
        console.error('[markEpisodeAsWatched] MAL.updateProgress() success is falsy')
    }

    commit('unqueue:markEpisodeAsWatched', file)

    if (global.REMOVE_FILES_WHEN_DONE)
      commit('enqueue:files.toRemove', file)
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


    if (!episodesCount) {
      episodless[title] = episodesCount
      console.info('[fetchNyaaEpisodesForMalEntry] episodless: ', episodless)
    }


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