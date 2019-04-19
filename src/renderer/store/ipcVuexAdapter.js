import { ipcRenderer } from 'electron'

export default function init() {
  return function adapter(store) {
    const eventName = store.state.eventName

    /**
     * Receive state changes from server
     */
    ipcRenderer.on(eventName, (event, { type, payload }) => {
      store.commit(type, payload)
    })

    /**
     * Propagate state changes to server
     */
    // store.subscribe((mutation, state) => {
    //   const extended = Object.assign(mutation, { isForServer: true })
    //   this.$scSocket.emit(eventName, extended)
    // })
  }
}
