'use strict'

module.exports = function init({ scServer }) {
  return function adapter(store) {
    /**
     * Propagate state changes to client
     */
    const channelName = store.state.eventName
    store.subscribe((mutation, state) => {
      scServer.exchange.publish(channelName, mutation)
    })
  }
}