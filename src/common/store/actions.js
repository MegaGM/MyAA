'use strict'

const
  fs = require('fs-extra'),
  Nyaa = require('../nyaa-api/Nyaa.api.js'),
  MAL = require('../mal-api/build/MAL.api.js')

const
  episodless = {}

const actions = {
  async removeFile({ state, commit }, NyaaFile) {
    if (!NyaaFile.filepath) { // then it's NyaaEpisode
      const
        lookup = files =>
          files
            .filter(f => f.title.toLowerCase() === NyaaFile.title.toLowerCase())
            .filter(f => f.episodeNumber === NyaaFile.episodeNumber)
      const
        inOngoings = lookup(Object.values(state.files.ongoings)),
        inDone = lookup(Object.values(state.files.done))

      let filepath = null
      if (inOngoings.length)
        filepath = inOngoings[0].filepath
      else if (inDone.length)
        filepath = inDone[0].filepath

      NyaaFile.filepath = filepath
    }

    if (NyaaFile.filepath)
      fs.remove(NyaaFile.filepath, err => {
        if (err)
          console.error('[store.actions] removeFile() catched: ', err)
        console.info('[removeFile] removed: ', NyaaFile.filename)

        commit('unqueue:files.toRemove', NyaaFile)
      })
  },
  async markAsDone({ state, commit }, NyaaFile /* possibly NyaaEpisode */) {
    const
      newEpisodeNumber = NyaaFile.episodeNumber,
      diff = Nyaa.diffMap.find(diff => diff.titleNyaa === NyaaFile.title),
      MalEntry = state.MalEntries[diff && diff.titleMAL || NyaaFile.title]

    if (!MalEntry) {
      console.error('[markAsDone] No MalEntry in MalEntries for NyaaFile.title: ')
      console.error('NyaaFile.title', NyaaFile.title)
      console.error('diff.titleMAL', diff && diff.titleMAL)
      return commit('unqueue:markAsDone', NyaaFile)
    }

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

    // might happen when page in chrome has been navigated
    // simply don't update the state.MalEntries in this case
    if (!MalEntriesArr.length)
      return

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