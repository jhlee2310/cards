export default function(){
    const info = this.deal_info
    const b_cards = info.deal.banker.cards
    const p_cards = info.deal.player.cards

    this.game.changeCardsMtl(p_cards,b_cards);
}