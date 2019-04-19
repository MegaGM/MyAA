'use strict'
const { diffMap } = require('../../common/nyaa-api/diffMap.js')

class Episode {
  constructor(o, opts) {
    this.rawTitle = o.title
    this.href = o.link.replace(/nyaa\.si/, opts.validURL)
    this.torrentID = o.link.replace(/https:\/\/[^\/]+\/download\/(\d+)\.torrent/, '$1')
    this.time = (new Date(o.pubDate)).getTime()
    this.seeders = o['nyaa:seeders']
    this.size = o['nyaa:size']
    this.NyaaQuery = opts.NyaaQuery
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
   * [Nauti] Kakegurui XX - 01 [5BD79EEA].mkv [720p]
   */
  static parseTitle(rawTitle) {
    const
      subTeams = diffMap.map(d => d.subTeam).filter(Boolean),
      uniqueSubTeams = [...new Set(subTeams)],
      mainRegexp = new RegExp(`\\[(${uniqueSubTeams.join('|')})] (.+) - (\\d+)`, 'i'),
      qualityRegexp = /\[(?:[^\]]+)?(1080p|720p|480p)(?:[^\]]+)?]/i

    if (!mainRegexp.test(rawTitle))
      return null // indicate failure

    const [match, subTeam, title, episodeNumber] = rawTitle.match(mainRegexp)

    const parsedTitle = {
      subTeam,
      title,
      episodeNumber: +episodeNumber,
    }

    if (qualityRegexp.test(rawTitle)) {
      const [match, quality] = rawTitle.match(qualityRegexp)
      parsedTitle.quality = quality
    }

    return parsedTitle
  }
}

module.exports = { Episode }