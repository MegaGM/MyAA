'use strict'

const
  Nyaa = require('../nyaa-api/Nyaa.api.js'),
  chokidar = require('chokidar'),
  watcherDirs = [
    '/new/trrnt/anime/ongoings',
    '/new/trrnt/anime/done',
    // '/wd/trrnt/anime/ongoings',
    // '/wd/trrnt/anime/done',
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
  store.subscribe(({ type, payload: NyaaFile }, state) => {
    if (type === 'files.add' && NyaaFile.dir === 'done')
      store.commit('enqueue:markAsDone', NyaaFile)
  })

  watcher
    // on init, 'add' will be dispatched for each existing file
    .on('add', filepath => {
      const NyaaFile = new Nyaa.File(filepath)

      if (NyaaFile.parsed)
        store.commit('files.add', NyaaFile)
      else
        console.warn(`[fileWatcher] Unable to parse as NyaaFile: \n${filepath}\n`)
    })
    .on('ready', () => {
      store.subscribe(({ type, payload: NyaaFile }, state) => {
        if (type === 'files.add' && NyaaFile.dir === 'ongoings') {
          const
            diff = Nyaa.diffMap.find(diff => diff.titleNyaa === NyaaFile.title),
            MalEntry = state.MalEntries[diff && diff.titleMAL || NyaaFile.title]

          if (MalEntry && MalEntry.title)
            store.commit('fetchTime', { title: MalEntry.title, timestamp: 0 })
        }
      })

      watcher
        .on('change', filepath => 'noop')
        .on('unlink', filepath => {
          const NyaaFile = new Nyaa.File(filepath)
          if (NyaaFile.parsed)
            store.commit('files.unlink', NyaaFile)
        })
        .on('addDir', dir => watcher.add(dir))
        .on('unlinkDir', dir => watcher.unwatch(dir))
    })
}

