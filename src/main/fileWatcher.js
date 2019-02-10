'use strict'

const
  Nyaa = require('../common/nyaa-api/Nyaa.api.js'),
  chokidar = require('chokidar'),
  watcherDirs = [
    '/new/trrnt/anime/ongoings',
    '/new/trrnt/anime/done',
  ],
  watcherOptions = {
    ignored: /[\/\\]\./i,
  },
  watcher = chokidar.watch(watcherDirs, watcherOptions)

module.exports = {
  setupFileWatcher,
}

// setupFileWatcher({
//   store: {
//     commit: console.log.bind(console),
//   }
// })

function setupFileWatcher({ store } = {}) {
  // store.subscribe(({ type, payload: file }, state) => {
  //   if (!type.startsWith('files.'))
  //     return

  //   if (type === 'files.add' && file.dir === 'done')
  // store.commit('enqueue:markAsDone', file)
  // })

  watcher
    // on init, 'add' will be dispatched for each existing file
    .on('add', filepath => {
      // const file = Nyaa.File.parseFilepath(filepath)
      const NyaaFile = new Nyaa.File(filepath)
      if (NyaaFile.parsed)
        store.commit('files.add', NyaaFile)
    })
    .on('ready', () => {
      watcher
        .on('change', filepath => 'noop')
        .on('unlink', filepath => {
          const NyaaFile = new Nyaa.File(filepath)
          if (NyaaFile.parsed)
            store.commit('files.unlink', NyaaFile)
        })
        .on('addDir', dir => watcher.add(dir))
        .on('unlinkDir', dir => watcher.unwatch(dir))

      store.subscribe(({ type, payload: NyaaFile }, state) => {
        if (!type.startsWith('files.'))
          return

        if (type === 'files.add' && NyaaFile.dir === 'done')
          store.commit('enqueue:markAsDone', NyaaFile)
      })
    })
}

