import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store = null
import state from '../../common/store/state.js'
import getters from '../../common/store/getters.js'
import mutations from '../../common/store/mutations.js'
import mapAll from '../../common/store/mapAll.plugin.js'
import ipcVuexAdapter from './ipcVuexAdapter.js'


export function getOrCreateStore(options) {
  if (store)
    return store
  else
    return createStore(options)
}

export function createStore(options) {
  store = new Vuex.Store({
    state,
    getters,
    mutations,
    plugins: [
      ipcVuexAdapter(),
      mapAll,
    ],
  })

  return store
}
