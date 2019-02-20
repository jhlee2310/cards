import * as THREE from 'three'

const e = function(vue){
    let cont =  document.querySelector('#cards_cont')        
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 45, cont.clientWidth / cont.clientHeight, 0.1, 1000 );
    let renderer = new THREE.WebGLRenderer({
        alpha:true,
        antialias: true,
    });
    let o = [];
    window.o = o;
    renderer.setSize( cont.clientWidth, cont.clientHeight );
    cont.appendChild( renderer.domElement );
    camera.position.z = 15*3;
    camera.position.y = -17*3;
    camera.lookAt(0,0,0)

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.z = 10
    scene.add( directionalLight );

    //var geometry = new THREE.PlaneGeometry( 10, 16, 4 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xBBBBBB, side: THREE.DoubleSide} );
    //var lmat = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    
    for(let i = -1; i <= 1 ; i += 2){
        let group = new THREE.Group()
        
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
        
        //var geometry = new THREE.ShapeBufferGeometry( shape );
        var geometry = new THREE.ExtrudeGeometry( shape, { depth: 0.2, bevelEnabled: false } );
        geometry.faces.filter(a=>{
            return a.materialIndex == 0 && a.normal.z < 0
        }).forEach(a=>{            
            a.materialIndex = 2
        })
        geometry.groupsNeedUpdate = true;

        var mesh = new THREE.Mesh( geometry, [
            new THREE.MeshBasicMaterial( { color: 0x444400 } ),
            new THREE.MeshBasicMaterial( { color: 0x000000 } ),
            new THREE.MeshBasicMaterial( { color: 0x000077 } ),
        ] );
        mesh.rotation.x = Math.PI;
        group.add( mesh );
        o.push(mesh)
        group.position.x = i * 30
        scene.add(group)

        /*
        let p1 = new THREE.Mesh( geometry, material )
        p1.position.x = -12
        group.add(p1)
        let p2 = new THREE.Mesh( geometry, material )
        p2.position.x = 0
        group.add(p2)
        let p3 = new THREE.Mesh( geometry, material )
        p3.position.x = 12
        group.add(p3)

        group.position.x = i * 30;
        scene.add(group)
        */
    }


    animate();
    

    window.THREE = THREE;
    window.camera = camera;

    function animate(){
        for(let _o of o){
            //_o.rotation.y += 0.03;

        }
        renderer.render( scene,camera )
        requestAnimationFrame(animate)
    }

    
}

export default e
