<template>
  <fragment>
    <div v-if="modal1_on" class="game-modal" :style="normal_modal">Start Betting</div>
    <div v-if="modal2_on" class="game-modal" :style="normal_modal">Time</div>
    <div v-if="modal3_on" class="game-modal" :style="normal_modal">Stop Betting</div>    
    <div v-if="!!my_bet_info && start_betting" class="cancel-modal" :style="cancel_modal" @click="tosvr_req_cancel_betting">Cancel</div>
    <div v-if="open_scatter_error" class="msg-modal" :style="msg_modal">
      <div class="msg-close" @click="close_msg()">X</div>
        <div>
          <div>Please download Scatter if it is not installed</div>
          <div class="msg-download" @click="goto_download()">Download</div>
        </div>
    </div>
  </fragment>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapMutations } from 'vuex'

  export default {
    props: ['game','start_betting','my_bet_info','room_id','msg'],
    data() {
      return {
        modal1_on: false,
        modal2_on: false,
        modal3_on: false,
        msg_modal_on : false,
      }
    },
    computed: {
      ...mapState(['resolution','open_scatter_error', 'game_connected','scatter','eosAccount']),
      msg_modal(){
        return {
          position:'absolute',
          top:'50%',
          left:'50%',
          width:'460px',
          height:'220px',
          transform: `translate(-50%,-50%)`,
          zIndex:'10',
          backgroundColor:'rgba(30,30,30,.85)',
          color:'#fff',
          boxSizing:'border-box',
          border:'1px solid #888',
          boxShadow:'5px 5px 20px rgba(0,0,0,.7)',
          display:'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      },
      cancel_modal(){
        let scaleFactor = this.resolution.width/1320
        return {
          fontWeight:700,
          fontSize:'16px',
          position:'absolute',
          top:'83%',
          justifyContent: 'center',
          alignItems: 'center',
          left:'50%',
          display:'flex',
          width:`140px`,
          height:'40px',
          backgroundColor:'rgba(255,0,0,.75)',
          cursor:'pointer',
          color:'white',
          zIndex:7,
          transform: `translate(-50%,-50%) scale(${scaleFactor})`,
        }
      },
      normal_modal(){
        let scaleFactor = this.resolution.width/1320
        
        return {
          fontWeight:700,
          fontSize:'20px',
          position:'absolute',
          top:'22%',
          justifyContent: 'center',
          alignItems: 'center',
          left:'50%',
          display:'flex',
          width:`200px`,
          height:'50px',
          backgroundColor:'black',
          color:'white',
          transform: `translate(-50%,-50%) scale(${scaleFactor})`,

        }
      },
    },
    methods: {
      ...mapMutations(['SET_OPEN_SCATTER_ERROR']),
        close_msg(){
          this.SET_OPEN_SCATTER_ERROR(false)
        },
        goto_download(){
          window.open('https://get-scatter.com/');
        },
        clearBetCoin(name){
          this.game.clear_bet_coins(name);
        },
        proc_cancel_bet(){
          //bet_info에서 자기자신 빼기          
          this.$parent.bet_info = this.$parent.bet_info.filter(t=>{
            return t.acc_name !== this.eosAccount.name
          })

          //배팅 코인 그래픽 빼기 //배팅 네임태그 빼기
          this.clearBetCoin(this.eosAccount.name);    

        },
        tosvr_req_cancel_betting() {
          if (!this.$socket || !this.game_connected) return; 
          if (!this.scatter || !this.scatter.identity) return; 
          
          const eosAccount = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');

          var req_json = {
              type    : "req_cancel_betting",
              account : eosAccount.name,
              room_id : this.room_id
          };          
          this.$socket.send(JSON.stringify(req_json));
          this.proc_cancel_bet();
      }
    },
    mounted(){
      
    },
    watch: {
      start_betting(newVal, oldVal){        
        if(newVal == true){
          this.modal1_on = true;
          setTimeout(()=>{
            this.modal1_on = false;
            this.modal2_on = true;
          },2500)
        }else if(newVal == false){
          this.modal2_on = false;
          this.modal3_on = true;
          setTimeout(()=>{
            this.modal3_on = false;
          },2000)
        }
      }
    }
  }
</script>

<style lang="scss">
 .msg-modal{
   .msg-close{
     font-weight:500;
     font-size:18px;
     position:absolute;
     top:4px;right:4px;
     color:#ccc;
     cursor:pointer;
     &:hover{
       color:rgb(255, 255, 255);
     }
   }
   .msg-download{
     margin-top: 60px;
     padding:5px 8px;
     box-sizing:border-box;
     background-color:rgb(26, 102, 189);
     width:125px;margin-left:auto;margin-right:auto;
     border-radius:99px;
     cursor:pointer;
   }
 }
</style>