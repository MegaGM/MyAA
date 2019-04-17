'use strict'

module.exports = job

async function job(store) {
  if (!store || !store.state.UPDATE_IN_BACKGROUND)
    return

  await store.dispatch('fetchMalEntries')

  /**
   * Check if there are some quests
   */
  const toDownload = store.state.files.toDownload
  if (toDownload.length) {
    await store.dispatch('downloadNyaaEpisode', toDownload[0])
    return // since it includes https GET to Nyaa.si
  }

  const toMarkAsDone = store.state.files.toMarkAsDone
  if (toMarkAsDone.length)
    await store.dispatch('markAsDone', toMarkAsDone[0])

  const toRemove = store.state.files.toRemove
  if (toRemove.length)
    await store.dispatch('removeFile', toRemove[0])


  /**
   * After all quests, update a single MalEntry
   */
  let MalEntry = store.getters.MalEntry__LRU
  if (!MalEntry)
    MalEntry = store.getters.MalEntry__Random

  await store.dispatch('fetchNyaaEpisodesForMalEntry', MalEntry)
}