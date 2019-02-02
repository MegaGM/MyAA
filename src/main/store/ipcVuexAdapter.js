const { ipcMain } = require('electron')

module.exports = function init({ w }) {
  return function adapter(store) {
    const eventName = store.state.eventName

    /**
     * Receive state changes from client
     */
    ipcMain.on(eventName, (event, mutation) => {
      store.commit(mutation)
    })

    /**
     * Propagate state changes to client
     */
    store.subscribe((mutation, state) => {
      w.webContents.send(eventName, mutation)
    })
  }
}