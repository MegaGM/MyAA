'use strict'
const { diffMap } = require('./diffMap.js')

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

    const parsedTitle = Episode.parseTitle(this.rawTitle)
    if (!parsedTitle)
      return this.parsed = false

    this.parsed = true
    for (const key in parsedTitle)
      this[key] = parsedTitle[key]
  }


  /**
   * @example:
   * [HorribleSubs] Tensei Shitara Slime Datta Ken - 17 [720p].mkv
   * [project-gxs] Uchuu Senkan Yamato 2202 - 22 [10bit 1080p] [6718054B].mkv
   * [Erai-raws] Kaguya-sama wa Kokurasetai - Tensai-tachi no Renai Zunousen - 05 [1080p][Multiple Subtitle].mkv
   */
  static parseTitle(rawTitle) {
    const
      subTeams = diffMap.map(d => d.subTeam).filter(Boolean),
      uniqueSubTeams = [...new Set(subTeams)],
      regex = new RegExp(`\\[(${uniqueSubTeams.join('|')})] (.+) - (\\d+) \\[(?:[^\\]]+)?(1080p|720p|480p)]`, 'i')

    let parsedTitle = null
    rawTitle.replace(regex, (match, $1, $2, $3, $4) => {
      parsedTitle = {
        subTeam: $1,
        title: $2,
        episodeNumber: +$3,
        quality: $4,
      }
    })

    return parsedTitle
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