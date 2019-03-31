import obj1 from '!!raw-loader!@/js/obj1.obj';
import obj2 from '!!raw-loader!@/js/obj2.obj';
import obj3 from '!!raw-loader!@/js/obj3.obj';
import obj4 from '!!raw-loader!@/js/obj4.obj';
import obj5 from '!!raw-loader!@/js/obj5.obj';

export default function(opt){

  const { vue, THREE, _resources_, resizeUpdate, scene, forIntersect } = opt
  const width = vue.resolution.width
  const height = vue.resolution.height
  let betZones = this.betZones;
  const betBoard = new THREE.Group();

  const objLoader = new THREE.OBJLoader();
  let o1 = objLoader.parse(obj1)
  o1.position.set( -40.9165,9.79363,0 )    
  o1.rotation.z =  THREE.Math.degToRad( -29.015 )
  betBoard.add( o1 )  
  let o2 = objLoader.parse(obj2)
  o2.position.set( -20.8671,3.17054,0 )    
  o2.rotation.z =  THREE.Math.degToRad( -12.9194 )
  betBoard.add( o2 )
  let o3 = objLoader.parse(obj3)
  betBoard.add( o3 )
  let o4 = objLoader.parse(obj4)
  o4.position.set( 20.8671,3.17054,0 )    
  o4.rotation.z =  THREE.Math.degToRad( 12.9194 )
  betBoard.add( o4 )
  let o5 = objLoader.parse(obj5)
  o5.position.set( 40.9165,9.79363,0 )    
  o5.rotation.z =  THREE.Math.degToRad( 29.015 )
  betBoard.add( o5 );  
  
  [o1,o2,o3,o4,o5].forEach((t, i)=>{
    // 색제어를 위한 캐시배열
    t.userData.toChangeRGB = [];
    t.userData.changeRGB = (c) => {
      for (let o of t.userData.toChangeRGB) {
        o.material.color.set(c)
      }
    }
    t.userData.restoreRGB = () => {
      for (let o of t.userData.toChangeRGB) {
        o.material.color.copy(o.userData.originalColor)
      }
    }
    let mesh = t.children.find(t=> /inner/.test(t.name))    
    mesh.userData.index = i;
    mesh.name = `betzone_${i}`;
    mesh.material.color.setStyle('#FFFFFF')    
    mesh.material.map =  _resources_.textures.betting_zone;
    mesh.material.blending = THREE.MultiplyBlending
    mesh.material.polygonOffset = true;
    mesh.material.polygonOffsetFactor = 3;
    mesh.material.needsUpdate = true;
    betZones.push(mesh)

    let outter = t.children.find(t=> /outter/.test(t.name))
    t.userData.toChangeRGB.push(outter)
    outter.material.color.setStyle('#CCCCCC')
    outter.userData.originalColor = outter.material.color.clone();

      


            
  })



  betBoard.scale.set(0.9,0.9,0.9)
  scene.add(betBoard);

  


  return;

   // let _matLine = new THREE.LineMaterial({
    //    color: 0xAAAAAA,
    //    linewidth: 2, // in pixels        
    //    dashed: false,
    //});

   // _matLine.resolution.set(width, height);    

    const RoundedRectangle = function (width, height, radius) {
        let ctx = new THREE.Shape();
        let x = -width / 2
        let y = -height / 2
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.autoClose = true;      
    return ctx;
    }

    let _r1 = RoundedRectangle(10, 16, 0.8),
    _r2 = RoundedRectangle(13, 16, 0.8);

    let _positions = [],
    _positions2 = [];

    
    for(let a of _r1.getPoints()){
        _positions.push(a.x, a.y, 0)    
    }

    _r2.getPoints().forEach(a => {
      _positions2.push(a.x, a.y, 0)
    });


    let _pl_mt = new THREE.MeshBasicMaterial({
      color: 0xffffff,//e2ecf2,
      blending: 4,
      map: _resources_.textures.betting_zone
    })       

    let _pl_g1 = new THREE.ShapeGeometry(_r1);
    let _pl_g2 = new THREE.ShapeGeometry(_r2);    
    _pl_g1.computeBoundingBox();
    _pl_g2.computeBoundingBox();

    let max = _pl_g1.boundingBox.max
    let min = _pl_g1.boundingBox.min
    
    let offset = new THREE.Vector2(0 - min.x, 0 - min.y)
    let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    let faces = _pl_g1.faces;

    _pl_g1.faceVertexUvs[0] = [];

    for (let j = 0; j < faces.length; j++) {

      var v1 = _pl_g1.vertices[faces[j].a],
        v2 = _pl_g1.vertices[faces[j].b],
        v3 = _pl_g1.vertices[faces[j].c];

        _pl_g1.faceVertexUvs[0].push([
        new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
        new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
        new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
      ]);

    }
    _pl_g1.uvsNeedUpdate = true;



    let _pl_m1 = new THREE.Mesh(_pl_g1, _pl_mt);
    let _pl_m2 = new THREE.Mesh(_pl_g2, _pl_mt);
    _pl_m1.userData.type = "plane"
    _pl_m1.name = "zone"
    _pl_m2.name = "zone"
    _pl_m2.userData.type = "plane"

//    let _geo = new THREE.LineGeometry(),
//      _geo2 = new THREE.LineGeometry();
//    _geo.setPositions(_positions)
 //   _geo2.setPositions(_positions2)

    //var _line = new THREE.Line2(_geo, _matLine),
    //  _line2 = new THREE.Line2(_geo2, _matLine);
    //_line.computeLineDistances();
    //_line2.computeLineDistances();
    
   // _line.name = "border"
    //_line2.material = _line2.material.clone()
    //_line2.name = "border"

    let _group = new THREE.Group();    
    //_group.add(_line);
    _group.add(_pl_m1);    
    _group.name = 'bet_2'
    betZones[2] = _group;

    let _group2 = new THREE.Group();
   // _group2.add(_line2)
    _group2.add(_pl_m2)
    _group2.position.x = 13.5;
    _group2.name = 'bet_3'
    betZones[3] = _group2;
    _group2.rotation.z = Math.PI / 24
    _group2.position.y = 1

    for( let i of [1,4,0] ){
        let gr = new THREE.Group()
        gr.name = `bet_${i}`
        //let li = _line2.clone();
        //li.material = li.material.clone()
        //li.name = 'border'        
       // gr.add(li)
        gr.add(_pl_m2.clone())
        betZones[i] = gr

        if(i == 1){
            gr.position.x = _group2.position.x * -1
            gr.position.y = _group2.position.y
            gr.rotation.z = _group2.rotation.z * -1
        }else if(i == 4){
            gr.position.x = _group2.position.x + 15;            
            gr.position.y = 4.4
            gr.rotation.z = Math.PI / 10
        }else if(i == 0){
            gr.position.x = (_group2.position.x + 15) * -1;
            gr.position.y = 4.4
            gr.rotation.z = -1 * Math.PI / 10
        }
    }

      betZones = betZones.map((t, i) => {      
      let a = (t.getObjectByProperty('name', 'zone'))
      a.userData.index = i;      
      scene.add(t);

      t.userData.toChangeRGB = []
      t.children.forEach(child => {
        if(child !== a) t.userData.toChangeRGB.push(child)
      })

     // t.userData.originalRGB = t.userData.toChangeRGB[0].material.color.clone();
      t.userData.changeRGB = (c) => {
        for (let o of t.userData.toChangeRGB) {
          o.material.color.set(c)
        }
      }
      t.userData.restoreRGB = () => {
        for (let o of t.userData.toChangeRGB) {
          o.material.color.copy(t.userData.originalRGB)
        }
      }

      if (i > 0) {
        //a.material = a.material.clone();
      }
      a.name = `betzone_${i}`;      
      
      return a
    })

    this.betZones = betZones    
    forIntersect.betting_zone = betZones
}