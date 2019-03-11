<template>
  <div class="about">
    <div>
      <span v-if="!eosAccount" @click="proc_getIdentity">login</span>
      <span v-else="!!eosAccount" @click="proc_forgetIdentity">logOut(<span>{{eosAccount.name}}</span>)</span>
    </div>    
    <!--hidden canvas-->
    <div v-show="false" id="hidden_canvas" style="text-align:left;background-color:black;">
      <div ref="hiddenDiv" style="width:512px;height:512px;">   
        <div v-for="item, index in hiddenData" :style="hiddenStyle.div(index == 2 ? 1 : 0)" :key="`hidden_${index}`">
          <span style="margin-right:16px">{{item[0]}}</span>
          <span style="margin-right:16px">{{item[1]}}</span>
          <span :style="hiddenStyle.percent">{{item[2]}}<span style="font-size:0.8em">%</span></span>
        </div>
      </div>
      
      <canvas width="512" height="512" ref="hiddenCanvas"/>
    </div>
    <span>{{round}}</span>
    <div id="cont_3d">
      <!--배팅코인-->
      <CoinsForBet ref="coins_for_bet" :style="CoinsForBet_style" default_size="600,140" pos_y="-18"/>
      
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
          <div v-for="data,index in bet_info_total">
            <span>{{index}}</span><span>{{data.acc_name}}</span><span>{{data.totalValue}} EOS</span>
          </div>        
      </div>
      
    </div>
		<board ref="board"></board>
    
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
import Eos from 'eosjs';
ScatterJS.plugins( new ScatterEOS() );


export default {
  components:{
    Board,
    CoinsForBet
  },
  data(){
    const that = this;
    return {
      bet_info_style:{
        transform: 'translate(0px, 0px)'
      },
      tosvr:{
        set_scatter_identity (scatter_identity = undefined ) {
          //if (!ws || !game_connected) return;
          const scatter = this.scatter

          if (scatter_identity === undefined) {          
            if ( scatter && scatter.identity ) {
              const eosAccount = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
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
          display:'inline-block',
          width:'90px',
          height:'90px',
          border:'5px solid #fff',          
          borderRadius: '50%',
          textAlign: 'center',
          letterSpacing: '-3px',          
          boxSizing: 'border-box',
          fontSize: '0.8em',
          float:'right',          
        },
        div(n){
          return{
            width: (n==0) ? '' : '76%',
            fontSize: '56px',
            lineHeight: '74px',
            fontFamily: 'Arial',
            fontWeight: 500,
            color: '#fff',
            overflow: 'hidden',
            opacity: '1',
            height:'102.4px'
          }
        }
      },
      bet_info:[
        
      ],      
      selectedCoin:{
        index: null,
        value: null,
      },
      CoinsForBet_style:{
        transformOrigin:'0px 0px',
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
      },
      deal_info: {},
      game: null,
      round: 1,
      easing: [
        {text:'Linear.None', value:TWEEN.Easing.Linear.None},
        {text:'Quadratic.In', value:TWEEN.Easing.Quadratic.In},
        {text:'Quadratic.Out', value:TWEEN.Easing.Quadratic.Out},
        {text:'Quadratic.InOut',  value:TWEEN.Easing.Quadratic.InOut},
        {text:'Cubic.In',  value:TWEEN.Easing.Cubic.In},
        {text:'Cubic.Out',  value:TWEEN.Easing.Cubic.Out},
        {text:'Cubic.InOut',  value:TWEEN.Easing.Cubic.InOut},
        {text:'Quartic.In',  value:TWEEN.Easing.Quartic.In},
        {text:'Quartic.Out',  value:TWEEN.Easing.Quartic.Out},
        {text:'Quartic.InOut',  value:TWEEN.Easing.Quartic.InOut},
        {text:'Quintic.In',  value:TWEEN.Easing.Quintic.In},
        {text:'Quintic.Out',  value:TWEEN.Easing.Quintic.Out},
        {text:'Quintic.InOut',  value:TWEEN.Easing.Quintic.InOut},
        {text:'Sinusoidal.In',  value:TWEEN.Easing.Sinusoidal.In},
        {text:'Sinusoidal.Out',  value:TWEEN.Easing.Sinusoidal.Out},
        {text:'Sinusoidal.InOut',  value:TWEEN.Easing.Sinusoidal.InOut},
        {text:'Exponential.In',  value:TWEEN.Easing.Exponential.In},
        {text:'Exponential.Out',  value:TWEEN.Easing.Exponential.Out},
        {text:'Exponential.InOut',  value:TWEEN.Easing.Exponential.InOut},
        {text:'Circular.In',  value:TWEEN.Easing.Circular.In},
        {text:'Circular.Out',  value:TWEEN.Easing.Circular.Out},
        {text:'Circular.InOut',  value:TWEEN.Easing.Circular.InOut},
        {text:'Elastic.In',  value:TWEEN.Easing.Elastic.In},
        {text:'Elastic.Out',  value:TWEEN.Easing.Elastic.Out},
        {text:'Elastic.InOut',  value:TWEEN.Easing.Elastic.InOut},
        {text:'Back.In',  value:TWEEN.Easing.Back.In},
        {text:'Back.Out',  value:TWEEN.Easing.Back.Out},
        {text:'Back.InOut',  value:TWEEN.Easing.Back.InOut},
        {text:'Bounce.In',  value:TWEEN.Easing.Bounce.In},
        {text:'Bounce.Out',  value:TWEEN.Easing.Bounce.Out},
        {text:'Bounce.InOut',  value:TWEEN.Easing.Bounce.InOut},
        
      ],
      typeA: TWEEN.Easing.Linear.None,
      typeB: TWEEN.Easing.Elastic.InOut,
    }
  },
  watch:{
    
    hiddenData(newData, oldData){
      const ctx = this.$refs.hiddenCanvas.getContext('2d');
      ctx.clearRect(0, 0, 512, 512);
      this.$nextTick(()=>{
        rasterizeHTML.drawHTML(this.$refs.hiddenDiv.innerHTML, this.$refs.hiddenCanvas, {
          
        })
        .then((a) => {
          this.game.textLabels.forEach((label, i) => {          
            label.material.map.needsUpdate = true;            
          })
        })
      })
    },    
  },
  created(){
    this.connectScatter();
	},
  mounted(){

    window.addEventListener('message', (e)=>{
      const msg = e.data      
      if(msg.type == "room_betting") this.bet_others(msg);
    })   

    this.$connect()

    this.game = new threejs({
      vue: this,
      el: '#cont_3d',
      TWEEN    
    })

    window.vv = this

    this.$socket.onmessage = (mes)=>{
      const message = JSON.parse(mes.data)
      console.log(message)
      switch(message.type){
        case 'welcome':          
          this.$socket.send(JSON.stringify({
             type    :"req_enter_room",
          room_id : 2
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
              this.round = message.round
              this.start_betting(10);
              break;
            case 'betting::chain':
              break;
            case 'prepare_dealing::chain':
              break;
            case 'dealing':
              break;
            case 'dealing:::chain':
            this.end_betting();
              break;
            case 'prepare_round':
              break;
          }
          break;
        case 'room_bead':
          this.$refs.board.nextRound(message)
          break;
        case 'room_detail':
          this.round = message.round
          this.$refs.board.setRound(message)
          break;
        case 'room_betting':          
          //this.bet_others(message);
          break;

        // case 'room_state':
        //   this.$refs.board.setState(message)
        //   break;
        default:
          break;
          //console.log(message)
      }
      
      this.$nextTick(()=>{
        this.$refs.hiddenCanvas.getContext('2d').clearRect(0,0,512,512)
        rasterizeHTML.drawHTML(this.$refs.hiddenDiv.innerHTML, this.$refs.hiddenCanvas, {
        
        })
        .then((a) => {
          this.game.textLabels.forEach((label, i) => {          
            label.material.map.needsUpdate = true;            
          })
        })
      })
       
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
          console.log('백그라운드 실행')
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
    hiddenData(){      
      let arrays = [[0,[],0],[0,[],0],[0,[],0],[0,[],0],[0,[],0]];
      let totalValue = 0;
      this.bet_info.forEach( (item,index)=>{
        const rSlot = (i) => {
          let s = [2,1,3,0,4]
          return s[i]
        }
        totalValue += +item.value;

        let slot = arrays[rSlot(item.slot)]
        slot[0] += +item.value
        if( slot[1].indexOf(item.acc_name) == -1) slot[1].push(item.acc_name)        
      })

      arrays.forEach(slot => {
        slot[2] = totalValue == 0 ? 0 : parseInt( +slot[0] / totalValue * 100 )
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
    async proc_insert_coin(to_account, token_contract, token_value, token_symbol) {
    // 토큰 전송은 게임서버와 연결되었을 때만 하자. 
    if (!game_connected || !scatter.identity) {
        $("#view_of_result").text('Game not connected or Scatter not logined');

        return; 
    }

    const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
    const opts = { authorization:[`${account.name}@${account.authority}`], requiredFields:{} };

    eos.contract(token_contract).then( contract => {
        contract.transfer(account.name, to_account, token_value + ' ' + token_symbol, '', opts).then(trx => {
            //console.log('trx', trx);
            $("#view_of_result").text(
                "transfer succ:\n" +
                JSON.stringify(trx, null, '\t')
            );


            console.log('succ', trx.transaction_id, trx.processed.block_num);

            // 게임서버에 돈 입금을 알린다. 
            tosvr_notify_insert_coin(trx.processed.block_num, trx.transaction_id, account.name, token_value, token_symbol)

        }).catch(err => {
            console.error(err);
            $("#view_of_result").text(
                "transfer error:\n" +
                JSON.stringify(err, null, '\t')
            );
        });

    }).catch(err => {
        console.error(err);
    })
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
    connectScatter(){
      return new Promise((resolve, reject)=>{
        const connectionOptions = {initTimeout:3000};
        ScatterJS.scatter.connect('game-eosbaccarat3', connectionOptions).then( connected => {
          if(!connected){          
            console.log('Could not connect to Scatter.');
            alert('Please download Scatter if it is not installed')
            return;
          }        
          console.log('Scatter Connected!')
          this.eos = this.scatter.eos(this.network, Eos);        

          if (this.scatter.identity) {
            this.eosAccount = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
          }else{
            this.eosAccount = null;
          }

          resolve(this.tosvr.set_scatter_identity(eosAccount.name));
        }).catch( ()=>{
          resolve(this.tosvr.set_scatter_identity(''));
        } )

      })
        
      
    },
    bet_others(message){
      this.game.bet_others(message)
    },
    end_betting(){
      if(this.game_status.betting == false) return
      this.$set(this.game_status,'betting', false);
    },
    start_betting(time){
      this.$set(this.game_status,'betting',true);

      new TWEEN.Tween({
        y: 0,
      })
      .to({
        y: -1, 
      }, 15000)
      .onUpdate(a => {
        this.bet_info_style = {
          transform: `translate(0px, ${a.y*1000}px)`
        }
      })
      .onComplete(() => {
          
      })
      .start()

      const d = ()=>{
        this.timer = time
        time--;
        if(this.timer <= 0) {
          this.$set(this.game_status,'betting', false);
          return
          }
        setTimeout(d, 1000)
      }
      d();     
    },
    process_deal(info){
      
      const b_cards = info.deal.banker.cards
      const p_cards = info.deal.player.cards
      const result = info.deal.result

      this.game.changeCardsMtl(p_cards,b_cards);
      this.game.animateCards(p_cards,b_cards,result);
    
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



.about *{
   user-select: none;
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

body{margin:0;padding:0}
.about{height:56.25vw;max-height:1080px;position:relative;
  max-width:1920px;margin:0 auto;width:100%;}

#cont_3d{
  position:relative;
  width:100%;
  height:100%;
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

