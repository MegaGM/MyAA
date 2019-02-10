'use strict'
const { Episode } = require('./Episode.js')

class File {
  constructor(filepath, opts) {
    const file = File.parseFilepath(filepath)
    if (!file)
      return this.parsed = false

    this.parsed = true
    for (const key in file)
      this[key] = file[key]
  }


  /**
   * @example:
   * /new/trrnt/anime/ongoings/[HorribleSubs] Tensei Shitara Slime Datta Ken - 17 [1080p].mkv
   * /new/trrnt/anime/done/SomeCustomSubdir/[Erai-raws] Renai Zunousen - 05 [1080p].mkv
   */
  static parseFilepath(filepath) {
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


    const parsedTitle = Episode.parseTitle(filename)
    if (!parsedTitle)
      return null // indicate that we were unable to recognize the file as a NyaaEpisode

    const NyaaFile = Object.assign({
      filepath,
      dirAbsolute,
      dir,
      subdir,
      filename,
    },
      parsedTitle
    )

    return NyaaFile
  }
}

module.exports = { File }