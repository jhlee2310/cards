<template>  
  <div>
    <div>
      <router-link v-for="i in 12" :key="i" :to="`/baccarat/${i}`" tag="span" style="margin-right:5px;cursor:pointer">{{i}}</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import * as THREE from 'three-full'
import Game from '@/js/gameManager.js'
import TWEEN from '@tweenjs/tween.js'

Vue.component('Board', () => import('@/components/Board.vue'));

export default {
  created(){
    Vue.prototype.$socket = new WebSocket('ws://192.168.0.14:3100')
    WebSocket.prototype.sendOBJ = (mes)=>{
      WebSocket.prototype.send(JSON.stringify(mes))
    }

    Vue.prototype.$socket.onmessage = mes => {
      console.log(mes)
    }
    Vue.prototype.$game = new Game({TWEEN, THREE, vue: this });    
  },
  methods:{
     ...mapMutations([
      'SET_GAME_LOADED'
    ]),
  },
  mounted(){    
    
  },
  computed: {
    ...mapState([
      'game_loaded','resolution'
    ])
  }
}
</script>

<style>

</style>
