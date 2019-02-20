import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import VueSocketIo from 'vue-socket.io'
import VueNativeSock from 'vue-native-websocket'

Vue.config.productionTip = false
/*
Vue.use(new VueSocketIo({
  debug:true,
  connection: 'ws://192.168.0.19:3100',
  vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))
*/

Vue.use(VueNativeSock,'ws://192.168.0.57:10080')
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
