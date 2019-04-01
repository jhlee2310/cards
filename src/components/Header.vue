<template>
  <header id="header_wrap">
    <Credit v-if="deposit_open"/>
    <Bonus v-if="bonus_open"/>
    <nav id="nav">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/logo.png">
        </router-link>
      </div>
      <div class="menu">
        <router-link to="/baccarat/">Baccarat Lobby</router-link>
        <!-- <router-link to="#bouns">Bonus</router-link> -->
				<a @click="()=>{this.bonus_open = true}">Bonus</a>
        <router-link to="#freecpu">Free CPU</router-link>
        <!-- <div style="line-height:0;"><img src="@/assets/speaker.png"/></div> -->
        <router-link to="#fairness">Fairness</router-link>
        <div class="deposit" v-if="eosAccount" @click="()=>{this.deposit_open = true}">Deposit</div>
        <div class="login"
          :style="{
				'background-color': eosAccount==null?'#00a8ff':'unset',
				'border': eosAccount==null?'none':'solid 1px #00a8ff'
			}"
        >
          <span v-if="!eosAccount" @click="proc_getIdentity">
            Log in with
            <span style="font-weight: bold;">Scatter</span>
          </span>
          <span v-else @click="proc_forgetIdentity">
            <span>{{eosAccount.name}}</span>
          </span>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
// import ScatterJS from 'scatterjs-core'
// import ScatterEOS from 'scatterjs-plugin-eosjs'
//import Eos from 'eosjs'
// ScatterJS.plugins( new ScatterEOS() );
import Vue from 'vue';
import Credit from "@/components/Credit.vue";
import Bonus from "@/components/Bonus.vue";

export default {
  name: "appheader",
  components: {
    Credit,
    Bonus,
  },
  data() {
    const that = this;
    this.ee = null;
    return {
			eos: [],
			menu_open:'',
      deposit_open: false,
      bonus_open: false,      
      //eosAccount: null,
      //scatter: ScatterJS.scatter,
      chatWelcome: false
    };
  },
  computed: {
    ...mapState(["open_scatter_error"]),
    ...mapGetters({
      eosAccount: "getEosAccount",
      //scatter: "getScatter",
      network: "getNetwork",
      game_connected: "getGameConnected",
      Eos: "getEos"
    })
  },
  mounted() {
    
    document.addEventListener('scatterLoaded', () => {
      console.log(window.scatter)
      //this.scatter = window.scatter;
      //window.scatter = null;
      //this.connectScatter();
    });

    this.connectScatter();
    
    window.hh = this;
  },
  methods: {
    ...mapActions({
      setEosAccount: "setEosAccount",
      setCredit: "setCredit",
      setOpenScatterError: "setOpenScatterError"
    }),
    tosvr_set_scatter_identity(name) {      
      this.$socket.sendOBJ({
        type: "req_set_scatter_identity",
        identity: name,
      })      
    },
    async proc_forgetIdentity() {
      if (!this.scatter.identity) return;

      await this.scatter.forgetIdentity();
      this.setEosAccount(null);
      this.setCredit(0);

      this.tosvr_set_scatter_identity("");
    },
    async proc_getIdentity(e) {
      let scatter = this.scatter;
      if(window.scatter){
        scatter = window.scatter;
      }
      const result = await this.connectScatter();
      if (!result) return;
      if (!scatter.suggestNetwork) {
        return;
      }      
      await scatter
        .suggestNetwork(this.network)
        .then(() => {
          console.log("sugggestNetwork: Succ2!");
        })
        .catch(function(error) {
          console.log("sugggestNetwork: 에러");
          console.log(error);
          return;
        });

      await scatter
        .getIdentity({ accounts: [this.network] })
        .then(identity => {
          console.log(identity);
          console.log("getIdentity: 성공");

          this.setEosAccount(
            identity.accounts.find(account => account.blockchain === "eos")
          );

          this.tosvr_set_scatter_identity(this.eosAccount.name);
        })
        .catch(error => {          
          console.log(error)
        });      
    },
    async connectScatter() {
      let connected = false;
      try{
        const connectionOptions = { initTimeout: 1300 };
        connected = await this.scatter.connect(
          "game-eosbaccarat3",
          connectionOptions
        );
      }catch(e){
        console.log(e);
      }      

      if (!connected) {
        console.log("Could not connect to Scatter.");
        this.setOpenScatterError(true);
        return false;
      }      
      console.log("Scatter Connected!");
      if (this.scatter.identity) {
        this.setEosAccount(
          this.scatter.identity.accounts.find(
            account => account.blockchain === "eos"
          )
        );

        if (!this.chatWelcome) {
          this.$chat.send(
            JSON.stringify({
              type: "welcome"
            })
          );
          this.chatWelcome = true;
        }
      } else {
        this.setEosAccount(null);        
      }

      return true;
    }
  }
};
</script>

<style lang="scss">
* {
  font-family: Montserrat;
}
#header_wrap {
  padding: 0 10px;
  position: relative;
  max-width:1920px;
  #nav {
    background-color: #000000;
    display: flex;
    justify-content: space-between;
    padding: 48px 0 44px;
    align-items: flex-end;
    .logo {
      -webkit-flex: 4;
      flex: 4;
      text-align: left;
      a {
        cursor: pointer;
      }
      img {
        animation: move 5s infinite;
      }
    }
    .menu {
      display: flex;
      justify-content: space-between;
      -webkit-flex: 7;
      flex: 7;
      align-items: baseline;
			a {
				font-size: 18px;
				font-weight: normal;
				font-style: normal;
				font-stretch: normal;
				letter-spacing: normal;
				cursor: pointer;
				color: #ffffff;
				text-decoration-line: blink;
				&.router-link-exact-active {
					color: #ffd324;
				}
			}
			span {
				color: #ffffff;
			}
			.deposit {
				border-radius: 15px;background-color: #ffa025;
				font-size: 16px;
				width: 114px;
				font-weight: 600;
				font-style: normal;
				font-stretch: normal;
				line-height: 1.88;
				letter-spacing: normal;
				text-align: center;
				cursor:pointer;
				color: #000000;
			}
			.login {
				width: 199px;
				height: 30px;
				border-radius: 15px;
				font-size: 16px;
				line-height: 1.88;
				cursor: pointer;
			}
    }
  }

  @keyframes move {
    0% {
      transform: rotateY(0);
    }
    80% {
      transform: rotateY(-360deg);
    }
    100% {
      transform: rotateY(-360deg);
    }
  }
}
</style>