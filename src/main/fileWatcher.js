'use strict'

const
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
  parseFilepath,
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
  // store.commit('enqueue:markEpisodeWatched', file)
  // })

  watcher
    // on init, 'add' will be dispatched for each existing file
    .on('add', filepath => {
      const file = parseFilepath(filepath)
      if (file)
        store.commit('files.add', file)
    })
    .on('ready', () => {
      watcher
        .on('change', filepath => 'noop')
        .on('unlink', filepath => {
          const file = parseFilepath(filepath)
          if (file)
            store.commit('files.unlink', file)
        })
        .on('addDir', dir => watcher.add(dir))
        .on('unlinkDir', dir => watcher.unwatch(dir))

      store.subscribe(({ type, payload: file }, state) => {
        if (!type.startsWith('files.'))
          return

        if (type === 'files.add' && file.dir === 'done')
          store.commit('enqueue:markEpisodeWatched', file)
      })
    })
}


function parseFilepath(filepath) { // /home/mome/dome/bom.mkv
  let
    parsedFile = null,
    dir,
    subdir
  const
    filename = filepath.substring(filepath.lastIndexOf('/') + 1),
    dirAbsolute = filepath.substring(0, filepath.lastIndexOf('/'))

  const
    indexOfOnogings = dirAbsolute.lastIndexOf('/ongoings'),
    indexOfDone = dirAbsolute.lastIndexOf('/done')

  if (indexOfOnogings > 0) {
    dir = 'ongoings'
    subdir = dirAbsolute.substring(indexOfOnogings + ('/ongoings'.length + 1))
  }
  else if (indexOfDone > 0) {
    dir = 'done'
    subdir = dirAbsolute.substring(indexOfDone + ('/done'.length + 1))
  }

  filename.replace(
    // [HorribleSubs] Tensei Shitara Slime Datta Ken - 17 [1080p].mkv
    /\[HorribleSubs] (.+) - (\d+) \[(\d+)p]/,
    (match, $1, $2, $3) => {
      parsedFile = {
        filepath,
        dirAbsolute,
        dir,
        subdir,
        filename,
        title: $1,
        episodeNumber: +$2,
        quality: $3,
      }
    })

  return parsedFile
}