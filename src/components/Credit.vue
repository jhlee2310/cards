<template>
  <div id="credit_wrap" @click.self="onClick">
    <div id="credit_cont">
      <div>Credit</div>
      <div>

      </div>
      <div class="footer">
        <div>Cancel</div>
        <div>OK</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted(){
    document.body.style.overflowX = 'hidden'
    document.body.style.overflowY = 'hidden'
  },
  beforeDestroy(){
    document.body.style.overflowX = 'auto'
    document.body.style.overflowY = 'auto'
  },
  methods:{
    onClick(e){
      
      this.$parent.deposit_open = false;
    }
  }
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
    box-sizing:border-box;
    border-radius:16px;
    top:50%;
    left:50%;
    position:absolute;
    z-index:99;
    width:480px;
    height:480px;
    background-color:white;
    transform:translate(-50%,-50%);
    overflow:hidden;
    .footer{
      width:100%;
      position:absolute;
      bottom:0;
      &>div{
        cursor:pointer;
        box-sizing:border-box;
        background-color:#345ff1;
        width:50%;
        float:left;
        padding:5px;
        line-height:2.2;
        height:45px;
        color:white;
        &:first-child{
          background-color:grey;
        }
      }
    }
  }
</style>
