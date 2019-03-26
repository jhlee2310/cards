<template>
  <div class="lobby" :style="boardScale">     
   <!-- bet_info_total -->
   <div class="room" v-for="(data,i) in roomList" :key="i" style="color:#fff;position: relative;width:610px;float:left;" @click="goGame(data.room_id)" @mouseenter="view(i, $event)" @mouseleave="view(i, $event)">
     <div :ref="`view${i}`" style="position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(230, 120, 0, 0.3);
    text-align: center;
    z-index: 2;
    visibility:hidden;
    ">
       <div>BET MIN 0000 MAX 0000</div>
       <div>TIE MIN 0000 MAX 0000</div>
       <div>PAIR MIN 0000 MAX 0000</div>
     </div>
     <div style="text-align:left;">ROOM: {{data.room_id}}</div>
     <div style="text-align:left;">ROUND: {{data.round}}</div>
     <div style="text-align:left;">USERS: {{data.watchers}}</div>
    <board :ref="`board${i}`" :roomId="i" lobby></board>
   </div>
  </div>

  
</template>

<script>
import Board from '@/components/Board.vue'
import { mapState, mapGetters, mapActions, mapMutations} from 'vuex'

export default {
	components:{
    Board,
  },
  data(){
    return {
      roomList: [1,2,3,4,5,6,7,8,9,10,11,12],
      mainWidth: 0,
    }
  },
  mounted(){
    if(!this.$socket){
      console.log("socket 연결")
		  this.$connect()
    }else{
      if(this.room_id){
        this.$socket.send(JSON.stringify({
            type: "room_leave",
            room_id : 0
        }))
        this.setRoomId(null)
      }

      this.$socket.send(JSON.stringify({
          type    :"req_room_list",
          offset  : 0,
          count   : 10
      }))
    }
    
    window.vv = this
    this.$socket.onmessage = (mes)=>{      
    const message = JSON.parse(mes.data)
      console.log("message",message)
      switch(message.type){
				case 'welcome':
          console.log('game_connected');
          this.$socket.send(JSON.stringify({
              type    :"req_room_list",
              offset  : 0,
              count   : 10
          }))

          break;
        case 'room_list':
          this.roomList = message.rooms
          this.$nextTick(()=>{
            // console.log('room_list');
            // console.log('this.$refs',this.$refs)
            message.rooms.forEach((data,i) => {
              let num = 'board'+i
              //console.log()
              this.$refs[num][0].setRound(data)
              
            });

          })
          break;

        case 'room_state':
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
          switch(message.state){           
            case 'prepare_round':
              if(message.round != 0)
                
              break;
            case 'prepare_game':
              this.roundInit()
              break;
          }
          break;
        case 'room_bead':
          let i = message.room_id-1
          let num = 'board'+i
          //console.log("num",num)
          if(message.round ==1){
            this.$refs[num][0].setInit()
          }
          this.roomList[i].round = message.round
          this.$refs[num][0].nextRound(message)
          //this.$refs.board.nextRound(message)

          break;
        default:
          break;
          //console.log(message)
      }
      
       
    }

    window.addEventListener('resize',this.onWindowResize,false)
    window.dispatchEvent(new Event("resize"))

  },
  computed:{
		...mapGetters({
      eosAccount: 'getEosAccount',
      scatter: 'getScatter',
			network: 'getNetwork',
			eos: 'getEos',
			game_connected: 'getGameConnected',
			room_id: 'getRoomId',
    }),
    boardScale(){
      let scale
      if(this.mainWidth >= 1800){
        scale = this.mainWidth/1800
      }else if(this.mainWidth >= 1200){
        scale = this.mainWidth/1200
      }else if(this.mainWidth >= 600){
        scale = this.mainWidth/600
      }

      return {
        //transform: `scale(${scale})`,
        //transformOrigin: "0% 0%",
      }
    },

  },
  methods: {
    ...mapActions({
			setRoomId: 'setRoomId',
		}),
    roundInit(){
      this.$refs.board.setInit()
    },
    goGame(roomId) {
      this.$router.push({path: `/baccarat/${roomId}`})
    },
    view(idx,e){
      if(e.type == 'mouseleave'){
        this.$refs[`view${idx}`][0].style.visibility = 'hidden'
      }else{
        this.$refs[`view${idx}`][0].style.visibility = 'visible'

      }
      // console.log(e)
      // console.log(this.$refs[`view${idx}`])
    },
    onWindowResize(){
      this.mainWidth = document.querySelector('main').clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
  .lobby {
    user-select: none;
    z-index: 3;
    position: relative;
    background-color: #000;
    margin: 0 auto;
    overflow: hidden;
    // div:hover {
    //   background-color: #000 !important;
    // }
    @media (min-width: 1836px){
      &{
        width:1830px;
      }
    }
    @media (max-width: 1835px){
      &{
        width:1220px;
      }
    }
    @media (max-width: 1199px){
      &{
        width:610px;
      }
    }
    
  }
    .room {
      &:nth-child(3n+1){
      @media screen and (min-width: 1836px){
          &{
            clear: both;
          }
        }
      }
      
      &:nth-child(2n+1){
      @media screen and (min-width: 1200px) and (max-width: 1835px){
          &{
            clear: both;
          }
        }
      }
      &:nth-child(n+1){
      @media screen and (max-width: 1199px){
          &{
            clear: both;
          }
        }
      }
    }

</style>

