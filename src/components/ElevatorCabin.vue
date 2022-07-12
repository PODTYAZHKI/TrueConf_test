<template>
  <!-- <div id="cabin_wrapper" class="cabin_wrapper"> -->
  <div id="cabin" class="cabin" :class="[props.direction === '' ? '' : 'blink']">
    <div class="cabin_indicator_wrapper">
      <div class="cabin_indicator"  :class="[props.direction === '' ? '' : 'cabin_indicator_move']">
        <div class="direction">
          {{ props.direction }}
        </div>
        {{ props.floor }}
      </div>
    </div>
  </div>
  <!-- </div> -->

</template>

<script setup>
import { onMounted, defineProps } from 'vue'
// import { useStore } from 'vuex'
// const store = useStore()
// const floor = ref()

const props = defineProps({
  width: String,
  height: String,
  floor: Number,
  direction: String
});

// const cabin = ref(null)

// function setFloor(i) {
//   floor.value = i
// }
onMounted(() => {
  setTimeout(() => {
    // document.getElementById("cabin").style.height = `${store.getters.getCabinHeight}px`
    // document.getElementById("cabin").style.width = `${store.getters.getCabinWidth}px`
    document.getElementById("cabin").style.height = `${props.height}px`
    document.getElementById("cabin").style.width = `${props.width}px`
    // document.getElementById("cabin_wrapper").style.height = `${props.height}px`
    // document.getElementById("cabin_wrapper").style.width = `${props.width}px`
  }, 300)
  // console.log(store.getters.getCabinHeight)
  // console.log(store.getters.getCabinWidth)
  // console.log(document.getElementById("cabin").style.width)
  // console.log(document.getElementById("cabin").style.height)

})

</script>

<style scope lang="scss">
.cabin {
  background-color: #03FFFF;


  &_wrapper {
    background-color: white;
    //width: 100%;
    //height: 100%;
  }

  //display: inline-block;
  //border: 1px solid grey;
  &_indicator {
    background-color: #139897;
    width: 40px;
    border-radius: 10%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    &_move {
      padding-top: 5px;
      padding-bottom: 5px;
    }

    //padding-top: 5px;
    //padding-bottom: 5px;
    &_wrapper {
      margin-top: 7px;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;


    }
  }
}

.blink {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.5;
  }
}
</style>