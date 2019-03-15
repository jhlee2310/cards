<template>  
  <div class="ui_wrap" style="border-top:1px solid #777; width:100%;position:relative" :style="wrapperStyle" ref="ui_wrap">
    <div id="credit_info" :style="styleObj" ref="ui">
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
      el : '',
    }
  },
  mounted(){
    
  },
  computed: {
    ...mapState([
      'resolution'
    ]),
    scaleFactor(){      
      return this.resolution.width / 1320
    },    
    wrapperStyle(){      
      return {
        height: 200 * this.scaleFactor  + 'px',
      }
    },    
    styleObj(){
      let obj = {                                         
        transform: `scale(${this.scaleFactor})`,       
      }
      return obj;
    },
  },
  watch: {
    styleObj(){
      let el = this.$refs.ui;
      this.$refs.ui_wrap.style.height =  el.getBoundingClientRect().height;
    }
  }  
}
</script>

<style lang="scss">
#credit_info{
  width:1320px;
  background-color: #343434;  
  color: white;
  position:absolute;
  top:0;
  left:0;
  transform-origin:0 0;
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