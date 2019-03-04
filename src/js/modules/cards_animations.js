export default function(TWEEN, vue, card_groups, p_data, b_data, result){   
    const p_cards = card_groups['player'].children.filter(c=>c.userData.type == 'card')
    const b_cards = card_groups['banker'].children.filter(c=>c.userData.type == 'card')
    const whole_cards = [...p_cards,...b_cards]    
    const ord_cards = [
        whole_cards[0],
        whole_cards[3],
        whole_cards[1],
        whole_cards[4],      
    ]
    if(p_data.length == 3) ord_cards.push(whole_cards[2])
    if(b_data.length == 3) ord_cards.push(whole_cards[5])

    card_groups.p_startVector = card_groups['player'].worldToLocal(new THREE.Vector3(0,40,10))
    card_groups.b_startVector = card_groups['banker'].worldToLocal(new THREE.Vector3(0,40,10))

    //초기화
    whole_cards.forEach(function (card) {
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
    let duration_rot = 230    
    let duration_delay2 = 500
    duration.before_reset = 8000;

    const init = () => {
        
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

        //this.clear_bet_coins();

        //카드 철수
        const reset_generator = function*(){
        for(let card of ord_cards){
            yield new TWEEN.Tween({
                x: card.position.x,
                y: card.position.y,
                z: card.position.z,
                rotX: card.rotation.x,
                rotY: card.rotation.y,
                rotZ: card.rotation.z
            })
            .to({
                x: 0,//-350,
                y: 250,//-200,
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
                
            })
            .start()
        }
    }
    const g = reset_generator();   

    new Promise(resolve => {
        vue.score.show = false;
        let q = setInterval( () => {
            let next = g.next()
            if( next.done ) {            
            clearInterval(q)
            setTimeout(()=>{              
                vue.score.player = 0;
                vue.score.banker = 0;              
                resolve()
            },1500)
            }
        }, 110)
    })
    .then(()=>{        
        init()})        
    };


    //카드 등장
    ;(async () => {
        vue.score.show = true;
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

            // 회전및 스코어 기록
            await new Promise(resolve => {
                new TWEEN.Tween({
                    rot: card.rotation[card.userData.isHidden ? 'x' : 'y'],
                    pos: card.position[!card.userData.isHidden ? 'x' : 'y'],
                })
                .to({
                    rot: !card.userData.isHidden ? 2*Math.PI : 0,
                    pos: card.userData.original_position[ !card.userData.isHidden ? 'x' : 'y'] - ( (!card.userData.isHidden) ? 8 : 8)
                }, duration_rot)
                //.easing(TWEEN.Easing.Circular.InOut)
                .onUpdate(a => {
                    card.rotation[ card.userData.isHidden ? 'x' : 'y'] = (a.rot)                
                    card.position[ !card.userData.isHidden ? 'x' : 'y'] = a.pos
                })
                .onComplete(() => {            
                vue.score[card.userData.parent_type] = (vue.score[card.userData.parent_type] + card.userData.value) % 10
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