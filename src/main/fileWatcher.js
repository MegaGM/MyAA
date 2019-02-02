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
    })
}


function parseFilepath(filepath) { // /home/mome/dome/bom.mkv
  let parsedFile = null
  const
    filename = filepath.substring(filepath.lastIndexOf('/') + 1),
    dirAbsolute = filepath.substring(0, filepath.lastIndexOf('/')),
    dir = dirAbsolute.substring(dirAbsolute.lastIndexOf('/') + 1)

  filename.replace(
    // [HorribleSubs] Tensei Shitara Slime Datta Ken - 17 [1080p].mkv
    /\[HorribleSubs] (.+) - (\d+) \[(\d+)p]/,
    (match, $1, $2, $3) => {
      parsedFile = {
        filepath,
        dirAbsolute,
        dir,
        filename,
        title: $1,
        episodeNumber: +$2,
        quality: $3,
      }
    })

  return parsedFile
}