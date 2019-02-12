'use strict'

const { ipcMain } = require('electron')

module.exports = function init({ w }) {
  return function adapter(store) {
    const eventName = store.state.eventName

    /**
     * Receive state changes from client
     */
    ipcMain.on(eventName, (event, { type, payload }) => {
      store.commit(type, payload)
    })

    /**
     * Propagate state changes to client
     */
    store.subscribe((mutation, state) => {
      // if (mutation.type === 'MalEntries')
      //   console.info('MalEntries: ',mutation)
      w.webContents.send(eventName, mutation)
    })
  }
}