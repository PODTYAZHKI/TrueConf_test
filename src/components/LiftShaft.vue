<template>
  <div class="shaft">
    <div v-for="i in floors" :key="i" class="floor" ref="floor">
      <div class="floor_shift">

        <!-- <div>
          {{shift_width.value}}
        </div>
        <div>
          {{floor_height.value}}
        </div> -->


      </div>
      <div class="info">
        {{ i }}
        <div class="button-wrapper">
          <input type="radio" checked='True' class="radio" @click="call(i)" />

        </div>
      </div>
    </div>
    <Elevator_cabin :width="shift_width" :height="floor_height" class="cabin" />
  </div>

</template>

<script setup>

import { ref, onMounted } from 'vue'
import Elevator_cabin from './ElevatorCabin.vue'
const floors = 5
const floor = ref()
const shift_width = ref(null)
const floor_height = ref(null)
const cabin_y = ref('0px')
const cabin_floor = ref(1)

function getShiftWidth(element) {
  shift_width.value = element.clientWidth + 1
}
function getFloorHeight(element) {
  floor_height.value = element.clientHeight + 1
}

function call(i) {
  elevatorMove(i)
  // console.log(i)
}

function elevatorMove(i) {
  // document.getElementById("cabin").style.bottom = `${ (i-1) * floor_height.value}px`
  // console.log(document.getElementById("cabin").style.bottom)
  cabin_y.value = document.getElementById("cabin").style.bottom
  
  var time = Math.abs( i - cabin_floor.value) * 1000
  console.log(i)
  console.log(cabin_floor.value)
  console.log(time)
  var cabin = document.getElementById('cabin');
  var animation = cabin.animate([
    // { transform: `translateY(${cabin_y.value})` },
    { transform: `translateY(-${(i - 1) * floor_height.value}px)` }
  ], time);
  animation.addEventListener('finish', function () {
    cabin.style.transform = `translateY(-${(i - 1) * floor_height.value}px)`;
  });
  cabin_floor.value = i
}

onMounted(() => {
  const element = floor.value[0]
  // console.log(element.clientHeight)
  getShiftWidth(element)
  getFloorHeight(element)

})

</script>

<style scope lang="scss">
.shaft {
  //margin: 20px;
  width: 100%;
  height: 100%;
  border: 0.5px solid grey;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  position: relative;

}

.floor {
  //background-color: red;
  height: 100%;
  border: 0.5px solid grey;
  display: flex;


  &_shift {
    width: 100px;
    height: 100%;
    //background-color: white;
    border-right: 1px solid grey
  }
}

.cabin {
  position: absolute;
  display: inline-block;


}

.info {
  padding-left: 10px;
  padding-top: 10px;
}

.button {
  &-wrapper {
    margin-top: 10px;
    width: 20px;
    height: 20px;
    border: 1px solid grey;
    display: flex;
    justify-content: center;
    align-items: center;

  }
}

.radio {
  margin: 0;
}
</style>