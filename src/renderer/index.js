global.BUILD_TARGET = 'electron-renderer'

import Vue from 'vue'
import router from './router'
import { getOrCreateStore } from './store'
import App from './components/App.vue'


// install plugins
import AntDesignFramework from './plugins/ant-design-vue.plugin.js'
import css from './styles/index.css'



import electron from 'electron'
Vue.prototype.$electron = electron

Vue.config.productionTip = false

new Vue({
  router,
  store: getOrCreateStore(),
  components: { App },
  render: (h) => h(App),
}).$mount('#app')
