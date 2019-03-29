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
      <Modal :timer="timer" :start_betting="game_status.betting" :my_bet_info="my_bet_info" :room_id="room_id" :game="$game"/>
      <!--timer-->
      <div :class="timer < 4?'timer active':'timer'" v-show="game_status.betting" ref="timer" :style="timerStyle">{{timer}}</div>

      <!--NameTags-->
      <NameTags :coin_groups="coin_group_labels" :resolution="resolution"/>

      <!--CoinsForBet-->
      <CoinsForBet ref="coins_for_bet" :betting="game_status.betting" :selected="selectedCoin"/>

      <!--스코어-->
      <transition name="fade">
        <div v-show="score.show" :style="score_player_style" class="score player" ref="score_player">{{score.player}}</div>
      </transition>
      <transition name="fade">
        <div v-show="score.show" :style="score_banker_style" class="score banker" ref="score_banker">{{score.banker}}</div>
      </transition>

      <!-- bet_info -->
      <div class="bet_info">
        <div class="bet_info_wrap" :style="bet_info_style">
          <div v-for="(data, index) in bet_info" class="bet_info_item" :key="index">
            <span :class="classBtoA(data.slot)"><div class="is-pair"></div></span>
            <span>{{data.acc_name}}</span>
            <span>{{parseFloat(data.value).toFixed(2)}}</span>
            <span>{{data.symbol}}</span>
          </div>
        </div>
      </div>      
      
    </div>
    <!-- bottom_ui -->
      <CreditInfo :bet="my_bet_info" :saved="saved_my_bet">
        <board :roomId="parseInt(room_id)" :room_detail="room_detail" ref="board"></board>
      </CreditInfo>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import Modal from '@/components/Modal.vue'
import CreditInfo from '@/components/CreditInfo.vue'
import CoinsForBet from '@/components/CoinsForBet.vue'
import NameTags from '@/components/NameTags.vue'
export default {
  components: { Modal, CreditInfo, CoinsForBet, NameTags},
  props: ['room_id','loaded'],
  data(){
    return {
      bet_info_style:{
        transform: 'translate(0px, 0px)'
      },
      selectedCoin:{
        index: null,
        value: null,
      },
      score: {
        player: 0,
        banker: 0,
        show: false,
      },
      game_status: {
        betting: null,
        bet_start: null,
        table:0,
        round:0,
        winner: '',
        pair: '',
      },
      saved_my_bet: [],
      room_detail: null,
			timer: '',
      room_bead: '',
      bet_info: [],
      coin_group_labels: [],
    }
  },
  methods: {
    ...mapMutations([
      'SET_WINDOW_RESOLUTION',
      'SET_ROOM_ID',
    ]),
    classBtoA(index){
      switch(index){
        case 0:
        return "beadRoad-t";
        break;
        case 1:
        return "beadRoad-p";
        break;
        case 2:
        return "beadRoad-b";
        break;
        case 3:
        return "beadRoad-p pair";
        break;
        case 4:
        return "beadRoad-b pair";
        break;
      }
    },
    restore_bettings(bettings){
      let array = []

      if(typeof bettings != 'undefined'){
        let keys = Object.keys(data.bettings)
        
        keys.forEach(( acc_name, index) => {
          let row = data.bettings[acc_name];
          let slots = Object.keys(row);
          slots.forEach( slot => {
            let symbol = Object.keys(row[slot])[0]
            let obj = {
              type: "room_betting",
              acc_name: acc_name,
              symbol: symbol,
              value: row[slot][symbol],
              slot: slot
            }
            array.push(obj)
          })            
        })
      }

      array = [
       {slot:0,acc_name:"oranke",value:500, symbol: "EOS"},
       {slot:1,acc_name:"oranke22",value:46.7, symbol: "EOS"},
       {slot:2,acc_name:"oke244",value:220, symbol: "EOS"},
       {slot:1,acc_name:"oke555",value:7, symbol: "EOS"},
       {slot:2,acc_name:"oranke2",value:49, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:0.4, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:10, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:112.8, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.4, symbol: "EOS"},
      ];      

      (async function(){        
        for(let mes of array){
          this.$game.bet_others(mes);
          await new Promise(res=>setTimeout( res, 30 ) )
        }
      }.bind(this))()
      
      
      //this.bet_info = array;
    },
    init_before_detail(){
      clearTimeout(this.handleTimeout1)
      clearTimeout(this.handleTimeout2)
      this.score = {
        player: 0,
        banker: 0,
        show: false,
      };
      this.game_status.betting = null;      
      this.timer = '';
      this.$game.init_before_detail();
      this.$game.clear_bet_coins();
      this.bet_info = [];
      this.coin_group_labels = [];
    },
    proc_room_detail(data, oldData){      
      //console.log(data)
      window.dispatchEvent(new Event('resize'))
      this.init_before_detail()      
      this.game_status.round = data.round
      switch(data.state){
        case "betting":

          let time = this.welcome.betting - data.stateTick;
          let extra = time % 1000
          this.timer = ((time - extra) / 1000) + 1
          

          this.handleTimeout1 = setTimeout(()=>{
            this.game_status.betting = true;
            const d = () => {
              if(this.timer == 0) return;              
              this.timer --;
              this.handleTimeout2 = setTimeout( d, 1000 )
            }
            d();            
          },extra)          

          this.restore_bettings(data.betting);
        break;
        case "betting::chain":
        break;
        case "dealing": case "dealing::chain":
          this.score = {
            player: data.deal.player.score,
            banker: data.deal.banker.score,
            show: true
          }
          this.$game.restoreDeal(data.deal);
          // 배팅관련
          //"bettings": { "eosblackkiko": { "0": { "EOS": "0.1000" }, "1": { "EOS": "0.2000" }, "2": { "EOS": "0.2000" } } } }
          // type: "room_betting", acc_name: "eosblackkiko", slot: 1, symbol: "EOS", value: "1.00"
          //this.bet_info = {acc_name: "eosblackkiko", slot: 1, symbol: "EOS", value: "1.00"}
          this.restore_bettings(data.betting);
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
    roundInit(){
      this.game_status.round = 1
      this.$refs.board.setInit()
    },
  },
  computed: {
    ...mapState([
      'game_loaded', 'resolution', 'welcome'
    ]),
    timerStyle(){
      let scaleFactor = this.resolution.width / 1320
      return {
        transform: `translate(-50%, -50%) scale(${scaleFactor})`
      }
    },
    score_player_style(){
      let scaleFactor = this.resolution.width / 1320
      return{
        transform: `translate(-50%, -50%) scale(${scaleFactor}`
      }
    },
    score_banker_style(){
      return this.score_player_style
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
  async mounted(){
    this.$game.vue_room = this;
    this.eBus.$on('socket', data => {
			console.log("data",data)
      switch(data.type){
        case "welcome":          
          break;
        case "room_detail":        
          this.room_detail = data
					break;
				case 'room_bead':
          if(this.room_id==data.room_id){
            this.room_bead = data
          }
          break;
        case 'room_state':
          /**
           * http://192.168.0.7:8081/issues/1126 참조
           * prepare_game	게임 준비중. 카드슈를 준비하는 상태
              prepare_game::chain	게임 정보를 체인에 동기화. 클라입장에서는 prepare_game와 같다.
              prepare_round	라운드를 준비하는 상태
              prepare_round::chain	라운드 정보를 체인에 동기화. 클라입장에서는 prepare_round와 같다.
              betting	배팅 가능 상태
              betting::chain	배팅정보를 체인에 동기화.
              dealing	카드 오픈
              dealing::chain	카드 오픈 및 돈분배를 체인에 동기화
          */
          switch(data.state){
						case 'betting':
              this.$set(this.game_status,'round', data.round)
              break;
            case 'prepare_round':
              if(data.round != 0)
                this.$refs.board.nextRound(this.room_bead)
              break;
            case 'prepare_game':
              this.roundInit()
              break;
          }
         break;
      }
    })

    this.$refs.cont_3d.appendChild( this.$game.renderer.domElement )
    this.enterRoom();

    window.addEventListener('resize', this.onResize );    
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
    .bet_info{
      font-size:13px;
      position:absolute;
      left:0;
      top:0%;
      width:200px;
      height:500px;  
      color:yellow;
      overflow:hidden;  
      -webkit-mask-image: -webkit-gradient(linear, left 20%, left 0, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))
    }

    .bet_info_wrap{  
      width:100%;
      position:absolute;
      top:0px;//500px;
      white-space: nowrap;
    }
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
			&.active {
				animation: ani 1s infinite;
				color: red;
				border-color: red;
			}
    }
    .score{
      position:absolute;
      top:37.5%;
      font-weight:500;
      font-size:30px;
      width: 30px;
      height:30px;
      color:white;
      &.player{
        left:39.5%;
      }
      &.banker{
        left:60.5%;
      }
    }
  }
	@keyframes ani {
		from {
			font-size: 36px;
			width:76px;
      height:76px;
		}
		to {
			font-size: 80px;
			width:100px;
      height:100px;
		}
	}

</style>
