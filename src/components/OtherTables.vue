<template>
  <div v-dragscroll.y='true' style="overflow-y:scroll;width:100%;height:100%;">        
    <InGameBoard v-for="(table,index) in list" :data="table" :key="index"/>   
  </div>
</template>

<script>
import InGameBoard from '@/components/InGameBoard.vue'
export default {
  props: ['list'],
  components:{    
    InGameBoard
  }
}
</script>

<style>

</style>
