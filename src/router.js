import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/baccarat/',
      name: 'baccarat',
      component: () => import('./views/Baccarat/Main.vue'),
      children: [
        {
          path: '',
          name: 'lobby',
          component: () => import('./views/Baccarat/Test.vue'),
        },
        {
          path: ':room_id',
          name: 'game_room',
          component: () => import('./views/Baccarat/Room.vue'),
          props: true,
        }

      ],
    },
    {
      path: '/lobby',
      name: 'lobby',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Lobby.vue'),
    }
  ]
})
