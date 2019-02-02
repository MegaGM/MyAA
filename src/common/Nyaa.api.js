'usy strict'

const
  Promise = require('bluebird'),
  { ipcRenderer } = require('electron'),
  axios = require('axios'),
  fastXmlParser = require('fast-xml-parser')

const NyaaMirrors = [
  // 'nyaa.si',
  'nyaa1.unblocked.lol',
  'nyaa1.unblocked.wtf',
  'nyaa1.unblocked.is',
  'nyaa.unblockall.org',
  'piyushroshan.appspot.com/nyaa.si'
]


// interface MalEntry {
//   progress: string | any
//   title: string
//   score: string
//   href: string
// }

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


class NyaaAPI {
  constructor() {
    this.meow = '#:3'
    this.validURL = null
    this.Episode = Episode
    this.NyaaMirrors = NyaaMirrors
  }

  async fetchQuery(q) {
    const
      url = await this.getValidURL(),
      uri = `https://${url}/?f=0&c=1_2&page=rss&q=${q}`

    try {
      const res = await axios.get(uri)
      const json = fastXmlParser.parse(res.data)
      let items = json.rss.channel.item
      items = Array.isArray(items) ? items : [items]

      return items
    } catch (err) {
      console.error('catched in Nyaa.fetchQuery', err)
    }
  }

  async getValidURL() {
    if (this.validURL)
      return this.validURL

    const OverlordIIIEp10 = 1074608 // for the test purpose

    const pingURL = async mirrorURL => {
      try {
        const res = await axios.get(`https://${mirrorURL}/download/${OverlordIIIEp10}.torrent`, { timeout: 2500 })
        console.info('getValidURL', res.status, 'for', mirrorURL)
        if (!this.validURL)
          this.validURL = mirrorURL
      } catch (err) {
        console.error('getValidURL', err.response.status, 'for', mirrorURL)
      }
    }

    await Promise.all(this.NyaaMirrors.map(pingURL))
      .then(() => console.info(`validURL: ${this.validURL}`))

    return this.validURL
  }

  // 1072772 => https://nyaa1.unblocked.wtf/download/1072772.torrent
  async uriFromTorrentID(torrentID) {
    const url = await this.getValidURL()
    return `https://${url}/download/${torrentID}.torrent`
  }

  composeNyaaQuery(title) {
    title = title
      .replace(/\(TV\)/, '')

    return encodeURIComponent(`HorribleSubs ${title} 1080`)
  }

  async fetchEpisodes(title) {
    const
      validURL = await this.getValidURL(),
      NyaaQuery = this.composeNyaaQuery(title),
      fetchedItems = await this.fetchQuery(NyaaQuery),
      fetchedAnime = fetchedItems
        .filter(Boolean)
        .map(item => new Episode(item, { NyaaQuery, validURL }))
        .filter(NyaaEpisode => NyaaEpisode.title)

    return fetchedAnime
  }

  async fetchAllCW(ongoings) {
    let fetchedAnime = []
    for (const ongoing of ongongs) {
      const anime = NyaaAPI.fetchEpisodes(ongoing.title)
      fetchAnime.push(anime)
    }

    return fetchAnime
  }
}

const API = new NyaaAPI()
module.exports = API
