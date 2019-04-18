'use strict'

module.exports = function init({ scServer }) {
  return function adapter(store) {
    const eventName = store.state.eventName

    /**
     * Receive state changes from client
     */
    // ipcMain.on(eventName, (event, { type, payload }) => {
    //   store.commit(type, payload)
    // })

    /**
     * Propagate state changes to client
     */
    store.subscribe((mutation, state) => {
      scServer.exchange.publish(eventName, mutation)
    })
  }
}