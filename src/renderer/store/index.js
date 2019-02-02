import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import state from '../../common/store/state.js'
import getters from '../../common/store/getters.js'
import mutations from '../../common/store/mutations.js'
import ipcVuexAdapter from './ipcVuexAdapter.js'


export function createStore(options) {
  const store = new Vuex.Store({
    state,
    getters,
    mutations,
    plugins: [ipcVuexAdapter()],
  })

  return store
}
