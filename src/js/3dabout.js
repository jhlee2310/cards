import * as THREE from 'three-full'
import init_cards from './modules/init_cards' // 카드 세팅
import init_betting_zone from './modules/init_betting_zone' // 배팅존 세팅
import pos_coins_for_bet from './modules/pos_coins_for_bet'  // 배팅UI
import cards_animations from './modules/cards_animations'  // 카드애니메이션


const e = function (opt) {

  const globals = {

  }

  // 카드 형태 생성
  this.card_groups = {
    player: null,
    banker: null,
  }

  const card_groups = this.card_groups

  this.resizeUpdate = {
    
  }
  const {  vue,  el, TWEEN } = opt

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
    if(!vue.game_status.bet_start) return;    
    if (selectedObject.type == "Mesh") {
      bet(vue.selectedCoin, selectedObject)
    }
   /* 
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
    */
  }

  this.onMouseMove = function (e) {
    if( !vue.game_status.bet_start ) return
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

  
  

  init_cards.bind(this)(textureLoader)
  init_betting_zone.bind(this)(width,height,betZones,forIntersect)
  
  

  //sprites  
  this.group_buy_sprite = [];

  {
    /*
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
*/
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

    let index = sprite.index;
    let coin = this.group_buy_sprite[index]

    coin = coin.clone()
    coin.position.x = (Math.random() - 0.5) * 0.7 + (coins.children.length * 0.05)
    coin.position.y = coins.children.length * 0.14
    coin.position.z = coins.children.length * 0.05
    coins.add(coin)
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

  this.animateCards = (p_data, b_data, result)=>{
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

  this.onResize = function(e){   
    let width = cont.clientWidth;
    let height = cont.clientHeight
    camera.aspect = cont.clientWidth / cont.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( cont.clientWidth, cont.clientHeight );
    
    this.resizeUpdate.matLine.resolution.set( width, height );
    scorePosition(width,height);
    timerPosition(width,height);
    coinForBetPosition(width,height);

    if(width<=750){
      this.resizeUpdate.matLine.linewidth=1
    }
  }  
  let timeStamp = 0
  const that = this;
  this.getTimeStamp = () => timeStamp
  
  function animate(time) {    
    timeStamp = time
    TWEEN.update(time)
    renderer.render(scene, camera)
      //console.log('윈도우 active 상태')
      requestAnimationFrame(animate);
  }
  

  // score 위치
  function scorePosition(width,height){
    let widthHalf = width/2;
    let heightHalf = height/2;
    
    ['player','banker'].forEach( (now, i) => {
      let el = vue.$refs[`score_${now}`]
      let group = card_groups[now]
      let pos = new THREE.Vector3();
      let scaleFactor = width/1280;
      let factor = (i == 0) ? -1 : 1;
      let offset = 40 * scaleFactor / 2
      pos.y += 13.5
      pos.x += 12.0 * factor
      pos.project(camera)
      
      pos.x = (pos.x * widthHalf) + widthHalf;
      pos.y = - (pos.y * heightHalf) + heightHalf;
      pos.z = 0;

      //el.style.width = 40 * scaleFactor + 'px'
      //el.style.height = 40 * scaleFactor + 'px'
      el.style.transform = `translate3d(${pos.x-offset}px, ${pos.y}px, ${pos.z}px) scale(${scaleFactor})`
    })    
  }

  // timer 위치
  function timerPosition(width,height){
    let widthHalf = width/2;
    let heightHalf = height/2;    
    let pos = new THREE.Vector3();
    let scaleFactor = width / 1280;        
    let el = vue.$refs.timer
    let default_size = el.dataset.default_size
    let offset = default_size * scaleFactor / 2;

    pos.y += 12.5
    pos.project(camera)      
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;
    pos.z = 0;   
    
    vue.$set(vue.timerStyle,'width', default_size + 'px')
    vue.$set(vue.timerStyle,'height', default_size + 'px')
    vue.$set(vue.timerStyle,'transform',`translate3d(${pos.x-offset}px, ${pos.y-offset}px, ${pos.z}px) scale(${scaleFactor})`)
    //el.style.height = 100 * scaleFactor + 'px'
  }

  function coinForBetPosition(width,height){
    pos_coins_for_bet.bind(that)(width,height)
  }

  timerPosition(width,height)
  scorePosition(width,height)
  coinForBetPosition(width,height)
  

  function show_winner(){
    //get position. player or 

  }


  
}

export default e