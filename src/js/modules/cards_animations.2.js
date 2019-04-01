function easing(TWEEN, index){
  const ease = [
    TWEEN.Easing.Linear.None, //0
    TWEEN.Easing.Quadratic.In,
    TWEEN.Easing.Quadratic.Out,
    TWEEN.Easing.Quadratic.InOut,
    TWEEN.Easing.Cubic.In,
    TWEEN.Easing.Cubic.Out,  //5
    TWEEN.Easing.Cubic.InOut,
    TWEEN.Easing.Quartic.In,
    TWEEN.Easing.Quartic.Out,
    TWEEN.Easing.Quartic.InOut,
    TWEEN.Easing.Quintic.In, //10
    TWEEN.Easing.Quintic.Out,
    TWEEN.Easing.Quintic.InOut,
    TWEEN.Easing.Sinusoidal.In,
    TWEEN.Easing.Sinusoidal.Out,
    TWEEN.Easing.Sinusoidal.InOut, //15
    TWEEN.Easing.Exponential.In,
    TWEEN.Easing.Exponential.Out,
    TWEEN.Easing.Exponential.InOut,
    TWEEN.Easing.Circular.In,
    TWEEN.Easing.Circular.Out, //20
    TWEEN.Easing.Circular.InOut,
    TWEEN.Easing.Elastic.In,
    TWEEN.Easing.Elastic.Out,
    TWEEN.Easing.Elastic.InOut,
    TWEEN.Easing.Back.In, //25
    TWEEN.Easing.Back.Out,
    TWEEN.Easing.Back.InOut,
    TWEEN.Easing.Bounce.In,
    TWEEN.Easing.Bounce.Out,
    TWEEN.Easing.Bounce.InOut, //30
  ];
  return ease[index];
}


export default function ($game) {

  const { _resources_, vue_room, TWEEN, THREE } = $game  
  const { card_groups, textureLoader } = _resources_
  const reset_generator = function* (ord_cards) {
    for (let card of ord_cards) {
      yield new TWEEN.Tween({
          x: card.position.x,
          y: card.position.y,
          z: card.position.z,
          rotX: card.rotation.x,
          rotY: card.rotation.y,
          rotZ: card.rotation.z
        })
        .to({
          x: card_groups.p_startVector.x, //-350,
          y: card_groups.p_startVector.y, //-200,
          z: card_groups.p_startVector.z,
          rotX: 0,
          rotY: 0,
          rotZ: 0
        }, 300)
        .onUpdate(a => {
          card.position.set(a.x, a.y, a.z)
          //card.rotation.set(a.rotX, a.rotY, a.rotZ)
        })
        .start()
    }    
  }

  this.p_data = null;
  this.b_data = null;
  this.p_card = null;
  this.b_card = null;
  this.whole_cards = null;
  this.ord_card = null;
  this.generator = null;
  this.winner = null;
  this.vue_room = null;

  card_groups.p_startVector = card_groups['player'].worldToLocal(new THREE.Vector3(0, 40, 10))
  card_groups.b_startVector = card_groups['banker'].worldToLocal(new THREE.Vector3(0, 40, 10))

  this.init = function(opt){
    const { p_cards, b_cards, result, vue_room } = opt;
    this.vue_room = vue_room;
    vue_room.score.show = true; // 스코어 켜기
    
    [p_cards, b_cards].forEach( (card_data, i ) => {
      let cards = (i == 0) ? card_groups['player'].children : card_groups['banker'].children
      card_data.forEach( (data, i) => {
        let c = cards[i];
        c.userData.value = data.value // 카드값 기록        
        textureLoader.load(require(`@/images/cards/${data.suit.toLowerCase()}${(data.number+'').toLowerCase()}.png`), texture => {
          texture.minFilter = texture.magFilter = THREE.LinearFilter;
          c.material[0].map = texture
          c.material[0].needsUpdate = true;
        })
      })
    })

    this.p_cards = card_groups['player'].children.filter(c => c.userData.type == 'card')
    this.b_cards = card_groups['banker'].children.filter(c => c.userData.type == 'card')

    console.log(this.p_cards, this.b_cards)
    this.whole_cards = [...this.p_cards, ...this.b_cards]
    this.ord_cards = [
      this.whole_cards[0],
      this.whole_cards[3],
      this.whole_cards[1],
      this.whole_cards[4],
    ]

    if(p_cards.length == 3) this.ord_cards.push(this.whole_cards[2])
    if(b_cards.length == 3) this.ord_cards.push(this.whole_cards[5])    

    this.whole_cards.forEach( card => {
      card.visible = false
      if (!card.userData.original_position) {
        card.userData.original_position = card.position.clone()
        card.userData.original_rotation = card.rotation.clone()
      }
      card.position.copy((card.userData.parent_type == 'player') ? card_groups.p_startVector : card_groups.b_startVector)
      card.rotation.z = 0;
    });

    this.generator = reset_generator(this.ord_cards);
    let winner = result.trim().toLowerCase().split(' ');
    this.winner = winner[0];
  }
  
  this.renew = () => {
    for (let card of this.whole_cards) {
      card.visible = false
      card.position.copy(card.userData.original_position)
      card.rotation.copy(card.userData.original_rotation)
    }
  }

  this.moveCard = (index, duration, e) => {
    const card = this.ord_cards[index]
    if(index >= 2){
      // 3번째 카드부터 적용
      card.rotation.y = 0;      
      if(index >= 4){
        card.rotation.x = 0;
      }
      if(!card.children.length){
        let child = card.clone()
        child.material[2] = child.material[2].clone()
        child.material[2].transparent = true;
        child.rotation.y = Math.PI;
        child.position.set(8,0,0.1)
        child.visible=true;
        card.add(child);        
      }else{
        card.children[0].position.set(8,0,0.1)
        card.children[0].material[2].opacity = 1;   
        card.children[0].visible=true; 
      }
    }

    card.visible = true;    
      new TWEEN.Tween({
          x: card.position.x,
          y: card.position.y,
          z: card.position.z,
          rotZ: card.rotation.z
        })
        .to({
          x: (index == 2 || index == 3) ? card.userData.original_position.x - 8 :  card.userData.original_position.x,
          y: (index == 4 || index == 5) ? card.userData.original_position.y - 8 : card.userData.original_position.y,
          z: card.userData.original_position.z,
          rotZ: card.userData.original_rotation.z,
        }, duration || 300)
        .easing(easing(TWEEN, e||0))
        .onUpdate(a => {
          card.position.set(a.x, a.y, a.z)
          if (card.userData.isHidden) card.rotation.z = a.rotZ
        })
        .onComplete(() => {
          
        })
        .start()
    
    }

    this.rotateCard = (index, duration, e) => {
      const card = this.ord_cards[index];      
      new TWEEN.Tween({
          rot: card.rotation[card.userData.isHidden ? 'x' : 'y'],
          pos: card.position[!card.userData.isHidden ? 'x' : 'y'],
        })
        .to({
          rot: !card.userData.isHidden ? 2 * Math.PI : 0,
          pos: card.userData.original_position[!card.userData.isHidden ? 'x' : 'y'] - ((!card.userData.isHidden) ? 8 : 8)
        }, duration || 300)        
        .onUpdate(a => {
          card.rotation[card.userData.isHidden ? 'x' : 'y'] = (a.rot)
          card.position[!card.userData.isHidden ? 'x' : 'y'] = a.pos
        })
        .easing(easing(TWEEN, e||0))
        .onComplete(() => {
          //스코어 갱신
          this.assignScore(card.userData)
        })
        .start()      
    }
    this.assignScore = (data) => {      
      this.vue_room.score[data.parent_type] = (this.vue_room.score[data.parent_type] + data.value) % 10
    }

    this.slideCard = (index, duration, e)=>{
      const card = this.ord_cards[index];
      const child = card.children[0];      
            
        new TWEEN.Tween({
          //rot: card.rotation[card.userData.isHidden ? 'x' : 'y'],
          pos: 8,
          opa: 1,
        })
        .to({
          //rot: !card.userData.isHidden ? 2 * Math.PI : 0,
          pos: 16,
          opa: 0,
        },680)// duration || 300)
        .onUpdate(a => {
          //card.rotation[card.userData.isHidden ? 'x' : 'y'] = (a.rot)
          child.position.x = a.pos
          child.material[2].opacity = a.opa*1.5
        })
        .easing(easing(TWEEN, e||10))
        .onComplete(() => {
          this.assignScore(card.userData)
        })
        .start()         
    }

    this.restoreDeal = () => {
      this.ord_cards.forEach((card,i) => {
        card.position.copy(card.userData.init_position)
        card.rotation.copy(card.userData.init_rotation)
        if( i < 4 ){
          card.rotation.set(0,0,0)
          card.position.x = card.position.x - 8
        }else{
          card.rotation.x = 0
          card.position.y = card.position.y - 8
        }
        card.children.forEach(child=>{            
          child.visible = false;
        })
        card.visible=true;
      })
    };
    
     //초기화

  this.reset = () => {
    //this.clear_bet_coins();
    //vue.score.show = false;
    new Promise(resolve=>{
      let q = setInterval(() => {
        let next = this.generator.next()
        if (next.done) {
          clearInterval(q)
          //스코어 초기화
          this.vue_room.score.player = 0;
          this.vue_room.score.banker = 0;
          this.vue_room.score.show = false;

          //코인판 초기화
          $game.clear_bet_coins();
          resolve();
        }
      }, 110)
    }).then(()=>{
      setTimeout(()=>{
        this.renew();        
        console.log('카드초기화됨')
      },2000)
    })
  }
}