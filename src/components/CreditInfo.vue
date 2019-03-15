<template>  
  <div class="ui_wrap" :style="wrapperStyle">
    <div id="credit_info" :style="styleObj">
      <div class="credit_box">
        <div class="credit_box_bet"><span>BET</span><span>{{bet}}</span></div>
        <div class="credit_box_credit"><span>CREDIT</span><span>{{credit}}</span></div>      
      </div>
      <div class="credit_buttons"></div>
      <slot/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['credit', 'bet'],  
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState([
      'resolution'
    ]),
    scaleFactor(){
      return this.resolution.width / 1320
    },
    wrapperStyle(){
      const el = document.getElementById('credit_info')      
      return {
        width: (el?el.clientWidth : 1320) * this.scaleFactor + 'px',
        height: (el?el.clientHeight : 300) * this.scaleFactor + 'px',
      }
    },
    styleObj(){
      return{        
        width:'1320px',
        backgroundColor: '#343434',
        color:'white',                        
        transform: `scale(${this.scaleFactor})`,
        transformOrigin: '0 0',
      }
    },
  },    
}
</script>

<style lang="scss">
#credit_info{
  
}
.credit_buttons{
  width:100%;
  height:100%;
}
.credit_box{
  position:absolute;
  overflow:hidden;  
  font-size:20px;
  top: -70px;
  right: 20px;
  width: 242px;
  color:yellow;
  &>div{
    padding:5px;
    overflow:hidden;
    border-bottom:1px solid white;    
    &:last-child{
      border-bottom:none;
    }
  }
  span:first-child{
    float:left;
  }
  span:last-child{
    float:right;
  }
}
</style>