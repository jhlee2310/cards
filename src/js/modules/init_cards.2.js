export default function init_cards(opt){
  const { THREE, _resources_,scene } = opt;

    const card_shape = new THREE.Shape();
    card_shape.autoClose = true;
    const card_groups = _resources_.card_groups
    const whole_cards = [];
    
    
    const round_ractangle = function (ctx, width, height, radius) {
      let x = width / 2 * -1,
        y = height / 2 * -1
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, y + height - radius);
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
      ctx.lineTo(x + width - radius, y + height);
      ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
      ctx.lineTo(x + width, y + radius);
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
      ctx.lineTo(x + radius, y);
      ctx.quadraticCurveTo(x, y, x, y + radius);
    }
    //card shape
    round_ractangle(card_shape, 8, 12.8, 0.45)

    const card_geometry = new THREE.ExtrudeGeometry(card_shape, {
      depth: 0.001,
      bevelEnabled: false
    });
    card_geometry.faces.filter(a => {
      return a.materialIndex == 0 && a.normal.z < 0
    }).forEach(a => {
      a.materialIndex = 2
    })
    card_geometry.groupsNeedUpdate = true;    
    card_geometry.computeBoundingBox();
    let max = card_geometry.boundingBox.max
    let min = card_geometry.boundingBox.min
    max.x *= 1.050
    min.x *= 1.050
    max.y *= 1.050
    min.y *= 1.050
    
    let offset = new THREE.Vector2(0 - min.x, 0 - min.y)
    let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    let faces = card_geometry.faces;

    card_geometry.faceVertexUvs[0] = [];

    for (let j = 0; j < faces.length; j++) {

      var v1 = card_geometry.vertices[faces[j].a],
        v2 = card_geometry.vertices[faces[j].b],
        v3 = card_geometry.vertices[faces[j].c];

      card_geometry.faceVertexUvs[0].push([
        new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
        new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
        new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
      ]);

    }
    card_geometry.uvsNeedUpdate = true;
    card_geometry.translate(4,0,0)


    // 카드 재질 정의
    const card_mat = {
      front: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        polygonOffset: true,
        polygonOffsetFactor: 0.3,
      }),
      middle: new THREE.MeshBasicMaterial({
        color: 0x777777, side: THREE.BackSide
      }),
      back: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: _resources_.textures.cards.back
      }),
    }

    let imgcnt = 0;

    for (let i = -1; i <= 1; i += 2) {
      let group = new THREE.Group()
      group.name = (i == -1) ? 'card_group_player' : 'card_group_banker'
      //mesh.rotation.x = Math.PI;        
      group.position.x = i * 12
      group.position.y = 22

      scene.add(group)

      for (let j = -1; j <= 3; j += 2) {
        let mesh = new THREE.Mesh(card_geometry, [
          card_mat.front.clone(),
          card_mat.middle,
          card_mat.back
        ]);
        mesh.name = `card_${imgcnt}`
        mesh.visible = false;
        mesh.userData.parent_type = (i == -1) ? 'player' : 'banker'
        mesh.userData.type = 'card';
        
        if (j != 3) { //히든카드가 아닐경우
          mesh.position.x = (j * 4.5) + 4 
          mesh.userData.isHidden = false;
          mesh.rotation.y = Math.PI
        } else {
          mesh.rotation.z = Math.PI / 2
          mesh.rotation.x = Math.PI
          mesh.position.y = 6.2
          mesh.position.x = (i * 16)
          mesh.userData.isHidden = true;
          //mesh.position.z = 1
          //mesh.renderOrder = 999;                
          //mesh.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        }
        
        mesh.userData.init_position = mesh.position.clone()
        mesh.userData.init_rotation = mesh.rotation.clone()
        console.log(mesh.position)
        //mesh.visible = false;

        group.add(mesh);
        whole_cards.push(mesh)        
      }
      if (i == -1) {
        card_groups.player = group
        _resources_.cards.player = group.children.filter(t=>{
          return t.userData.type == 'card'
        })
      } else {
        card_groups.banker = group
        _resources_.cards.banker = group.children.filter(t=>{
          return t.userData.type == 'card'
        })
      }
    }

    //card holder shape
    const holder_shape = new THREE.Shape();
    card_shape.autoClose = true;    
    round_ractangle(holder_shape, 8, 12.8, 0.45)
    let _matLine = new THREE.LineMaterial({
      color: 0xAAAAAA,
      linewidth: 1, // in pixels
      dashed: false,
    });    

    _matLine.resolution.set(5000, 5000);

    let _geo = new THREE.LineGeometry();
    let holder_geo = new THREE.ShapeGeometry(holder_shape)
    let holder_mesh = new THREE.Mesh(holder_geo, new THREE.MeshBasicMaterial({
      color: 0xEEEEEE,
      blending: 4,
      map: _resources_.textures.betting_zone      
    }));
    const _positions = []

    for(let a of holder_shape.getPoints()){
      _positions.push(a.x, a.y, 0)    
    }
    _geo.setPositions(_positions)     
    
    whole_cards.forEach( (card,i) =>{
      let holder = new THREE.Line2(_geo, _matLine);
      holder.computeLineDistances();
      holder.position.copy(card.position)
      holder.rotation.z = card.rotation.z
      holder.position.z = -0.05;
      holder.position.x -= (i != 2 && i != 5) ? 4 : 0
      holder.position.y -= (i == 2 || i == 5) ? 4 : 0

      let clone_mesh = holder_mesh.clone()            
      clone_mesh.position.copy(holder.position)
      clone_mesh.rotation.copy(holder.rotation)
      card.parent.add(clone_mesh)
      card.parent.add(holder)      
    })
  }