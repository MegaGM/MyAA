import { ipcRenderer } from 'electron'

export default function init() {
  return function adapter(store) {
    const eventName = store.state.eventName

    /**
     * Receive state changes from client
     */
    ipcRenderer.on(eventName, (event, mutation) => {
      console.info('mutation', mutation.type)
      store.commit(mutation)
    })

    /**
     * Propagate state changes to server
     */
    // store.subscribe((mutation, state) => {
    //   const extended = Object.assign(mutation, { isForServer: true })
    //   ipcRenderer.send(eventName, extended)
    // })
  }
}
