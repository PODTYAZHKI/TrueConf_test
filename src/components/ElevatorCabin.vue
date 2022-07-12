<template>

  <div id="cabin" class="cabin" :class="[props.blink ? 'blink' : '']">
    <div class="cabin_indicator_wrapper">
      <div class="cabin_indicator" :class="[props.direction === '' ? '' : 'cabin_indicator_move']">
        <div class="direction">
          {{ props.direction }}
        </div>
        {{ props.floor }}
      </div>
    </div>
  </div>

</template>

<script setup>
import { onMounted, defineProps } from 'vue'

const props = defineProps({
  width: Number,
  height: Number,
  floor: String,
  direction: String,
  blink: Boolean
});

onMounted(() => {
  setTimeout(() => {
    document.getElementById("cabin").style.height = `${props.height}px`
    document.getElementById("cabin").style.width = `${props.width}px`
  }, 300)
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