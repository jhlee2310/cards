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
    Vue.prototype.$game = new Game({TWEEN, THREE, vue: this });
    Vue.prototype.eBus = new Vue();
  },
  methods:{
     ...mapMutations([
      'SET_GAME_LOADED'
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
      'game_loaded','resolution','room_id'
    ])
  }
}
</script>

<style>

</style>
