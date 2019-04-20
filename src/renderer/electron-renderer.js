global.BUILD_TARGET = 'electron-renderer'

import Vue from 'vue'
Vue.config.productionTip = false

// install plugins
import AntDesignFramework from './plugins/ant-design-vue.plugin.js'
import css from './styles/index.css'

// bootstrap app
import App from './components/App.vue'
import router from './router'
import { getOrCreateStore } from './store'
import scVuexAdapter from './store/scVuexAdapter.js'

import SCVue from './plugins/socketcluster-client.plugin.js'
SCVue
  .install(Vue)
  .then((scSocket) => {
    const store = getOrCreateStore()
    scVuexAdapter({ scSocket })(store)

    new Vue({
      router,
      store,
      components: { App },
      methods: {
        // it could be a plugin-mixin
        openLink(link) {
          this.$scSocket.emit('openFile', link)
        },
      },
      render: (h) => h(App),
    }).$mount('#app')
  })