const { ipcMain } = require('electron')

module.exports = {
  setupAPI,
}

async function setupAPI() {
  ipcMain.on('updateMalEntryProgress', async (event, options) => {
    const MalEntry = await MAL.updateProgress(options)
    const MalEntriesArr = await refetchMalEntries()
    store.forceMalEntryToBeUpdated(MalEntry.title)
    event.sender.send('MalEntries', MalEntriesArr)
  })

  ipcMain.on('forceMalEntryToBeUpdated', async (event, title) => {
    store.forceMalEntryToBeUpdated(title)
  })

  ipcMain.on('getMalEntries', async (event, payload) => {
    const MalEntriesArr = await refetchMalEntries()
    /**
     * sending MalEntriesArr, unsorted Array of MalEntries,
     * instead of grabbing the Object from store,
     * because on the client we need an Array of MalEntries
     * and because the array will be sorted there anyway
     */
    event.sender.send('MalEntries', MalEntriesArr)
  })

  ipcMain.on('getUpdates', async (event, payload) => {
    const withNewEpisodes = Object.entries(store.newEpisodes)
      .filter(([title, newEpisodes]) => newEpisodes.length)

    const updates = []
    for (const [title, newEpisodes] of withNewEpisodes) {
      updates.push({
        title,
        newEpisodes,
      })
    }

    event.sender.send('updates', updates)
  })
}
