<template>
  
  <div style="background:#000000;width: 100%;position: relative;margin: 0px 9.1%;">
    <div>
      <div style="text-align: left;">
      <!-- <img src="@/assets/bg.png" style="position: absolute;top: 0px;left: 0px;width:100%;height:100%;"/> -->
        <img src="@/assets/model.png" style="margin-left: -75px;
        z-index: 2;
      position: relative;"/>
      </div>
      <div style="text-shadow: 2.5px 4.3px 25px rgba(0, 0, 0, 0.88);
      font-size: 103.5px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #dfdfe4;
      position: absolute;
      margin-top: 564px;
      margin-left: 22px;
      top: 0px;
      z-index: 1;
      ">
        BACCA
      </div>
      <div style="text-shadow: 2.5px 4.3px 25px rgba(0, 0, 0, 0.88);
      font-size: 103.5px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #dfdfe4;
      position: absolute;
      top: 0px;
      margin-top: 655px;
      margin-left: 191px;
      z-index: 1;
      ">
        RAT
      </div>
    </div>
    <div style="position: absolute;
    top: 0;
    width: 100%;
    z-index: 3;
    ">
      <div style="font-size: 60px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    position: absolute;
    top: 266px;
    right: 405px;
    ">
        Baccarat
      </div>
      <div style="font-family: OpenSans;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.88;
    letter-spacing: normal;
    text-align: left;
    color: #c1c1c1;
    width: 684px;
    position: absolute;
    top: 344px;
    right: -4px;
    ">
        Baccarat is the ultimate card casino game. It attracts more high rollers than any other game, and once you play Baccarat you’ll know why. You are one click away from the world’s most majestic casino card game.
      </div>
      <div style="width: 214px;
    height: 56px;
    border-radius: 27.5px;
    background-color: #ffd324;
    font-size: 20px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 56px;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    position: absolute;
    top: 477px;
    right: 465px;
    cursor: pointer;
    z-index: 2;
    ">
    <router-link to="/baccarat" tag="div">
    Play Now
	</router-link>
    </div>
      </div>
      <img src="@/assets/group-1.png" style="width: 100%;
    z-index: 2;
    position: absolute;
    left: 0px;
    top: 746px;
    "/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import TWEEN from '@tweenjs/tween.js'
//import threejs from '@/js/3d.js'

export default {
  name: 'home',
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
    // new threejs(this)
    // window.on( 'resize', this.onWindowResize )
  },
}
</script>

<style lang="scss" scoped>
  // div {
  //   position: relative;
  // }
  // img {
  //   position: absolute;
  // }
</style>

