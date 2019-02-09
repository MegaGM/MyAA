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
  // store.commit('enqueue:markEpisodeAsWatched', file)
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
          store.commit('enqueue:markEpisodeAsWatched', file)
      })
    })
}


/**
 * filename examples:
 * /new/trrnt/anime/ongoings/[HorribleSubs] Tensei Shitara Slime Datta Ken - 17 [1080p].mkv
 * /new/trrnt/anime/done/KaguyaCustomSubdir/[Erai-raws] Kaguya-sama wa Kokurasetai - Tensai-tachi no Renai Zunousen - 05 [1080p].mkv
 */
function parseFilepath(filepath) {
  const
    filename = filepath.substring(filepath.lastIndexOf('/') + 1),
    dirAbsolute = filepath.substring(0, filepath.lastIndexOf('/'))

  let dir, subdir
  {
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
  }


  const parsedTitle = Nyaa.Episode.parseTitle(filename)
  if (!parsedTitle)
    return null // indicate that we were unable to recognize the file as a NyaaEpisode

  const parsedFile = Object.assign({
    filepath,
    dirAbsolute,
    dir,
    subdir,
    filename,
  },
    parsedTitle
  )

  return parsedFile
}