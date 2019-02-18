'use strict'

const state = {
  eventName: 'vuex.mutation',
  onChangeOfTheseSettingsDumpVuexStateToFS: [
    'CYCLE_STEP',
    'CYCLE_DEBUG',
    'NYAA_QUALITY',
    'UPDATE_IN_BACKGROUND',
    'REMOVE_FILES_WHEN_DONE',
    'NyaaEpisodes',
  ],

  CYCLE_STEP: 2,
  CYCLE_DEBUG: false,

  NYAA_QUALITY: '1080',
  UPDATE_IN_BACKGROUND: true,
  REMOVE_FILES_WHEN_DONE: true,

  MalEntries: {},
  fetchTime: {},
  msToGetOutdated: 100000,

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