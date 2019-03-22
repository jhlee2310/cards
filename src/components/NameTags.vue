<template>
  <div class="name_tags">
    <div v-for="name in coin_groups">{{name.name}}</div>
  </div>
</template>

<script>
export default {
  props:['coin_groups','game'],
  data(){
    return{
      names:[[],[],[],[],[]],
    }
  },
  computed:{    
    check_names(){

    }
  },
  mounted(){
    
  }
}
</script>

<style>

</style>
