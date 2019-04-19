export default function init({ scSocket }) {
  return function adapter(store) {
    /**
     * Receive state changes,
     * which are either EMITted or PUBLISHed from server
     */
    const channelName = store.state.eventName
    const channel = scSocket.channel(channelName)
    scSocket.on(channelName, watcher)
    if (!channel.isSubscribed()) {
      channel.subscribe()
    }
    channel.unwatch(watcher)
    channel.watch(watcher)

    function watcher({ type, payload }) {
      store.commit(type, payload)
    }
  }
}