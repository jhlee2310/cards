<template>
  <fragment>
    <div v-if="winner=='P'" class="player-win" :style="player_win">
      <div>PLAYER</div>
      <div>WIN</div>
    </div>    
    <div v-if="winner=='B'" class="player-win" :style="banker_win">
      <div>BANKER</div>
      <div>WIN</div>
    </div>
    <div v-if="winner=='T'" class="player-win" :style="tie_win">
      <div>TIE</div>
    </div>   
  </fragment>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapMutations } from 'vuex'

  export default {
    props: ['winner'],
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
      this.SET_MODAL1_MSG('ffff')
    }
  }
</script>

<style lang="scss">
  .game-modal{
   
  }
</style>