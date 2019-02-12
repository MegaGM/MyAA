'use strict'
const fs = require('fs-extra')

const
  filepath = './options.json',
  persistentOptions = [
    'NYAA_QUALITY',
    'UPDATE_IN_BACKGROUND',
    'REMOVE_FILES_WHEN_DONE',
  ]

module.exports = function init(store) {
  try {
    const options = fs.readJSONSync(filepath)
    if (options)
      for (const key in options)
        store.state[key] = options[key]
  } catch (err) {
    console.warn('[persistentOptions.vuex.plugin] No ./options.json', err.message)
  }

  store.subscribe(({ type, payload }, state) => {
    const shouldUpdate = persistentOptions.includes(type)
    if (!shouldUpdate)
      return

    const options = {}
    for (const key of persistentOptions)
      options[key] = state[key]

    options[type] = payload

    fs.outputJSONSync(filepath, options)
  })
}