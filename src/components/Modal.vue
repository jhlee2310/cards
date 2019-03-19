<template>
  <fragment>
    <div v-if="modal1_on" class="game-modal" :style="normal_modal">Start Betting</div>
    <div v-if="modal2_on" class="game-modal" :style="normal_modal">Time</div>
    <div v-if="modal3_on" class="game-modal" :style="normal_modal">Stop Betting</div>    
  </fragment>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapMutations } from 'vuex'

  export default {
    props: ['start_betting','status','message'],
    data() {
      return {
        modal1_on: false,
        modal2_on: false,
        modal3_on: false,
      }
    },
    computed: {
      ...mapState(['resolution','modal1_msg']),
      normal_modal(){
        let scaleFactor = this.resolution.width/1320
        console.log(scaleFactor)
        return {
          fontWeight:700,
          fontSize:'20px',
          position:'absolute',
          top:'22%',
          justifyContent: 'center',
          alignItems: 'center',
          left:'50%',
          display:'flex',
          width:`200px`,
          height:'50px',
          backgroundColor:'black',
          color:'white',
          transform: `translate(-50%,-50%) scale(${scaleFactor})`,

        }
      },
    },
    methods: {
      ...mapMutations(['SET_MODAL1_MSG']),
    },
    mounted(){
      //this.SET_MODAL1_MSG('ffff')
    },
    watch: {
      start_betting(newVal, oldVal){
        console.log(newVal);
        if(newVal == true){
          this.modal1_on = true;
          setTimeout(()=>{
            this.modal1_on = false;
            this.modal2_on = true;
          },2500)
        }else if(newVal == false){
          this.modal2_on = false;
          this.modal3_on = true;
          setTimeout(()=>{
            this.modal3_on = false;
          },2000)
        }
      }
    }
  }
</script>

<style lang="scss">
 
</style>