import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import VueNativeSock from 'vue-native-websocket'
import _ from 'lodash';
import VueDragscroll from 'vue-dragscroll'
import Fragment from 'vue-fragment'
import '@/assets/global.css'
import moment from 'moment'

Object.defineProperty(Vue.prototype, '$_', { value: _ });
Object.defineProperty(Vue.prototype, '$moment', { value: moment });

Vue.config.productionTip = false

//const chatSocket = new WebSocket('ws://192.168.0.29:7070');
//chatSocket.onmessage = mes => console.log(mes)
//Object.defineProperty(Vue.prototype, '$chat', {value: chatSocket});

//Vue.use(VueNativeSock, 'ws://192.168.0.14:3100')
Vue.use(Fragment.Plugin)
//Vue.use(VueNativeSock, 'ws://www.jh84.kr:3100', {
//  connectManually: true,
//})



Vue.use(VueDragscroll)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
