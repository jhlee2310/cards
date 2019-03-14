<template>
  <fragment>
    <div class="game-modal" :style="normal_modal">{{modal1_msg}}</div>
  </fragment>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapMutations } from 'vuex'

  export default {
    props: ['status','message'],
    data() {
      return {

      }
    },
    computed: {
      ...mapState(['resolution','modal1_msg']),
      normal_modal(){
        let scaleFactor = this.resolution.width/1320
        
        return {
          width:`200px`,
          backgroundColor:'black',
          transfrom: `scale(${scaleFactor})`,

        }
      },
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
    position:absolute;
    top:0;left:0;
    color:yellow;
  }
</style>