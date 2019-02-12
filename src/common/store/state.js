'use strict'

const state = {
  eventName: 'vuex.mutation',
  MalEntries: {},
  NyaaEpisodes: {},
  fetchTime: {},

  NYAA_QUALITY: '1080',
  UPDATE_IN_BACKGROUND: true,
  REMOVE_FILES_WHEN_DONE: true,

  files: {
    ongoings: {},
    done: {},
    toRemove: [],
    toMarkAsDone: [],
    toDownload: [],
  },
}

module.exports = state