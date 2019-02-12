global.BUILD_TARGET = 'electron-renderer'

import Vue from 'vue'
Vue.config.productionTip = false

// install plugins
import AntDesignFramework from './plugins/ant-design-vue.plugin.js'
import css from './styles/index.css'
import electron from 'electron'
Vue.prototype.$electron = electron

// bootstrap app
import router from './router'
import { getOrCreateStore } from './store'

import App from './components/App.vue'

new Vue({
  router,
  store: getOrCreateStore(),
  components: { App },
  methods: {
    openLink(link) {
      this.$electron.shell.openExternal(link)
    },
  },
  render: (h) => h(App),
}).$mount('#app')
