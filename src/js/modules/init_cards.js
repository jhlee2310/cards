export default function init_cards(textureLoader){
    const card_shape = new THREE.Shape();
    const card_groups = this.card_groups

    card_shape.autoClose = true;
    (function (ctx, width, height, radius) {
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
    })(card_shape, 8, 12.8, 0.45);

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

    // 카드 재질 정의
    const card_mat = {
      front: new THREE.MeshPhongMaterial({
        color: 0xffffff
      }),
      middle: new THREE.MeshBasicMaterial({
        color: 0x777777, side: THREE.BackSide
      }),
      back: new THREE.MeshPhongMaterial({
        color: 0xffffff
      }),
    }

    textureLoader.load(require('@/images/backside.jpg'), tex => {
      card_mat.back.map = tex;
      card_mat.back.needsUpdate = true;
    })
    let imgcnt = 0;

    for (let i = -1; i <= 1; i += 2) {
      let group = new THREE.Group()
      group.name = (i == -1) ? 'card_group_player' : 'card_group_banker'

      for (let j = -1; j <= 3; j += 2) {
        let mesh = new THREE.Mesh(card_geometry, [
          card_mat.front.clone(),
          card_mat.middle,
          card_mat.back
        ]);
        mesh.name = `card_${imgcnt}`
        mesh.userData.parent_type = (i == -1) ? 'player' : 'banker'      
        
        if (j != 3) { //히든카드가 아닐경우
          mesh.position.x = j * 4.5
          mesh.userData.isHidden = false;
          mesh.rotation.y = Math.PI
        } else {
          mesh.rotation.z = Math.PI / 2
          mesh.rotation.x = Math.PI
          mesh.position.y = 2.2
          mesh.position.x = i * 16
          mesh.userData.isHidden = true;
          //mesh.position.z = 1
          //mesh.renderOrder = 999;                
          //mesh.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        }


        //mesh.visible = false;

        group.add(mesh);
        o.push(mesh)

        if (i == -1) {
          card_groups.player = group
        } else {
          card_groups.banker = group
        }
      }




      //mesh.rotation.x = Math.PI;        
      group.position.x = i * 12
      group.position.y = 22

      scene.add(group)
    }
  }