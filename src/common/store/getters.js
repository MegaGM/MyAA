'use strict'

module.exports = {
  getFileStatusByNyaaEpisode,
  getFreshNyaaEpisodesByMalEntry,
  isMalEntryOutdated,
  getNyaaEpisodesByMalEntry,
  getLastNyaaEpisodeUploadTimeByMalEntry,
  MalEntry__LRU,
  MalEntries__ascByTitle,
}

function isMalEntryOutdated(state) {
  return MalEntry => {
    const
      fetchTime = MalEntry.fetchTime,
      msToGetOutdated = (Object.keys(state.MalEntries).length /* just to be sure */ - 5) * (state.CYCLE_STEP * 1000) || 5 * 60 * 1000,
      isOutdated = fetchTime < (new Date().getTime() - msToGetOutdated)

    return isOutdated
  }
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

function getFreshNyaaEpisodesByMalEntry(state, getters) {
  return MalEntry => {
    const
      episodes = getters.getNyaaEpisodesByMalEntry(MalEntry),
      freshNyaaEpisodes = episodes.filter(NyaaEpisode =>
        NyaaEpisode.episodeNumber > MalEntry.progress.current
      )

    return freshNyaaEpisodes
  }
}

function getNyaaEpisodesByMalEntry(state, getters) {
  return MalEntry => {
    const episodes = state.NyaaEpisodes[MalEntry.title]
    if (!episodes || !episodes.length)
      return []

    return episodes
  }
}

function getLastNyaaEpisodeUploadTimeByMalEntry(state, getters) {
  return MalEntry => {
    const episodes = getters.getNyaaEpisodesByMalEntry(MalEntry)
    if (!episodes || !episodes.length)
      return 0

    const lastEpisode = episodes.sort((a, b) => b.time - a.time)[0]
    return lastEpisode.time

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
