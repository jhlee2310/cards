import * as THREE from 'three'
//import { SMAASearchImageData,SMAAAreaImageData, SMAAEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
const e = function(opt){
    const {vue,el,TWEEN} = opt    
    const clock = new THREE.Clock()
    let cont =  this.cont = document.querySelector(el)
    let width = cont.clientWidth
    let height = cont.clientHeight

    
    let scene = this.scene = new THREE.Scene();    
    let camera = this.camera = new THREE.PerspectiveCamera( 30, cont.clientWidth / cont.clientHeight, 0.1, 1000 );
    let renderer = this.renderer = new THREE.WebGLRenderer({
        //alpha:true,
        antialias: true,
    });

    let o = [];
    const textureLoader =  new THREE.TextureLoader();
    
        
    window.o = o;
    window.THREE = THREE;
    window.camera = camera;
    window.scene = scene;
    window.renderer = renderer;

    renderer.setSize( cont.clientWidth, cont.clientHeight );
    cont.appendChild( renderer.domElement );
    camera.position.z = 120;
    //camera.position.y = -20;
    camera.lookAt(0,0,0)
    
    //const renderPass = new THREE.RenderPass( scene, camera );
    //const fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
	//fxaaPass.renderToScreen = true;
    

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.z = 10
    scene.add( directionalLight );

    //const composer1 = new THREE.EffectComposer( renderer );
	//composer1.addPass( renderPass );
	//composer1.addPass( fxaaPass );
    let table = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({
        color: 0xffffff,        
    }))
    textureLoader.load(require('@/images/table.jpg'),tex => {
        table.material.map = tex;
        tex.minFilter = tex.magFilter = THREE.LinearFilter;
        table.material.needsUpdate = true;
    })
    
    table.name = "table"
    table.position.z = -3
    table.scale.set(140,57,1)

        
    
    scene.add(table)

    // 카드 형태 생성
    var shape = new THREE.Shape();
        shape.autoClose = true;
        ( function roundedRect( ctx, x, y, width, height, radius ) {
            ctx.moveTo( x, y + radius );
            ctx.lineTo( x, y + height - radius );
            ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
            ctx.lineTo( x + width - radius, y + height );
            ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
            ctx.lineTo( x + width, y + radius );
            ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
            ctx.lineTo( x + radius, y );
            ctx.quadraticCurveTo( x, y, x, y + radius );
        } )( shape, -5, -8, 10, 16, 0.8 );
        
        var geometry = new THREE.ExtrudeGeometry( shape, { depth: 0.2, bevelEnabled: false } );
        geometry.faces.filter(a=>{
            return a.materialIndex == 0 && a.normal.z < 0
        }).forEach(a=>{            
            a.materialIndex = 2
        })
        geometry.groupsNeedUpdate = true;

        geometry.computeBoundingBox();
        let max = geometry.boundingBox.max
        let min = geometry.boundingBox.min;
        let offset = new THREE.Vector2(0 - min.x, 0 - min.y)
        let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
        let faces = geometry.faces;

        geometry.faceVertexUvs[0] = [];

        for (let j = 0; j < faces.length ; j++) {

            var v1 = geometry.vertices[faces[j].a], 
                v2 = geometry.vertices[faces[j].b], 
                v3 = geometry.vertices[faces[j].c];
            
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
                new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
                new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
            ]);
            
        }
        geometry.uvsNeedUpdate = true;   
        // 카드 형태 생성

        // 카드 재질 정의
        const card_mat = {
            front: new THREE.MeshBasicMaterial( { color: 0xffffff } ),
            middle: new THREE.MeshBasicMaterial( { color: 0x000000 } ),
            back: new THREE.MeshBasicMaterial( { color: 0xffffff } ),
        } 

        textureLoader.load(require('@/images/backside.jpg'),tex=>{
            card_mat.back.map = tex;
            card_mat.back.needsUpdate = true;
        })
        let imgcnt = 0;
    
    for(let i = -1; i <= 1 ; i += 2){
        let group = new THREE.Group()     
        
        for(let j = -1; j<=3; j+=2){
            let mesh = new THREE.Mesh( geometry, [
                card_mat.front.clone(),
                card_mat.middle,
                card_mat.back
            ] );
            mesh.name = `card_${imgcnt}`
            if(j !=3 ){
                mesh.position.x = j * 5.6
                mesh.rotation.x = Math.PI
            }else{
                mesh.rotation.z = Math.PI/2
                mesh.position.y = -10
                mesh.position.z = 0.4
            }

            textureLoader.load(require(`@/images/test_${imgcnt++}.png`), texture=>{
                texture.minFilter = texture.magFilter = THREE.LinearFilter;
                mesh.material[0].map = texture       
                mesh.material[0].needsUpdate = true;
            })

            
            mesh.visible = false;
            
            group.add( mesh );
            o.push(mesh)
        }
        
       

        //mesh.rotation.x = Math.PI;        
        group.position.x = i * 20
        group.position.y = 17
        
        scene.add(group)
    }


    animate();
    

    

    

    function animate(time){        
        TWEEN.update(time)
        renderer.render( scene,camera )
        requestAnimationFrame(animate)
        
    }

    
}

export default e
