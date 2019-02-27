<template>
  <div class="about">
    <span>{{round}}</span>
    
    <div id="cont_3d">
      <!--배팅코인-->
      <CoinsForBet ref="coins_for_bet" :style="CoinsForBet_style" default_size="600,140" pos_y="-18"/>
      <!--배팅코인-->
      <div class="board">
      <transition nmae="slide-fade">
        <div v-if="false&&show" class="rectanges" style="position:absolute;width:280px;height:125px;left:0;bottom:0;background:rgba(255,255,255,.8);border:1px solid #666">
          <div class="col" v-for="(count, i) in winners" :style="{
              position:'absolute',
              height:'100%',
              width:'20px',
              top: count.top+'px',
              left: count.left+'px',
            }"
            :key="count.round">
              <div v-if="count.player=='P'" class="is-p-player"/>
              <div v-else class="is-b-player"/>
              <!-- <img src="@/assets/logo.png"> -->
            </div>
          <svg height="121" width="280">
            <line v-for="i in 20" x1="0" :y1="i*delta" x2="280" :y2="i*delta" :style="{
              'stroke':'rgb(0,0,0)',
              'stroke-width':i%2==0?'2':'1'
            }" :key="`row${i}`"/>
            <line v-for="i in 20" :x1="i*delta" y1="0" :x2="i*delta" y2="121" :style="{
              'stroke':'rgb(0,0,0)',
              'stroke-width':i%2==0?'2':'1'
              }" :key="`col${i}`"/>
          </svg>
          </div>
      </transition>
      </div>
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
    <div class="control">
      <select v-model="typeA">
        <option v-for="type in easing" v-bind:value="type.value" :key="type.text">
          {{ type.text }}
        </option>
      </select>
      <select v-model="typeB">
        <option v-for="type in easing" v-bind:value="type.value" :key="type.text">
          {{ type.text }}
        </option>
      </select>      
      <button @click="show = !show">
        toggle
      </button>
    </div>    
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import threejs from '@/js/3dabout.js'
import CoinsForBet from '@/components/CoinsForBet.vue'

export default {
  components:{
    CoinsForBet
  },
  data(){
    return {
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
      delta:20,
      show: true,
      round: 1,
      winners: [],
      lastWinner: '',
      left: 0,
      top: 0,
      winning: 1,
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
  created(){
    
  },
  mounted(){
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
          switch(message.state){
            case 'betting':
            this.start_betting(3);
            break;
          }
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
    randomItem(a) {
      return a[Math.floor(Math.random() * a.length)];
    },
    nextRound() {
      let winner = this.randomItem(['P','B'])
      let cnt = this.round -1

      // let winnerArray = ['P','P','P','P','P','P','P','P','B']
      // let winner =winnerArray[cnt]


      if(this.lastWinner==''){
        this.lastWinner = winner
      }else if(this.lastWinner == winner){
        this.winning++
        if(this.winning<=6)
          this.top = this.top+20
        else
          this.left = this.left+20
      }else{
        let cnt = 0
        if(this.winning>6){
          cnt = (this.winning - 6)*20
        }
        if(cnt != 0){
          this.left = this.left-cnt+20
        }else{
          this.left = this.left+20
          
        }
        this.winning = 1
        this.top = 0
      }
        this.winners.push(
          {
            round: this.round,
            top: this.top,
            left: this.left,
            player: winner,
          }
        )

      this.lastWinner = winner
      this.round++
    }
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

/* 애니메이션 진입 및 진출은 다른 지속 시간 및  */
/* 타이밍 기능을 사용할 수 있습니다. */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.score{
  position:absolute;
  font-size:20px;
  color:#FFF;
  transform-origin: 0% 0%;
  text-align:center;
}

.is-b-player {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 1px;
  border: 1px solid #283283;
}
.is-p-player {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin: 1px;
  border: 1px solid #8f0e0e;
}

.winner{
  position:absolute;
  font-size:53px;
  color: #fff;
  text-shadow: #000;
  text-shadow: 2px 2px 12px aquamarine;
}
</style>

