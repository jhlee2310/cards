<template>  
  <div>
    <div>
      <router-link v-for="i in 12" :key="i" :to="`/baccarat/${i}`" tag="span" style="margin-right:5px;cursor:pointer">{{i}}</router-link>
    </div>
    <div v-if="!game_loaded || !isReady">NOW LOADING</div>
    <router-view v-else/>
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
  data(){
    return {
      
    }
  },
  created(){    
    Vue.prototype.eBus = new Vue();
    Vue.prototype.$game = new Game({TWEEN, THREE, vue: this });
    this.eBus.$on('socket',mes=>{
      if(mes.type == "welcome"){
        console.log('socket connected')
        this.SET_WELCOME(mes.times)
        this.SET_IS_READY(true)
      }
    })

  },
  methods:{
     ...mapMutations([
      'SET_GAME_LOADED',
      'SET_IS_READY',
      'SET_WELCOME',
    ]),
  },
  mounted(){    
    const $socket = Vue.prototype.$socket = new WebSocket('ws://www.jh84.kr:3100')
    $socket.sendOBJ = function(mes){
      this.send(JSON.stringify(mes))
    }

    $socket.onmessage = (mes) => {
      const data = JSON.parse(mes.data)
      this.eBus.$emit('socket', data);
    }    
  },
  computed: {
    ...mapState([
      'game_loaded','resolution','room_id', 'isReady'
    ])
  }
}
</script>

<style>

</style>
