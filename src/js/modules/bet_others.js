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
    this.do_bet(target, sprite, -1, message.acc_name) // visual

    //notice
    const Vue = this.vue
    Vue.bet_info.push(message)
 }