<template>
  <div id="coins_for_bet" :style="styleObj" :class="{disabled: !betting}">    
    <div class="inner_wrap">
      <div v-for="i,j of 9" :key="`coins${j}`" class="coin_wrap" :class="{active:betting}" @click="onClickCoin" :data-index="j" :data-value="values[j]">        
        <img class="coin" :src="require(`@/images/chips/bet${files[j]}__.png`)"/>
        <span class="coin_value">{{ values[j].toString().replace(/000$/,'K') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props:['default_size','pos_y','betting','selected'],
  data() {    
    return {      
      files: [4, 5, 6, 7, 8, 9, 10, 11, 12],
      values: [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000],      
    }
  },
  methods: {
    onClickCoin(e){      
      const coin = e.target.parentElement
      const $parent = this.$parent.$parent;
      this.$set($parent.game_status,'bet_start',true)
      if( !coin.classList.contains('selected')){
        coin.parentElement.querySelectorAll('.coin_wrap').forEach( a => {          
          a.classList.remove('selected')
        })
        coin.classList.add('selected')
        this.$set($parent.selectedCoin,'index',coin.dataset.index)
        this.$set($parent.selectedCoin,'value',coin.dataset.value)
      }else{
        coin.classList.remove('selected')
        this.$set($parent.game_status,'bet_start',false)
        this.$set($parent.selectedCoin,'index',null)
        this.$set($parent.selectedCoin,'value',null)
      }
    }
  },
  mounted(){
    
  },
  computed:{
    ...mapState([
      'resolution'
    ]),
    styleObj(){
      return{
        position: 'absolute',
        left: '50%',
        top: '-45%',
        width: '600px',        
        transform: `translate(-50%,0) scale(0.9)`   
      }
    }
  },
  watch:{
    // 배팅가능상태 여부
    betting(v){
      
    }
  }
}
</script>

<style lang="scss">
  #coins_for_bet{
    z-index:2;
    &.disabled{
      filter: grayscale(100%);
    }
    position:absolute;
    transition: filter 0.5s;
    overflow-x: hidden;
    .inner_wrap{
      width:1200px;
      padding:10px;
      overflow:hidden;
    }
    .coin_wrap{
      position:relative;
      margin-top:30px;
      float:left;
      width:80px;
      height:80px;
      margin-right:20px;
      cursor: default;
      border-radius:50%;
      transition:all 0.07s;
      &.active{cursor:pointer};
      &.active:hover{
        box-shadow: 0px 0px 20px orange
      }
      &.selected{
        transform: translateY(-20px);
        box-shadow: 0px 0px 20px orange
      }
    }
    .coin{
      width:100%;
      height:100%;
    }
    .coin_value{
      position:absolute;
      top:28px;left:0;
      width:100%;
      text-align:center;
      color:yellow;
      font-size:20px;
      z-index:1;
    }
  }
</style>
