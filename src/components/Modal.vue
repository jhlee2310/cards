<template>
  <fragment>
    <div v-if="modal1_on" class="game-modal" :style="normal_modal">Start Betting</div>
    <div v-if="modal2_on" class="game-modal" :style="normal_modal">Time</div>
    <div v-if="modal3_on" class="game-modal" :style="normal_modal">Stop Betting</div>
    <div v-if="modal3_on" class="game-modal" :style="normal_modal">Stop Betting</div>
    <div v-if="!!my_bet_info && start_betting" class="cancel-modal" :style="cancel_modal" @click="tosvr_req_cancel_betting">Cancel</div>
  </fragment>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapMutations } from 'vuex'

  export default {
    props: ['game','start_betting','my_bet_info','room_id'],
    data() {
      return {
        modal1_on: false,
        modal2_on: false,
        modal3_on: false,
      }
    },
    computed: {
      ...mapState(['resolution','modal1_msg', 'game_connected','scatter','eosAccount']),
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
      ...mapMutations(['SET_MODAL1_MSG']),
        clearBetCoin(name){
          this.game.clear_bet_coins(name);
        },
        proc_cancel_bet(){
          //bet_info에서 자기자신 빼기          
          this.$parent.bet_info = this.$parent.bet_info.filter(t=>{
            return t.acc_name !== this.eosAccount.name
          })

          //배팅 코인 그래픽 빼기
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

          console.log(req_json);
          this.$socket.send(JSON.stringify(req_json));
          this.proc_cancel_bet();
      }
    },
    mounted(){
      console.log(this.eosAcount)
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
 
</style>