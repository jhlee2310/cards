<template>
  <div ref="room_root">
    <div>{{room_detail}}{{game_loaded}} {{resolution}}</div>
    <div id="cont_3d" ref="cont_3d" :style="{
      width: resolution.width + 'px',
      height: resolution.height + 'px',
      position: 'relative',
    }">
      <!--Room Number -->
      <div class="table-number" :style="tableNumStyle">
        <span>TABLE</span><span style="margin-left:20px;">{{room_id}}</span>
      </div>
      <!--round Number -->
      <div class="round-number" :style="roundNumStyle">
        <span>ROUND</span><span style="margin-left:20px;">{{game_status.round}}</span>
      </div>
      <!--modal-->
      <Modal :start_betting="game_status.betting" :my_bet_info="my_bet_info" :room_id="room_id" :game="$game"/>
      <!--timer-->
      <div class="timer" v-show="game_status.betting" ref="timer" :style="timerStyle">{{timer}}</div>
      
      
    </div>
    <!-- bet_info_total -->
      <CreditInfo :bet="my_bet_info" :saved="saved_my_bet">
        <board :roomId="parseInt(room_id)" :room_detail="room_detail" ref="board"></board>
      </CreditInfo>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import Modal from '@/components/Modal.vue'
import CreditInfo from '@/components/CreditInfo.vue'
export default {
  components: {Modal,CreditInfo},
  props: ['room_id','loaded'],
  data(){
    return {
      game_status: {
        betting: false,
        bet_start: false,
        table:0,
        round:0,
        winner: '',
        pair: '',
      },
      saved_my_bet:[],
      room_detail: null,
      timer: '',
    }
  },
  methods: {
    ...mapMutations([
      'SET_WINDOW_RESOLUTION',
      'SET_ROOM_ID',
    ]),
    proc_room_detail(data, oldData){
      console.log(data)
      this.game_status.round = data.round
      switch(data.state){
        case "betting":
          let extra = data.stateTick % 1000
          this.timer = (data.stateTick - extra) / 1000
          setInterval(()=>{
            this.game_status.betting = true;
          },extra)          
        break;
      }
    },
    enterRoom(number){      
      this.$socket.sendOBJ({
        type: "req_enter_room",
        room_id : number || this.room_id
      })
    },
    onResize(e){
      const _width = this.$refs.room_root.clientWidth;
      const _height = _width * 0.36
      this.SET_WINDOW_RESOLUTION([_width,_height])
      this.$game.onResize(e)
    },
  },
  computed: {
    ...mapState([
      'game_loaded', 'resolution'
    ]),
    timerStyle(){
      let scaleFactor = this.resolution.width / 1320
      return {
        transform: `translate(-50%, -50%) scale(${scaleFactor})`
      }
    },
    my_bet_info(){
      let sum = 0;
      let array = [];
      if(this.eosAccount){
        for(let bet of this.bet_info){
          if(bet.acc_name == this.eosAccount.name){
            sum = +sum + +bet.value
            sum = parseFloat(sum).toFixed(4);
            array.push(bet)
          }
        }
      }
      return { array, sum }
    },
    scaleFactor(){
      return this.resolution.width / 1320
    },
    tableNumStyle(){
      return {        
        transform:`translate(-50%,-50%) scale(${this.scaleFactor})`
      }
    },
    roundNumStyle(){
      return {        
        transform:`translate(-50%, -50%) scale(${this.scaleFactor})`
      }
    },
  },
  mounted(){
    if (this.$route.meta.req_enter) this.enterRoom();
    this.eBus.$on('socket', data => {      
      switch(data.type){
        case "welcome":
          console.log('방에입장')
          this.enterRoom();
        break;
        case "room_detail":        
          this.room_detail = data
        break;
      }
    })
  
    this.$refs.cont_3d.appendChild( this.$game.renderer.domElement )
    window.addEventListener('resize', this.onResize );
    window.dispatchEvent(new Event('resize'))
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.onResize );
    this.eBus.$off('socket');
  },
  beforeRouteEnter( to, from, next){
    //deep link
    if( from.name == 'lobby' ){
      to.meta.req_enter = true
    }
    next();
  },
  beforeRouteUpdate (to, from, next) {
    //router link
    const number = to.params.room_id
    this.$refs.board.setInit();
    this.enterRoom(number);
    
    //console.log(to, from)
    next()
  },
  watch: {
    game_loaded(){},    
    room_id : {
      handler(newVal){
        if(newVal === null) return;
        this.SET_ROOM_ID(newVal)
      },
      immediate: true
    },
    room_detail(data, oldData){
      this.proc_room_detail(data, oldData)
    }
  }
}

</script>

<style lang="scss">
  #cont_3d{
    .table-number{
      color: #fff;     
      font-size: 24px;
      position: absolute;
      top: 5%;
      left:25%;
    }
    .round-number{
      color: #fff;     
      font-size: 24px;
      position: absolute;
      top: 5%;
      left: 75%;
    }
    .timer{
      color:#fff;
      display:flex;
      justify-content:center;
      align-items: center;
      font-size: 36px;
      position:absolute;
      left:50%;
      top:37%;      
      width:76px;
      height:76px;
      border:3px solid #fff;
      box-sizing:border-box;
      border-radius:50%;
    }
  }
</style>
