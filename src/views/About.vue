<template>
  <div class="about">
    <!--hidden canvas-->
    <div v-show="true" id="hidden_canvas" style="text-align:left;">
      <div ref="hiddenDiv" style="width:512px;height:512px;">   
        <div :style="hiddenStyle.div(0)">
          <span style="margin-right:16px">00111</span>
          <span style="margin-right:16px">04</span>
          <span :style="hiddenStyle.percent">40<span style="font-size:0.8em">%</span></span>
        </div> 
        <div :style="hiddenStyle.div(0)">
          <span style="margin-right:16px">00222</span>
          <span style="margin-right:16px">07</span>
          <span :style="hiddenStyle.percent">22<span style="font-size:0.8em">%</span></span>
        </div>
        <div :style="hiddenStyle.div(1)">
          <span style="margin-right:16px">00333</span>
          <span>04</span>
          <span :style="hiddenStyle.percent">40<span style="font-size:0.8em">%</span></span>
        </div>
        <div :style="hiddenStyle.div(0)">
          <span style="margin-right:16px">00444</span>
          <span style="margin-right:16px">04</span>
          <span :style="hiddenStyle.percent">40<span style="font-size:0.8em">%</span></span>
        </div>
        <div :style="hiddenStyle.div(0)">
          <span style="margin-right:16px">01555</span>
          <span style="margin-right:16px">02</span>
          <span :style="hiddenStyle.percent">60<span style="font-size:0.8em">%</span></span>
        </div>
      </div>
      
      <canvas antialias="true" width="512" height="512" ref="hiddenCanvas"/>
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
      <!--스코어-->
      <!--winner-->
      <div class="winner" ref="winner">WIN</div>
      <!--winner-->
      <!--timer-->
      <div class="timer" v-show="game_status.betting" ref="timer" data-default_size="68" :style="timerStyle">{{timer}}</div>
      <!--timer-->      
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

export default {
  components:{
    Board,
    CoinsForBet
  },
  data(){
    return {
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
            opacity: '0.7',
            height:'102.4px'
          }
        }
      },      
      hiddenData:[
        {},{},{},{},{}
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
      rasterizeHTML.drawHTML(this.$refs.hiddenDiv.innerHTML, this.$refs.hiddenCanvas, {
        
      })
      .then((a) => {
        this.game.textLabels.forEach((label, i) => {
          console.log(label)
          label.material.map.needsUpdate = true;
          label.material.needsUpdate = true;
        })
      })
    },
  },
  created(){
    
	},
  mounted(){    
    setInterval(()=>{
      this.hiddenData = 3
    },0)
    this.game = new threejs({
      vue: this,
      el: '#cont_3d',
      TWEEN    
    })

    this.$socket.send(JSON.stringify({
        type    :"req_enter_room",
        room_id : 1
    }))
    this.$socket.onmessage = (mes)=>{      
      const message = JSON.parse(mes.data)
      console.log(message)
      switch(message.type){
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
              this.start_betting(3);
              break;
            case 'betting::chain':
              break;
            case 'prepare_dealing::chain':
              break;
            case 'dealing':
              break;
            case 'dealing:::chain':
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
        // case 'room_state':
        //   this.$refs.board.setState(message)
        //   break;
        default:
          break;
          //console.log(message)
      }
    }
    window.vv = this
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
  methods: {
    start_betting(time){
      this.$set(this.game_status,'betting',true);

      const d = ()=>{
        this.timer = time
        time--;
        if(time <= 0) {
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
<style el="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>

<style el="scss">
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
  .about{height:70vw;max-height:896px;position:relative;
  max-width:1280px;margin:0 auto;}
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
}

</style>

