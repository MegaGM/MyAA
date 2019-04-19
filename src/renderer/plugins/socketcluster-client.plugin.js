import sc from 'socketcluster-client'

export default {
  install(Vue, options) {
    return new Promise((resolve, reject) => {
      const scOptions = {
        autoReconnectOptions: {
          initialDelay: 1000,
          maxDelay: 5000,
          multiplier: 1,
          randomness: 200,
        },
        host: 'localhost:7700',
      }
      if (options)
        Object.assign(scOptions, options)

      const scSocket = sc.create(scOptions)
      scSocket.on('connect', () => {
        Vue.prototype.$scSocket = scSocket
        resolve(scSocket)
      })
    })
  }
}