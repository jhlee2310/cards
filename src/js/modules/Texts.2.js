export default function(opt){
  const { THREE, camera, scene, _resources_ } = opt;

  //var directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
  let pointLight = new THREE.PointLight('#FFFFFF',1)
  pointLight.position.copy(camera.position)
  pointLight.layers.set(1)
  scene.add(pointLight)
  
  const matrix = new THREE.Group();
  matrix.lookAt(camera.position.x,camera.position.y,camera.position.z)
  matrix.position.copy(camera.target)  
  scene.add(matrix)

  const makeTextGeo = (txt,ft,size) => {
    let geometry = new THREE.TextGeometry(txt,{
      font: ft,
      size: size,
      height: 0.1,
      curveSegments: 6,
      bevelEnabled: false,
      //bevelThickness: 0.4,
		  //bevelSize: 0.16,
      //bevelSegments: 2
    });

    geometry.computeBoundingBox();
    let box = geometry.boundingBox;
    let trans = box.max.clone().sub(box.min);
    geometry.translate( -trans.x/2, -trans.y/2, -trans.z/2 )

    return geometry;
  }
  
  _resources_.winners = {};
  ;(async() => {
    const fonts = await Promise.all(
      [
        new Promise( resolve => {
          new THREE.FontLoader().load('/brushScript.json', _f1 => {
            resolve(_f1)
          })
        }),
        /*
        new Promise( resolve => {
          new THREE.FontLoader().load('/helvetiker_bold.typeface.json', _f2 => {
            resolve(_f2)
          })
        }),
        new Promise( resolve => {
          //new THREE.TextureLoader().load(require('@/images/equirectangular.png'), texture => {
            new THREE.TextureLoader().load(require('@/images/metal.jpg'), texture => {
            texture.mapping = THREE.SphericalReflectionMapping;
            texture.encoding = THREE.sRGBEncoding;
            resolve(texture)
          })
        }),*/
      ]
    )

    let font1 = fonts[0]
    //let font2 = fonts[1]
    //let envMap = fonts[2];

    
    let text_material = new THREE.MeshPhongMaterial({      
      color: '#FF0000',
     // envMap: envMap,
    })

    let text_material2 = new THREE.MeshPhongMaterial({      
      color: '#0000ff',
      //envMap: envMap, 
    })

    let text_material3 = new THREE.MeshPhongMaterial({      
      color: '#00ff00'     
    })

    //console.log(text_material2)

    // p_group
    ;(function(){
      let group = new THREE.Group();
      let mesh = new THREE.Mesh( makeTextGeo('Player',font1,4), text_material2 )
      let mesh2 = new THREE.Mesh( makeTextGeo('Win!',font1,4), text_material2 )
      mesh.layers.set(1)
      mesh2.layers.set(1)
      mesh.position.y = 2.2
      mesh2.position.y = -2.2
      group.add(mesh);
      group.add(mesh2);
      //group.rotation.z = Math.PI
      group.visible = false;
      matrix.add(group);      

      group.position.x = -18
      group.position.y = 7

      _resources_.winners.player = group;
      
    })()

    // b_group
    ;(function(){
      let group = new THREE.Group();
      let mesh = new THREE.Mesh( makeTextGeo('Banker',font1,4), text_material )
      let mesh2 = new THREE.Mesh( makeTextGeo('Win!',font1,4), text_material )
      mesh.position.y = 2.2
      mesh2.position.y = -2.2
      mesh.layers.set(1)
      mesh2.layers.set(1)
      
      group.add(mesh);
      group.add(mesh2);
      //group.lookAt(camera.position.x,camera.position.y,camera.position.z)
      group.visible = false;
      matrix.add(group);
      group.position.x = 18
      group.position.y = 7

      _resources_.winners.banker = group;
    })();

    ;(function(){
      let group = new THREE.Group();
      let mesh = new THREE.Mesh( makeTextGeo('Tie',font1,4), text_material3)            
      mesh.layers.set(1)
      group.add(mesh);      
      //group.lookAt(camera.position.x,camera.position.y,camera.position.z)
      group.visible = false;
      matrix.add(group);
      
      group.position.y = 7
      _resources_.winners.tie = group;
    })();

  
  })();
}