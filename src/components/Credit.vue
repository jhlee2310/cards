<template>
  <div id="credit_wrap" @click.self="onClick">
    <div id="credit_cont">
      <div class="credit_main">
        <div class="credit_header">
          <span :class="{selected:selected(0)}" @click="changeTab(0, $event)">Credit</span>
          <span :class="{selected:selected(1)}" @click="changeTab(1, $event)">Withdraw</span></div>
        <div class="credit_body" :class="{selected:selected(0)}">
          <div class="credit_body_section">
            <div class="section_title">Tokens <span>({{balance}} available)</span></div>
            <div><input v-model="tokens" ref="input_token" @input="inputTest"/></div>
          </div>
          <div class="credit_body_section">
            <div class="section_title">Credit</div>
            <div>{{credit}}</div>
          </div>
        </div>      
        <div class="credit_body" :class="{selected:selected(1)}">        
          <div>Withraw all Credit - <span>{{credit}}</span></div>          
        </div>
      </div>
      <div class="footer">
        <div @click="onClick">Cancel</div>
        <div @click="onSubmit">OK</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data(){
    return{
      balance: 0,
      tokens: '',
      tab: 0,
    }
  },
  computed:{    
    ...mapGetters({
			eosAccount: 'getEosAccount',
			scatter: 'getScatter',
			network: 'getNetwork',
			game_connected: 'getGameConnected',      
      credit: 'getCredit'
		})
  },
  mounted(){
    this.$nextTick(()=>{this.$refs.input_token.focus()});
    this.$eos.getCurrencyBalance('eosio.token',this.eosAccount.name,'EOS').then(result=>{
      this.balance = result[0];
    })
    document.body.style.overflowX = 'hidden'
    document.body.style.overflowY = 'hidden'
  },
  beforeDestroy(){
    document.body.style.overflowX = 'auto'
    document.body.style.overflowY = 'auto'
  },
  methods:{
    changeTab(num,event){
      this.tab = num;
    },
    selected(index){
      return index == this.tab;
    },
    inputTest(e){
      this.tokens = this.tokens.replace(/[^0-9.]/,'');
      this.tokens = this.tokens.replace(/(\..+)([.])/,'$1');
      this.tokens = this.tokens.replace(/([.]\d{4})(.)/,'$1');
    },
    async onSubmit(e){
      if(this.tab == 0){
        if( +this.tokens > this.balance.split(' ')[0]){
          alert('too much request');
          this.tokens = '';
          this.$refs.input_token.focus();
          return;
        }

        if(!this.tokens){
          alert('please input');
          this.$refs.input_token.focus();
          return;
        }      
        this.onClick();
        let value = (+this.tokens).toFixed(4);
        this.proc_insert_coin('baccaratdev1', 'eosio.token', value, 'EOS');
        this.onClick();

      }else if(this.tab == 1){
        this.tosvr_req_coin_out();
        this.onClick();
        
      }
    },
    onClick(e){      
      this.$parent.deposit_open = false;
    },
    async proc_insert_coin(to_account, token_contract, token_value, token_symbol) {
      // 토큰 전송은 게임서버와 연결되었을 때만 하자. 
      if (!this.game_connected || !this.scatter.identity) {
          return; 
      }			
      const account = this.scatter.identity.accounts.find(x => x.blockchain === 'eos');
      const opts = { authorization:[`${account.name}@${account.authority}`], requiredFields:{} };
      //console.log(to_account, token_contract, token_value, opts);
      
      this.$eos.contract(token_contract)
      .then( contract => {
        contract.transfer(account.name, to_account, token_value + ' ' + token_symbol, 'Deposit', opts)        
        .then( trx => {
            //console.log("transfer succ:\n" + JSON.stringify(trx, null, '\t'));
            //console.log('succ', trx.transaction_id, trx.processed.block_num);
            // 게임서버에 돈 입금을 알린다.
            this.tosvr_notify_insert_coin(trx.processed.block_num, trx.transaction_id, account.name, token_value, token_symbol)
        }).catch(err => {console.error(err) });
      }).catch(err => { console.error(err) })
    },
    tosvr_notify_insert_coin(block_num, trx_id, token_sender, token_value, token_symbol) {
      if (!this.$socket || !this.game_connected) return; 
      console.log(token_sender); 
      var req_json = {
          type        : "req_notify_insert_coin",
          block_num   : block_num,
          trx_id      : trx_id, 
          from        : token_sender,
          value       : token_value,
          symbol      : token_symbol
      };
      console.log(req_json)
      this.$socket.send(JSON.stringify(req_json)); 
    },
    tosvr_req_coin_out(){
      if (!this.$socket || !this.game_connected) return; 
      if (!this.scatter || !this.scatter.identity) return; 

      console.log('코인 돌려받기 요청')

      const eosAccount = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
      var req_json = {
          type    : "req_coin_out",
          account : eosAccount.name,
          symbol  : "EOS"
      };

      this.$socket.send(JSON.stringify(req_json)); 
    },
  },  
  
}
</script>

<style lang="scss">
  #credit_wrap{
    position:fixed;
    width:100vw;
    height:100vh;
    top:0;left:0;
    background-color:rgba(0,0,0,.8);
    z-index:999;
    
  }
  #credit_cont{
    text-align:left;
    box-sizing:border-box;
    border-radius:16px;
    top:50%;
    left:50%;
    position:absolute;
    z-index:99;
    width:420px;
    height:280px;
    background-color:white;
    transform:translate(-50%,-50%);
    overflow:hidden;
    .credit_main{
      padding:16px;
      .credit_header{
        text-align:left;
        padding-bottom:10px;        
        font-weight:700;
        font-size:24px;
        border-bottom:1px solid #cccccc;
        span{
          cursor:pointer;
          color: #ccc;
          margin-right:30px;
          &.selected{
            color:black;
          }
        }
      }
      .credit_body{
        &.selected{
          display:block;
        }
        &.withdraw{
          padding-left:16px;
        }
        display:none;
        margin-top:16px;
        .credit_body_section{
          padding-bottom:10px;
          margin-bottom:16px;
          border-bottom:1px solid #cccccc;
          &:last-child{
            border-bottom: none;
          }
          .section_title{
            font-weight:700;
            margin-bottom:10px;
          }
          input{
            width:100%;
            height:22px;
          }
        }
      }
    }

    .footer{
      width:100%;
      position:absolute;
      bottom:0;
      &>div{
        cursor:pointer;
        display:flex;
        box-sizing:border-box;
        background-color:#345ff1;
        width:50%;
        float:left;
        padding:5px;
        justify-content: center;
        align-items: center;        
        height:45px;
        color:white;
        &:first-child{
          background-color:grey;
        }
      }
    }
  }
</style>
