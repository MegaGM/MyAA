'use strict'

module.exports = {
  getFileStatusByNyaaEpisode,
  getNyaaEpisodesByMalEntry,
  MalEntry__LRU,
  MalEntries__ascByTitle,
}

function getFileStatusByNyaaEpisode(state) {
  return NyaaEpisode => {

    const lookup = files =>
      files
        .filter(f => f.title.toLowerCase() === NyaaEpisode.title.toLowerCase())
        .map(f => f.episodeNumber)
        .includes(NyaaEpisode.episodeNumber)

    const status = {
      fresh: false,
      downloaded: false,
      done: false,
    }

    if (lookup(Object.values(state.files.ongoings)))
      status.downloaded = true
    else if (lookup(Object.values(state.files.done)))
      status.done = true
    else
      status.fresh = true

    return status
  }
}

function getNyaaEpisodesByMalEntry(state) {
  return MalEntry => {
    const episodes = state.NyaaEpisodes[MalEntry.title]
    if (!episodes || !episodes.length)
      return []

    const newNyaaEpisodes = episodes
      .filter(NyaaEpisode => {
        return NyaaEpisode.episodeNumber > MalEntry.progress.current
      })

    return newNyaaEpisodes
  }
}

function MalEntry__LRU(state) {
  const
    noMalEntries = !Object.keys(state.MalEntries).length,
    noFetchTimestamps = !Object.keys(state.fetchTime).length
  if (noMalEntries || noFetchTimestamps) {
    console.error('[MalEntry__LRU] (noMalEntries || noFetchTimestamps)')
    return null
  }

  const fetchTimestamps__ascByFetchTime = Object
    .keys(state.fetchTime)
    .map(title => ({
      title,
      fetchTime: state.fetchTime[title],
    }))
    .sort(({ fetchTime: t1 }, { fetchTime: t2 }) => t1 - t2)

  const
    [{ title }] = fetchTimestamps__ascByFetchTime,
    MalEntry = state.MalEntries[title]

  return MalEntry
}

function MalEntries__ascByTitle(state, getters) {
  const MalEntries = Object.values(state.MalEntries)
  return MalEntries.sort(createComparator('ascByTitle'))
}


const createComparator = (favor) => {
  return (a, b) => {
    if (favor === 'ascByTitle') {
      return a.title.localeCompare(b.title)
    }
    else if (favor === 'descByTitle') {
      return b.title.localeCompare(a.title)
    } else {
      throw new RangeError('Invalid favor in createComparator: ', favor)
    }
  }
}
