<template>  
  <div class="ui_wrap" style="border-top:1px solid #777; width:100%;position:relative" :style="wrapperStyle" ref="ui_wrap">
    <div id="credit_info" :style="styleObj" ref="ui">
      <div class="credit_box">
        <div class="credit_box_bet"><span>BET</span><span>{{bet.sum}}</span></div>
        <div class="credit_box_credit"><span>CREDIT</span><span>{{credit}}</span></div>      
      </div>
      <div class="credit_buttons"></div>
      <div class="bet_funcs" style="overflow:hidden;position:absolute;top:-34px;right:8px;">
        <div class="func_btn" style="float:left" @click="do_bet_func('rebet')">Re Bet</div>
        <div class="func_btn" style="float:left" @click="do_bet_func('double')">Double</div>
        <div class="func_btn" style="float:left" @click="do_bet_func('max')">MAX</div>
      </div>
      <slot/>
    </div>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'

export default {
  props: ['bet','saved'],  
  data() {
    return {
      el : '',
    }
  },
  mounted(){
    
  },
  methods:{
    do_bet_func(type){
      if( !this.saved.sum || !this.saved.array ) return;
      let bases = [10000,5000,1000,500,100,50,10,1,0.1]
      const slots = [0,0,0,0,0]; // tie, p, b, pp, bp
      // 슬롯당 sum을 구함.
      let factor = 1;
      if(type == "double") factor = 2;

      for(let slot of this.saved.array){
        slots[slot.slot] += +slot.value * factor
        slots[slot.slot] = parseInt(slots[slot.slot] * 10) / 10
      }

      let total = 0;
      for(let slot of slots){        
        total += slot
      }

      //유효한 슬롯 객체
      const final_slots = [];      
      slots.forEach((t,i)=>{
        if(t>0){
          final_slots.push({
            slot:i,
            value:t
          })
        }
      })
        

      if (type != 'max' && this.credit < total){
        alert('잔액이 부족합니다.'); return;
      }
      
      if(type == 'max'){ // 맥스 버튼일 경우
        // 단일 배팅일경우
        if(final_slots.length == 1){
          final_slots[0].value = parseInt(this.credit * 10) / 10;
        }else{ // 복수 배팅일경우
          let temp_sum = 0;
          for(let i =0; i < final_slots.length; i++){            
            if(i < final_slots.length-1){
              final_slots[i].value = parseInt( final_slots[i].value / total * this.credit * 10 ) / 10
              temp_sum += final_slots[i].value
              console.log(temp_sum)
            }else{
              final_slots[i].value = parseInt( (this.credit - temp_sum) * 10) / 10
            }
          }
        }
      }
      
      ;(async()=>{        
        for(let slot of final_slots){          
          this.$parent.tosvr_req_betting("EOS", slot.value, slot.slot);
          await new Promise(resolve => {
            setTimeout(resolve, 50)
          })          
        }
      })()      
    }
  },
  computed: {    
    ...mapGetters({
      credit: 'getCredit',
    }),
    ...mapState([
      'resolution'
    ]),
    scaleFactor(){      
      return this.resolution.width / 1276
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
  width:1276px;
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