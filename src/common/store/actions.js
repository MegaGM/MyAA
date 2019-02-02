'use strict'

const Nyaa = require('../Nyaa.api.js')
// if (global.BUILD_TARGET === 'electron-main') {
//   let MAL
// }

const actions = {
  async fetchNyaaEpisodesForMalEntry({ state, commit }, MalEntry) {
    const now = new Date().getTime()
    console.info(
      `-${now - state.fetchTime[MalEntry.title]}`,
      'fetchNyaaEpisodesForMalEntry',
      MalEntry.title
    )

    const
      NyaaEpisodes = {},
      NyaaEpisodesArr = await Nyaa.fetchEpisodes(MalEntry.title)

    for (const NyaaEpisode of NyaaEpisodesArr)
      NyaaEpisodes[MalEntry.title] = NyaaEpisode

    commit('NyaaEpisodes', NyaaEpisodes)
    commit('fetchTime', {
      title: MalEntry.title,
      timestamp: now,
    })
  },
  async fetchMalEntries({ state, commit }) {
    const
      now = new Date().getTime(),
      MAL = require('../mal-api/build/MAL.api.js'),
      MalEntries = {},
      MalEntriesArr = await MAL.getCW()

    for (const MalEntry of MalEntriesArr)
      MalEntries[MalEntry.title] = MalEntry

    if (!Object.keys(state.fetchTime).length)
      for (const MalEntry of MalEntriesArr)
        commit('fetchTime', {
          title: MalEntry.title,
          timestamp: now,
        })

    commit('MalEntries', MalEntries)
  },
  // async lookupFiles({ state, commit }, dir) {
  //   const
  //   dirname=dir.
  //     downloadedFiles = fs.readdirSync(dir),
  //     downloadedEpisodes = downloadedFiles.map(file => parseFilename(file)).filter(Boolean)

  //   const parseFilename = title => {
  //     let parsed = null
  //     title.replace(
  //       /\[HorribleSubs] (.+) - (\d+) \[(\d+)p]/,
  //       (match, $1, $2, $3) => {
  //         parsed = {}
  //         parsed.title = $1
  //         parsed.episodeNumber = +$2
  //         parsed.quality = $3
  //       })

  //     return parsed
  //   }
  // },
}

module.exports = actions