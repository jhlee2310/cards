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
      game: null,
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

      camera.aspect = cont.clientWidth / cont.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( cont.clientWidth, cont.clientHeight );
		},
    async click(e){
      const scene = this.game.scene
      let card = scene.getObjectByName('card_1')      
      
      card.userData.original_position = card.position.clone()
      card.position.y += 8
      
      card.visible = true      
      //Linear.None
      await new Promise( (resolve,reject) => {
        new TWEEN.Tween( { rot: 0, pos: card.position.y } )
        .to( { pos: card.userData.original_position.y},450 )
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(a=>{
          card.position.y = a.pos
        })
        .onComplete( ()=>{
          resolve();
        }).start()
      })

       new TWEEN.Tween( { rot: 0, y: 0 } )
        .to( { y: Math.PI }, 1000 )
        .easing( TWEEN.Easing.Elastic.InOut )
        .onUpdate( function (a) {          
          card.rotation.y = a.y  
        } )
        .start();        
    }
  }
}
</script>

<style el="scss">
body{margin:0;padding:0}
  .about{height:60vw;position:relative}
  #cont_3d{
    position:relative;
    width:100%;
    height:100%;    
  }
</style>

