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
  // store.commit('enqueue:markNyaaEpisodeAsWatched', file)
  // })

  watcher
    // on init, 'add' will be dispatched for each existing file
    .on('add', filepath => {
      const file = Nyaa.File.parseFilepath(filepath)
      if (file)
        store.commit('files.add', file)
    })
    .on('ready', () => {
      watcher
        .on('change', filepath => 'noop')
        .on('unlink', filepath => {
          const file = Nyaa.File.parseFilepath(filepath)
          if (file)
            store.commit('files.unlink', file)
        })
        .on('addDir', dir => watcher.add(dir))
        .on('unlinkDir', dir => watcher.unwatch(dir))

      store.subscribe(({ type, payload: file }, state) => {
        if (!type.startsWith('files.'))
          return

        if (type === 'files.add' && file.dir === 'done')
          store.commit('enqueue:markNyaaEpisodeAsWatched', file)
      })
    })
}

