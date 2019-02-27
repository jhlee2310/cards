export default function(width, height){
    const vue = this.vue;    
    let widthHalf = width/2;
    let heightHalf = height/2;
    let pos = new THREE.Vector3();
    let scaleFactor = width / 1280;        
    let comp = vue.$refs.coins_for_bet
    let default_sizeX = comp.default_size.split(',')[0]
    let default_sizeY = comp.default_size.split(',')[1]
    let offsetX = default_sizeX * scaleFactor / 2;
    let offsetY = default_sizeY * scaleFactor / 2;
    
    pos.y += parseFloat(comp.pos_y)
    pos.project(this.camera)
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;
    pos.z = 0;   
           
    vue.$set(vue.CoinsForBet_style,'width', default_sizeX + 'px')
    vue.$set(vue.CoinsForBet_style,'height', default_sizeY + 'px')
    vue.$set(vue.CoinsForBet_style,'transform',`translate3d(${pos.x-offsetX}px, ${pos.y-offsetY}px, ${pos.z}px) scale(${scaleFactor})`)
 
}