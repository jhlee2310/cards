<template>
  <div style="position:absolute;width:800px;height:130px;bottom:-50px;left:50%;color:#fff;z-index:1" :style="styleObj">
    <div id="coins_for_bet" :class="{disabled: !betting}"> 
      <div class="inner_wrap" :class="{toggle_slide: toggle_slide}">
        <div v-for="i,j of 9" :key="`betcoins_${j}`" class="coin_wrap" :class="{active:betting,selected:isSelected(j)}" @click="onClickCoin" :data-index="j" :data-value="values[j]">        
          <img class="coin" :src="require(`@/images/chips/bet${files[j]}__.png`)"/>
          <span class="coin_value">{{ values[j].toString().replace(/000$/,'K') }}</span>
        </div>
      </div>      
    </div>
    <div v-if="toggle_slide" 
    @click="toggle_slide = !toggle_slide"
    class="slide_control toggle_left" style="position:absolute;top:60px;left:70px;font-size:40px;cursor:pointer"><i class="fas fa-caret-left"></i></div>
    <div v-if="!toggle_slide"
    @click="toggle_slide = !toggle_slide"
    class="slide_control toggle_right" style="position:absolute;top:60px;right:70px;font-size:40px;cursor:pointer"><i class="fas fa-caret-right"></i></div>
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
      toggle_slide: false,
    }
  },
  methods: {
    onClickCoin(e){
      if(!this.betting) return;
      const coin = e.target.parentElement
      const $parent = this.$parent;      
      if( coin.dataset.index != this.selected.index ){
        this.$set($parent.game_status,'bet_start',true)
        this.$set($parent.selectedCoin,'index', coin.dataset.index)
        this.$set($parent.selectedCoin,'value',coin.dataset.value)
      }else{        
        this.$set($parent.game_status,'bet_start',false)
        this.$set($parent.selectedCoin,'index',null)
        this.$set($parent.selectedCoin,'value',null)        
      }
    },
    
    isSelected(j){      
      return this.selected.index == j
    }
  },
  mounted(){
    
  },
  computed:{
    ...mapState([
      'resolution'
    ]),
    styleObj(){
      let scaleFactor = this.resolution.width / 1600
      return{           
        transform: `translate(-50%,0) scale(${scaleFactor})`
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
    &.disabled{
      filter: grayscale(100%);
    }
    position:absolute;
    transition: filter 0.5s;
    width:600px;
    overflow-x: hidden;
    left:100px;

    .inner_wrap{
      width:1200px;
      padding:10px;
      overflow:hidden;
      transition: 0.2s transform;
      &.toggle_slide{
        transform: translateX(-300px);
      }
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

   .slide_control{
     //transition: 0.1s all;
      &:hover{
        color:yellow;
        transform: scale(1.1)
      }
    }
</style>
