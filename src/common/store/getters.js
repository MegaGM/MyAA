'use strict'
const { diffMap } = require('../nyaa-api/diffMap.js')

module.exports = {
  getFileStatusByNyaaEpisode,
  getFreshNyaaEpisodesByMalEntry,
  isMalEntryOutdated,
  getNyaaEpisodesByMalEntry,
  getLastNyaaEpisodeUploadTimeByMalEntry,
  MalEntry__Random,
  MalEntry__LRU,
  MalEntries__ascByTitle,
}

function isMalEntryOutdated(state) {
  return MalEntry => {
    const
      fetchTime = state.fetchTime[MalEntry.title] || 0,
      // msToGetOutdated = (Object.keys(state.MalEntries).length /* just to be sure */ * 2) * (state.CYCLE_STEP * 1000) || 5 * 60 * 1000,
      isOutdated = fetchTime < (new Date().getTime() - state.msToGetOutdated)

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

function MalEntry__Random(state) {
  const
    keys = Object.keys(state.MalEntries),
    randomIndex = Math.floor(Math.random() * keys.length),
    MalEntry = state.MalEntries[keys[randomIndex]]

  return MalEntry
}

function MalEntry__LRU(state) {
  const
    noMalEntries = !Object.keys(state.MalEntries).length,
    noFetchTimestamps = !Object.keys(state.fetchTime).length
  if (noMalEntries || noFetchTimestamps) {
    console.warn('[MalEntry__LRU] (noMalEntries || noFetchTimestamps)')
    return null
  }

  const fetchTimestamps__ascByFetchTime = Object
    .entries(state.fetchTime)
    .map(([title, fetchTime]) => ({ title, fetchTime }))
    .sort(({ fetchTime: t1 }, { fetchTime: t2 }) => t1 - t2)

  const
    [{ title: titleNyaa }] = fetchTimestamps__ascByFetchTime,
    diff = diffMap.find(d => d.titleNyaa === titleNyaa),
    title = diff && diff.titleMAL || titleNyaa,
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
