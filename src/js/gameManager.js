import init_cards from './modules/init_cards.2.js' // 카드 세팅
import init_betting_zone from './modules/init_betting_zone.2.js' // 배팅존 세팅
import cards_animations from './modules/cards_animations.2.js' // 카드애니메이션
import init_betted_coin from './modules/init_betted_coin.js' // 배팅된 코인
import bet_others from './modules/bet_others' // 다른유저 배팅
import Texts from './modules/Texts.2.js' // 3dTexts
const e = function (opt) {
  const { vue, TWEEN, THREE } = opt
  this.THREE = THREE;
  this.vue = vue;
  this.TWEEN = TWEEN;

  const textureLoader = new THREE.TextureLoader();  
  const fontLoader = new THREE.FontLoader();

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

  const forIntersect = this.forIntersect = {
    betting_zone: [],
  };
  const resizeUpdate = {
    matLines: [],
  }
  
  let _s = Date.now()
  init.bind(this)();
  
  loadResource(_resources_).then( () => {    
    init_table.bind(this)();
    init_cards.bind(this)({
      THREE, _resources_, scene
    });
    init_betting_zone.bind(this)({
      scene, vue, _resources_, THREE, resizeUpdate, forIntersect
    });
    init_labels.bind(this)();    
    init_winner_effect.bind(this)({
      camera, scene, THREE, _resources_
    });
    this.animateCards = new cards_animations(this)
    init_functions.bind(this)();

    console.log(`loading Time :: ${Date.now() - _s}`);
    vue.SET_GAME_LOADED(true)
    
    
  })

  function init_functions(){
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

    // 방입장시 빠른 딜 전개
    this.restoreDeal = (data) => {
      console.log('게임카드 복구')
      const $R = _resources_;  
      [ data.player.cards, data.banker.cards ].forEach( (group, g)=>{
        group.forEach( (d, i) => {
          let c = g == 0 ? $R.cards.player[i] : $R.cards.banker[i];
          //재질
          let texture = `${d.suit}${d.number}`.toLowerCase()
          texture = $R.textures.cards.front[texture];        
          c.material[0].map = texture
          c.material[0].needsUpdate = true;
          
          if(i<2){
            c.rotation.set(0,0,0)
            c.position.x = c.position.x - 8
          }else{
            c.rotation.x = 0
            c.position.y = c.position.y - 8
          }
          c.visible = true;
        })
      })   
    };
    this.bet_others = (message) => {      
      this.vue_room.bet_info = this.vue_room.bet_info.concat(message)
      bet_others.bind(this)(message, this.betZones)
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
          resolve();
        })
      }),

      // font 1
      new Promise( resolve=>{
        fontLoader.load('/brushScript.json', font => {
          R.fonts.brushScript = font
          console.log('brushScript_loaded')
          resolve()
        });
      }),

       // font 2
       new Promise( resolve=>{
        fontLoader.load('/Arial_Regular.json', font => {
          R.fonts.Arial_Regular = font
          console.log('Arial_Regular_loaded')
          resolve()
        });
      }),
      // card_back_side
      new Promise( resolve => {
        textureLoader.load(require('@/images/backside.jpg'), tex => {
          R.textures.cards.back = tex;
          resolve();
        });
      }),
      // betting_zones
      new Promise( resolve => {
        textureLoader.load(require(`@/images/betting_zone.jpg`), tex => {
          R.textures.betting_zone = tex
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
                r();
              })
            })
          )
        }
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

      text.scale.multiplyScalar(1.2)
      text.position.y = -10.2;
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

      text.scale.multiplyScalar(0.9)
      text.position.z = 0.05;
      text.position.y = -7;
      this.betZones[i].parent.add(text)
      this.betZones[i].parent.userData.toChangeRGB.push(text)
      text.name = "ratio"
      i++;
    }    
  }

  function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
}

export default e
