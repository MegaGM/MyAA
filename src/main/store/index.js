const Vue = require('vue')
const Vuex = require('vuex')
Vue.use(Vuex)

let store = null
const
  state = require('../../common/store/defaultState.js'),
  getters = require('../../common/store/getters.js'),
  actions = require('./actions'),
  mutations = require('../../common/store/mutations.js'),
  scVuexAdapter = require('./scVuexAdapter.js'),
  persistentOptions = require('./persistentOptions.plugin.js')

module.exports = { getOrCreateStore, createStore }

function getOrCreateStore(options) {
  if (store)
    return store
  else
    return createStore(options)
}

function createStore({ scServer }) {
  store = new Vuex.Store({
    state: Object.assign({}, state),
    getters,
    actions,
    mutations,
    plugins: [
      scVuexAdapter({ scServer }),
      persistentOptions
    ],
  })

  return store
}
