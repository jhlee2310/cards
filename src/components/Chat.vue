<template>
	<div>
        <div style="width: 67px;height: 213px;box-shadow: -3.5px 2px 10px 0 rgba(0, 0, 0, 0.46);background-color: #ff343d;border-radius: 15px 0 0 15px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    position: absolute;
    top: 651px;
    right: 0;
    z-index: 3;
    cursor: pointer;
    font-size:20px;
      "
      @click="clickShow">
      <img src="@/assets/user.png" style="margin-top: 30px;"/>
      <span style="writing-mode: tb-rl;transform: rotate(180deg);
      position: absolute;
      top: 92px;
      right: 21px;
      ">Live chat</span>
      </div>
      <transition nmae="slide-fade">
				<div style="position: fixed;
    top: 0;
    right: 0;
    width: 12%;
		z-index: 2;
		">
        <div v-if="show" class="chatbox">
					<div class="chat-header"><i class="icon-bet-chat"></i><div class="users-online"></div><a class="close"><span></span></a></div>
					<div class="chats" id="chat-messages-container">
						<!---->
						<div class="chat" v-for="(data, i) in messageList" :key="i">
							<span class="username">{{data.name}}</span>
							<span class="time">{{data.time}}</span>
							<p>{{data.msg}}</p>
						</div>
					</div>
					<div class="input">
						<!---->
						<!-- <div class="btn-cont">
							<a class="btn btn-primary btn-block">Login</a>
						</div> -->
						<input v-model="message" v-if="eosAccount!=null" name="message" type="text" placeholder="Write message" maxlength="200" autocomplete="off"
						@keydown.enter="msgSend">
					</div>
        </div>
				</div>
      </transition>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
	name: 'appChat',
	data() {
		return {
			show: false,
			message: '',
			messageList: [],
			scrollPosition: 0,
		}
	},
	computed: {
		...mapGetters({
			eosAccount: 'getEosAccount',
		}),
	},
	mounted(){

		this.$chat.onmessage = (mes)=> {
			const message = JSON.parse(mes.data)
			message.forEach(data => {
				data.time = this.$moment(data.time).format('HH:mm')
			})
			this.messageList = message
			if(this.show){
				this.$nextTick(() => {
					var container = this.$el.querySelector("#chat-messages-container");
					console.log("container.scrollHeight",container.scrollHeight)
					container.scrollTop = container.scrollHeight;
				});
			}
		}
		
		
	},
	methods: {
		msgSend(){
			this.$chat.send(JSON.stringify({
				type: 'chat',
				user: this.eosAccount.name,
				txt:this.message
			}))
			this.message = ''
		},
		clickShow(){
			this.show = !this.show
			this.$parent.show = this.show
		},
	}
}
</script>
<style lang="scss" scoped>
.w20 {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    width: 20%;
    max-height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 2000;
}
.tfw {
    transition: width .25s ease-out,transform .25s ease-out,padding-top .5s,-webkit-transform .25s ease-out;
}
.chat-header {
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    height: 60px;
    i.icon-bet-chat {
        display: block;
        position: absolute;
        top: 0;
        color: #b0d4e9;
        left: 0;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 24px!important;
    }
    .icon-bet-chat:before {
      content: "\e905";
    }
    .users-online {
      position: absolute;
      left: 60px;
      display: block;
      width: 120px;
      height: 60px;
      top: 0;
      line-height: 60px;
  	}
		.close {
			float: right;
			font-size: 1.3125rem;
			font-weight: 700;
			line-height: 1;
			color: #000;
			text-shadow: 0 1px 0 #fff;
			opacity: .5;
		}
		.close:not(:disabled):not(.disabled) {
			cursor: pointer;
		}
}
.chatbox {
	height: 100vh;
	z-index: 1337;
	background: #141b28;
	color: #fff;
	padding-top: 60px;
	padding-bottom: 50px;
	box-sizing: border-box;
	.chats {
			overflow-y: scroll;
			height: 100%;
	}
	.chat {
		display: block;
		float: left;
		clear: both;
		width: 100%;
		box-sizing: border-box;
		padding: 15px;
		.username {
				float: left;
				height: 16px;
				display: block;
				font-weight: 700;
				font-size: 14px;
				line-height: 16px;
				color: #878;
				min-width: 170px;
				text-align: left;
		}
		.time {
				float: right;
				height: 16px;
				display: block;
				color: #6685a5;
				font-size: 12px;
				line-height: 16px;
		}
		p {
				float: left;
				display: block;
				clear: both;
				overflow-wrap: break-word;
				max-width: 100%;
				font-size: 12px;
				margin: 4px 0 0;
				line-height: calc(23/14);
				text-align: left;
		}
	}
	.input {
		background: #1d2235;
		height: 50px;
		width: 100%;
		z-index: 100;
		position: fixed;
		bottom: 0;
		input {
			height: 30px;
			float: left;
			padding-left: 15px;
			margin-top: 10px;
			width: 85%;
			background: 0 0;
			border: none;
			color: #fff;
		}
	}
}
</style>


