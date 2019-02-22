<template>
  <div class="about">
    <div id="cont_3d">
      <div class="rectanges" style="position:absolute;width:500px;height:210px;left:0;bottom:0;background:rgba(255,255,255,.8);border:1px solid #666">
        <div class="col" v-for="(j, i) in 20" :style="{
          position:'absolute',
          height:'100%',
          width:'20px',
          left: i * 20+'px'}" :key="i">
            <img src="@/assets/logo.png">
            <img src="@/assets/logo.png">
            <img src="@/assets/logo.png">
          </div> 
        <svg height="210" width="500">          
          <line v-for="i in 20" x1="0" :y1="i*delta" x2="500" :y2="i*delta" style="stroke:rgb(0,0,0);stroke-width:1" :key="i"/>
          <line v-for="i in 20" :x1="i*delta" y1="0" :x2="i*delta" y2="210" style="stroke:rgb(0,0,0);stroke-width:1" :key="i"/>
        </svg>
        </div>
    </div>
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
      game: null,
      delta:20,
    }
  },
  mounted(){  
    this.game = new threejs({
      vue: this,
      el: '#cont_3d',
      TWEEN    
    })

    window.addEventListener('resize',this.onWindowResize,false)
  },
  methods: {
    onWindowResize(e){
      const camera = this.game.camera
      const renderer = this.game.renderer
      const cont = this.game.cont
      const width = cont.clientWidth
      const height = cont.clientHeight

      camera.aspect = cont.clientWidth / cont.clientHeight;
			camera.updateProjectionMatrix();
      renderer.setSize( cont.clientWidth, cont.clientHeight );
      
      this.game.resizeUpdate.matLine.resolution.set( width, height );
      if(widht<=750){
        his.game.resizeUpdate.matLine.linewidth=1
      }
		},
    async click(e){
      const scene = this.game.scene


     const card_ord = [1,4,0,3,2,5]

      for(let ord=0;ord<card_ord.length;ord++){

        let i = card_ord[ord]

        let card = scene.getObjectByName(`card_${i}`)      
        card.visible = false
        let speed = 450

      card.userData.original_position = card.position.clone()
      if(i == 2 || i == 5){
        card.position.y += 40
        speed = 1000
      }else{
        card.position.y += 8
      }
      
      //Linear.None
      await new Promise( (resolve,reject) => {
        setTimeout(() => {
      card.visible = true
          new TWEEN.Tween( { rot: 0, pos: card.position.y } )
          .to( { pos: card.userData.original_position.y},speed )
          .easing(TWEEN.Easing.Linear.None)
          .onUpdate(a=>{
            card.position.y = a.pos
            card.rotation.y = a.rot
          })
          .onComplete( ()=>{
            resolve();
            console.log("move comp")
          }).start()
       new TWEEN.Tween( { rot: 0, y: 0 } )
        .to( { y: Math.PI }, speed+1000 )
        .easing( TWEEN.Easing.Elastic.InOut )
        .onUpdate( function (a) {          
          card.rotation.y = a.y  
        } )
        .onComplete( ()=>{
            resolve();
            console.log("rot comp")
          })
        .start();        
        }, 1000);
      })
      }

    }
  }
}
</script>

<style el="scss">
body{margin:0;padding:0}
  .about{height:70vw;position:relative}
  #cont_3d{
    position:relative;
    width:100%;
    height:100%;    
  }

.col img{
  display:block;
  width:100%;
  height:20px;
}
</style>

