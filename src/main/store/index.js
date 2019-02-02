const Vue = require('vue')
const Vuex = require('vuex')
Vue.use(Vuex)

const
  state = require('../../common/store/state.js'),
  getters = require('../../common/store/getters.js'),
  actions = require('../../common/store/actions.js'),
  mutations = require('../../common/store/mutations.js'),
  ipcVuexAdapter = require('./ipcVuexAdapter.js')


module.exports = { createStore }

function createStore({ w }) {
  const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins: [ipcVuexAdapter({ w })],
  })

  return store
}
