<template>
  <div class="building">
    <div class="floors">
      <div v-for="i in floors" :key="i" class="floor" ref="floor">


      </div>
    </div>
    <div class="shafts">
      <div class="shaft" v-for="j in shafts" :key="j">
        <div class="floor_shaft" ref="floor_shaft" v-for="i in floors" :key="i">

        </div>
      </div>
      <div class="info-wrapper">
        <div class="info-floor" v-for="i in floors" :key="i">
          {{ i }}
          <div class="button-wrapper">
            <input type="radio" checked='True' class="radio" @click="call(i)" />

          </div>
        </div>
      </div>
    </div>

    <Elevator_cabin class="cabin" />
    <!-- <Building_setting class="settings" /> -->
  </div>

</template>

<script setup>

import { ref, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import Elevator_cabin from './ElevatorCabin.vue'
// import Building_setting from './BuildingSettings.vue'
const store = useStore()
const floors = ref()
const shafts = ref()
const floor_shaft = ref()
const shaft_width = ref(null)
const floor_height = ref(null)
const cabin_y = ref('0px')
const cabin_floor = ref(1)

function getshaftWidth(element) {
  shaft_width.value = element.clientWidth
}
function getFloorHeight(element) {
  floor_height.value = element.clientHeight
}

function call(i) {
  elevatorMove(i)
  // console.log(i)
}

function elevatorMove(i) {
  // document.getElementById("cabin").style.bottom = `${ (i-1) * floor_height.value}px`
  // console.log(document.getElementById("cabin").style.bottom)
  cabin_y.value = document.getElementById("cabin").style.bottom

  var time = Math.abs(i - cabin_floor.value) * 1000
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
onBeforeMount(() => {
  floors.value = store.getters.getFloorsCount
  shafts.value = store.getters.getShaftsCount
})
onMounted(async () => {
  // floors.value = store.getters.getFloorsCount()
  const element = floor_shaft.value[0]
  // console.log(element.clientHeight)
  getshaftWidth(element)
  getFloorHeight(element)
  store.commit('setCabinWidth', shaft_width.value)
  // await store.dispatch('changeCabinWidth', shaft_width.value)
  store.commit('setCabinHeight', floor_height.value)

})

</script>

<style scope lang="scss">
.building {
  //margin: 20px;
  width: 100%;
  height: 100%;
  border: 0.5px solid grey;
  //display: flex;
  //flex-direction: column-reverse;
  //justify-content: space-between;
  position: relative;

}

.floors {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;


}

.shafts {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;



}

.shaft {
  border-right: 1px solid grey;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
}

.floor {
  //background-color: red;
  height: 100%;
  border: 0.5px solid grey;
  //display: flex;


  &_shaft {
    width: 100px;
    height: 100%;
    //background-color: white;

  }
}

.cabin {
  position: absolute;
  display: inline-block;
  bottom: 0;


}

.settings {
  position: absolute;
  right: 0;
}

.info {
  &-wrapper {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;

  }

  &-floor {
    padding-left: 10px;
    padding-top: 10px;
    height: 100%;
    width: 100px;
  }
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
    color: white;

    .radio {
      margin: 0;
    }

    .radio:checked {
      left: 5px;
      top: 5px;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: #e145a3;
    }
  }
}
</style>