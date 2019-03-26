<template>
  <div style="width: 100%;">
    <div style="position: relative;margin: 0px 9.1%;">
      <div>
        <div style="text-align: left;">
        <!-- <img src="@/assets/bg.png" style="position: absolute;top: 0px;left: 0px;width:100%;height:100%;"/> -->
          <img src="@/assets/model.png" style="margin-left: -75px;
          z-index: 2;
        position: relative;"/>
        </div>
        <div id="textContent">
          <div 
          style="text-shadow: 2.5px 4.3px 25px rgba(0, 0, 0, 0.88);
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
      </div>
      <div style="position: absolute;
      top: 0;
      width: 100%;
      z-index: 3;
      ">
        <div
        class="txtAni"
      style="font-size: 60px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #ffffff;
      position: absolute;
      top: 266px;
      right: 436px;
      "
      >
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
      right: 27px;
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
      right: 496px;
      cursor: pointer;
      z-index: 2;
      ">
      <router-link to="/baccarat/12" tag="div" class="button">
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
  /*
 * Animation module with all animation code
 */
.anim-text-flow,
.anim-text-flow-hover:hover {
  /*
   * Animation variables
   */
  $animationSteps: 20;
  $animationDuration: 50;
  $animationElement: span;
  $animationElementsCount: 100;
  $delayBetweenLetters: 0.2;

  /*
   * Elements settings
   */
  #{$animationElement} {
    animation-name: anim-text-flow-keys;
    animation-duration: #{$animationDuration}s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-fill-mode: forwards;
  }

  /*
   * Keyframe loop
   */
  @keyframes anim-text-flow-keys {
    @for $i from 0 through $animationSteps {
      #{percentage($i * (1 / $animationSteps))} {
        color: hsla(random(365), 60, 60, 1);
      }
    }
  }

  /*
   * Element animation delay loop
   */
  $totalDelayTime: $animationElementsCount * $delayBetweenLetters;

  @for $i from 1 through $animationElementsCount {
    #{$animationElement}:nth-of-type(#{$i}) {
      animation-delay: #{($i * $delayBetweenLetters) - $totalDelayTime}s;
    }
  }
}

$secondary-color: #ffe221;

#textContent {
  div {
    animation-delay: 4.1s;
    -webkit-animation-fill-mode: forwards;
    opacity: 0;
    animation-name: titleAnimation;
    animation-timing-function:ease;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    &:first-child{
      animation-delay: 4.2s;

    }

    &:last-child{
      color: $secondary-color;
      animation-delay: 4s;
    }
  }
}

.animation {
  animation-name: titleAnimation;
  animation-timing-function:ease;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

.txtAni {
  //animation: blur 1s ease-out infinite;
  //position: relative;
  //font-family: sans-serif;
  //text-transform: uppercase;
  font-size: 2em;
  letter-spacing: 4px;
  overflow: hidden;
  background: linear-gradient(90deg, #000, #fff, #000);
  background-repeat: no-repeat;
  background-size: 80%;
  animation: animate 5s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: rgba(255, 255, 255, 0);
}

@keyframes slidein { 
  from { margin-left: 100%; width: 300% }
  to { margin-left: 0%; width: 100%; }
}

@keyframes titleAnimation {
    0% {
      transform: translateY(-50px);
      opacity: 0;
      -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%);
      clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 80%);
  }
  20% {
      transform: translateY(0);
      opacity: 1;
      -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%);
      clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%);
  }
  80% {
       transform: translateY(0);
       opacity: 1;
      -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%);
      clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 15%);
  }
  100% {
       transform: translateY(50px);
       opacity: 0;
      -webkit-clip-path: polygon(100% 0, 100% -0%, 0 100%, 0 100%);
      clip-path: polygon(100% 0, 100% -0%, 0 100%, 0 100%);
    
  }
}

@keyframes animate {
  0% {
    background-position: -500%;
  }
  100% {
    background-position: 500%;
  }
}

@keyframes blur {
  from {
    text-shadow:0px 0px 10px #fff,
      0px 0px 10px #fff, 
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 50px #fff,
      0px 0px 50px #fff,
      0px 0px 50px #7B96B8,
      0px 0px 150px #7B96B8,
      0px 10px 100px #7B96B8,
      0px 10px 100px #7B96B8,
      0px 10px 100px #7B96B8,
      0px 10px 100px #7B96B8,
      0px -10px 100px #7B96B8,
      0px -10px 100px #7B96B8;
  }
}


div.button:hover {
	color: rgba(255, 255, 255, 0.85);
	box-shadow: rgba(30, 22, 54, 0.7) 0 0px 0px 40px inset;
	border-radius: 27.5px;
}
</style>

