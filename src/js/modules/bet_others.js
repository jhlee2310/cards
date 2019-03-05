export default function(message, betZones){
/*
{type: "room_betting", acc_name: "eosblackkiko", slot: 1, symbol: "EOS", value: "1.0000"}P
{type: "room_betting", acc_name: "eosblackkiko", slot: 2, symbol: "EOS", value: "1.0000"}B
{type: "room_betting", acc_name: "eosblackkiko", slot: 3, symbol: "EOS", value: "1.0000"}PP
{type: "room_betting", acc_name: "eosblackkiko", slot: 4, symbol: "EOS", value: "1.0000"}BP
{type: "room_betting", acc_name: "eosblackkiko", slot: 0, symbol: "EOS", value: "1.0000"}T
*/
    const reverseTable = [2, 1, 3, 0, 4]
    const reverseCoin = [0.1, 1, 10, 50, 100, 500, 1000, 5000, 100000]
    
    let target_index = message.slot    
    let target = betZones[ reverseTable[target_index] ]
    let sprite = {
        index: reverseCoin.indexOf(parseFloat(message.value)),
        value: parseFloat(message.value)
    }
    this.do_bet(target, sprite, -1, message.acc_name)

    /*
    const show_bet = (cont, p, q) => {
        
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
        }*/
}