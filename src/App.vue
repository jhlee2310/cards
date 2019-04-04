<template>
  <div id="app">
    <div id="wrap">
      <AppHeader :url="location.pathname"></AppHeader>
      <main>        
        <router-view/>
        <div class="loading-progress" v-if="/baccarat/.test(location.pathname) && !(game_loaded && game_connected)">
          <div>
            <div>NOW LOADING...</div>
            <div class="bar" style="width:320px;height:10px;border:1px solid white;border-radius:6px;position:relative;overflow:hidden;background-color:#222;margin-bottom:8px;margin-top:8px;">
              <div class="bar_inner" style="height:100%;background-color:white;position:absolute;left:0;top:0;" :style="progress_style"></div>
            </div>
            <div>{{loading_progress}} / {{to_done}}</div>
          </div>
        </div>
      </main>
      <AppFooter></AppFooter>
    </div>
		<AppChat v-if="location.pathname == '/'"></AppChat>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AppHeader from "@/components/Header.vue"
  import AppFooter from "@/components/Footer.vue"
  import AppChat from "@/components/Chat.vue"
  export default {
    components: {
      'AppHeader': AppHeader,
      'AppFooter': AppFooter,
      'AppChat': AppChat,
    },
    data(){      
      return {
        to_done: 77,
        location: window.location,        
      }
    },
    mounted(){      

    },
    computed:{
      ...mapState([
      'game_loaded','resolution','room_id', 'game_connected', 'welcome', 'loading_progress'
    ]),
      progress_style(){
        let percent = Math.round( this.loading_progress / this.to_done * 100 );
        return {
          width: percent +'%' 
        }
      }
    }
  }
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=cyrillic,cyrillic-ext,latin-ext,vietnamese');
#app {  
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  //background-image: url('./assets/bg.png');
  .loading-progress{
    display:flex;
    min-height:300px;    
    color:white;
    align-items: center;
    justify-content: center;
    .bar_inner{
      //transition: 0.01s width ease;
    }
  }
  
}
#wrap {
  max-width: 1920px;
  /*min-width: 1920px;*/
  margin: 0 auto;
  position: relative;
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
}
#wrap:before  {
  content: '';
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url('./assets/bg.png');
  background-repeat: no-repeat;
  opacity: 0.7;

}
</style>
