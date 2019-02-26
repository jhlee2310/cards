import * as THREE from 'three-full'

const e = function (opt) {

  this.resizeUpdate = {
    matLines: []
  }
  const {
    vue,
    el,
    TWEEN
  } = opt
  const clock = new THREE.Clock()
  let cont = this.cont = document.querySelector(el)
  let width = cont.clientWidth
  let height = cont.clientHeight


  this.intersects = null;
  const raycaster = new THREE.Raycaster();
  const mouseVector = new THREE.Vector3();
  const forIntersect = {
    betting_zone: [],
    coins: []
  };
  this.switch = {
    betting: false,
  }
  this.temp = {
    clicked_coin: null,
  }

  // 배팅용 5개 zone Mesh가 담기는 배열
  this.betZones = []
  let betZones = this.betZones;

  function getIntersects(targets) {
    raycaster.setFromCamera(mouseVector, camera);
    if (targets instanceof Array) {
      return raycaster.intersectObjects(targets, true);
    } else {
      return raycaster.intersectObject(targets, true);
    }
  }

  let selectedObject = null
  this.onMouseClick = function (e) {
    if (selectedObject.type == "Sprite") {
      selectedObject.userData.originalScale = new THREE.Vector3()
      selectedObject.userData.originalScale.copy(selectedObject.scale)
      selectedObject.scale.set(6, 6, 1)
      this.temp.clicked_coin = selectedObject;
      this.switch.betting = true;
    } else {
      if (selectedObject.type == "Mesh") {
        bet(this.temp.clicked_coin, selectedObject)
      }
    }
  }

  this.onMouseMove = function (e) {

    e.preventDefault();

    let x = (e.layerX / width) * 2 - 1;
    let y = -(e.layerY / height) * 2 + 1;
    mouseVector.set(x, y, 10);
    let targets = [];

    if (y > -0.57) {
      targets = forIntersect.betting_zone
    } else {
      targets = forIntersect.coins
    }

    if (selectedObject) {
      selectedObject.material.color.set('#FFFFFF')
      selectedObject = null
    }

    let intersects = getIntersects(targets);

    if (intersects.length > 0) {
      var res = intersects.filter(function (res) {
        return res && res.object;
      })[0];
      if (res && res.object) {
        selectedObject = res.object;
        selectedObject.material.color.set('#690');
      }
    }

  }

  let scene = this.scene = new THREE.Scene();
  let camera = this.camera = new THREE.PerspectiveCamera(30, cont.clientWidth / cont.clientHeight, 0.1, 1000);
  let renderer = this.renderer = new THREE.WebGLRenderer({
    //alpha:true,
    antialias: true,
    autoClearDepth: false
  });

  let o = [];
  const textureLoader = new THREE.TextureLoader();


  window.o = o;
  window.THREE = THREE;
  window.camera = camera;
  window.scene = scene;
  window.renderer = renderer;

  renderer.setSize(cont.clientWidth, cont.clientHeight);
  cont.appendChild(renderer.domElement);
  camera.position.z = 120;
  //camera.position.y = -80;
  camera.lookAt(0, 0, 0)

  //const renderPass = new THREE.RenderPass( scene, camera );
  //const fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
  //fxaaPass.renderToScreen = true;


  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.z = 10
  scene.add(directionalLight);

  //const composer1 = new THREE.EffectComposer( renderer );
  //composer1.addPass( renderPass );
  //composer1.addPass( fxaaPass );
  let table = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
    color: 0xffffff,
  }))
  textureLoader.load(require('@/images/table.jpg'), tex => {
    table.material.map = tex;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    table.material.needsUpdate = true;
  })

  table.name = "table"
  table.position.z = -10
  table.scale.set(96, 66, 1)



  scene.add(table)

  // 카드 형태 생성

  const card_shape = new THREE.Shape();
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
  })(card_shape, 8, 12.8, 0.8);

  const card_geometry = new THREE.ExtrudeGeometry(card_shape, {
    depth: 0.2,
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
  let min = card_geometry.boundingBox.min;
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
  
  // 카드 형태 생성
  this.card_groups = {
    player: null,
    banker: null,
  }
  const card_groups = this.card_groups

  // 카드 재질 정의
  const card_mat = {
    front: new THREE.MeshBasicMaterial({
      color: 0xffffff
    }),
    middle: new THREE.MeshBasicMaterial({
      color: 0x000000
    }),
    back: new THREE.MeshBasicMaterial({
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

  //배팅판
  var _matLine = new THREE.LineMaterial({
    color: 0xffffff,
    linewidth: 3, // in pixels        
    dashed: false
  });
  _matLine.resolution.set(width, height);

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


  // betZones
  {
    let _r1 = RoundedRectangle(10, 16, 0.8),
      _r2 = RoundedRectangle(13, 16, 0.8);

    let _positions = [],
      _positions2 = [];
    _r1.getPoints().forEach(a => {
      _positions.push(a.x, a.y, 0)
    });
    _r2.getPoints().forEach(a => {
      _positions2.push(a.x, a.y, 0)
    });


    let _pl_mt = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.3,
      transparent: true,
      depthTest: false
    })
    let _pl_g1 = new THREE.ShapeBufferGeometry(_r1),
      _pl_g2 = new THREE.ShapeBufferGeometry(_r2)
    let _pl_m1 = new THREE.Mesh(_pl_g1, _pl_mt),
      _pl_m2 = new THREE.Mesh(_pl_g2, _pl_mt.clone())
    _pl_m1.position.z = _pl_m2.position.z = -0.2

    let _geo = new THREE.LineGeometry(),
      _geo2 = new THREE.LineGeometry();

    _geo.setPositions(_positions)
    _geo2.setPositions(_positions2)

    var _line = new THREE.Line2(_geo, _matLine),
      _line2 = new THREE.Line2(_geo2, _matLine);
    _line.computeLineDistances();
    _line2.computeLineDistances();

    let _group = new THREE.Group(),
      _group2 = new THREE.Group();
    _group.add(_line)
    _group.add(_pl_m1);
    _group.position.z = -3
    _group2.add(_line2)
    _group2.add(_pl_m2)
    _group2.position.x = 15;
    _group2.position.z = -5
    _group.name = 'bet_2'
    betZones[2] = _group;
    _group2.name = 'bet_3'
    betZones[3] = _group2;
    scene.add(_group)
    scene.add(_group2)
    _group2.rotation.z = Math.PI / 36
    _group2.position.y = 0.8
    let _group3 = _group2.clone()
    _group3.name = 'bet_1'
    betZones[1] = _group3;
    _group3.position.x = _group2.position.x * -1
    _group3.rotation.z = _group2.rotation.z * -1
    let _group4 = _group2.clone()
    _group4.name = 'bet_4'
    betZones[4] = _group4;
    _group4.position.x = _group2.position.x + 16;
    _group4.position.y = 3
    _group4.rotation.z = Math.PI / 16
    let _group5 = _group4.clone()
    _group5.name = 'bet_0'
    betZones[0] = _group5;
    _group5.position.x = _group4.position.x * -1;
    _group5.rotation.z = _group4.rotation.z * -1

    betZones = betZones.map((t, i) => {
      scene.add(t);
      let a = (t.getObjectByProperty('type', 'Mesh'))
      a.userData.index = i;

      if (i > 0) {
        a.material = a.material.clone();
      }
      a.name = `betzone_${i}`;
      return a
    })

    forIntersect.betting_zone = betZones
  }

  //sprites
  this.group_buy_sprite = [];

  {
    const group_sprite = new THREE.Group()
    let cnt = 0;
    for (let i of [4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      let names = [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000];
      let spriteMap = new textureLoader.load(require(`@/images/chips/bet${i}__.png`));
      let spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      sprite.name = names[cnt];
      sprite.userData.index = cnt;
      sprite.scale.set(4.8, 4.8, 1)
      sprite.position.x = cnt++ * 7
      group_sprite.add(sprite);
    }

    group_sprite.position.x = -(cnt - 1) * 7 / 2
    group_sprite.position.y = -22
    group_sprite.position.z = 0
    forIntersect.coins = group_sprite
    scene.add(group_sprite)

    for (let i of [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000]) {
      let spriteMap = textureLoader.load(require(`@/images/chips/buy${i}_.png`));
      let sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff
      }));
      sprite.scale.set(2.6, 2.6)
      this.group_buy_sprite.push(sprite)
    }
  }

  const show_bet = (cont, p, q) => {
    let target;
    let zones = [];
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        zones.push(new THREE.Vector3(x, y, 0))
      }
    }
    if (typeof cont == 'number') {
      switch (cont) {
        case 1:
          target = _group5;
          break;
        case 2:
          target = _group3
          break;
        case 3:
          target = _group
          break;
        case 4:
          target = _group2
          break;
        case 5:
          target = _group4
          break;
      }
    } else {
      target = cont
    }

    let z = Math.floor(Math.random() * 9)
    let coins = new THREE.Group();
    coins.position.copy(zones[z].multiplyScalar(3.8))
    let coin = this.group_buy_sprite[`buy_${p}`]
    for (let i = 0; i < q; i++) {
      coin = coin.clone()
      coin.position.x = (Math.random() - 0.5) * 0.7 + (i * 0.05)
      coin.position.y = i * 0.14
      coins.add(coin)
    }
    target.add(coins)
  }


  //세부 영역 정의
  const definedZones = [];
  this.definedZones = definedZones;
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      const v = new THREE.Vector3(x, y, 0)
      v.multiplyScalar(3.8)
      definedZones.push(v)
    }
  }

  const do_bet = (target, sprite, zone) => {
    let coins = target.getObjectByName('mycoins');
    if (!coins) {
      coins = new THREE.Group()
      coins.name = 'mycoins'
      coins.position.copy(definedZones[zone])
      target.add(coins)
    }

    let index = sprite.userData.index;
    let coin = this.group_buy_sprite[index]

    coin = coin.clone()
    coin.position.x = (Math.random() - 0.5) * 0.7 + (coins.children.length * 0.05)
    coin.position.y = coins.children.length * 0.14
    coin.position.z = coins.children.length * 0.05
    coins.add(coin)

  }

  this.changeCardsMtl = function (p_data, b_data) {
    [p_data, b_data].forEach((card_data, i) => {
      let cards = (i == 0) ? card_groups['player'].children : card_groups['banker'].children
      card_data.forEach((card, i) => {
        let c = cards[i];
        textureLoader.load(require(`@/images/cards/${card.suit.toLowerCase()}${(card.number+'').toLowerCase()}.png`), texture => {
          texture.minFilter = texture.magFilter = THREE.LinearFilter;
          c.material[0].map = texture
          c.material[0].needsUpdate = true;
        })
      })
    })
  }

  this.animateCards = function(p_data, b_data) {
    const p_cards = card_groups['player'].children
    const b_cards = card_groups['banker'].children
    const whole_cards = [...p_cards,...b_cards]    
    const ord_cards = [
      whole_cards[0],
      whole_cards[3],
      whole_cards[1],
      whole_cards[4],      
    ]
    if(p_data.length == 3) ord_cards.push(whole_cards[2])
    if(b_data.length == 3) ord_cards.push(whole_cards[5])

    card_groups.p_startVector = card_groups['player'].worldToLocal(new THREE.Vector3(0,40,0))
    card_groups.b_startVector = card_groups['banker'].worldToLocal(new THREE.Vector3(0,40,0))

    //초기화
    whole_cards.forEach(function (card, value) {
        card.visible = false
        if (!card.userData.original_position) {
          card.userData.original_position = card.position.clone()
          card.userData.original_rotation = card.rotation.clone()
        }
        card.position.copy( (card.userData.parent_type == 'player') ? card_groups.p_startVector : card_groups.b_startVector)
        card.rotation.z = 0;
    });
    
    const duration = {}
    let duration_move = 180
    let duration_delay = 300
    let duration_rot = 300    
    let duration_delay2 = 500
    duration.before_reset = 8000;
    const init = () => {
      console.log('철수완료');
      for(let card of whole_cards){
        card.visible = false
        card.position.copy(card.userData.original_position)
        card.rotation.copy(card.userData.original_rotation)
      }
    }

    const reset = async() => {
      await new Promise(resolve => {
        setTimeout(resolve, duration.before_reset)
      })

      //카드 철수
      const reset_generator = function*(){
        for(let card of ord_cards){
          yield new Promise(resolve => {
            new TWEEN.Tween({
              x: card.position.x,
              y: card.position.y,
              z: card.position.z,
              rotX: card.rotation.x,
              rotY: card.rotation.y,
              rotZ: card.rotation.z
            })
            .to({
              x: -350,
              y: -200,
              z: 0,
              rotX: 0,
              rotY: 0,
              rotZ: 0
            })
            .onUpdate(a => {
              card.position.set(a.x,a.y,a.z)
              card.rotation.set(a.rotX,a.rotY,a.rotZ)
            })
            .onComplete(() => {
              resolve();          
            })
            .start()
          })
        }
      }

      const g = reset_generator();
      
      new Promise(resolve => {
        let q = setInterval( () => {
          let next = g.next()
          if( next.done ) {
            clearInterval(q)
            setTimeout(resolve,1500)            
          }
        }, 110)
      }).then(init)
        
    };

    ;(async () => {
      for(let card of ord_cards) {
        card.visible = true;
        await new Promise(resolve => {
          new TWEEN.Tween({
            x: card.position.x,
            y: card.position.y,
            z: card.position.z,
            rotZ: card.rotation.z
          })
          .to({
            x: card.userData.original_position.x,
            y: card.userData.original_position.y,
            z: card.userData.original_position.z,
            rotZ: card.userData.original_rotation.z,            
          }, duration_move)
          //.easing(this.typeA)
          .onUpdate(a => {
            card.position.set(a.x,a.y,a.z)
            if(card.userData.isHidden) card.rotation.z = a.rotZ
          })
          .onComplete(() => {
            resolve();          
          })
          .start()
        })

        await new Promise(resolve => {
          setTimeout(resolve, duration_delay)
        })

        await new Promise(resolve => {
          new TWEEN.Tween({
            rot: card.rotation[card.userData.isHidden ? 'x' : 'y'],
          })
          .to({
            rot: 0,
          }, duration_rot)
          //.easing(this.typeA)
          .onUpdate(a => {
            card.rotation[ card.userData.isHidden ? 'x' : 'y'] = (a.rot)
          })
          .onComplete(() => {
            resolve();          
          })
          .start()
        })

        await new Promise(resolve => {
          setTimeout(resolve, duration_delay2)
        })
      }
    })().then(reset)
  }

  // betting target 정의
  const saveZone = [null, null, null, null, null]

  function bet(sprite, target) {
    let zone;
    let index = target.userData.index
    if (!saveZone[index]) {
      saveZone[index] = Math.floor(Math.random() * 9)
    }
    zone = saveZone[index];

    do_bet(target, sprite, zone)
  }



  animate();

  function animate(time) {
    TWEEN.update(time)
    renderer.render(scene, camera)
    requestAnimationFrame(animate)

  }


}

export default e