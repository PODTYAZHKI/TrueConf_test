<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <LiftShaft />
</template>

<script>
import LiftShaft from './components/LiftShaft.vue'

export default {
  name: 'App',
  components: {

    LiftShaft
  }
}
</script>

<style lang="scss">
  body {
    
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    padding: 20px;
  }
  #app {
    //padding: 20px;
    height: 100vh;
    //width: 100vw;
  }
</style>


