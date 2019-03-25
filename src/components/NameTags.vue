<template>
  <div class="name_tags">
    <div class="name_tag" v-for="name,index in coin_groups" :key="'key_'+index" :style="{
      top: check_names[index][1]+'px',
      left: check_names[index][0] + 'px',
      transform: `translate(-50%,-50%) scale(${scaleFactor})`,
    }">{{name.name}}</div>
  </div>
</template>

<script>
export default {
  props:['coin_groups','game','resolution'],
  data(){
    return{
      names:[[],[],[],[],[]],
      //coin_groups: [{"name":"eosblackkiko","slot":1,"position":{"x":-0.3569530533226602,"y":-0.3644571881987504,"z":0.9969960336351492}},{"name":"eosblackkiko","slot":3,"position":{"x":0.31374136666951874,"y":-0.03021055294023509,"z":0.997217331045558}},{"name":"eosblackkiko","slot":4,"position":{"x":0.5373981509446435,"y":-0.0661532533010846,"z":0.9971935341672237}},{"name":"eosblackkiko","slot":0,"position":{"x":-0.5788698938857184,"y":-0.2230248066090061,"z":0.9970896729316812}}],
    }
  },
  computed:{
    scaleFactor(){
      return this.resolution.width / 1320;
    },
    check_names(){
      const posArray = []      
      this.coin_groups.forEach( (t,i) => {        
        posArray.push([ (t.position.x + 1) / 2 * this.resolution.width, - ( t.position.y - 1) / 2 * this.resolution.height])
      })
      return posArray
    }
  },
  mounted(){    
    
  }
}
</script>

<style>
  .name_tags{
    position:absolute;
    top:0;left:0;
  }
  .name_tag{
    position:absolute;    
    color:#07ff05;
  }
</style>
