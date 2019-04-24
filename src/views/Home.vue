<template>
  <div class="home_wrap">    
      <div class="content_cont" :style="content_cont_style">
        <div class="img_cont" :style="img_cont_style">
          <img class="img_model" src="@/assets/model.png"/>
          <div class="text_content">
            <div class="bacca">BACCA</div>
            <div class="rat">RAT</div>
          </div>
        </div>
        <img src="@/assets/group-1.png" style="width: 100%;height:70px;z-index: 2;position: absolute;left: 0px;bottom: 0px;transform:translate(0px,50%);opacity:0.48"/>
      </div>              
      <div class="right_side">
        <div class="txtAni">Baccarat</div>
        <div class="txtLong">
          Baccarat is the ultimate card casino game. It attracts more high rollers than any other game, and once you play Baccarat you’ll know why. You are one click away from the world’s most majestic casino card game.
        </div>
        <div class="btn_play" style="
      ">
      <router-link to="/baccarat/1" tag="div" class="button">
      Play Now
    </router-link>
      </div>
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
    onWindowResize(e){
      this.width = window.innerWidth;
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
      width:0,
    }
  },
  created(){
    window.addEventListener('resize',this.onWindowResize)
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
    this.$nextTick(()=>{
      window.dispatchEvent(new Event('resize'))
    })    
  },
  computed: {
    content_cont_style(){
      if(this.width <= 850 ){
        let scaleFactor = this.width/850;        
        return {
          height: `${scaleFactor*600}px`,          
        }
      }else return {}
    },
    img_cont_style(){
      if(this.width <= 850 ){
        let scaleFactor = this.width/850
        return {
          transform: `translate(-50%,-50%) scale(${scaleFactor})`,
        }
      }else return {}
    }
  }
}
</script>

<style lang="scss">
.home_wrap{
  position:relative;max-width:1600px;margin:0 auto;
  .content_cont{
    position:relative;width:100%;height:600px;overflow:hidden;margin:0 auto;
    .img_cont{
      width:680px;height:600px;overflow:hidden;position:absolute;top:0;left:0;
      @media screen and (max-width: 1200px){
        &{
          position:relative;
          margin:0 auto;
          top:auto;left:auto;
        }
      }
      @media screen and (max-width: 850px){
        &{          
          position:absolute;          
          top:50%;left:50%;
        }
      }
      .img_model{
      display:block;right:-170px;position:absolute;height:600px;
      }
      .text_content{
        position:absolute;
        bottom:36px;left:100px;font-size:70px;z-index:-1;
        .bacca{
          text-shadow: 2.5px 4.3px 25px rgba(0, 0, 0, 0.88);font-size: 1em;font-weight: bold;font-style: normal;font-stretch: normal;
          line-height: 1.2;letter-spacing: normal;text-align: right;color: #dfdfe4;
        }
        .rat{
          text-shadow: 2.5px 4.3px 25px rgba(0, 0, 0, 0.88);font-size: 1em;font-weight: bold;
          text-align: right;color: #dfdfe4;
        }
      }    
    }
  }
  .right_side{
    position:absolute;width:750px;right:0;top:45%;transition: 0.2s all ease;overflow:hidden;
    @media screen and (max-width: 1200px){
      &{
        box-sizing:border-box;
        padding:30px;
        margin-top:100px;
        width:100%;
        position:relative;
        right:auto;
        top:auto;
        margin:0 auto;
      }
    }
    .txtAni{
      font-size: 60px;font-weight: bold;font-style: normal;font-stretch: normal;line-height: 1.2;letter-spacing: normal;text-align: left;
      color: #ffffff;margin-bottom:25px;  
    }
    .txtLong{
      font-family: 'OpenSans';
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.88;
      letter-spacing: normal;
      text-align: left;
      color: #c1c1c1;
      margin-bottom:25px;
    }
    .btn_play{
      width: 214px;height: 56px;border-radius: 27.5px;background-color: #ffd324;font-size: 20px;font-weight: bold;font-style: normal;font-stretch: normal;line-height: 56px;
      letter-spacing: normal;text-align: center;color: #000000;cursor: pointer;z-index: 2;
    }
  }
}
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

