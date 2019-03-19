<template>
	<header style="padding:0 9.1%;position:relative;z-index:2;">
		<nav id="nav">
			<div style="-webkit-flex: 4;flex: 4;text-align: left;">
			<router-link to="/" style="cursor: pointer;">
				<img src="@/assets/logo.png"/>
			</router-link>
			</div>
			<div style="display:flex;justify-content: space-between;-webkit-flex: 7;flex: 7;align-items: baseline;">
	<router-link to="#lobby" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
	cursor: pointer;">
	Baccarat Lobby
	</router-link>
			<router-link to="#bouns" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
	cursor: pointer;">
	Bonus
	</router-link>
			<router-link to="#freecpu" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
	cursor: pointer;">
	Free CPU
	</router-link>
			<!-- <div style="line-height:0;"><img src="@/assets/speaker.png"/></div> -->
			<router-link to="#fairness" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
	cursor: pointer;">
				Fairness
				</router-link>
				<div v-if="eosAccount" style="border-radius: 15px;background-color: #ffa025;
				font-size: 16px;
				width: 114px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.88;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
				">
					Deposit
				</div>
			<div :style="{
				width: '199px',
				height: '30px',
				'border-radius': '15px',
				'background-color': eosAccount==null?'#00a8ff':'unset',
				'border': eosAccount==null?'none':'solid 1px #00a8ff',
				'font-size': '16px',
				'line-height': '1.88',
				cursor: 'pointer',
			}">
				<span v-if="!eosAccount" @click="proc_getIdentity">Log in with <span style="font-weight: bold;">Scatter</span></span>
				<span v-else @click="proc_forgetIdentity"><span>{{eosAccount.name}}</span></span>
			</div>
			</div>
		</nav>
	</header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import ScatterJS from 'scatterjs-core'
// import ScatterEOS from 'scatterjs-plugin-eosjs'
// ScatterJS.plugins( new ScatterEOS() );
import Eos from 'eosjs';


export default {
		name: 'appheader',
		data(){
			const that = this;
			return {
				tosvr:{
					set_scatter_identity (scatter_identity = undefined ) {
						console.log("set_scatter_identity")
						if (!that.$socket || !that.game_connected) return;
						const scatter = that.scatter

						if (scatter_identity === undefined) {          
							if ( scatter && scatter.identity ) {
								const eosAccount = that.scatter.identity.accounts.find(account => account.blockchain === 'eos');
								scatter_identity = eosAccount.name; 
								console.log('스캐터 아이디', scatter_identity);
							}
						}
						
						if (scatter_identity === undefined) return;

						let req_json = {
							type      :"req_set_scatter_identity",
							identity  : scatter_identity
						};

						console.log("req_json",req_json)
						that.$socket.send(JSON.stringify(req_json));
					},
				},
				//eosAccount: null,
				//scatter: ScatterJS.scatter,
				eos: null,
				
			}
		},
		computed: {
			...mapGetters({
				eosAccount: 'getEosAccount',
				scatter: 'getScatter',
				network: 'getNetwork',
				game_connected: 'getGameConnected',
			}),
		},
		mounted() {
			this.connectScatter()
    	//this.$connect()
		},
		methods: {
			...mapActions({
				setEosAccount: 'setEosAccount',
				setCredit: 'setCredit',
			}),
			async proc_forgetIdentity() {
				if (!this.scatter.identity) return; 

				await this.scatter.forgetIdentity();
				this.setEosAccount(null)
				this.setCredit(0)
				
				this.tosvr.set_scatter_identity('');
			},
			async proc_getIdentity(){     
				await this.connectScatter()
				if(!this.scatter.suggestNetwork) { console.log(!!this.scatter.suggestNetwork); return;}
				await this.scatter.suggestNetwork(this.network).then( () => {
					console.log("sugggestNetwork: Succ2!");
				}).catch(function (error) {
					console.log("sugggestNetwork: 에러");
					console.log(error)    
					return; 
				});
				await this.scatter.getIdentity({accounts:[this.network]})
				.then(identity => {
					console.log("getIdentity: 성공");
					this.setEosAccount(identity.accounts.find(account => account.blockchain === 'eos'));
					let eosAccount = this.eosAccount
					console.log("eosAccount",eosAccount);

					// 게임서버에 identity 알림. 
					this.tosvr.set_scatter_identity(eosAccount.name);

				})
				.catch(function (error) {
					console.log("에러");
					console.log(error); 
				});
		
				//console.log(this.scatter.identity);
			},
			async connectScatter(){
				const connectionOptions = {initTimeout:5000};
				const connected = await this.scatter.connect('game-eosbaccarat3', connectionOptions)
									
				if(!connected){          
					console.log('Could not connect to Scatter.');
					//alert('Please download Scatter if it is not installed')
					return;
				}

				console.log('Scatter Connected!')
				this.eos = this.scatter.eos(this.network, Eos);          
				if (this.scatter.identity) {            
					this.setEosAccount(this.scatter.identity.accounts.find(account => account.blockchain === 'eos'));
					this.tosvr.set_scatter_identity(this.eosAccount.name);
				}else{
					this.setEosAccount(null)
					this.tosvr.set_scatter_identity('');
				}      
			},
		}
}
</script>

<style lang="scss">
* {
	font-family: Montserrat;
}
#nav {
	background-color: #000000;
  display: flex;
	justify-content: space-between;
	padding: 48px 0 44px;
	align-items: flex-end;
	div {
		color: #ffffff;
		&.router-link-exact-active {
			color: #ffd324;
		}
	}
}
// #nav {
//   padding: 30px;
//   background-color: #000000;
// 	font-family: Montserrat;
//   a {
//     font-size: 18px;
//     font-weight: normal;
//     font-style: normal;
//     font-stretch: normal;
//     line-height: 4.01;
//     letter-spacing: normal;
//     color: #ffffff;
// 		text-decoration: none;
// 		text-align: left;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
//   .baccarat {
//     width: 78px;
//     height: 14px;
//     font-family: Montserrat;
//     font-weight: normal;
//     font-style: normal;
//     font-stretch: normal;
//     line-height: 4.01;
//     letter-spacing: normal;
//     text-align: left;
//     color: #ffffff;
//   }
// }
</style>