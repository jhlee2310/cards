export default function(){
    const { scene, camera, THREE, betted_coins, _resources_ } = this;

    let geometry = new THREE.CircleGeometry( 1.48, 16 );
    let vts = geometry.vertices;
    var circleShape = new THREE.Shape();
    circleShape.autoClose = true;
   
    circleShape.moveTo(vts[1].x, vts[1].y);
    for(let i = 2; i < geometry.vertices.length; i++){    
      circleShape.lineTo(vts[i].x, vts[i].y);
    }    

    var extrudeSettings = { 
      depth : 0.2,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.1,
    };  
   
    var geo = new THREE.ExtrudeGeometry( circleShape, extrudeSettings );
    
    geo.groupsNeedUpdate = true;
    geo.computeBoundingBox();   
    let max = geo.boundingBox.max
    let min = geo.boundingBox.min

    geo.vertices.forEach(a=>{
      a.z = a.z + (-1 * min.z)
    })

    geo.verticesNeedUpdate = true;
    
    geo.computeBoundingBox();
    max = geo.boundingBox.max
    min = geo.boundingBox.min


    max.x *= 1
    min.x *= 1
    max.y *= 1
    min.y *= 1  
   
   let offset = new THREE.Vector2(0 - min.x, 0 - min.y)
   let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
   let faces = geo.faces;
   geo.faceVertexUvs[0] = [];
   for (let j = 0; j < faces.length; j++) {
      var v1 = geo.vertices[faces[j].a],
        v2 = geo.vertices[faces[j].b],
        v3 = geo.vertices[faces[j].c];

      geo.faceVertexUvs[0].push([
        new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
        new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
        new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
      ]);

   }
   geo.uvsNeedUpdate = true;

  let index = 0;
  const values = [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000]

  for (let i of [4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    let map = _resources_.textures.chips[index]
    let mesh = new THREE.Mesh( geo, [
      new THREE.MeshPhongMaterial({
        map: map,
        shininess: 80

      }),
      new THREE.MeshPhongMaterial({
        map: map,
        shininess: 80

      }),
    ]);
    
    //mesh.castShadow = true;
    mesh.material.flatShading = false
    mesh.material[1].shading = THREE.SmoothShading;
    mesh.geometry.computeVertexNormals()
    mesh.userData.value = values[index];
    index++;
    
    betted_coins.push(mesh)
  }
 
  let a = new THREE.PlaneGeometry(4.1,4.1)
  let b = new THREE.Mesh(a,new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: _resources_.textures.shadow,
    blending: THREE.MultiplyBlending,
    polygonOffset: true,
    polygonOffsetFacetor:2,
  }))  
  
  betted_coins.push(b);
  
}