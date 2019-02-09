'use strict'

class Episode {
  constructor(o, opts) {
    this.rawTitle = o.title
    this.href = o.link.replace(/nyaa\.si/, opts.validURL)
    this.torrentID = o.link.replace(/https:\/\/[^\/]+\/download\/(\d+)\.torrent/, '$1')
    this.time = (new Date(o.pubDate)).getTime()
    this.seeders = o['nyaa:seeders']
    this.size = o['nyaa:size']
    this.NyaaQuery = opts.NyaaQuery
    this.new = opts.new
    this.downloaded = opts.downloaded
    // this.timesince = timeSince(this.time)
    this.parseTitle()
  }

  parseTitle() {
    //  [HorribleSubs] Black Clover - 67 [1080p].mkv
    this.rawTitle.replace(
      /\[HorribleSubs] (.+) - (\d+) \[(\d+)p]/,
      (match, $1, $2, $3) => {
        this.title = $1
        this.episodeNumber = +$2
        this.quality = $3
      })
  }
}

module.exports = { Episode }


// export default class Anime {
//   constructor(o, opts) {
//     this.title = o.title
//     // this.link = o.link
//     this.time = (new Date(o.pubDate)).getTime()
//     this.seeds = o['nyaa:seeders']
//     this.size = o['nyaa:size']
//     this.torrentID = o.link.replace(/https:\/\/[^\/]+\/download\/(\d+)\.torrent/, '$1')
//     this.NyaaQuery = opts.NyaaQuery
//     this.new = opts.new
//     this.downloaded = opts.downloaded
//     // this.timesince = timeSince(this.time)
//   }
// }