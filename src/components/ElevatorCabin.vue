<template>
  <div ref="cabin" id="cabin" class="cabin" :width="props.width" :height="props.height"> 
    3
  </div>

</template>

<script setup>
import { defineProps, onMounted } from 'vue'
const props = defineProps({
  width: Number,
  height: Number,
})
// const cabin = ref(null)
onMounted(()=>{
  document.getElementById("cabin").style.height = `${props.height}px`
  document.getElementById("cabin").style.width = `${props.width}px`
})

</script>

<style scope lang="scss">
  .cabin {
    background-color: red;
    //display: inline-block;
    border: 1px solid grey;
  }
</style>