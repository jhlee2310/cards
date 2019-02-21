<template>
  <div class="about">
    <div id="cont_3d"></div>
    <div class="control">
      <button @click="click">click</button>
    </div>
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import threejs from '@/js/3dabout.js'

export default {
  data(){
    return {
      ngin: null,
    }
  },
  mounted(){
    this.ngin = new threejs({
      vue: this,
      el: '#cont_3d',
      TWEEN
    })    
  },
  methods: {
    click(e){
      const scene = this.ngin.scene
      let obj = scene.getObjectByName('card_1')
    }
  }
}
</script>

<style el="scss">
  .about{height:500px;position:relative}
  #cont_3d{
    position:relative;
    width:100%;
    height:100%;
    background-color:brown;
  }
</style>

