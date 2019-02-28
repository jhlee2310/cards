import * as THREE from 'three-full'
import init_cards from './modules/init_cards' // 카드 세팅
import init_betting_zone from './modules/init_betting_zone' // 배팅존 세팅
import pos_coins_for_bet from './modules/pos_coins_for_bet' // 배팅UI
import cards_animations from './modules/cards_animations' // 카드애니메이션
import init_betted_coin from './modules/init_betted_coin.js' // 배팅된 코인


const e = function (opt) {
  this.THREE = THREE
  this.betted_coins = [];

  // 카드 형태 생성
  this.card_groups = {
    player: null,
    banker: null,
  }

  const card_groups = this.card_groups

  this.resizeUpdate = {

  }
  const {
    vue,
    el,
    TWEEN
  } = opt

  this.vue = vue;

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
    if (!vue.game_status.bet_start) return;
    if (selectedObject.type == "Mesh") {
      bet(vue.selectedCoin, selectedObject)
    }
  }

  this.onMouseMove = function (e) {
    if (!vue.game_status.bet_start) return
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
      //selectedObject.material.color.set('#FFFFFF')
      selectedObject = null
    }
    
    let intersects = getIntersects(targets);

    if (intersects.length > 0) {
      var res = intersects.filter(function (res) {
        return res && res.object;
      })[0];
      if (res && res.object) {
        selectedObject = res.object;
        //selectedObject.material.color.set('#690');
      }
    }
  }

  let scene = this.scene = new THREE.Scene();
  let camera = this.camera = new THREE.PerspectiveCamera(25, cont.clientWidth / cont.clientHeight, 0.1, 1000);
  let renderer = this.renderer = new THREE.WebGLRenderer({
    //alpha:true,
    antialias: true,
  });

  let o = [];
  const textureLoader = new THREE.TextureLoader();
  this.textureLoader = textureLoader


  window.o = o;
  window.THREE = THREE;
  window.camera = camera;
  window.scene = scene;
  window.renderer = renderer;

  renderer.setSize(cont.clientWidth, cont.clientHeight);
  cont.appendChild(renderer.domElement);
  //renderer.autoClear = false;
  //renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap
/*

  const renderPass = new THREE.RenderPass(scene, camera);
  //let pass = new THREE.SMAAPass( width * renderer.getPixelRatio(), height * renderer.getPixelRatio() );
  //pass.renderToScreen = true;  
  const pass = new THREE.ShaderPass(THREE.FXAAShader);
  pass.renderToScreen = true;
  pass.material.uniforms['resolution'].value.x = 1 / (width);
  pass.material.uniforms['resolution'].value.y = 1 / (height);

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(pass);
*/
  camera.position.z = 120;
  camera.position.y = -80;
  camera.lookAt(0, 0, 0)




  var directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
  //directionalLight1.castShadow = true;
  directionalLight1.shadow.mapSize.width = 1024;  // default
  directionalLight1.shadow.mapSize.height = 1024; // default
  directionalLight1.shadow.camera.near = 0.01;       // default
  directionalLight1.shadow.camera.far = 15000      // default
  var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);  
  //directionalLight2.castShadow = true;
  
  directionalLight1.position.set(-500, -500, 500)
  directionalLight2.position.z = 15;
  scene.add(directionalLight1);
  scene.add(directionalLight2);
  

  //const composer1 = new THREE.EffectComposer( renderer );
  //composer1.addPass( renderPass );
  //composer1.addPass( fxaaPass );
  let table = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
    color: 0xffffff,
  }))
  let table_group = new THREE.Group();
  table_group.lookAt(camera.position)
  table_group.add(table)

  textureLoader.load(require('@/images/table.jpg'), tex => {
    table.material.map = tex;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    table.material.needsUpdate = true;
  })

  table.name = "table"
  table.position.z = -20
  table.scale.set(102, 64, 1)



  scene.add(table_group)




  init_cards.bind(this)(textureLoader,width, height)
  init_betting_zone.bind(this)(width, height, betZones, forIntersect)


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
    let coins = target.parent.getObjectByName('mycoins');
    let index = sprite.index;    
    let coin = this.betted_coins[index]
    

    if (!coins) {
      coins = new THREE.Group()
      coins.name = 'mycoins'
      let shadow = this.betted_coins[this.betted_coins.length-1].clone()
      shadow.position.z = 0.1;
      coins.add(shadow)
      coins.position.copy(definedZones[zone])
      coin = coin.clone()
      coin.position.z = 0.2
      coins.add(coin)  
      target.parent.add(coins)
    }
    else{   
      coin = coin.clone()    
      coin.position.x = (Math.random() - 0.5) * 0.3
      coin.position.y = (Math.random() - 0.5) * 0.3
      coin.position.z = coins.children.length * 0.5
      coins.add(coin)
    }
  }

  //카드 재질및 정보 세팅
  this.changeCardsMtl = function (p_data, b_data) {
    [p_data, b_data].forEach((card_data, i) => {
      let cards = (i == 0) ? card_groups['player'].children : card_groups['banker'].children
      card_data.forEach((data, i) => {
        let c = cards[i];
        c.userData.value = data.value // 카드값 기록        
        textureLoader.load(require(`@/images/cards/${data.suit.toLowerCase()}${(data.number+'').toLowerCase()}.png`), texture => {
          texture.minFilter = texture.magFilter = THREE.LinearFilter;
          c.material[0].map = texture
          c.material[0].needsUpdate = true;
        })
      })
    })
  }

  this.animateCards = (p_data, b_data, result) => {
    cards_animations(TWEEN, vue, card_groups, p_data, b_data, result);
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

  this.onResize = function (e) {
    let _width = cont.clientWidth;
    let _height = cont.clientHeight
    width = _width;
    height = _height;
    camera.aspect = cont.clientWidth / cont.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(cont.clientWidth, cont.clientHeight);

    this.resizeUpdate.matLine.resolution.set(width, height);
    scorePosition(width, height);
    timerPosition(width, height);
    coinForBetPosition(width, height);

    if (width <= 750) {
      this.resizeUpdate.matLine.linewidth = 1
    }
  }
  let timeStamp = 0
  const that = this;
  this.getTimeStamp = () => timeStamp

  function animate(time) {
    timeStamp = time
    TWEEN.update(time)
    renderer.render(scene, camera)
    //composer.render()
    //console.log('윈도우 active 상태')
    requestAnimationFrame(animate);
  }


  // score 위치
  function scorePosition(width, height) {
    let widthHalf = width / 2;
    let heightHalf = height / 2;

    ['player', 'banker'].forEach((now, i) => {
      let el = vue.$refs[`score_${now}`]
      let group = card_groups[now]
      let pos = new THREE.Vector3();
      let scaleFactor = width / 1280;
      let factor = (i == 0) ? -1 : 1;
      let offset = 40 * scaleFactor / 2
      pos.y += 13.5
      pos.x += 12.0 * factor
      pos.project(camera)

      pos.x = (pos.x * widthHalf) + widthHalf;
      pos.y = -(pos.y * heightHalf) + heightHalf;
      pos.z = 0;

      //el.style.width = 40 * scaleFactor + 'px'
      //el.style.height = 40 * scaleFactor + 'px'
      el.style.transform = `translate3d(${pos.x-offset}px, ${pos.y}px, ${pos.z}px) scale(${scaleFactor})`
    })
  }

  // timer 위치
  function timerPosition(width, height) {
    let widthHalf = width / 2;
    let heightHalf = height / 2;
    let pos = new THREE.Vector3();
    let scaleFactor = width / 1280;
    let el = vue.$refs.timer
    let default_size = el.dataset.default_size
    let offset = default_size * scaleFactor / 2;

    pos.y += 12.5
    pos.project(camera)
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;
    pos.z = 0;

    vue.$set(vue.timerStyle, 'width', default_size + 'px')
    vue.$set(vue.timerStyle, 'height', default_size + 'px')
    vue.$set(vue.timerStyle, 'transform', `translate3d(${pos.x-offset}px, ${pos.y-offset}px, ${pos.z}px) scale(${scaleFactor})`)
    //el.style.height = 100 * scaleFactor + 'px'
  }

  function coinForBetPosition(width, height) {
    pos_coins_for_bet.bind(that)(width, height)
  }

  timerPosition(width, height)
  scorePosition(width, height)
  coinForBetPosition(width, height)


  function show_winner() {
    //get position. player or 
  }

  init_betted_coin.bind(this)()  
  
  //폰트 라벨
  ;(() => {
    var loader = new THREE.FontLoader();
    loader.load( '/brushScript.json', font => {
      let i = 0;      
      for(let txt of ['P.PAIR','PLAYER','TIE','BANKER','B.PAIR']){
        let shapes = font.generateShapes( txt, 1 );
        let geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        let xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        let text = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
          color: 0xCCCCCC
        }) );

        text.scale.multiplyScalar(1.2)
        text.position.y = -10.2;
        this.betZones[i].parent.add(text)
        i++;
      }

   
      
    })


    loader.load( '/Arial_Regular.json', font => {
      let i = 0;
      for(let ratio of ['1:1','11:1','8:1','11:1','0.95:1']){
        let shapes = font.generateShapes( ratio, 1 );
        let geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        let xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        let text = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
          color: 0xCCCCCC
        }) );

        text.scale.multiplyScalar(0.9)
        text.position.y = -7;
        this.betZones[i].parent.add(text)
        i++;      
      }
    })
  })()


}

export default e