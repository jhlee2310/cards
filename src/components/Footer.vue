<template>
  <footer id="footer_wrap">
    <div class="cont_top">
      <img src="@/assets/typo.png">
      <div class="right">
        <img src="@/assets/flag.png">
        <span>English</span>
      </div>
    </div>
    <div class="cont_middle">
      <div class="left">2019 Copyright. All rights reserved.</div>
      <div class="right">
        <img style="margin-right:10px;" src="@/assets/twitter.png">
        <img style="margin-right:10px;" src="@/assets/medium.png">
        <img src="@/assets/reddit.png">
      </div>
    </div>
    <div class="cont_bottom">
      Please arrange your time reasonably, and do not over-indulge.
      <br>If you reside in a location where lottery, gambling, sports betting or betting over the internet is illegal, please do not click on anything related to these activities on this site. You must be 21 years of age to click on any betting or gambling related items even if it is legal to do so in your location. Recognising that the laws and regulations involving online gaming are different everywhere, readers are advised to check with the laws that exist within their own jurisdiction to ascertain the legality of the activities which are covered.
      The games provided by BetDice are based on blockchain, fair and transparent. When you start playing these games, please note that online gambling and lottery is an entertainment vehicle and that it carries with it a certain degree of financial risk. Players should be aware of this risk, and govern themselves accordingly.
    </div>
  </footer>
</template>

<script>
export default {
  name: "appfooter"
};
</script>

<style lang="scss">
#footer_wrap {
  background-color: #000000;
  //height: 302px;
  //padding: 0px 9.1%;
  padding:0 10px;
  max-width:1920px;
  margin: 0 auto;
  position: relative;
  box-sizing:border-box;
  //z-index: 2;
  .cont_top {
    text-align: left;
    padding-top: 68px;
    padding-bottom: 14px;
    position: relative;
    .right {
      width: 140px;
      height: 30px;
      border-radius: 15px;
      border: solid 1px #ffffff;
      color: #ffffff;
      font-family: Montserrat;
      font-size: 14px;
      font-weight: 500;
      font-style: normal;
      font-stretch: normal;
      line-height: 2.14;
      letter-spacing: normal;
      text-align: left;
      position: absolute;
      top: 47px;
      right: 0;
      & > img {
        margin-left: 21px;
        margin-right: 12px;
        vertical-align: middle;
      }
    }
  }
	.cont_middle {
		display:flex;
		.left {
			font-size: 14px;
			font-weight: normal;
			font-style: normal;
			font-stretch: normal;
			letter-spacing: normal;
			text-align: left;
			color: #8e8e8e;
		}
		.right {
			margin-left: auto;
		}
	}
	.cont_bottom {
		border-top: solid 1px rgba(142, 142, 142, 0.3);
		margin-top: 22px;
		padding-top:20px;
		margin-bottom: 33px;
		text-align: justify;
		font-size: 12px;
		font-weight: normal;
		font-style: normal;
		font-stretch: normal;
		line-height: 1.5;
		letter-spacing: normal;
		color: rgba(142, 142, 142, 0.3);
	}
}
</style>


