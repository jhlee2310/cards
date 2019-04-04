<template>  
  <div>
    <router-view v-if="game_loaded && game_connected"></router-view>
    <!--hidden canvas-->
    <canvas width="256" height="256" ref="hiddenCanvas" v-show="false"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import * as THREE from 'three-full'
import Game from '@/js/gameManager.js'
import TWEEN from '@tweenjs/tween.js'
import Board from '@/components/Board.vue'
Vue.component('Board',Board)
//require('../../../public/test.js')
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
      const pm = window.abc;
      this.$worker_self = new (function(){
        this.handleTimeout = {}
        this.postMessage = (mes)=>{
          pm.bind(this)(mes, that);
        }
      })();
    }

    const worker = useWorker ? this.$worker : this.$worker_self;

    this.eBus.$on('socket', mes => {
      console.log(mes)
      if(mes.type == "welcome"){
        console.log('socket connected')
        this.SET_WELCOME(mes.times)        
        this.SET_GAME_CONNECTED(true)

        this.$socket.send(JSON.stringify({
          type    :"req_room_list",
          offset  : 0,
          count   : 10
        }))
        
        if( this.eosAccount && this.eosAccount.name ){
          this.tosvr_set_scatter_identity();          
        }else{
          
        }
        
        if(this.$worker) this.$worker.postMessage({
          type: 'welcome',
          data: mes.times
        })
      }else if(mes.type == "game_token_info"){
        this.SET_CREDIT(mes.value)
      }else if(mes.type == "room_list"){
        //this.SET_ROOM_LIST(mes.rooms);
      }else if(mes.type == "room_bead"){
        //this.SET_ROOM_BEAD(mes)
      }
    })

    //하부컴퍼넌트에서 요청
    this.eBus.$on('toWorker', mes=>{
      switch(mes.type){
        case "start_bet_timer":
          worker.postMessage(mes)
        break;
        case "start_cards_animation":
          worker.postMessage(mes)
        break;
        case "stop_animation":
          worker.postMessage(mes)
        break;
      }
    });     
       
  },
  methods: {
     ...mapMutations([
      'SET_GAME_LOADED',
      'SET_IS_READY',
      'SET_WELCOME',
      'SET_CREDIT',
      'SET_GAME_CONNECTED',
      'SET_ROOM_LIST',
      'SET_LOADING_PROGRESS',
      'INCREASE_LOADING_PROGRESS'
    ]),
    tosvr_set_scatter_identity() {
      let req_json = {
        type: "req_set_scatter_identity",
        identity: this.eosAccount.name
      };
      this.$socket.send(JSON.stringify(req_json));      
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
      'game_loaded','resolution','room_id','welcome', 'eosAccount', 'game_connected', 'loading_progress'
    ])
  }
}
</script>

<style>

</style>
