<template>
  <div id="coins_for_bet">
    <div class="inner_wrap">
      <div v-for="i,j of 9" :key="`coins${j}`" class="coin_wrap" @click="onClickCoin" :data-index="j" :data-value="values[j]">
        <img class="coin" :src="require(`@/images/chips/bet${files[j]}__.png`)"/>
        <span class="coin_value">{{ values[j].toString().replace(/000$/,'K') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['default_size','pos_y'],
  data() {
    return {
      files: [4, 5, 6, 7, 8, 9, 10, 11, 12],
      values: [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000],
      selectedCoin: {
        index: null,
        value: null,
      },
    }
  },
  methods: {
    onClickCoin(e){
      const coin = e.target.parentElement
      this.$set(this.$parent.game_status,'bet_start',true)
      if( !coin.classList.contains('selected')){
        coin.parentElement.querySelectorAll('.coin_wrap').forEach( a => {          
          a.classList.remove('selected')
        })
        coin.classList.add('selected')
        this.$set(this.$parent.selectedCoin,'index',coin.dataset.index)
        this.$set(this.$parent.selectedCoin,'value',coin.dataset.value)
      }else{
        coin.classList.remove('selected')
        this.$set(this.$parent.game_status,'bet_start',false)
        this.$set(this.$parent.selectedCoin,'index',null)
        this.$set(this.$parent.selectedCoin,'value',null)
      }
    }
  }
}
</script>

<style lang="scss">
  #coins_for_bet{
    position:absolute;
    overflow-x: hidden;
    .inner_wrap{
      width:1200px;
      padding:10px;
    }
    .coin_wrap{
      position:relative;
      margin-top:30px;
      float:left;
      width:80px;
      height:80px;
      margin-right:20px;
      cursor:pointer;
      border-radius:50%;
      transition:all 0.07s;
      &:hover{
        transform: translateY(-20px);        
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
