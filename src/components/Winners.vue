<template>
  <fragment>
    <div v-if="false && winner=='P'" class="player-win" :style="player_win">
      <div>PLAYER</div>
      <div>WIN</div>
    </div>    
    <div v-if="false &&winner=='B'" class="player-win" :style="banker_win">
      <div>BANKER</div>
      <div>WIN</div>
    </div>
    <div v-if="false &&winner=='T'" class="player-win" :style="tie_win">
      <div>TIE</div>
    </div>   
  </fragment>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapMutations } from 'vuex'
  import TWEEN from '@tweenjs/tween.js'
  

  export default {
    props: ['winner','game', 'TWEEN'],
    data() {
      return {
        common_style:{

        }
      }
    },
    computed: {
      ...mapState(['resolution','modal1_msg']),
      player_win(){
        let width = 160;
        let height = 72;
        let scaleFactor = this.resolution.width/1320;
        let transformX = this.resolution.width * 0.36
        let transformY = this.resolution.height * 0.24
        return {
          width:`${width}px`,
          height:`${height}px`,          
          transform: `translate(-50%,-50%) scale(${scaleFactor})`,
          position:'absolute',
          left:`${transformX}px`,          
          top: `${transformY}px`,
          color:'orange',
          fontWeight: '900',
          fontSize: '25px',          
          borderRadius: '8px',          
          boxSizing: 'border-box',
          padding:'px',
        }
      },
      banker_win(){
        let width = 160;
        let height = 72;
        let scaleFactor = this.resolution.width/1320;
        let transformX = this.resolution.width * 0.64
        let transformY = this.resolution.height * 0.24
        return {
          width:`${width}px`,
          height:`${height}px`,          
          left:`${transformX}px`,          
          top: `${transformY}px`,
          transform: `translate(-50%,-50%) scale(${scaleFactor})`,
          position:'absolute',          
          color:'orange',
          fontWeight: '900',
          fontSize: '25px',          
          borderRadius: '8px',          
          boxSizing: 'border-box',
          padding:'px',
        }
      },
      tie_win(){
        let width = 160;
        let height = 72;
        let scaleFactor = this.resolution.width/1320;
        let transformX = this.resolution.width * 0.5// - width*scaleFactor/2;
        let transformY = this.resolution.height * 0.24// - height*scaleFactor/2;
        return {
          width:`${width}px`,
          height:`${height}px`,
          left:`${transformX}px`,          
          top: `${transformY}px`,          
          transform: `translate(-50%,-50%) scale(${scaleFactor})`,
          position:'absolute',          
          color:'orange',
          fontWeight: '900',
          fontSize: '25px',          
          borderRadius: '8px',          
          boxSizing: 'border-box',
          padding:'px',
        }
      }
    },
    methods: {
      ...mapMutations(['SET_MODAL1_MSG']),
    },
    mounted(){
      
    },
    watch:{
      winner(newVal, oldVal){        
        const {player, banker, tie} = this.game.winners
          let target;
          let old_target;
        if(newVal){
          

          console.log(newVal, oldVal)
        
          switch(newVal){
            case 'P':
              target = player;
            break;
            case "B":
              target = banker;
            break;
            case "T":
              target = tie;
            break;           
          }
          target.visible = true;
          new TWEEN.Tween({
            z: -10,
            rotZ : -2* Math.PI
          })
          .to({
            z: 0,
            rotZ : 0,
          }, 500)
          .easing(TWEEN.Easing.Bounce.Out)
          .onUpdate(a => {
            target.position.z = a.z
            target.rotation.z = a.rotZ
            //card.rotation.set(a.rotX, a.rotY, a.rotZ)
          })
          .start()
          
        }else{
            switch(oldVal){
              case 'P':
                old_target = player;
              break;
              case "B":
                old_target = banker;
              break;
              case "T":
                old_target = tie;
              break;
            }
            old_target.visible = false;
          }
      }
    }
  }
</script>

<style lang="scss">
  .game-modal{
   
  }
</style>