<template>
  <div class="about">
    <div>
      <span v-if="!eosAccount" @click="proc_getIdentity">login</span>
      <span v-else="!!eosAccount" @click="proc_forgetIdentity">logOut(<span>{{eosAccount.name}}</span>)</span>
    </div>
    <!--hidden canvas-->
    <div v-show="false" id="hidden_canvas" style="text-align:left;background-color:black;">
      <div ref="hiddenDiv" style="width:256px;height:256px;">   
        <div v-for="item, index in hiddenData" :style="hiddenStyle.div(index == 2 ? 1 : 0)" :key="`hidden_${index}`">
          <div style="font-size:26px;position:relative">
            <span style="margin-right:16px">{{item[0]}}</span>
            <span style="position:absolute;left:60px;top:-6px"><img src="@/images/human.png" style="width:30px;height:30px;position:relative;top:3px">{{item[1]}}</span>
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
          <div v-for="data in bet_info">
            {{data.symbol}}{{parseFloat(data.value).toFixed(2)}}{{data.acc_name}}
          </div>
        </div>
      </div>

      <!-- bet_info_total -->
      <div class="bet_info_total">        
          <div v-for="data, index in bet_info_total" :key="`bet_total${index}`">            
            <span>{{index}}</span><span>{{data.acc_name}}</span><span>{{data.totalValue}} EOS</span>
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
      <Modal/>

      <!--modal-->
      <Winners :winner="game_status.winner"/>
    </div>    
    <!-- bet_info_total -->
    <CreditInfo :credit="game_token_info" :bet="my_bet_info">
      <CoinsForBet ref="coins_for_bet" default_size="600,140" pos_y="-18" :betting="game_status.betting"/>
      <board ref="board" :roomId="game_status.table"></board>
    </CreditInfo>
  </div>

  
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import threejs from '@/js/3dabout.js'
import rasterizeHTML from 'rasterizehtml'
import CoinsForBet from '@/components/CoinsForBet.vue'
import Board from '@/components/Board.vue'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import CreditInfo from '@/components/CreditInfo.vue'
import Eos from 'eosjs';
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import Modal from '@/components/Modal.vue'
import Winners from '@/components/Winners.vue'

ScatterJS.plugins( new ScatterEOS() );

export default {
  components:{
    Board,
    CoinsForBet,
    CreditInfo,
    Modal,
    Winners
  },
  data(){
    const that = this;
    return {
      nowAnimate: null,
      worker: null,
      game_token_info: '',
      game_connected: false,
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
        notify_insert_coin(block_num, trx_id, token_sender, token_value, token_symbol) {
          if (!this.$socket || !this. game_connected) return; 
          console.log(token_sender); 
          var req_json = {
              type        : "req_notify_insert_coin",
              block_num   : block_num,
              trx_id      : trx_id, 
              from        : token_sender,
              value       : token_value,
              symbol      : token_symbol
          };
          this.$socket.send(JSON.stringify(req_json)); 
        }
      },
      eosAccount: null,
      scatter: ScatterJS.scatter,
      eos: null,
      BACCARAT_ACCOUNT: 'baccaratdev1',
      network: ScatterJS.Network.fromJson({
        name: 'Kylin',
        blockchain:'eos',
        chainId:'5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        host:'api-kylin.eoslaomao.com',
        port:443,
        protocol:'https'
      }),
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
      },
      game_status_betting: false,
      deal_info: {},
      game: null,
      round: 1,
      room_bead: '',
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
    
    let cont3d = document.getElementById('cont_3d')
    this.SET_WINDOW_RESOLUTION([cont3d.clientWidth,cont3d.clientHeight])
    this.connectScatter();
    this.$connect()

    this.worker.onmessage = this.procssWorker

    this.worker.postMessage({
        type:'init',
        
      })

    this.game = new threejs({
      vue: this,
      el: '#cont_3d',
      TWEEN 
    })
    window.vv = this
    this.$socket.onmessage = (mes)=>{      
    const message = JSON.parse(mes.data)
    this.worker.postMessage(message)

      switch(message.type){
        case 'welcome':
          this.game_connected = true;
          console.log('game_connected');

          this.$socket.send(JSON.stringify({
             type    :"req_enter_room",
            room_id : 5
          }))
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
              this.init_betting_info(5000); // delay1
              console.log('배팅정보를 초기화합니다.');
              break;
            case 'dealing:::chain':
            
              break;
            case 'prepare_round':
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
          this.game_token_info = message.value;
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
    my_bet_info(){
      let sum = 0;
      for(let bet of this.bet_info){
        if(bet.acc_name == this.eosAccount.name){
          sum = +sum + +bet.value
          sum = parseFloat(sum).toFixed(4);
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
      const obj = [];
      this.bet_info.forEach( (t,i)=>{
        let _obj = obj.filter( item => item.acc_name == t.acc_name)[0];
        if(!_obj){
          _obj = {
            acc_name: t.acc_name,
            data : [],
            totalValue: 0,         
          }
          obj.push(_obj);
        }        
        _obj.data.push(t)

        _obj.totalValue =  (function(){
          let total = 0;
          for(let i = 0; i< this.data.length; i++){
            total += +this.data[i].value;            
          }
          return parseFloat(total).toFixed(1);
        }).bind(_obj)()        
      })
      
      return obj;
    }
  },
  methods: {
    pause(time){
      return new Promise(resolve=>{
        setTimeout(resolve,time)
      })
    },

    
    procssWorker(message){
      let data = message.data;
      console.log(data);
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
            'betting::chain'
            break;
          }          
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
        break;

        case "worker::expose_winner":
          this.$set(this.game_status,'winner', this.room_bead.bead.split(',')[0]);
        break;
      }
    },
    ...mapMutations([
      'SET_WINDOW_RESOLUTION' // [width,height]
    ]),
    async init_betting_info(delay1){
      await new Promise(resolve => {
        setTimeout(resolve, delay1)        
      })

      this.bet_info = [];      
    },
    async proc_insert_coin(to_account, token_contract, token_value, token_symbol) {
      // 토큰 전송은 게임서버와 연결되었을 때만 하자. 
      if (!this.game_connected || !this.scatter.identity) {
          return; 
      }

      const account = this.scatter.identity.accounts.find(x => x.blockchain === 'eos');
      const opts = { authorization:[`${account.name}@${account.authority}`], requiredFields:{} };
      console.log(to_account, token_contract, token_value);
      return;
      this.eos.contract(token_contract)
      .then( contract => {
        contract.transfer(account.name, to_account, token_value + ' ' + token_symbol, '', opts)        
        .then( trx => {
            console.log("transfer succ:\n" + JSON.stringify(trx, null, '\t'));
            console.log('succ', trx.transaction_id, trx.processed.block_num);
            // 게임서버에 돈 입금을 알린다.
            tosvr_notify_insert_coin(trx.processed.block_num, trx.transaction_id, account.name, token_value, token_symbol)
        }).catch(err => {console.error(err) });
      }).catch(err => { console.error(err) })
    },
    async proc_forgetIdentity() {
      if (!this.scatter.identity) return; 

      await this.scatter.forgetIdentity();
      this.eosAccount = null;
      
      this.tosvr.set_scatter_identity('');
    },

    async proc_getIdentity(){     
      await this.connectScatter()
      if(!this.scatter.suggestNetwork) { console.log(!!this.scatter.suggestNetwork); return;}
      await this.scatter.suggestNetwork(this.network).then( () => {
        console.log("sugggestNetwork: Succ2!");
      }).catch(function (error) {
        console.log("sugggestNetwork: 에러");
        console.log(error)    
        return; 
      });
      await this.scatter.getIdentity({accounts:[this.network]})
      .then(identity => {
        console.log("getIdentity: 성공");
        let eosAccount = this.eosAccount = identity.accounts.find(account => account.blockchain === 'eos');
        console.log(this.eosAccount);               

        // 게임서버에 identity 알림. 
        this.tosvr.set_scatter_identity(eosAccount.name);

      })
      .catch(function (error) {
        console.log("에러");
        console.log(error); 
      });
  
      //console.log(this.scatter.identity);
    },
    async connectScatter(){
      const connectionOptions = {initTimeout:5000};
      const connected = await ScatterJS.scatter.connect('game-eosbaccarat3', connectionOptions)
                
      if(!connected){          
        console.log('Could not connect to Scatter.');
        //alert('Please download Scatter if it is not installed')
        return;
      }

      console.log('Scatter Connected!')
      this.eos = this.scatter.eos(this.network, Eos);          
      if (this.scatter.identity) {            
        this.eosAccount = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
        this.tosvr.set_scatter_identity(this.eosAccount.name);
      }else{            
        this.eosAccount = null;
        this.tosvr.set_scatter_identity('');
      }      
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
      if( e.target.tagName != 'CANVAS') return;
      this.game.onMouseClick(e);
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

<style lang="scss" scoped>
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
  font-size:14px;
  position:absolute;
  left:0;
  top:0%;
  width:180px;
  height:500px;  
  color:yellow;
  overflow:hidden;  
  -webkit-mask-image: -webkit-gradient(linear, left 20%, left 0, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))
}

.bet_info_wrap{
  font-size:14px;
  width:100%;
  position:absolute;
  top:500px;
}

.bet_info_total{
  color:yellow;
  position:absolute;
  right:0;
  &>div>span{
    display:inline-block;
    margin-right:10px;
    &:nth-child(1){

    }
  }
}

</style>

