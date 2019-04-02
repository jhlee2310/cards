<template>
  <div ref="room_root">
    <div ref="hiddenDiv" v-show="false" style="width:256px;height:256px;">   
      <div v-for="(item, index) in hiddenData" :style="hiddenStyle.div(index == 2 ? 1 : 0)" :key="index">
        <div style="font-size:32px;position:relative">            
          <span style="position:absolute;left:0px;"><img src="@/images/human.png" style="width:30px;height:30px;position:relative;">{{item[1]}}</span>
          <span :style="hiddenStyle.percent">{{item[2]}}%</span>
        </div>
      </div>
    </div>      
    
    <div id="cont_3d" ref="cont_3d" :style="{
      width: resolution.width + 'px',
      height: resolution.height + 'px',
      position: 'relative',
    }">
      <!--debug-->
      <div class="debug_status" style="position:absolute;top:4.5%;left:50%;color:#00FF00" :style="tableNumStyle">{{game_status.status}}</div>
      <!--Room Number -->
      <div class="table-number" :style="tableNumStyle">
        <span>TABLE</span><span style="margin-left:20px;">{{room_id}}</span>
      </div>
      <!--round Number -->
      <div class="round-number" :style="roundNumStyle">
        <span>ROUND</span><span style="margin-left:20px;">{{game_status.round}}</span>
      </div>
      <!--modal-->
      <Modal :timer="timer" :start_betting="game_status.betting" :my_bet_info="my_bet_info" :room_id="room_id" :game="$game"/>
      
      <!--timer-->
      <div :class="timer < 4?'timer active':'timer'" v-show="game_status.betting && timer " ref="timer" :style="timerStyle">{{timer}}</div>

      <!--NameTags-->
      <NameTags :coin_groups="coin_group_labels" :resolution="resolution"/>      

      <!--스코어-->
      <transition name="fade">
        <div v-show="score.show" :style="score_player_style" class="score player" ref="score_player">{{score.player}}</div>
      </transition>
      <transition name="fade">
        <div v-show="score.show" :style="score_banker_style" class="score banker" ref="score_banker">{{score.banker}}</div>
      </transition>

      <!-- bet_info -->
      <div class="bet_info">
        <div class="bet_info_wrap" :style="bet_info_style">
          <div v-for="(data, index) in bet_info" class="bet_info_item" :key="index">
            <span :class="classBtoA(data.slot)"><div class="is-pair"></div></span>
            <span>{{data.acc_name}}</span>
            <span>{{parseFloat(data.value).toFixed(2)}}</span>
            <span>{{data.symbol}}</span>
          </div>
        </div>
      </div>

      <!--winners-->
      <Winners :winner="game_status.winner" :pair="game_status.pair"/>

      <!--OtherTables-->
      <div class="tables_wrap" :class="{hidden:toggles.OtherTables}" :style="otherTableStyle">
        <OtherTables :list="room_list"></OtherTables>
        <div class="toggle-other-tables" @click="toggles.OtherTables=!toggles.OtherTables">
          <div><span>Tables</span><i class="tables_btn fas fa-caret-right"></i></div>
        </div>
      </div>

      <!-- bet_info_total -->
      <div class="bet_info_total">        
        <div><span>PLAYER</span><span>{{bet_info_total[0]}}</span></div>
        <div><span>BANKER</span><span>{{bet_info_total[1]}}</span></div>
        <div><span>TIE</span><span>{{bet_info_total[2]}}</span></div>
        <div><span>P.PAIR</span><span>{{bet_info_total[3]}}</span></div>
        <div><span>B.PAIR</span><span>{{bet_info_total[4]}}</span></div>
      </div>      
    </div>
    <!-- bottom_ui -->
    <div style="position:relative;width:100%;height:0;">
      <CoinsForBet ref="coins_for_bet" :betting="game_status.betting" :selected="selectedCoin"/>
    </div>
      <CreditInfo :bet="my_bet_info" :saved="saved_my_bet">        
        <board :roomId="parseInt(room_id)" :room_detail="room_detail" ref="board"></board>
      </CreditInfo>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'
import Modal from '@/components/Modal.vue'
import CreditInfo from '@/components/CreditInfo.vue'
import CoinsForBet from '@/components/CoinsForBet.vue'
import NameTags from '@/components/NameTags.vue'
import Winners from '@/components/Winners.vue'
import OtherTables from '@/components/OtherTables.vue'
import rasterizeHTML from 'rasterizehtml'


export default {
  components: { Modal, CreditInfo, CoinsForBet, NameTags, Winners, OtherTables},
  props: ['room_id','loaded'],
  created(){
    this.$game.vue_room = this;
  },
  data(){
    return {
      history_move_start: false,
      toggles:{
        OtherTables: true,
      },
      hiddenStyle:{
        percent:{                    
          textAlign: 'center',          
          fontSize: '1em',
          float:'right',          
        },
        div(n){
          return{
            width: (n==0) ? '100%' : '76%',
            fontSize: '999px',
            //lineHeight: '1em',
            fontFamily: 'Arial',
            fontWeight: 500,
            color: '#fff',
            overflow: 'hidden',            
            height:'51.2px'
          }
        }
      },
      bet_info_style:{
        
      },
      selectedCoin:{
        index: null,
        value: null,
      },
      score: {
        player: 0,
        banker: 0,
        show: false,
      },
      game_status: {
        status: '',
        betting: null,
        bet_start: null,
        table:0,
        round:0,
        winner: '',
        pair: '',
      },
      saved_my_bet: [],
      room_detail: null,
			timer: '',
      room_bead: '',
      bet_info: [],
      coin_group_labels: [],
    }
  },
  methods: {
    ...mapMutations([
      'SET_WINDOW_RESOLUTION',
      'SET_ROOM_ID',
      'SET_CREDIT',
      'SET_OPEN_SCATTER_ERROR',
      'SET_ROOM_LIST',
    ]),
    tosvr_req_betting(symbol, value, slot) {          
      
      if (!this.$socket || !this.game_connected) return;
      if (!this.eosAccount) return;      
      
      var req_json = {
        type    : "req_betting",
        account : this.eosAccount.name,
        symbol  : symbol,
        value   : value,
        slot    : slot
      };        
          
      this.$socket.send(JSON.stringify(req_json)); 
    },
    onMouseClick(e){
      if( e.target.tagName != 'CANVAS' && e.target.getAttribute('class') != "name_tag") return;
      else{
        if(this.game_status.bet_start){
          if(!this.eosAccount) {          
            this.SET_OPEN_SCATTER_ERROR(true)
            return;
          }
          else{
            this.$game.onMouseClick(e);
          }
        }        
      }
    },
    init_betting_info(){      
      this.bet_info = [];
      this.coin_group_labels = [];

      //배팅존에 내재된 used 배열 리셋
      for(let z of this.$game.betZones){
        z.parent.userData.zones = [];
      }
    },
    onMouseMove(e){      
      this.$game.onMouseMove(e);      
    },
    save_my_bet(){
      if(this.eosAccount && this.eosAccount.name){
        if(!this.my_bet_info.sum){
          console.log('배팅금액이 없으므로 저장안함')
          return;
        }          
        this.saved_my_bet = {
          array: this.my_bet_info.array.slice(),
          sum: this.my_bet_info.sum,
        }
      }
    },
    classBtoA(index){
      switch(index){
        case 0:
        return "beadRoad-t";
        break;
        case 1:
        return "beadRoad-p";
        break;
        case 2:
        return "beadRoad-b";
        break;
        case 3:
        return "beadRoad-p pair";
        break;
        case 4:
        return "beadRoad-b pair";
        break;
      }
    },
    restore_bettings(bettings){
      let array = []

      if(typeof bettings != 'undefined'){
        let keys = Object.keys(data.bettings)
        
        keys.forEach(( acc_name, index) => {
          let row = data.bettings[acc_name];
          let slots = Object.keys(row);
          slots.forEach( slot => {
            let symbol = Object.keys(row[slot])[0]
            let obj = {
              type: "room_betting",
              acc_name: acc_name,
              symbol: symbol,
              value: row[slot][symbol],
              slot: slot
            }
            array.push(obj)
          })            
        })
      }

      (async function(){        
        for(let mes of array){
          this.$game.bet_others(mes);
          await new Promise(res=>setTimeout( res, 30 ) )
        }
      }.bind(this))()      
    },
    init_before_detail(){
      // 카드 애니메이션 즉시 종료
      this.eBus.$emit('toWorker',{
        type:'stop_animation'
      })

      //bet_info_history 종료
      clearInterval(this.handleInterval);
      this.history_move_start == false;
      this.bet_info_style = {};

      this.score = {
        player: 0,
        banker: 0,
        show: false,
      };
      this.game_status.betting = null;      
      this.timer = '';
      this.$game.restoreColor();
      this.$game.clearSelectedObject();
      this.$game.hideWinners();
      this.$game.init_before_detail();
      this.$game.clear_bet_coins();
      this.bet_info = [];
      this.coin_group_labels = [];
      this.game_status.status = '';
    },
    proc_room_detail(data, oldData){      
      //console.log(data)
      window.dispatchEvent(new Event('resize'))
      this.init_before_detail()      
      this.game_status.round = data.round
      this.game_status.status = data.state;
      switch(data.state){
        case "betting":
          let time = data.stateTick;
          this.eBus.$emit('toWorker',{
            type: 'start_bet_timer',
            time: time,
          });
          this.game_status.betting = -1;                    
          this.restore_bettings(data.betting);
        break;
        case "betting::chain":
        break;
        case "dealing": case "dealing::chain":
        const p_cards = data.deal.player.cards;
        const b_cards = data.deal.banker.cards;
        const result = data.deal.result;
        
          this.score = {
            player: data.deal.player.score,
            banker: data.deal.banker.score,
            show: true
          };

          this.$game.animateCards.init({
            p_cards, b_cards, result, vue_room: this,
          });
          this.$game.animateCards.restoreDeal();
          // 배팅관련
          //"bettings": { "eosblackkiko": { "0": { "EOS": "0.1000" }, "1": { "EOS": "0.2000" }, "2": { "EOS": "0.2000" } } } }
          // type: "room_betting", acc_name: "eosblackkiko", slot: 1, symbol: "EOS", value: "1.00"
          //this.bet_info = {acc_name: "eosblackkiko", slot: 1, symbol: "EOS", value: "1.00"}
          this.restore_bettings(data.betting); // 데이터 복원
        break;
        
      }
    },
    enterRoom(number){      
      this.$socket.sendOBJ({
        type: "req_enter_room",
        room_id : number || this.room_id
      })      
    },
    onResize(e){
      const _width = this.$refs.room_root.clientWidth;
      const _height = _width * 0.36
      this.SET_WINDOW_RESOLUTION([_width,_height])
      this.$game.onResize(e)
    },
    roundInit(){
      this.game_status.round = 1
      this.$refs.board.setInit()
    },
  },
  computed: {
    ...mapState([
      'game_loaded', 'resolution', 'welcome', 'credit', 'eosAccount', 'game_connected', 'room_list'
    ]),
     hiddenData(){      
      let arrays = [[0,[],0],[0,[],0],[0,[],0],[0,[],0],[0,[],0]];
      let totalValue = 0;
       const rSlot = (i) => {
          let s = [2,1,3,0,4]
          return s[i]
        }

      for(let item of this.bet_info){       
        totalValue += +item.value;
        let slot = arrays[rSlot(item.slot)]        
        slot[0] = (+slot[0] + +item.value).toFixed(1)
        

        if( slot[1].indexOf(item.acc_name) == -1) slot[1].push(item.acc_name)        
      }

      arrays.forEach(slot => {
        slot[2] = totalValue == 0 ? 0 : parseInt( slot[0] / totalValue * 100 )
        slot[1] = slot[1].length
      })
      return arrays
    },
    otherTableStyle(){
      let scalefactor = this.resolution.width / 1920;
      let X = this.toggles.OtherTables ? (-scalefactor * 560) + 'px' : 0 ;
      return {
        transform: `translate(${X},-50%) scale(${scalefactor})`
      }
    },
    bet_info_total(){
      const obj = [0,0,0,0,0];
      const aTob = index => {
        let slots = [2,0,1,3,4];
        return slots[index]
      }
      this.bet_info.forEach( (t, i)=>{
        let s = aTob(t.slot);
        obj[s] = +obj[s] + parseFloat(t.value);
        obj[s] = parseFloat(obj[s]).toFixed(1);
      })      
      return obj;
    },
    
    timerStyle(){
      let scaleFactor = this.resolution.width / 1320
      return {
        transform: `translate(-50%, -50%) scale(${scaleFactor})`
      }
    },
    score_player_style(){
      let scaleFactor = this.resolution.width / 1320
      return{
        transform: `translate(-50%, -50%) scale(${scaleFactor}`
      }
    },
    score_banker_style(){
      return this.score_player_style
    },
    my_bet_info(){
      let sum = 0;
      let array = [];
      if(this.eosAccount){
        for(let bet of this.bet_info){
          if(bet.acc_name == this.eosAccount.name){
            sum = +sum + +bet.value
            sum = parseFloat(sum).toFixed(4);
            array.push(bet)
          }
        }
      }
      return { array, sum }
    },
    scaleFactor(){
      return this.resolution.width / 1320
    },
    tableNumStyle(){
      return {        
        transform:`translate(-50%,-50%) scale(${this.scaleFactor})`
      }
    },
    roundNumStyle(){
      return {        
        transform:`translate(-50%, -50%) scale(${this.scaleFactor})`
      }
    },
  },
  async mounted(){
    this.eBus.$on('close_tables', ()=>{
      this.toggles.OtherTables = true;;
    });
    this.eBus.$on('socket', data => {
			//console.log("data",data)
      switch(data.type){
        case "welcome":          
          break;
        case "room_detail":        
          this.room_detail = data
					break;
				case 'room_bead':
          if(this.room_id == data.room_id){
            this.room_bead = data
          }
          break;
        case 'deal_info':
          const b_cards = data.deal.banker.cards
          const p_cards = data.deal.player.cards
          const result = data.deal.result      
          this.$game.animateCards.init({
              p_cards, b_cards, result, vue_room: this,
            });
          this.eBus.$emit('toWorker', {
            type: 'start_cards_animation',
            data: data.deal,
          })
          break;
        case 'room_state':
          this.game_status.status = data.state;
          /**
           * http://192.168.0.7:8081/issues/1126 참조
           * prepare_game	게임 준비중. 카드슈를 준비하는 상태
              prepare_game::chain	게임 정보를 체인에 동기화. 클라입장에서는 prepare_game와 같다.
              prepare_round	라운드를 준비하는 상태
              prepare_round::chain	라운드 정보를 체인에 동기화. 클라입장에서는 prepare_round와 같다.
              betting	배팅 가능 상태
              betting::chain	배팅정보를 체인에 동기화.
              dealing	카드 오픈
              dealing::chain	카드 오픈 및 돈분배를 체인에 동기화
          */
          switch(data.state){
						case 'betting':
              this.$set(this.game_status,'round', data.round)              
              this.eBus.$emit('toWorker',{
                type: 'start_bet_timer',
                time: 0,
              })
              this.game_status.betting = true;

              /*
              new TWEEN.Tween({ y: 0 })
              .to({y: -1}, 20000)
              .onUpdate(a => {
                this.bet_info_style = {
                  transform: `translate(0px, ${a.y*1000}px)`
                }
              })
              .onComplete(() => {})
              .start()*/
              break;
            case 'betting::chain':
              this.game_status.betting = false;
              //this.game_status.bet_start = false;            
              //색상 복원
              this.$game.restoreColor();
              this.$game.clearSelectedObject();
              //커서 복원
              document.body.style.cursor = "default";
              //나의 배팅정보를 기록함
              this.save_my_bet();
              break;
            case 'dealing':              
            break;            
            case 'prepare_round':
              if(data.round != 0)
                this.$refs.board.nextRound(this.room_bead);
                this.$game.animateCards.reset();
                this.$set(this.game_status,'winner','')
                this.$set(this.game_status,'pair','')
                this.init_betting_info();
                console.log('배팅정보를 초기화합니다.');
              break;
            case 'prepare_game':
              this.roundInit()
            break;            
          }
        break;
        case 'room_betting':          
          this.$game.bet_others(data)
        break;
        case 'room_list':
         this.SET_ROOM_LIST(data.rooms);
        break;
      }     
    })    
    this.$socket.sendOBJ({
      type: "req_room_list",
      offset  : 0,
      count   : 10
    });
    

    this.eBus.$on('worker', data => {      
      switch(data.type){
        case "worker::timer":
          this.timer = data.value
          break;
        case "worker::cards_drop":
          ;(async()=>{
            if(data.index >= 2 ){

            }
            console.log(data);
            this.$game.animateCards.moveCard(data.index,600,1)            
          })()          
        break;

        case "worker::cards_open_quick":
          ;(async()=>{
            this.$game.animateCards.rotateCard(data.index,200,4)
          })()          
        break;

        case "worker::cards_open_long":
          ;(async()=>{
            this.$game.animateCards.slideCard(data.index,200)
          })()          
        break;
        
        case "worker::cards_out":
        /*
          this.$game.animateCards.reset();
          //this.$set(this.game_status,'winner','')
          //this.$set(this.game_status,'pair','')
          this.init_betting_info();
          console.log('배팅정보를 초기화합니다.');
          */
        break;

        case "worker::expose_winner":
          this.$set(this.game_status,'winner', this.room_bead.bead.split(',')[0]);
          this.$set(this.game_status,'pair', this.room_bead.bead.split(',')[1]);
        break;
      }
    });

    this.$refs.cont_3d.appendChild( this.$game.renderer.domElement )
    this.enterRoom();

    window.addEventListener('resize', this.onResize );
    window.addEventListener('mousemove',this.onMouseMove,false)
    window.addEventListener('click',this.onMouseClick,false)
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.onResize );
    window.removeEventListener('click',this.onMouseClick)
    this.eBus.$off('socket');
    this.eBus.$off('worker');
    this.eBus.$off('close_tables');
    window.removeEventListener('mousemove',this.onMouseMove)
  },
  beforeRouteEnter( to, from, next){
    //deep link
    if( from.name == 'lobby' ){
      to.meta.req_enter = true
    }
    next();
  },
  beforeRouteUpdate (to, from, next) {
    //router link
    const number = to.params.room_id
    this.$refs.board.setInit();
    this.enterRoom(number);
    
    //console.log(to, from)
    next()
  },
  watch: {
    bet_info(newV, oldV){
      if( newV.length == 1 && oldV.length == 0 && this.history_move_start == false){
        this.history_move_start == true;
        let t = 0;
        let factor = -0.7;
        this.handleInterval = setInterval(()=>{
          let offset = factor*(t++)
          this.bet_info_style = {
              transform: `translateY(${offset}px)`
          }
          if(offset < -3000 ) {
            clearInterval(this.handleInterval);
            this.history_move_start == false;
          }
        },15)
      }
    },
    room_id : {
      handler(newVal){
        if(newVal === null) return;
        this.SET_ROOM_ID(newVal)
      },
      immediate: true
    },
    room_detail(data, oldData){
      this.proc_room_detail(data, oldData)
    },
     hiddenData: {
      handler(nv,ov){                
        const ctx = this.$parent.$refs.hiddenCanvas.getContext('2d');      
        ctx.clearRect(0, 0, 255, 255);
        this.$nextTick(()=>{
          rasterizeHTML.drawHTML(this.$refs.hiddenDiv.innerHTML, this.$parent.$refs.hiddenCanvas)
         .then((a) => {           
            this.$game.textLabels.forEach((label, i) => {
              label.material.map.needsUpdate = true;
            })
          })
        })
      },
      deep: true,
      //immediate: true,
    },    
  }
}

</script>

<style lang="scss">
  @mixin bet-info{
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: inline-flex;  
    color:white;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
  }

  #cont_3d{
    user-select: none;
    overflow:hidden;
    .tables_wrap{
      background-color:rgba(0,0,0,.35);
      transform-origin:0 50%;
      position:absolute;
      box-sizing:border-box;
      width:560px;
      height:640px;
      top:50%;
      padding:12px;
      padding-right:0;
      left:0px;
      transition:0.4s left;
      .tables_btn{
        transform: rotateZ(90deg);
        transition: 0.2s transform;        
      }
      &.hidden{        
        .tables_btn{transform: rotateZ(-90deg)}
      }
    }
    .toggle-other-tables{
      @media (hover:hover){
        &:hover{
          color:yellow;
        }
      }
      cursor:pointer;
      position:absolute;
      background-color:#000;
      color:white;
      font-size:18px;
      width:40px;
      height:100px;
      top:50%;
      left:100%;      
      transform:translate(0,-50%);
      &>div{
        position:absolute;
        top:50%;left:50%;
        transform: translate(-50%,-50%) rotateZ(90deg);
        &>i{
          margin-left:12px;
          transform: rotate(-90deg)
        }
      }
    }
    .bet_info{
      font-size:13px;
      position:absolute;
      left:0;
      top:0%;
      width:200px;
      height:500px;  
      color:yellow;
      /*overflow:hidden;  */
      -webkit-mask-image: -webkit-gradient(linear, left 20%, left 0, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
      .bet_info_item{
        margin-bottom:5px;
        margin-left:5px;
        text-align:left;
        &>span{
          margin-right:8px;
        }
        .beadRoad-b {
          @include bet-info;
          background-color: red;
          &::after{
            content:"B";
          }
          .is-pair{
            display:none;
            position:absolute;
          }
          &.pair{
            background-color:#cccccc;
            color:#cccccc;    
            .is-pair{
              display:block;
              top:0;
              left:0;
              width:6px;
              height:6px;
              background-color:red;
              border-radius:50%;
            }
          }
          

        }
        .beadRoad-p {
          @include bet-info;
          background-color: blue;
          &::after{
            content:"P";
          }
          &.pair{
            background-color:#cccccc;
            color:#cccccc;    
            .is-pair{
              display:block;
              bottom:0;
              right:0;
              width:6px;
              height:6px;
              background-color:blue;
              border-radius:50%;
            }
          }
          .is-pair{
            display:none;
            position:absolute;
          }
        }
        .beadRoad-t {
          @include bet-info;
          background-color: green; 
          &::after{
            content:"T";
          }
          .is-pair{
            display:none;
          }
          //margin: 1px;
          //font-size:10px;
        }
      }
    }

    .bet_info_wrap{  
      width:100%;
      position:absolute;
      top:500px;
      white-space: nowrap;      
    }
    .table-number{
      color: #fff;     
      font-size: 24px;
      position: absolute;
      top: 5%;
      left:25%;
    }
    .round-number{
      color: #fff;     
      font-size: 24px;
      position: absolute;
      top: 5%;
      left: 75%;
    }
    .timer{
      color:#fff;
      display:flex;
      justify-content:center;
      align-items: center;
      font-size: 36px;
      position:absolute;
      left:50%;
      top:37%;      
      width:76px;
      height:76px;
      border:3px solid #fff;
      box-sizing:border-box;
      border-radius:50%;
			&.active {
				animation: ani 1s infinite;
				color: red;
				border-color: red;
			}
    }
    .score{
      position:absolute;
      top:37.5%;
      font-weight:500;
      font-size:30px;
      width: 30px;
      height:30px;
      color:white;
      &.player{
        left:39.5%;
      }
      &.banker{
        left:60.5%;
      }
    }

    .bet_info_total{
      color:yellow;
      position:absolute;
      top:10px;
      right:0;
      width:200px;
      &>div>span{
        display:inline-block;
        text-align:right;
        width:40%;
        margin-right:10px;
        &:nth-child(1){
          width:50%;
        }
      }
    }
  }
	@keyframes ani {
		from {
			font-size: 24px;
			width:45px;
      height:45px;
		}
		to {
			font-size: 36px;
			width:76px;
      height:76px;
		}
	}

</style>
