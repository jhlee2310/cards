<template>
  <div class="about">    
    <!-- <div>
      <span v-if="!eosAccount" @click="proc_getIdentity">login</span>
      <span v-else="!!eosAccount" @click="proc_forgetIdentity">logOut(<span>{{eosAccount.name}}</span>)</span>
    </div> -->
    <!--hidden canvas-->
    <div v-show="false" id="hidden_canvas" style="text-align:left;background-color:black;">
      <div ref="hiddenDiv" style="width:256px;height:256px;">   
        <div v-for="item, index in hiddenData" :style="hiddenStyle.div(index == 2 ? 1 : 0)" :key="`hidden_${index}`">
          <div style="font-size:26px;position:relative">
            <!--span style="margin-right:16px">{{item[0]}}</span-->
            <span style="position:absolute;left:0px;top:-6px"><img src="@/images/human.png" style="width:30px;height:30px;position:relative;top:3px">{{item[1]}}</span>
            <span :style="hiddenStyle.percent">{{item[2]}}%<span style="font-size:0.8em"></span></span>
          </div>
        </div>
      </div>      
      <canvas width="256" height="256" ref="hiddenCanvas"/>
    </div>
    
    <div id="cont_3d">      
      <!--스코어-->
      <transition name="fade">
        <div v-show="score.show" :style="scoreStyle" class="score player" ref="score_player">{{score.player}}</div>
      </transition>
      <transition name="fade">
        <div v-show="score.show" :style="scoreStyle" class="score banker" ref="score_banker">{{score.banker}}</div>
      </transition>            
      <!--winner-->
      <div class="winner" ref="winner">WIN</div>
      
      <!--timer-->
      <div class="timer" v-show="game_status.betting" ref="timer" data-default_size="68" :style="timerStyle">{{timer}}</div>

      <!-- bet_info -->
      <div class="bet_info">
        <div class="bet_info_wrap" :style="bet_info_style">
          <div v-for="data in bet_info" class="bet_info_item">
            <span :class="classBtoA(data.slot)"><div class="is-pair"></div></span>
            <span>{{data.acc_name}}</span>
            <span>{{parseFloat(data.value).toFixed(2)}}</span>
            <span>{{data.symbol}}</span>
          </div>
        </div>
      </div>

      <!-- bet_info_total -->
      <div class="bet_info_total">        
          <div>
            <span>PLAYER</span><span>{{bet_info_total[0]}}</span>
          </div>
          <div>
            <span>BANKER</span><span>{{bet_info_total[1]}}</span>
          </div>
          <div>
            <span>TIE</span><span>{{bet_info_total[2]}}</span>
          </div>
          <div>
            <span>P.PAIR</span><span>{{bet_info_total[3]}}</span>
          </div>
          <div>
            <span>B.PAIR</span><span>{{bet_info_total[4]}}</span>
          </div>
      </div>      

      <!--Room Number -->
      <div class="table-number" :style="tableNumStyle">
        <span>TABLE</span><span style="margin-left:20px;">{{game_status.table}}</span>
      </div>
      <!--Room Number -->
      <div class="round-number" :style="roundNumStyle">
        <span>ROUND</span><span style="margin-left:20px;">{{game_status.round}}</span>
      </div>
      <!--modal-->
      <Modal :start_betting="game_status.betting" :my_bet_info="my_bet_info" :room_id="room_id" :game="game"/>
      <!--modal-->
      <Winners :winner="game_status.winner" :game="game" :TWEEN="TWEEN" :pair="game_status.pair"/>
      <!--NameTags-->
      <NameTags :coin_groups="coin_groups" :game="game" :resolution="resolution"/>
      <!--CoinsForBet-->
      <CoinsForBet ref="coins_for_bet" default_size="600,140" pos_y="-18" :betting="game_status.betting" :selected="selectedCoin"/>
    </div>
    <!-- bet_info_total -->
    <CreditInfo :bet="my_bet_info">
      <board ref="board" :roomId="game_status.table"></board>
    </CreditInfo>
    
  </div>

  
</template>

<script>
import Vue from 'vue';
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three-full'
import threejs from '@/js/3dabout.js'
import rasterizeHTML from 'rasterizehtml'
import CoinsForBet from '@/components/CoinsForBet.vue'
import Board from '@/components/Board.vue'
import CreditInfo from '@/components/CreditInfo.vue'
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import Modal from '@/components/Modal.vue'
import Winners from '@/components/Winners.vue'
import NameTags from '@/components/NameTags.vue'

export default {
	props: [
		'room_id',
	],
  components:{
    Board,
    CoinsForBet,
    CreditInfo,
    Modal,
    Winners,
    NameTags
  },
  data(){
    //non watching
    const that = this;
    this.TWEEN = TWEEN;
    this.game = null;

    return {
      bet_info_test:[
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
       {slot:0,acc_name:"oranke",value:12.48, symbol: "EOS"},
      ],      
      nowAnimate: null,
      worker: null,
      //game_token_info: '',
      //game_connected: false,
      bet_info_style:{
        transform: 'translate(0px, 0px)'
      },
      tosvr:{
        req_betting(symbol, value, slot) {
          
          if (!that.$socket || !that.game_connected) return;
          if (!that.scatter || !that.scatter.identity) return;          
          
          const eosAccount = that.scatter.identity.accounts.find(account => account.blockchain === 'eos');
          
          var req_json = {
              type    : "req_betting",
              account : eosAccount.name,
              symbol  : symbol,
              value   : value,
              slot    : slot
          };        
          
          that.$socket.send(JSON.stringify(req_json)); 
        },
        set_scatter_identity (scatter_identity = undefined ) {
          if (!that.$socket || !that.game_connected) return;
          const scatter = that.scatter

          if (scatter_identity === undefined) {          
            if ( scatter && scatter.identity ) {
              const eosAccount = that.scatter.identity.accounts.find(account => account.blockchain === 'eos');
              scatter_identity = eosAccount.name; 
              console.log('스캐터 아이디', scatter_identity);
            }
          }
          
          if (scatter_identity === undefined) return;

          let req_json = {
            type      :"req_set_scatter_identity",
            identity  : scatter_identity
          };

          that.$socket.send(JSON.stringify(req_json));
          console.log(req_json)
        },        
      },
      BACCARAT_ACCOUNT: 'baccaratdev1',
      hiddenStyle:{
        percent:{          
          //display: 'inline-block',
          //width:'1em',
          //height:'1em',
          //border:'1px solid #fff',          
          //borderRadius: '50%',
          textAlign: 'center',
          //letterSpacing: '-3px',          
          //boxSizing: 'border-box',
          fontSize: '1em',
          float:'right',          
        },
        div(n){
          return{
            width: (n==0) ? '100%' : '76%',
            fontSize: '1em',
            //lineHeight: '1em',
            fontFamily: 'Arial',
            fontWeight: 500,
            color: '#fff',
            overflow: 'hidden',            
            height:'51.2px'
          }
        }
      },
      bet_info:[
        
      ],      
      selectedCoin:{
        index: null,
        value: null,
      }, 
      timer:'--',
      timerStyle:{},
      scoreStyle:{width:'40px',height:'40px'},
      score:{
        player: 0,
        banker: 0,
        show:false,
      },
      game_status: {
        betting: false,
        bet_start: false,
        table:0,
        round:0,
        winner: '',
        pair: '',
      },
      game_status_betting: false,
      deal_info: {},
      game: null,
      round: 1,
      room_bead: '',
      coin_groups: [],
    }
  },
  watch:{
    game_status: {
        handler(nv, ov){
          if(nv.betting !== ov.betting){
            //this.$refs.coins_for_bet
          }
        },
        deep: true
    },
    hiddenData: {
      handler(nv,ov){
        const ctx = this.$refs.hiddenCanvas.getContext('2d');      
        ctx.clearRect(0, 0, 255, 255);
        this.$nextTick(()=>{        
          rasterizeHTML.drawHTML(this.$refs.hiddenDiv.innerHTML, this.$refs.hiddenCanvas)
         .then((a) => {
            this.game.textLabels.forEach((label, i) => {          
              label.material.map.needsUpdate = true;            
            })
          })
        })
      },
      deep: true,
      //immediate: true,
    },    
  },
  created(){
    this.worker = new Worker('/worker.js');
	},
  mounted(){
    
    //setInterval(()=>{this.$chat.send(JSON.stringify({type:'chat',txt:'abcdefg'}))},1000)
    let cont3d = document.getElementById('cont_3d')
    this.SET_WINDOW_RESOLUTION([cont3d.clientWidth,cont3d.clientHeight])
    // this.connectScatter();
		this.$connect()
		// 게임서버에 identity 알림. 
		//this.tosvr.set_scatter_identity(eosAccount.name);
		
		


    this.worker.onmessage = this.procssWorker

    this.worker.postMessage({
        type:'init',
        
      })

    this.game = new threejs({
      vue: this,
      Vue,
      el: '#cont_3d',
      TWEEN , THREE
    })   

    window.vv = this
    this.bet_info = [];
    this.$socket.onmessage = (mes)=>{      
    const message = JSON.parse(mes.data)
    this.worker.postMessage(message)

      switch(message.type){
				case 'welcome':
					this.setGameConnected(true)
          //this.game_connected = true;
          console.log('game_connected');

          this.$socket.send(JSON.stringify({
             type    :"req_enter_room",
            room_id : this.room_id
					}))
										
					this.$socket.send(JSON.stringify({
						type      :"req_set_scatter_identity",
						identity  : this.eosAccount.name
					}));
          break;

        case 'deal_info':
          this.deal_info = message
          this.process_deal(message)
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
          switch(message.state){           
            case 'betting':
              this.$set(this.game_status,'round', message.round)
              break;
            case 'prepare_dealing::chain':
              break;
            case 'dealing':              
              break;
            case 'dealing:::chain':

              break;
            case 'prepare_round':
              if(message.round != 0)
                this.$refs.board.nextRound(this.room_bead)
              break;
            case 'prepare_game':
              this.roundInit()
              break;
          }
          break;
        case 'room_bead':
          if(this.game_status.table==message.room_id){
            this.room_bead = message
          }

          break;
        case 'room_detail':
          this.round = message.round
          this.$set(this.game_status,'table', message.room_id)
          this.$set(this.game_status,'round', message.round)
          this.$refs.board.setRound(message)
          break;
        case 'room_betting':          
          this.bet_others(message);
          break;
				case 'game_token_info':
					//this.game_token_info = message.value
					this.setCredit(message.value)
          break;
        // case 'room_state':
        //   this.$refs.board.setState(message)
        //   break;
        default:
          break;
          //console.log(message)
      }
      
       
    }


    window.addEventListener('resize',this.onWindowResize,false)    
    window.addEventListener('mousemove',this.onMouseMove,false)
    document.querySelector('#cont_3d').addEventListener('click',this.onMouseClick, false)
    window.addEventListener('visibilitychange',(e)=>{      
      if(document.hidden){
        let stamp = this.game.getTimeStamp()        
        let stampTime = new Date().getTime()
        console.log('stamp : ' + stamp)    
        const d = () => {          
          if(!document.hidden){console.log('백그라운드 종료'); return;}          
            let nowTime = new Date().getTime();
            let delta = nowTime - stampTime;
            console.log(delta);
            TWEEN.update(stamp + delta);
            this.game.renderer.render(this.game.scene,this.game.camera);
            setTimeout(d, 10)        
          }
        d(); 
      }
    },false)
  },
  computed:{
		...mapGetters({
      eosAccount: 'getEosAccount',
      scatter: 'getScatter',
			network: 'getNetwork',
			eos: 'getEos',
			game_connected: 'getGameConnected',
    }),
    my_bet_info(){
      let sum = 0;
      if(this.eosAccount){
        for(let bet of this.bet_info){
          if(bet.acc_name == this.eosAccount.name){
            sum = +sum + +bet.value
            sum = parseFloat(sum).toFixed(4);
          }
        }
      }
      return sum
      
    },
    ...mapState([
      'resolution'
    ]),
    scaleFactor(){
      return this.resolution.width / 1320
    },
    tableNumStyle(){
      return {
        color: '#fff',
        transformOrigin: '0 0',
        fontSize: '24px',
        position: 'absolute',
        top:0,
        left:0,
        transform:`translate(${this.resolution.width * 0.2}px, ${this.resolution.height * 0.03}px) scale(${this.scaleFactor})`
      }
    },
    roundNumStyle(){
      return {
        color: '#fff',
        transformOrigin: '0 0',
        fontSize: '24px',
        position: 'absolute',
        top:0,
        left:0,
        transform:`translate(${this.resolution.width * 0.70}px, ${this.resolution.height * 0.03}px) scale(${this.scaleFactor})`
      }
    },
   
    hiddenData(){      
      let arrays = [[0,[],0],[0,[],0],[0,[],0],[0,[],0],[0,[],0]];
      let totalValue = 0;
       const rSlot = (i) => {
          let s = [2,1,3,0,4]
          return s[i]
        }

      for(let item of this.bet_info){       
        totalValue += +item.value;
        let slot = arrays[rSlot(item.slot)]        
        slot[0] = (+slot[0] + +item.value).toFixed(1)
        

        if( slot[1].indexOf(item.acc_name) == -1) slot[1].push(item.acc_name)        
      }

      arrays.forEach(slot => {
        slot[2] = totalValue == 0 ? 0 : parseInt( slot[0] / totalValue * 100 )
        slot[1] = slot[1].length
      })
      return arrays
    },
    bet_info_total(){
      const obj = [0,0,0,0,0];
      const aTob = index => {
        let slots = [2,0,1,3,4];
        return slots[index]
      }
      this.bet_info.forEach( (t, i)=>{
        let s = aTob(t.slot);
        obj[s] = +obj[s] + parseFloat(t.value);
        obj[s] = parseFloat(obj[s]).toFixed(1);
      })
      
      return obj;
    }
  },
  methods: {    
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
    aTobSlot(i){
      let s = [2,1,3,0,4]
      return s[i]
    },
		...mapActions({
			setCredit: 'setCredit',
      setGameConnected: 'setGameConnected',
      setOpenScatterError: 'setOpenScatterError',
		}),
    pause(time){
      return new Promise(resolve=>{
        setTimeout(resolve,time)
      })
    },    
    procssWorker(message){
      let data = message.data;
      //console.log(data);
      switch(data.type){
        case "welcome":
        break;
        case "room_state":
          switch(data.state){
            case "betting": // 배팅 시작을 알림
              this.game_status.betting = true;
              new TWEEN.Tween({ y: 0 })
              .to({y: -1}, 20000)
              .onUpdate(a => {
                this.bet_info_style = {
                  transform: `translate(0px, ${a.y*1000}px)`
                }
              })
              .onComplete(() => {})
              .start()
            break;
            case "betting::chain":
            this.game_status.betting = false;
            //this.game_status.bet_start = false;
            
            //색상 복원
            this.game.restoreColor();
            this.game.clearSelectedObject();
            //커서 복원
            document.body.style.cursor = "default";

            break;
          }          
        break;

        case "worker::timer_start":
          
        break;

        case "worker::timer":
          this.timer = data.value;
        break;

        case "worker::cards_drop":
          ;(async()=>{
            if(data.index >= 2 ){

            }
            this.game.animateCards.moveCard(data.index,600,1)
            //await this.pause(800)
            //this.game.animateCards.rotateCard(data.index,200,2)
          })()          
        break;

        case "worker::cards_open_quick":
          ;(async()=>{
            this.game.animateCards.rotateCard(data.index,200,4)
          })()          
        break;

        case "worker::cards_open_long":
          ;(async()=>{
            this.game.animateCards.slideCard(data.index,200)
          })()          
        break;
        
        case "worker::cards_out":
          this.game.animateCards.reset();
          this.$set(this.game_status,'winner','')
          this.$set(this.game_status,'pair','')
          this.init_betting_info();
          console.log('배팅정보를 초기화합니다.');
        break;

        case "worker::expose_winner":
          this.$set(this.game_status,'winner', this.room_bead.bead.split(',')[0]);
          this.$set(this.game_status,'pair', this.room_bead.bead.split(',')[1]);
        break;
      }
    },
    ...mapMutations([
      'SET_WINDOW_RESOLUTION' // [width,height]
    ]),
    init_betting_info(){      
      this.bet_info = [];
      this.coin_groups = [];
    },
    
    bet_others(message){
      this.game.bet_others(message)
    },
    end_betting(){
      if(this.game_status.betting == false) return
      this.game_status.betting = false
    },
    process_deal(info){
      //카드 딜링 정보 전달
      const b_cards = info.deal.banker.cards
      const p_cards = info.deal.player.cards
      const result = info.deal.result      
      this.game.animateCards.init(p_cards,b_cards,result);
    },
    onMouseMove(e){      
      this.game.onMouseMove(e);      
    },
    onMouseClick(e){
      if( e.target.tagName != 'CANVAS' && e.target.getAttribute('class') != "name_tag") return;
      else{
        if(!this.eosAccount) {
          this.setOpenScatterError(true)
          return;
        }
        this.game.onMouseClick(e);
      }
    },
    onWindowResize(e){
      this.game.onResize(e);     
    },
    roundInit(){
      this.game_status.round = 1
      this.$refs.board.setInit()
    },

  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}



.about {
   user-select: none;
   z-index: 3;
   position: relative;
   span{
     //font-family: 'Germania One', 'Roboto';
   }

}
.timer{  
  color:#fff;
  display:flex;
  justify-content:center;
  align-items: center;
  font-size: 36px;
  position:absolute;
  left:0;
  top:0;    
  transform-origin: 0px 0px;
  width:100px;
  height:100px;
  border:3px solid #fff;
  box-sizing:border-box;
  border-radius:50%;  
}

body{margin:0;padding:0;overflow-x:hidden}
.about{position:relative;
  max-width:1920px;margin:0 auto;width:100%;}

#cont_3d{
  position:relative;
  width:100%;
  height:36vw;
  max-height:691.2px;
  
}

.col .img1{
  display:block;
  width:100%;
  height:20px;
   background-image: url('../assets/logo.png');
   background-size: 20px 20px;
}

.score{
  position:absolute;
  font-size:20px;
  color:#FFF;
  transform-origin: 0% 0%;
  text-align:center;
}
.winner{
  position:absolute;
  font-size:53px;
  color: #fff;
  text-shadow: #000;
  text-shadow: 2px 2px 12px aquamarine;
  display:none;
}

.bet_info{
  font-size:13px;
  position:absolute;
  left:0;
  top:0%;
  width:200px;
  height:500px;  
  color:yellow;
  overflow:hidden;  
  -webkit-mask-image: -webkit-gradient(linear, left 20%, left 0, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));

  @mixin bet-info{
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: inline-flex;  
  color:white;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
}
.beadRoad-b {
  @include bet-info;
  background-color: red;
  &::after{
    content:"B";
  }
  .is-pair{
    display:none;
    position:absolute;
  }
  &.pair{
    background-color:#cccccc;
    color:#cccccc;    
    .is-pair{
      display:block;
      top:0;
      left:0;
      width:6px;
      height:6px;
      background-color:red;
      border-radius:50%;
    }
  }
  

}
.beadRoad-p {
  @include bet-info;
  background-color: blue;
  &::after{
    content:"P";
  }
  &.pair{
    background-color:#cccccc;
    color:#cccccc;    
    .is-pair{
      display:block;
      bottom:0;
      right:0;
      width:6px;
      height:6px;
      background-color:blue;
      border-radius:50%;
    }
  }
  .is-pair{
    display:none;
    position:absolute;
  }
}
.beadRoad-t {
  @include bet-info;
  background-color: green; 
  &::after{
    content:"T";
  }
  .is-pair{
    display:none;
  }
  //margin: 1px;
  //font-size:10px;
}
}

.bet_info_wrap{  
  width:100%;
  position:absolute;
  top:500px;
  white-space: nowrap;
}

.bet_info_total{
  color:yellow;
  position:absolute;
  top:10px;
  right:0;
  width:200px;
  &>div>span{
    display:inline-block;
    text-align:right;
    width:40%;
    margin-right:10px;
    &:nth-child(1){
      width:50%;
    }
  }
}

.bet_info_item{
  margin-bottom:5px;
  margin-left:5px;
  text-align:left;
  &>span{
    margin-right:8px;
  }
}


</style>

