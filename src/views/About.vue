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
  .about{height:60vw;position:relative}
  #cont_3d{
    position:relative;
    width:100%;
    height:100%;    
  }
</style>

