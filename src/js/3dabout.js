import init_cards from './modules/init_cards' // 카드 세팅
import init_betting_zone from './modules/init_betting_zone' // 배팅존 세팅
import pos_coins_for_bet from './modules/pos_coins_for_bet' // 배팅UI
import cards_animations from './modules/cards_animations' // 카드애니메이션
import init_betted_coin from './modules/init_betted_coin.js' // 배팅된 코인
import bet_others from './modules/bet_others' // 다른유저 배팅
import Texts from './modules/Texts.js' // 3dTexts


const e = function (opt) {
  
  const { vue, el, TWEEN, THREE } = opt

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

  this.vue = vue;
  this.TWEEN = TWEEN;

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

  let selectedObject = null
  this.clearSelectedObject = ()=>{
    selectedObject = null;
  }
  this.onMouseClick = function (e) {   
    
    if (!vue.game_status.bet_start) return;
    if (!selectedObject) return;
    if (selectedObject.type == "Mesh") {      
      //vue.proc_insert_coin(vue.BACCARAT_ACCOUNT, 'eosio.token', parseFloat(vue.selectedCoin.value).toFixed(4), 'EOS');      
      let reverse_index = [3,1,0,2,4]
      vue.tosvr.req_betting("EOS", parseFloat(vue.selectedCoin.value).toFixed(2), reverse_index[selectedObject.userData.index])      
    }
  }

  this.onMouseMove = function (e) {
    if (!vue.game_status.bet_start || !vue.game_status.betting) return
    e.preventDefault();
    let x, y;    
    if( e.target.tagName == "CANVAS" ){
      x = (e.layerX / width) * 2 - 1;
      y = -(e.layerY / height) * 2 + 1;
    }else{
      //const rect = e.target.getBoundingClientRect()      
      x = ( parseFloat(e.target.style.left) + e.layerX) / width * 2 - 1;
      y = ( parseFloat(e.target.style.top) + e.layerY) / height  * -2 + 1;      
    }

    //console.log(+e.target.style.left + e.layerX)

    mouseVector.set(x, y, 10);
    let targets = forIntersect.betting_zone

    raycaster.setFromCamera(mouseVector, camera);

    let intersects = raycaster.intersectObjects(this.betZones);

    if (intersects.length > 0) {
      let intersect = intersects[0].object
      document.body.style.cursor = "pointer"
      if (!selectedObject) {        
        intersect.parent.userData.changeRGB('#FFFF00')
        selectedObject = intersect;

      } else if (selectedObject) {
        if (selectedObject === intersect) {
          return
        } else {
          let toChange = selectedObject
          toChange.parent.userData.restoreRGB();
          intersect.parent.userData.changeRGB('#FFFF00')
          selectedObject = intersect
        }
      }
    } else {
      document.body.style.cursor = ""
      if (selectedObject) {        
        let toChange = selectedObject        
        toChange.parent.userData.restoreRGB(); 
        selectedObject = null;       
      }
    }
    return;   
  }

  let scene = this.scene = new THREE.Scene();
  let scene2 = this.scene2 = new THREE.Scene();
  let camera = this.camera = new THREE.PerspectiveCamera(32, cont.clientWidth / cont.clientHeight, 0.1, 1000);
  let renderer = this.renderer = new THREE.WebGLRenderer({
    //alpha:true,
    antialias: true,
  });
  
  let css_scene = this.css_scene = new THREE.Scene();

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
  camera.position.normalize();
  camera.position.multiplyScalar(64)
  camera.lookAt(0, 6, 0)
  camera.target = new THREE.Vector3(0,6,0);




  var directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
  //directionalLight1.castShadow = true;
  directionalLight1.shadow.mapSize.width = 1024; // default
  directionalLight1.shadow.mapSize.height = 1024; // default
  directionalLight1.shadow.camera.near = 0.01; // default
  directionalLight1.shadow.camera.far = 15000 // default
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
  table_group.position.copy(camera.target)
  table_group.lookAt(camera.position)
  table_group.add(table)

  textureLoader.load(require('@/images/table.jpg'), tex => {
    table.material.map = tex;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    table.material.needsUpdate = true;
  })

  table.name = "table"
  table.position.z = -20
  table.position.y = -10
  table.scale.set(135, 80, 1)
  table.scale.normalize();
  table.scale.multiplyScalar(camera.position.length()*2.5)



  scene.add(table_group)




  init_cards.bind(this)(textureLoader, width, height)
  init_betting_zone.bind(this)(width, height, betZones, forIntersect)


 


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
  
  const do_bet = (target, sprite, zone, who) => {
    
    let groupName = (typeof who == 'undefined') ? 'mycoins' : who
    let coins = target.parent.getObjectByName( groupName );
    let index = sprite.index;
    let coin = this.betted_coins[index]

    

    const randomNumber = (target) => {      
      while(1){
        let used = [];
        target.parent.userData.zones.map(t => {
          used.push(t.zone)
        })
        let rnd =  Math.floor(Math.random() * 9)
        if(used.indexOf(rnd) == -1) {return rnd}
        else continue;
      }
    }

    //새로운 그룹 생성
    if (!coins) {
      coins = new THREE.Group()
      coins.name = groupName     

      coins.userData.type = "coins"
      let shadow = this.betted_coins[this.betted_coins.length - 1].clone()
      //shadow.position.z = 0.1;
      //shadow.renderOrder = 0.5
      coins.add(shadow)
      
      if(typeof target.parent.userData.zones == 'undefined') target.parent.userData.zones = [];
      let zz = randomNumber(target)
      target.parent.userData.zones.push({
        who: groupName,
        zone: zz,
      })      

      coins.position.copy(definedZones[zz])
      coin = coin.clone()
      coin.position.z = 0.2
      coins.add(coin)
      target.parent.add(coins)

       //Vue에 그룹 생성을 알림. (너무 빨리 하면 안됨)
      setTimeout( ()=> {
        vue.coin_groups.push({
          name : groupName,
          slot : target.userData.index,
          position : coins.localToWorld( new THREE.Vector3()).project(camera),
        })
      },20)
    } else {
      coin = coin.clone()
      coin.position.x = (Math.random() - 0.5) * 0.3
      coin.position.y = (Math.random() - 0.5) * 0.3
      coin.position.z = coins.children.length * 0.5
      coins.add(coin)
    }
  }

  this.do_bet = (target, sprite, zone, who)=>{
    do_bet(target, sprite, zone , who);
  }

  
  this.animateCards = new cards_animations(this)


  // betting target 정의






  animate();

  this.onResize = function (e) {
    let _width = cont.clientWidth;
    let _height = cont.clientHeight;
    vue.SET_WINDOW_RESOLUTION([_width,_height]);
    width = _width;
    height = _height;
    renderer.setSize(_width, _height);
    camera.aspect = _width / _height;
    camera.updateProjectionMatrix();
    

    this.resizeUpdate.matLine.resolution.set(width, height);
    scorePosition(width, height);
    timerPosition(width, height);
    //coinForBetPosition(width, height);

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
    //renderer.autoClear = true;
    
    camera.layers.enable(1)
    camera.layers.set(0)
    renderer.render(scene, camera)
    renderer.autoClear = false;
    renderer.clearDepth();
    camera.layers.set(1)
    renderer.render(scene, camera)
    
    //renderer.render(scene2, camera)
    
    
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

  timerPosition(width, height)
  scorePosition(width, height)

  function show_winner() {
    //get position. player or 
  }

  init_betted_coin.bind(this)()

  //폰트 라벨
  ;
  (() => {
    var loader = new THREE.FontLoader();
    loader.load('/brushScript.json', font => {
      let i = 0;
      for (let txt of ['P.PAIR', 'PLAYER', 'TIE', 'BANKER', 'B.PAIR']) {
        let shapes = font.generateShapes(txt, 1);
        let geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);
        let text = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
          color: 0xCCCCCC
        }));

        text.scale.multiplyScalar(1.2)
        text.position.y = -10.2;
        this.betZones[i].parent.add(text)
        this.betZones[i].parent.userData.toChangeRGB.push(text)
        text.name = "label"
        i++;
      }



    })


    loader.load('/Arial_Regular.json', font => {
      let i = 0;
      for (let ratio of ['11:1', '1:1', '8:1', '0.95:1', '11:1']) {
        let shapes = font.generateShapes(ratio, 1);
        let geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);
        let text = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
          color: 0xCCCCCC
        }));

        text.scale.multiplyScalar(0.9)
        text.position.z = 0.05;
        text.position.y = -7;
        this.betZones[i].parent.add(text)
        this.betZones[i].parent.userData.toChangeRGB.push(text)
        text.name = "ratio"
        i++;
      }
    })
  })()


  // 데이터 라벨링
  this.textLabels = [];
  ;  (function (zones) {    
    zones.forEach( (z,i) => {      
      let parent = z.parent;
      let geo = new THREE.PlaneGeometry(13,2.6)
      let mat = new THREE.MeshBasicMaterial({      
        transparent:true,
        //depthTest: false,
      })
      let mesh = new THREE.Mesh(geo,mat.clone())
      let cvs = vue.$refs.hiddenCanvas
      //cvs.getContext('2d').imageSmoothingEnabled = true
      let map = new THREE.Texture(cvs)
      map.wrapS = map.wrapT = THREE.RepeatWrapping
      map.repeat.y = 0.2
      map.offset.y = -0.2 * (i+1)
      


      mesh.material.map = map
      mesh.material.map.minFilter = mesh.material.map.magFilter = THREE.LinearFilter;
      //mesh.material.needsUpdate=true
      mesh.position.x = ( i==2 ) ? 1.48 : 0
      mesh.position.y = 6.5
      mesh.position.z = 0.1
      parent.add(mesh)
      this.textLabels.push(mesh)
    })
  }.bind(this))(this.betZones)

  this.bet_others = (message)=>{
    vue.bet_info = vue.bet_info.concat(message)
    bet_others.bind(this)(message,this.betZones)
  }

  // trigger => cards_animations.js
  this.changeColor = (winner, pair) => {
    //winner color
    const reverse = {
      P: {
        slot: 1,
        color: '#0000FF'
      },
      B: {
        slot: 3,
        color: '#FF0000'
      },
      T: {
        slot: 2,
        color: '#00FF00'
      },
      P1: {
        slot: 0,
        color: '#FFFF00'
      },
      P2: {
        slot: 4,
        color: '#FFFF00'
      }
    }
    const group = this.betZones[reverse[winner].slot].parent;    
    group.userData.changeRGB(reverse[winner].color);

    if(pair > 0){
      const p_group = this.betZones[reverse[`P${pair}`].slot].parent;
      p_group.userData.changeRGB(reverse[`P${pair}`].color);
    }
  }

  this.restoreColor = () => {
    this.betZones.forEach(t=>{
      t.parent.userData.restoreRGB();
    })
  }

  this.clear_bet_coins = (name) => {
    // 전체 철수
      this.betZones.forEach( (zone,i)=>{
        let parent = zone.parent
        delete(parent.userData.zones)
        let whole_coins = parent.children.filter( child => {
          return child.userData.type == 'coins'
        })

        whole_coins.forEach(coins => {
          if(typeof name == 'undefined'){
            parent.remove(coins)
          }else if(coins.name == name){
            parent.remove(coins)
            //라벨에서 해당네임 빼기
            vue.coin_groups = vue.coin_groups.filter(t=>{              
              return t.name != name
            })
          }
        })
      })
  }

  Texts(this,table_group);
}

export default e