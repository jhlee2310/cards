<template>  
  <div class="ui_wrap" style="border-top:1px solid #777; width:100%;position:relative" :style="wrapperStyle" ref="ui_wrap">
    <div id="credit_info" :style="styleObj" ref="ui">
      <div class="credit_box">
        <div class="credit_box_bet"><span>BET</span><span>{{bet}}</span></div>
        <div class="credit_box_credit"><span>CREDIT</span><span>{{credit}}</span></div>      
      </div>
      <div class="credit_buttons"></div>
      <div class="bet_funcs" style="overflow:hidden;position:absolute;top:-34px;right:8px;">
        <div class="func_btn" style="float:left">Re Bet</div>
        <div class="func_btn" style="float:left">Double</div>
        <div class="func_btn" style="float:left">MAX</div>
      </div>
      <slot/>
    </div>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'

export default {
  props: ['bet'],  
  data() {
    return {
      el : '',
    }
  },
  mounted(){
    
  },
  computed: {
    ...mapGetters({
      credit: 'getCredit',
    }),
    ...mapState([
      'resolution'
    ]),
    scaleFactor(){      
      return this.resolution.width / 1292
    },    
    wrapperStyle(){      
      return {
        height: 168 * this.scaleFactor  + 'px',
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
  width:1292px;
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
  font-size:16px;
  top: -96px;
  right: 10px;
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

.func_btn{
  width:92px;
  padding:5px;
  height:30px;
  background:rgba(255,255,255,.85);
  color: black;
  border-radius:8px;
  margin-left:14px;
  font-weight:500;
  border: 1px solid #999;
  box-sizing:border-box;
  cursor: pointer;
  &:hover{
    border-color:yellow;
    color:yellow;
    background-color:cadetblue;
  }
}
</style>