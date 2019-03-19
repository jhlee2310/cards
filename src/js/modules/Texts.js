export default function(game, table_group){
  const { THREE, scene2, camera } = game;

  var directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight1.position.copy(camera.position)
  scene2.add(directionalLight1)
  
  const matrix = new THREE.Group();
  matrix.lookAt(camera.position.x,camera.position.y,camera.position.z)
  matrix.position.copy(camera.target)
  scene2.add(matrix)

  const makeTextGeo = (txt,ft,size) => {
    let geometry = new THREE.TextGeometry(txt,{
      font: ft,
      size: size,
      height: 1,
      curveSegments: 6,
      bevelEnabled: false,      
      //bevelSegments: 5
    });

    geometry.computeBoundingBox();
    let box = geometry.boundingBox;
    let trans = box.max.clone().sub(box.min);
    geometry.translate( -trans.x/2, -trans.y/2, -trans.z/2 )

    return geometry;
  }
  
  game.winners = {};
  ;(async() => {
    const fonts = await Promise.all(
      [
        new Promise( resolve => {
          new THREE.FontLoader().load('/brushScript.json', _f1 => {
            resolve(_f1)
          })
        }),    
        new Promise( resolve => {
          new THREE.FontLoader().load('/helvetiker_bold.typeface.json', _f2 => {
            resolve(_f2)
          })
        }),
        new Promise( resolve => {
          /*new THREE.TextureLoader().load(require('@/images/equirectangular.png'), texture => {
            var cubemapGenerator = new THREE.EquirectangularToCubeGenerator( texture, { resolution: 512 } );
					  var pngBackground = cubemapGenerator.renderTarget;
					  var cubeMapTexture = cubemapGenerator.update( renderer );
					  var pmremGenerator = new THREE.PMREMGenerator( cubeMapTexture );
					  pmremGenerator.update( renderer );
					  var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
					  pmremCubeUVPacker.update( renderer );
					  let pngCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
					  texture.dispose();
					  pmremGenerator.dispose();
					  pmremCubeUVPacker.dispose();				
            resolve(pngCubeRenderTarget)*/
          
            resolve();
          
        }),
      ]
    )

    let font1 = fonts[0]
    let font2 = fonts[1]
    let envMap = fonts[2];

    
    let text_material = new THREE.MeshStandardMaterial({      
      color: '#FF0000'     
    })

    let text_material2 = new THREE.MeshStandardMaterial({      
      color: '#0000ff'     
    })

    let text_material3 = new THREE.MeshStandardMaterial({      
      color: '#00ff00'     
    })

    // p_group
    ;(function(){
      let group = new THREE.Group();
      let mesh = new THREE.Mesh( makeTextGeo('Player',font1,4), text_material2 )
      let mesh2 = new THREE.Mesh( makeTextGeo('Win',font1,4), text_material2 )
      mesh.position.y = 2.2
      mesh2.position.y = -2.2
      group.add(mesh);
      group.add(mesh2);
      group.rotation.z = Math.PI
      group.visible = false;
      matrix.add(group);      

      group.position.x = -18
      group.position.y = 7

      game.winners.player = group;
      
    })()

    // b_group
    ;(function(){
      let group = new THREE.Group();
      let mesh = new THREE.Mesh( makeTextGeo('Banker',font1,4), text_material )
      let mesh2 = new THREE.Mesh( makeTextGeo('Win',font1,4), text_material )
      mesh.position.y = 2.2
      mesh2.position.y = -2.2
      
      group.add(mesh);
      group.add(mesh2);
      //group.lookAt(camera.position.x,camera.position.y,camera.position.z)
      group.visible = false;
      matrix.add(group);
      group.position.x = 18
      group.position.y = 7

      game.winners.banker = group;
    })();

    ;(function(){
      let group = new THREE.Group();
      let mesh = new THREE.Mesh( makeTextGeo('Tie',font1,4), text_material3)            
      
      group.add(mesh);      
      //group.lookAt(camera.position.x,camera.position.y,camera.position.z)
      group.visible = false;
      matrix.add(group);
      
      group.position.y = 7
      game.winners.tie = group;
    })();

  
  })();
}