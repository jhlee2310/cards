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
import w from '../../../public/test.js'
Vue.component('Board', () => import('@/components/Board.vue'));

export default {
  data(){
    return {
      
    }
  },
  created(){
    const that = this
    Vue.prototype.eBus = new Vue();
    Vue.prototype.$game = new Game({TWEEN, THREE, vue: this });

    const useWorker = true;

    if(useWorker){
      // worker를 가동할 경우    
      this.$worker = new Worker('/worker.js');          
      this.$worker.onmessage = (mes) => {      
        this.eBus.$emit('worker', mes.data )
      };
    }else{
      // worker를 가동하지 않을경우
      this.$worker_self = new (function(){
        this.postMessage = (mes) => {
          w(mes, that)
        };
      })();
    }

    const worker = useWorker ? this.$worker : this.$worker_self;    
    this.eBus.$on('socket', mes => {
      if(mes.type == "welcome"){
        console.log('socket connected')
        this.SET_WELCOME(mes.times)
        this.SET_IS_READY(true)
        
        if(this.$worker) this.$worker.postMessage({
          type: 'welcome',
          data: mes.times
        })
      }
    })

    //하부컴퍼넌트에서 요청
    this.eBus.$on('toWorker', mes=>{
      switch(mes.type){
        case "start_bet_timer":
          worker.postMessage(mes)
        break;
      }
    });     
       
  },
  methods:{
     ...mapMutations([
      'SET_GAME_LOADED',
      'SET_IS_READY',
      'SET_WELCOME',
    ]),
    sendTime(t){
      this.eBus.$emit('worker',{
        type: 'timer',
        value: t,
      });
    }
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
