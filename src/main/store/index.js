const Vue = require('vue')
const Vuex = require('vuex')
Vue.use(Vuex)

let store = null
const
  state = require('../../common/store/state.js'),
  getters = require('../../common/store/getters.js'),
  actions = require('../../common/store/actions.js'),
  mutations = require('../../common/store/mutations.js'),
  ipcVuexAdapter = require('./ipcVuexAdapter.js')

module.exports = { getOrCreateStore, createStore }

function getOrCreateStore(options) {
  if (store)
    return store
  else
    return createStore(options)
}

function createStore({ w }) {
  store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins: [ipcVuexAdapter({ w })],
  })

  return store
}
