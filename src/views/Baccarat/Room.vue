<template>
  <div ref="room_root">
    <div>{{room_id}} {{game_loaded}} {{resolution}}</div>
    <div id="cont_3d" ref="cont_3d" :style="{
      width: resolution.width + 'px',
      height: resolution.height + 'px',
      position: 'relative',
    }">
      <!--Room Number -->
      <div class="table-number" :style="tableNumStyle">
        <span>TABLE</span><span style="margin-left:20px;">{{room_id}}</span>
      </div>
      <!--round Number -->
      <div class="round-number" :style="roundNumStyle">
        <span>ROUND</span><span style="margin-left:20px;">{{game_status.round}}</span>
      </div>
      <!--modal-->
      <Modal :start_betting="game_status.betting" :my_bet_info="my_bet_info" :room_id="room_id" :game="$game"/>
      
      
    </div>
    <!-- bet_info_total -->
      <CreditInfo :bet="my_bet_info" :saved="saved_my_bet">
        <board ref="board" :roomId="parseInt(room_id)"></board>
      </CreditInfo>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import Modal from '@/components/Modal.vue'
import CreditInfo from '@/components/CreditInfo.vue'
export default {
  components: {Modal,CreditInfo},
  props: ['room_id','loaded'],
  data(){
    return {
      game_status: {
        betting: false,
        bet_start: false,
        table:0,
        round:0,
        winner: '',
        pair: '',
      },
      saved_my_bet:[],      
    }
  },
  methods: {
    ...mapMutations([
      'SET_WINDOW_RESOLUTION'
    ]),
    onResize(e){
      const _width = this.$refs.room_root.clientWidth;
      const _height = _width * 0.36
      this.SET_WINDOW_RESOLUTION([_width,_height])
      this.$game.onResize(e)
    },
  },
  computed: {
    ...mapState([
      'game_loaded', 'resolution'
    ]),
    my_bet_info(){
      let sum = 0;
      let array = [];
      if(this.eosAccount){
        for(let bet of this.bet_info){
          if(bet.acc_name == this.eosAccount.name){
            sum = +sum + +bet.value
            sum = parseFloat(sum).toFixed(4);
            array.push(bet)
          }
        }
      }
      return { array, sum }
    },
    scaleFactor(){
      return this.resolution.width / 1320
    },
    tableNumStyle(){
      return {        
        transform:`translate(-50%,-50%) scale(${this.scaleFactor})`
      }
    },
    roundNumStyle(){
      return {        
        transform:`translate(-50%, -50%) scale(${this.scaleFactor})`
      }
    },
  },
  mounted(){    
    this.$refs.cont_3d.appendChild( this.$game.renderer.domElement )
    window.addEventListener('resize', this.onResize );
    window.dispatchEvent(new Event('resize'))    
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.onResize );
  },
  beforeRouteEnter( to, from, next){
    //deep link
    console.log('enter')
    next();
  },
  beforeRouteUpdate (to, from, next) {
    //router link
    console.log('update')
    next()
  },
  watch: {
    game_loaded(){
      
    }
  }
}

</script>

<style lang="scss">
  #cont_3d{
    .table-number{
      color: #fff;     
      font-size: 24px;
      position: absolute;
      top: 5%;
      left:25%;
    }
    .round-number{
      color: #fff;     
      font-size: 24px;
      position: absolute;
      top: 5%;
      left: 75%;
    }
  }
</style>
