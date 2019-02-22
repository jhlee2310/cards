import * as THREE from 'three'
import LineMaterial from '@/js/src/lines/LineMaterial'
import LineSegments2 from '@/js/src/lines/LineSegments2'
import Line2 from '@/js/src/lines/Line2'
import LineGeometry from '@/js/src/lines/LineGeometry'
import LineSegmentsGeometry from '@/js/src/lines/LineSegmentsGeometry'
//import WireframeGeometry2 from '@/js/src/lines/WireframeGeometry2'
//import Wireframe from '@/js/src/lines/Wireframe'

//import { SMAASearchImageData,SMAAAreaImageData, SMAAEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
const e = function(opt){
    LineSegmentsGeometry(THREE)    
    LineGeometry(THREE);
    //WireframeGeometry2(THREE);
    LineMaterial(THREE);
    LineSegments2(THREE);
    Line2(THREE);
    //Wireframe(THREE);   

    this.resizeUpdate = {
        matLines: []
    }
    const {vue,el,TWEEN} = opt    
    const clock = new THREE.Clock()
    let cont =  this.cont = document.querySelector(el)
    let width = cont.clientWidth
    let height = cont.clientHeight


    this.intersects = null;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector3();
    const forIntersect = [];

    function getIntersects( x, y ) {
        x = ( x / width ) * 2 - 1;
        y = - ( y / height ) * 2 + 1;
        mouseVector.set( x, y, 0.5 );
        raycaster.setFromCamera( mouseVector, camera );        
        return raycaster.intersectObjects( forIntersect, true );
    }

    let selectedObject = null

    this.onMouseMove = function(e){        
        e.preventDefault();

        if ( selectedObject ){
            selectedObject.material.color.set( '#FFFFFF' )               
            selectedObject = null
        }

        let intersects = getIntersects( e.layerX, e.layerY );       
        
        if ( intersects.length > 0 ) {
            var res = intersects.filter( function ( res ) {
                return res && res.object;
            } )[ 0 ];
            if ( res && res.object ) {
                selectedObject = res.object;
                selectedObject.material.color.set( '#690' );
            }
		}

    }
    
    let scene = this.scene = new THREE.Scene();    
    let camera = this.camera = new THREE.PerspectiveCamera( 30, cont.clientWidth / cont.clientHeight, 0.1, 1000 );
    let renderer = this.renderer = new THREE.WebGLRenderer({
        //alpha:true,
        antialias: true,
        autoClearDepth: false
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
    table.position.z = -10
    table.scale.set(96,66,1)

        
    
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
            mesh.rotation.x = Math.PI
            if(j !=3 ){
                mesh.position.x = j * 5.6
            }else{
                mesh.rotation.z = Math.PI/2
                mesh.position.y = -6
                mesh.position.z = 1
                mesh.renderOrder = 999;                
                mesh.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
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
        group.position.y = 22
        
        scene.add(group)
    }

    //배팅판
    var _matLine = new THREE.LineMaterial( {
        color: 0xffffff,
        linewidth: 3, // in pixels        
        dashed: false
    });    
    _matLine.resolution.set( width, height );
    
    const RoundedRectangle = function (width, height, radius ) {
        let ctx = new THREE.Shape();
        let x = -width/2
        let y = -height/2
        ctx.moveTo( x, y + radius );
        ctx.lineTo( x, y + height - radius );
        ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
        ctx.lineTo( x + width - radius, y + height );
        ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
        ctx.lineTo( x + width, y + radius );
        ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
        ctx.lineTo( x + radius, y );
        ctx.quadraticCurveTo( x, y, x, y + radius );
        ctx.autoClose = true;
        return ctx;        
    }
    
    let _r1 = RoundedRectangle(10, 16, 0.8 ), _r2 = RoundedRectangle(13, 16, 0.8 );
    
    let _positions = [], _positions2 = [];    
    _r1.getPoints().forEach(a=>{
        _positions.push(a.x,a.y,0)
    });
    _r2.getPoints().forEach(a=>{
        _positions2.push(a.x,a.y,0)
    });


    let _pl_mt = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity:0.3, transparent: true, depthTest:false } )
    let _pl_g1 = new THREE.ShapeBufferGeometry( _r1 ), _pl_g2 = new THREE.ShapeBufferGeometry(_r2)
    let _pl_m1 = new THREE.Mesh( _pl_g1,  _pl_mt ), _pl_m2 = new THREE.Mesh( _pl_g2,  _pl_mt.clone() )
    forIntersect.push(_pl_m1,_pl_m2);
    _pl_m1.position.z = _pl_m2.position.z = -0.2
        
    

    let _geo = new THREE.LineGeometry(), _geo2 = new THREE.LineGeometry();

    _geo.setPositions(_positions)
    _geo2.setPositions(_positions2)
    
    
    var _line = new THREE.Line2( _geo, _matLine ), _line2 = new THREE.Line2( _geo2, _matLine );
    _line.computeLineDistances();    
    _line2.computeLineDistances();
    
    let _group = new THREE.Group(),  _group2 = new THREE.Group();
    _group.add(_line)
    _group.add(_pl_m1);
    _group.position.z = -3
    _group2.add(_line2)
    _group2.add(_pl_m2)    
    _group2.position.x = 15;
    _group2.position.z = -5
    _group.name = 'bet_1'
    _group2.name = 'bet_2'
    scene.add(_group)
    scene.add(_group2)
    _group2.rotation.z = Math.PI / 36
    _group2.position.y = 0.8
    let _group3 = _group2.clone()
    _group3.name = 'bet_3'
    _group3.position.x = _group2.position.x * -1
    _group3.rotation.z = _group2.rotation.z * -1
    let _group4 = _group2.clone()
    _group4.name = 'bet_4'
    _group4.position.x = _group2.position.x + 16;
    _group4.position.y = 3
    _group4.rotation.z = Math.PI / 16
    let _group5 = _group4.clone()
    _group5.name = 'bet_5'
    _group5.position.x = _group4.position.x * -1;
    _group5.rotation.z = _group4.rotation.z * -1

    scene.add(_group3)
    scene.add(_group4)
    scene.add(_group5)

    for(let i=3;i <= 5;i++){
        let tmp = scene.getObjectByName(`bet_${i}`).getObjectByProperty('type',"Mesh")
        tmp.material = tmp.material.clone()
        forIntersect.push(tmp)
    }

    //sprites
    const group_sprite = new THREE.Group()
    let cnt = 0;
    for(let i of [4,5,6,7,8,9,10,11,12]){
        let spriteMap = new textureLoader.load( require(`@/images/chips/bet${i}__.png`) );
        let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        let sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(4.8,4.8)
        sprite.position.x = cnt++ * 7
        group_sprite.add( sprite );
    }
    group_sprite.position.x = -(cnt-1) * 7 /2
    group_sprite.position.y = -22
    scene.add(group_sprite)
    
    this.group_buy_sprite = {}
    for(let i of [0.1,1,10,50,100,500,1000,5000,100000]){
        let spriteMap = new textureLoader.load( require(`@/images/chips/buy${i}_.png`) );
        let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        let sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(2.6,2.6)        
        this.group_buy_sprite[`buy_${i}`] = sprite
    }

    const show_bet = (cont, p, q)=>{
        let target;
        let zones = [];
        for(let y=-1; y<=1; y++){
            for(let x=-1; x<=1; x++){
                zones.push(new THREE.Vector3(x,y,0))
            }
        }
        switch(cont){
            case 1: target = _group5;
                break;
            case 2: target = _group3
                break;
            case 3: target = _group
                break;
            case 4: target = _group2
                break;
            case 5: target = _group4
                break;
        }
        
        let z = Math.floor(Math.random()*9)
        let coins = new THREE.Group();
        coins.position.copy( zones[z].multiplyScalar(3.8) )
        let coin = this.group_buy_sprite[`buy_${p}`]        
        for(let i=0;i<q;i++){
            coin = coin.clone()
            coin.position.x = (Math.random() - 0.5)*0.7 + ( i*0.05 )
            coin.position.y = i*0.14            
            coins.add(coin)
        }
        target.add(coins)
    }
    
    show_bet(1,'50',10)
    show_bet(3,'0.1',12)
    show_bet(4,'100000',4)
    show_bet(4,'100000',10)
    show_bet(3,'500',10)
    
    
    
    

    animate();

    function animate(time){        
        TWEEN.update(time)
        renderer.render( scene,camera )
        requestAnimationFrame(animate)
        
    }

    
}

export default e

