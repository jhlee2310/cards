import init_cards from './modules/init_cards.2.js' // 카드 세팅
import init_betting_zone from './modules/init_betting_zone.2.js' // 배팅존 세팅
import cards_animations from './modules/cards_animations.2.js' // 카드애니메이션
import init_betted_coin from './modules/init_betted_coin.2.js' // 배팅된 코인
//import bet_others from './modules/bet_others' // 다른유저 배팅
import Texts from './modules/Texts.2.js' // 3dTexts

const e = function (opt) {
  const that = this;
  const { vue, TWEEN, THREE } = opt
  this.THREE = THREE;

  THREE.Math = {
    degToRad : (deg) => {return deg * Math.PI / 180}
  }
  this.vue = vue;
  this.TWEEN = TWEEN;
  this.timeStamp = 0;  
  const textureLoader = new THREE.TextureLoader();  
  const fontLoader = new THREE.FontLoader();
  const mouseVector = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  let camera, scene, renderer;
  const _resources_ = this._resources_ = {
    winners: {

    },
    card_groups: {},
    cards:{
      player:[],
      banker:[],
    },
    fonts: {},
    textures: {
      betting_zone: null,
      chips: [],
      shadow: null,
      cards: {
        front: {},
        back: null,
      }
    },    
    geometry: {},
    textureLoader
  };

  this.betZones = [];
  this.betted_coins = [];
  this.definedZones = [];
  this.textLabels = [];

  const forIntersect = this.forIntersect = {
    betting_zone: [],
  };
  const resizeUpdate = {
    matLines: [],
  }

  //raycasting 결과가 담기는 변수
  let selectedObject = null
  
  let _s = Date.now()
  init.bind(this)();
  
  loadResource(_resources_).then( () => {
    init_table.bind(this)();
    vue.INCREASE_LOADING_PROGRESS();
    
    init_cards.bind(this)({
      THREE, _resources_, scene
    });
    vue.INCREASE_LOADING_PROGRESS();
    
    init_betting_zone.bind(this)({
      scene, vue, _resources_, THREE, resizeUpdate, forIntersect
    });
    vue.INCREASE_LOADING_PROGRESS();
    
    init_labels.bind(this)();
    vue.INCREASE_LOADING_PROGRESS();
    
    init_winner_effect.bind(this)({
      camera, scene, THREE, _resources_
    });
    vue.INCREASE_LOADING_PROGRESS();

    this.animateCards = new cards_animations(this)
    vue.INCREASE_LOADING_PROGRESS();
    
    init_definedZones.bind(this)();
    vue.INCREASE_LOADING_PROGRESS();
    
    init_betted_coin.bind(this)();
    vue.INCREASE_LOADING_PROGRESS();
    
    init_functions.bind(this)();
    vue.INCREASE_LOADING_PROGRESS();
    
    init_textLabels.bind(this)(this.betZones);
    vue.INCREASE_LOADING_PROGRESS();

    console.log(`loading Time :: ${Date.now() - _s}`);
    setTimeout(()=>{
      vue.SET_GAME_LOADED(true)
    },100)
  })
  function init_definedZones(){    
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const v = new THREE.Vector3(x, y, 0)
        v.multiplyScalar(3.8)
        this.definedZones.push(v)
      }
    }
  }
  function init_functions(){
    // 방입장시 위너 하이드
    this.hideWinners = () => {
      ['player','banker','tie'].forEach(t=>{        
        this._resources_.winners[t].visible = false;
        
      })
      
    };
    // 방입장시 빠른 딜 전개 초기화
    this.init_before_detail = () => {
      const $R = _resources_
      const whole_cards = [...$R.cards.player,...$R.cards.banker];
      whole_cards.forEach( (t, i) => {
        t.visible = false;
        t.position.copy(t.userData.init_position);
        t.rotation.copy(t.userData.init_rotation);
      })      
    };
    this.restoreDeal = (data) => {

    };
    this.bet_others = (message) => {

      this.vue_room.bet_info = this.vue_room.bet_info.concat(message)      
      const reverseTable = [2, 1, 3, 0, 4]
      const reverseCoin = [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000]
      let target_index = message.slot    
      let target = this.betZones[ reverseTable[target_index] ]
    
      if(reverseCoin.indexOf(parseFloat(message.value)) == -1){
        //한번에
        do_bet_once.bind(this)(target, parseFloat(message.value), message.acc_name) // visual
      }else{
        //일반 코인한개씩
        let sprite = {
          index: reverseCoin.indexOf(parseFloat(message.value)),
          value: parseFloat(message.value)
        }      
        do_bet.bind(this)(target, sprite, -1, message.acc_name) // visual
      }
      //bet_others.bind(this)(message, this.betZones)
    };

    this.clear_bet_coins = (name) => {
    // 전체 철수
      const { vue_room } = this;
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
            vue_room.coin_group_labels = vue_room.coin_group_labels.filter(t=>{              
              return t.name != name
            })
          }
        })
      })
    };
    this.restoreColor = () => {
      this.betZones.forEach(t=>{
        t.parent.userData.restoreRGB();
      })
    };
    this.clearSelectedObject = ()=>{
      selectedObject = null;
    }


    // mouse mouse event handler
    this.onMouseMove = function (e) {
      const { vue_room } = this;
      const { resolution } = vue_room;
      let width = resolution.width;
      let height = resolution.height;

      if (!vue_room.game_status.bet_start || !vue_room.game_status.betting) return
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
    },
    //배팅존 테두리 컬러 이펙트
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
    },
    this.onMouseClick = function (e) {
      const { vue_room } = this;
      if (!vue_room.game_status.bet_start) return;
      if (!selectedObject) return;
      if (selectedObject.type == "Mesh") {      
        //vue.proc_insert_coin(vue.BACCARAT_ACCOUNT, 'eosio.token', parseFloat(vue.selectedCoin.value).toFixed(4), 'EOS');              
        let reverse_index = [3,1,0,2,4]
        vue_room.tosvr_req_betting("EOS", parseFloat(vue_room.selectedCoin.value).toFixed(2), reverse_index[selectedObject.userData.index])
      }
    }
  }

  function init_textLabels(zones){

    zones.forEach( (z,i) => { 
      let parent = z.parent;
      let geo = new THREE.PlaneGeometry(11.5,2.2)
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
      mesh.position.x = ( i == 0 ) ? 0.3 : ( i == 2 ) ? 1.48 : ( i == 4 ) ? -0.3 : 0;
      mesh.position.y = (function(){
        let _y;
        switch(i){
          case 0: case 4:
            _y = 6.1;
          break;
          case 1: case 3:
            _y = 5.2;
          break;
          case 2:
            _y = 5.6;
          break;
        }
        return _y        
      })();
      mesh.position.z = 0.1
      parent.add(mesh)
      this.textLabels.push(mesh)
    })
  }
  

  function do_bet(target, sprite, zone, who){    
    
    const { vue_room, definedZones } = this
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
        vue_room.coin_group_labels.push({
          name : groupName,
          slot : target.userData.index,
          position : coins.localToWorld( new THREE.Vector3()).project(camera),
        })
      },50)
    } else {
      coin = coin.clone()
      coin.position.x = (Math.random() - 0.5) * 0.3
      coin.position.y = (Math.random() - 0.5) * 0.3
      coin.position.z = coins.children.length * 0.5
      coins.add(coin)
    }  
  }

  function do_bet_once(target, value, who){
    const { definedZones, vue_room }  = this
    let groupName = who;
    let coins = target.parent.getObjectByName( groupName );    
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

    //넣을 코인 파악하기
    const cal_insert_coins = (value)=>{
      
      let result = [];
      let sample = [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000].reverse()
      let i = sample.length-1;
      for( let v of sample ){
        let div = Math.floor( +(value/v).toFixed(5) ) // 신뢰도??
        if(div > 0){
          result.push({
            index: i,
            qt: div,
          })          
          value = +(value % v).toFixed(4)
        }
        i--;
      }
      return result
    }

    const to_insert = cal_insert_coins(value)

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
      //coin = coin.clone()
      //coin.position.z = 0.2
      //coins.add(coin)
      target.parent.add(coins)

      //Vue에 그룹 생성을 알림. (너무 빨리 하면 안됨)
      setTimeout( ()=> {
        vue_room.coin_group_labels.push({
          name : groupName,
          slot : target.userData.index,
          position : coins.localToWorld( new THREE.Vector3()).project(camera),
        })
      },50)
    }

    //코인 넣기
    for(let info of to_insert){        
      for(let i=0;i<info.qt;i++){
        let coin = this.betted_coins[info.index].clone();
        coin.position.x = (Math.random() - 0.5) * 0.3
        coin.position.y = (Math.random() - 0.5) * 0.3
        coin.position.z = coins.children.length * 0.5
        coin.rotation.z = (Math.random() * Math.PI * 2) - Math.PI
        coins.add(coin)
      }
    }   
  }

  function loadResource(R){    
    return Promise.all([
    // 테이블 재질
      new Promise( resolve=>{
        textureLoader.load( require('@/images/table.jpg' ), tex => {
          tex.minFilter = tex.magFilter = THREE.LinearFilter
          R.textures.table = tex
          console.log('table_texture_loaded')
          vue.INCREASE_LOADING_PROGRESS();
          resolve();
        })
      }),

      // font 1
      new Promise( resolve=>{
        fontLoader.load('/brushScript.json', font => {
          R.fonts.brushScript = font
          console.log('brushScript_loaded')
          vue.INCREASE_LOADING_PROGRESS();
          resolve()
        });
      }),

       // font 2
       new Promise( resolve=>{
        fontLoader.load('/Arial_Regular.json', font => {
          R.fonts.Arial_Regular = font
          console.log('Arial_Regular_loaded')
          vue.INCREASE_LOADING_PROGRESS();
          resolve()
        });
      }),
      // card_back_side
      new Promise( resolve => {
        textureLoader.load(require('@/images/backside.jpg'), tex => {
          R.textures.cards.back = tex;
          vue.INCREASE_LOADING_PROGRESS();
          resolve();
        });
      }),
      // betting_zones
      new Promise( resolve => {
        textureLoader.load(require(`@/images/betting_zone.jpg`), tex => {
          R.textures.betting_zone = tex
          vue.INCREASE_LOADING_PROGRESS();
          resolve();
        })
      }),
      // chip sprites      
      Promise.all( ( () => {
        const array = [];        
        for (let i of [4, 5, 6, 7, 8, 9, 10, 11, 12]) {
          array.push( new Promise( r => {
              textureLoader.load(require(`@/images/chips/bet${i}__.png`), tex => {
                R.textures.chips.push(tex)
                vue.INCREASE_LOADING_PROGRESS();                
                r();
              })
            })
          )
        }

        array.push( new Promise( r => {
          textureLoader.load(require(`@/images/chips/coin_shadow2.jpg`), tex=>{
            R.textures.shadow = tex;
            vue.INCREASE_LOADING_PROGRESS();
            r();    
          })
        }))
        return array;
        })()
      ).then(()=>{
        console.log('All chip Textures Loaded');
      }),
      Promise.all( (() => {
        const array = [];
        for (let symbol of ['s','d','h','c']){
          for (let val of [2,3,4,5,6,7,8,9,10,'j','q','k','a']){
            array.push( new Promise( r => {
              textureLoader.load( require(`@/images/cards/${symbol}${(val)}.png` ), texture => {
                texture.minFilter = texture.magFilter = THREE.LinearFilter;
                R.textures.cards.front[`${symbol}${(val)}`] = texture
                vue.INCREASE_LOADING_PROGRESS();
                r();
              })
            }))
          }
        }
        return array;
      })() )
    ])
  }

  function init(){
    camera = this.camera = new THREE.PerspectiveCamera(32, 1/0.36, 0.01, 500);
    scene = this.scene = new THREE.Scene();
    renderer = this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    //camera
    camera.position.z = 120;
    camera.position.y = -80;
    camera.position.normalize();
    camera.position.multiplyScalar(64)
    camera.lookAt(0, 6, 0)
    camera.target = new THREE.Vector3(0,6,0);

    //light
    var directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    //directionalLight1.castShadow = true;
    //directionalLight1.shadow.mapSize.width = 1024; // default
    //directionalLight1.shadow.mapSize.height = 1024; // default
    //directionalLight1.shadow.camera.near = 0.01; // default
    //directionalLight1.shadow.camera.far = 15000 // default
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    //directionalLight2.castShadow = true;  
    
    directionalLight1.position.set(-500, -500, 500)
    directionalLight2.position.z = 15;
    scene.add(directionalLight1);
    scene.add(directionalLight2);
    
    animate();

    this.onResize = e => {
      let width = vue.resolution.width;
      let height = vue.resolution.height
      renderer.setSize(width, height)
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function init_winner_effect(opt){
    Texts(opt);
  }

  function init_table(){
    let table = new THREE.Mesh( new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: _resources_.textures.table
    }))    

    let table_group = new THREE.Group();
    this.table_group = table_group;

    table_group.position.copy(camera.target)
    table_group.lookAt(camera.position)
    table_group.add(table)
    table.name = "table"
    table.position.z = -20
    table.position.y = -10
    table.scale.set(135, 80, 1)
    table.scale.normalize();
    table.scale.multiplyScalar(camera.position.length()*2.5)
    scene.add(table_group)
  }

  function init_labels(){    
    
    let i = 0;
    for (let txt of ['P.PAIR', 'PLAYER', 'TIE', 'BANKER', 'B.PAIR']) {
      let shapes = _resources_.fonts.brushScript.generateShapes(txt, 1);
      let geometry = new THREE.ShapeBufferGeometry(shapes);
      geometry.computeBoundingBox();
      let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
      geometry.translate(xMid, 0, 0);
      let text = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0xCCCCCC
      }));
      text.userData.originalColor = text.material.color.clone();

      text.scale.multiplyScalar(1.2)
      text.position.y = i == 1 || i == 3 ? -10.7 : -10.2;
      this.betZones[i].parent.add(text)
      this.betZones[i].parent.userData.toChangeRGB.push(text)
      text.name = "label"
      i++;
    } 
      
    i = 0;
    for (let ratio of ['11:1', '1:1', '8:1', '0.95:1', '11:1']) {
      let shapes = _resources_.fonts.Arial_Regular.generateShapes(ratio, 1);
      let geometry = new THREE.ShapeBufferGeometry(shapes);
      geometry.computeBoundingBox();
      let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
      geometry.translate(xMid, 0, 0);
      let text = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0xCCCCCC
      }));
      text.userData.originalColor = text.material.color.clone();

      text.scale.multiplyScalar(0.9)
      text.position.z = 0.05;
      text.position.y = i == 1 || i == 3 ? -7.5 : -7;
      this.betZones[i].parent.add(text)
      this.betZones[i].parent.userData.toChangeRGB.push(text)
      text.name = "ratio"
      i++;
    }    
  }

  function animate(time){
    if(typeof time == 'undefined') time = 0;
    requestAnimationFrame(animate)
    that.timeStamp = time
    TWEEN.update(time)
    camera.layers.enable(1)
    camera.layers.set(0)
    renderer.render(scene, camera)
    renderer.autoClear = false;
    renderer.clearDepth();    
    camera.layers.set(1)
    renderer.render(scene, camera)
  }
}

export default e
