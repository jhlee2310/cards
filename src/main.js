import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueNativeSock from 'vue-native-websocket'
import _ from 'lodash';
import VueDragscroll from 'vue-dragscroll'
import Fragment from 'vue-fragment'
import '@/assets/global.css'

Object.defineProperty(Vue.prototype, '$_', { value: _ });

Vue.config.productionTip = false

const chatSocket = new WebSocket('ws://192.168.0.57:7070');
//chatSocket.onmessage = mes => console.log(mes)
Object.defineProperty(Vue.prototype, '$chat', {value: chatSocket});

//Vue.use(VueNativeSock, 'ws://192.168.0.14:3100')
Vue.use(Fragment.Plugin)
Vue.use(VueNativeSock, 'ws://eostics.io:3100', {
  connectManually: true,
})



Vue.use(VueDragscroll)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
