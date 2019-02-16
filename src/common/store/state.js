'use strict'

const state = {
  eventName: 'vuex.mutation',

  CYCLE_STEP: 2,
  CYCLE_DEBUG: false,

  NYAA_QUALITY: '1080',
  UPDATE_IN_BACKGROUND: true,
  REMOVE_FILES_WHEN_DONE: true,

  MalEntries: {},
  fetchTime: {},

  NyaaEpisodes: {},
  files: {
    ongoings: {},
    done: {},
    toRemove: [],
    toMarkAsDone: [],
    toDownload: [],
  },
}

module.exports = state