<template>
  <div id="app">
    <div>
      <AppHeader></AppHeader>
      <main style="display:flex;font-family:Montserrat;">
        <router-view/>
      </main>
      <AppFooter></AppFooter>
    </div>
  </div>
</template>

<script>
  import AppHeader from "@/components/Header.vue"
  import AppFooter from "@/components/Footer.vue"
  export default {
    components: {
      'AppHeader': AppHeader,
      'AppFooter': AppFooter
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
  max-width: 1920px;
  min-width: 1920px;
  margin: auto;
  position: relative;
}
#app:after  {
  content: '';
  // display: none;
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
