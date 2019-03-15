<template>
	<header style="padding:0 9.1%;position:relative;z-index:2;">
		<nav id="nav">
			<router-link to="/baccarat" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  
  letter-spacing: normal;">
	<!-- Baccarat -->
	</router-link>
			<router-link to="#bonus" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;">
	<!-- Bonus -->
	</router-link>
			<router-link to="#vip" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;">
	<!-- VIP -->
	</router-link>
			<router-link to="#referral" tag="div" style="font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;">
	<!-- Referral -->
	</router-link>
			<router-link to="/" tag="div"><img src="@/assets/logo.png"/></router-link>
			<div style="line-height:0;"><img src="@/assets/speaker.png"/></div>
			<div>
				<!-- EOS -->
				</div>
			<div style="width: 199px;
		height: 30px;
		border-radius: 15px;
		background-color: #00a8ff;
		font-size: 16px;
		line-height: 1.88;
		">
				<span v-if="!eosAccount" @click="proc_getIdentity">Log in with <span style="font-weight: bold;">Scatter</span></span>
				<span v-else @click="proc_forgetIdentity"><span>{{eosAccount.name}}</span></span>
			</div>
		</nav>
	</header>
</template>

<script>
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs';
ScatterJS.plugins( new ScatterEOS() );

export default {
		name: 'appheader',
		data(){
			const that = this;
			return {
				tosvr:{
					set_scatter_identity (scatter_identity = undefined ) {
						//if (!ws || !game_connected) return;
						const scatter = this.scatter

						if (scatter_identity === undefined) {          
							if ( scatter && scatter.identity ) {
								const eosAccount = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
								scatter_identity = eosAccount.name; 
								console.log('스캐터 아이디', scatter_identity);
							}
						}
						
						if (scatter_identity === undefined) return;

						let req_json = {
							type      :"req_set_scatter_identity",
							identity  : scatter_identity
						};

						that.$socket.send(JSON.stringify(req_json));
					}
				},
				eosAccount: null,
				scatter: ScatterJS.scatter,
				eos: null,
				network: ScatterJS.Network.fromJson({
					name: 'Kylin',
					blockchain:'eos',
					chainId:'5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
					host:'api-kylin.eoslaomao.com',
					port:443,
					protocol:'https'
				}),
			}
		},
		methods: {
			async proc_forgetIdentity() {
				if (!this.scatter.identity) return; 

				await this.scatter.forgetIdentity();
				this.eosAccount = null;
				
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
					let eosAccount = this.eosAccount = identity.accounts.find(account => account.blockchain === 'eos');
					console.log(this.eosAccount);               

					// 게임서버에 identity 알림. 
					this.tosvr.set_scatter_identity(eosAccount.name);

				})
				.catch(function (error) {
					console.log("에러");
					console.log(error); 
				});
		
				//console.log(this.scatter.identity);
			},
			connectScatter(){
				return new Promise((resolve, reject)=>{
					const connectionOptions = {initTimeout:3000};
					ScatterJS.scatter.connect('game-eosbaccarat3', connectionOptions).then( connected => {
						if(!connected){          
							console.log('Could not connect to Scatter.');
							alert('Please download Scatter if it is not installed')
							return;
						}        
						console.log('Scatter Connected!')
						this.eos = this.scatter.eos(this.network, Eos);        

						if (this.scatter.identity) {
							this.eosAccount = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');
						}else{
							this.eosAccount = null;
						}

						resolve(this.tosvr.set_scatter_identity(eosAccount.name));
					}).catch( ()=>{
						resolve(this.tosvr.set_scatter_identity(''));
					} )

				})
					
				
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
	padding: 48px 4.2% 44px;
	align-items: flex-end;
	div {
		cursor: pointer;
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