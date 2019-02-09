'usy strict'

const
  Promise = require('bluebird'),
  { ipcRenderer } = require('electron'),
  axios = require('axios'),
  fastXmlParser = require('fast-xml-parser'),
  { Episode } = require('./Episode.js'),
  { File } = require('./File.js'),
  { diffMap } = require('./diffMap.js')

const NyaaMirrors = [
  // 'nyaa.si',
  'nyaa1.unblocked.lol',
  'nyaa1.unblocked.wtf',
  'nyaa1.unblocked.is',
  'nyaa.unblockall.org',
  'piyushroshan.appspot.com/nyaa.si'
]



class NyaaAPI {
  constructor() {
    this.meow = '#:3'
    this.validURL = null
    this.Episode = Episode
    this.File = File
    this.NyaaMirrors = NyaaMirrors
    this.diffMap = diffMap
  }

  async fetchQuery(q) {
    const
      url = await this.getValidURL(),
      uri = `https://${url}/?f=0&c=1_2&page=rss&q=${encodeURI(q)}`

    try {
      const res = await axios.get(uri)
      const json = fastXmlParser.parse(res.data)
      let items = json.rss.channel.item
      items = Array.isArray(items) ? items : [items]

      return items
    } catch (err) {
      console.error(`[Nyaa] catched in fetchQuery('${q}')`, err)
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
        if (err.response && err.response.status)
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

  composeNyaaQuery(titleMAL) {
    const
      subTeamDefault = 'HorribleSubs',
      qualityDefault = '1080',
      diff = this.diffMap.find(diff => diff.titleMAL === titleMAL)
    // console.info('composeNyaQuery diff: ', diff)
    const
      subTeam = diff && diff.subTeam || subTeamDefault,
      title = diff && diff.titleNyaa || diff && diff.titleMAL || titleMAL.replace(/\(TV\)/, ''),
      quality = diff && diff.quality || qualityDefault

    const NyaaQuery = `${subTeam} ${title} ${quality}`
    return NyaaQuery
  }

  async fetchEpisodes(title) {
    const
      validURL = await this.getValidURL(),
      NyaaQuery = this.composeNyaaQuery(title),
      fetchedItems = await this.fetchQuery(NyaaQuery),
      fetchedAnime = fetchedItems
        .filter(Boolean)
        .map(item => new Episode(item, { NyaaQuery, validURL }))
        .filter(NyaaEpisode => NyaaEpisode.parsed)

    return fetchedAnime
  }

  // async fetchAllCW(ongoings) {
  //   let fetchedAnime = []
  //   for (const ongoing of ongongs) {
  //     const anime = NyaaAPI.fetchEpisodes(ongoing.title)
  //     fetchAnime.push(anime)
  //   }

  //   return fetchAnime
  // }
}

const API = new NyaaAPI()
module.exports = API
