'use strict'

const getters = {
  getNyaaEpisodeFileStatus(state) {
    return NyaaEpisode => {
      // TODO: check if there are some files on SSD/HDD
      const lookup = files =>
        files
          .filter(f => f.title.toLowerCase() === NyaaEpisode.title.toLowerCase())
          .map(f => f.episodeNumber)
          .includes(NyaaEpisode.episodeNumber)

      let status = null
      if (lookup(Object.values(state.files.ongoings)))
        status = 'ongoing'
      else if (lookup(Object.values(state.files.done)))
        status = 'done'
      return status
    }
  },
  freshNyaaEpisodesForMalEntry(state) {
    return MalEntry => {
      const newNyaaEpisodes = state.NyaaEpisodes[MalEntry.title]
        .filter(NyaaEpisode => {
          return NyaaEpisode.episodeNumber > MalEntry.progress.current
        })

      return newNyaaEpisodes
    }
  },
  LRU_MalEntry(state) {
    if (!Object.keys(state.MalEntries).length || !Object.keys(state.fetchTime).length)
      return null

    const sortedFetchTimestamps = Object
      .keys(state.fetchTime)
      .map(title => ({
        title,
        fetchTime: state.fetchTime[title],
      }))
      .sort(({ fetchTime: t1 }, { fetchTime: t2 }) => t1 - t2)

    const
      [{ title }] = sortedFetchTimestamps,
      MalEntry = state.MalEntries[title]

    return MalEntry
  },
  MalEntries__byComplexAlgorithm(state, getters) {
    const withNewEpisodesOnly__descByLex = Object
      .values(state.MalEntries)
      .filter(MalEntry => state.NyaaEpisodes[MalEntry.title].length)
      .sort((a, b) => a.title.localeCompare(b.title))

    const withoutNewEpisodesOnly__descByLex = Object
      .values(state.MalEntries)
      .filter(MalEntry => !state.NyaaEpisodes[MalEntry.title].length)
      .sort((a, b) => a.title.localeCompare(b.title))

    return [
      ...withNewEpisodesOnly__descByLex,
      ...withoutNewEpisodesOnly__descByLex,
    ]
  },
}

module.exports = getters
