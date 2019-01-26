import Vue from 'vue'
import Vuex from 'vuex'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Antd)

import App from './App.vue'

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
})