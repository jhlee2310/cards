<template>
  <div id="app">
    <div id="wrap">
      <AppHeader :url="location.pathname"></AppHeader>
      <main>        
        <router-view/>
        <div v-if="/baccarat/.test(location.pathname) && !(game_loaded && isReady)"> NOW LOADING</div>
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
        location: window.location,        
      }
    },
    mounted(){      

    },
    computed:{
      ...mapState([
      'game_loaded','resolution','room_id', 'isReady', 'welcome'
    ])
    }
  }
</script>


<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=cyrillic,cyrillic-ext,latin-ext,vietnamese');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  //background-image: url('./assets/bg.png');
  
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
