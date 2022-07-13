<template>

  <div ref="elevator_cabin" class="cabin" :class="[props.blink ? 'blink' : '']">

    <div class="cabin_indicator_wrapper">
      <div class="cabin_indicator" :class="[props.direction === '' || props.direction === undefined ? '' : 'cabin_indicator_move']">
        <div class="direction">
          {{ props.direction }}
        </div>
        {{ props.direction != '' ? props.floor : ''}}
      </div>
    </div>
  </div>

</template>

<script setup>
import { onMounted, defineProps, ref } from 'vue'

const props = defineProps({
  width: Number,
  height: Number,
  floor: Number,
  direction: String,
  blink: Boolean,

});
const elevator_cabin = ref()
onMounted(() => {
  setTimeout(() => {
    elevator_cabin.value.style.height = `${props.height}px`
    elevator_cabin.value.style.width = `${props.width}px`
  }, 500)
})

</script>

<style scope lang="scss">
.cabin {
  background-color: #03FFFF;


  &_wrapper {
    background-color: white;
  }

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