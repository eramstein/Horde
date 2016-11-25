import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Game from '../views/Game'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Home
    }, {
      path: '/game',
      component: Game
    }
  ]
})