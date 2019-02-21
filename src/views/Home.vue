<template>
  <div>
    <div class="home">
      
    </div>
    <div id="cards_cont" style="border:1px solid grey;width:100%;height:600px;margin:0 auto;overflow:hidden">
      
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import TWEEN from '@tweenjs/tween.js'
//import threejs from '@/js/3d.js'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  methods:{
    onWindowResize(){

    },
    render(stamp){
      this.update()
      requestAnimationFrame(this.render)
    },
    update(){
      
    }
  },
  data(){
    return{
      br:'',
    }
  },
  created(){
    /*
    this.$options.sockets.onopen = (data) => {
      const x = JSON.stringify({
        name:'y',
        value:'yyyyy'
      })
      this.$socket.send(x)
    }
    this.$options.sockets.onmessage = (data) => {
      
      let d = JSON.parse(data.data)
      if(d.type='br'){
        this.br = d.value
      }
    }*/
        //this.$options.sockets.onmessage = (data) => console.log(data)
    //console.log(this.$options.sockets)

    //this.$socket.sendObj({awesome: 'data'})
  },
  mounted(){    
    new threejs(this)
    window.on( 'resize', this.onWindowResize )
  },
}
</script>
