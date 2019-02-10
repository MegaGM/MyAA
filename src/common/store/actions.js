'use strict'

const
  fs = require('fs-extra'),
  Nyaa = require('../nyaa-api/Nyaa.api.js'),
  MAL = require('../mal-api/build/MAL.api.js')

const
  episodless = {}

const actions = {
  async removeFile({ state, commit }, NyaaFile) {
    fs.remove(NyaaFile.filepath, err => {
      if (err)
        console.error('[store.actions] removeFile() catched: ', err)
      console.info('[removeFile] removed: ', NyaaFile.filename)

      commit('unqueue:files.toRemove', NyaaFile)
    })
  },
  async markAsDone({ state, commit }, NyaaFile) {
    const
      newEpisodeNumber = NyaaFile.episodeNumber,
      diff = Nyaa.diffMap.find(diff => diff.titleNyaa === NyaaFile.title),
      MalEntry = state.MalEntries[diff && diff.titleMAL || NyaaFile.title]

    if (!MalEntry)
      throw new RangeError('[markAsDone] No MalEntry in MalEntries for NyaaFile.title: ' + NyaaFile.title)

    if (newEpisodeNumber > MalEntry.progress.current) {
      const success = await MAL.updateProgress({
        newEpisodeNumber,
        MalEntry,
      })
      if (!success)
        console.error('[markAsDone] MAL.updateProgress() success is falsy')
    }

    commit('unqueue:markAsDone', NyaaFile)

    if (global.REMOVE_FILES_WHEN_DONE)
      commit('enqueue:files.toRemove', NyaaFile)
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