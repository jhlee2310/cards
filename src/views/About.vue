<template>
  <div class="about">
    <span>{{round}}</span>
    <div id="cont_3d">
      <div class="board">
      <transition nmae="slide-fade">
        <div v-if="show" class="rectanges" style="position:absolute;width:280px;height:125px;left:0;bottom:0;background:rgba(255,255,255,.8);border:1px solid #666">
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
      <button @click="click">click</button>
      <button @click="show = !show">
        toggle
      </button>
    </div>
    <div>{{deal_info}}</div>
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import threejs from '@/js/3dabout.js'
import process_deal from '@/js/process_deal.js'


export default {
  data(){
    return {
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
      switch(message.type){
        case 'deal_info':
          this.deal_info = message
          this.process_deal(this.deal_info)
          break;
      }
    }

    window.vv = this

    window.addEventListener('resize',this.onWindowResize,false)
    window.addEventListener('mousemove',this.onMouseMove,false)
    window.addEventListener('click',this.onMouseClick,false)
  },
  methods: {
    process_deal,
    onMouseMove(e){      
      this.game.onMouseMove(e);      
    },
    onMouseClick(e){
      this.game.onMouseClick(e);
    },
    onWindowResize(e){
      const camera = this.game.camera
      const renderer = this.game.renderer
      const cont = this.game.cont
      const width = cont.clientWidth
      const height = cont.clientHeight

      camera.aspect = cont.clientWidth / cont.clientHeight;
			camera.updateProjectionMatrix();
      renderer.setSize( cont.clientWidth, cont.clientHeight );
      
      this.game.resizeUpdate.matLine.resolution.set( width, height );
      if(widht<=750){
        his.game.resizeUpdate.matLine.linewidth=1
      }
		},
    async click(e){
      const scene = this.game.scene

      o.forEach(function(card, value){
        card.visible = false
        if(!card.userData.original_position){
          card.userData.original_position = card.position.clone()
          card.userData.original_rotation = card.rotation.clone()
        }
        card.position.copy(card.userData.original_position)
        card.rotation.copy(card.userData.original_rotation)
      });

      // o.forEach(function(i){
      //   console.log(o[i])
      // })


     const card_ord = [1,3,0,4,2,5]

      for(let ord=0;ord<card_ord.length;ord++){

        let i = card_ord[ord]

        let card = scene.getObjectByName(`card_${i}`)      
        //card.visible = false
        let speed = 450

        if(i == 2 || i == 5){
        //  card.position.y += 40
          //card.rotation.y += 40
          //speed = 1000
        }else{
        }
          card.position.y += 8
        
        //Linear.None
        await new Promise( (resolve,reject) => {
          setTimeout(() => {
            card.visible = true
            new TWEEN.Tween( { rot: 0, pos: card.position.y } )
            .to( { pos: card.userData.original_position.y},speed )
            .easing(this.typeA)
            .onUpdate(a=>{
              card.position.y = a.pos
              card.rotation.y = a.rot
            })
            .onComplete( ()=>{
              resolve();
              console.log("move comp")
            }).start()
            if(i == 2 || i == 5){
              new TWEEN.Tween( { rot: 0, y: Math.PI } )
                .to( { y: 0 }, speed+1000 )
                .easing( this.typeB )
                .onUpdate( function (a) {          
                    card.rotation.x = a.y
                } )
                .onComplete( ()=>{
                    resolve();
                    console.log("rot comp")
                  })
                .start();        
            }else{
              new TWEEN.Tween( { rot: 0, y: 0 } )
                .to( { y: Math.PI }, speed+1000 )
                .easing( this.typeB )
                .onUpdate( function (a) {          
                  card.rotation.y = a.y
                } )
                .onComplete( ()=>{
                    resolve();
                    console.log("rot comp")
                  })
                .start();        
            }
          }, 1000);
        })
      }
      this.nextRound()

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
</style>

