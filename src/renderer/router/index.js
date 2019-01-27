import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      // path: '/home/mega/github/horrible-nyaa-mal/build/renderer/index.html',
      name: 'Home',
      component: Home,
      // component: () => import(/* webpackChunkName: 'homechung' */ './Home.vue'),
    },
  ],
})

