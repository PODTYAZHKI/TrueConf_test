<template>
  <div ref="cabin" id="cabin" class="cabin">

  </div>

</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

// const cabin = ref(null)
onMounted(() => {
  setTimeout(() => {
    document.getElementById("cabin").style.height = `${store.getters.getCabinHeight}px`
    document.getElementById("cabin").style.width = `${store.getters.getCabinWidth}px`
  }, 1000)
  // console.log(store.getters.getCabinHeight)
  // console.log(store.getters.getCabinWidth)
  // console.log(document.getElementById("cabin").style.width)
  // console.log(document.getElementById("cabin").style.height)

})

</script>

<style scope lang="scss">
.cabin {
  background-color: red;
  //display: inline-block;
  //border: 1px solid grey;
}
</style>