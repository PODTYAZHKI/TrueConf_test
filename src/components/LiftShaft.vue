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
            <input ref="radio" type="radio" checked='True' class="radio" @click="check_lift_queue(i)" />

          </div>
        </div>
      </div>
    </div>

    <Elevator_cabin class="cabin" :width="shaft_width" :height="floor_height" :floor="toFloor"
      :direction="cabin_direction" />
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
// const cabin_y = ref('0px')
const cabin_floor = ref(1)
const radio = ref()
const cabin_direction = ref('')
// const lift_cabin = ref()

const toFloor = ref()
function getshaftWidth(element) {
  shaft_width.value = element.clientWidth
}
function getFloorHeight(element) {
  floor_height.value = element.clientHeight
}

const lift_queue = ref([])
const cabin_status = ref('ready')
function check_lift_queue(i) {
  if ((lift_queue.value.length === 0 || lift_queue.value.at(-1) != i) && (i != cabin_floor.value || movingFloor.value != i)) {
    lift_queue.value.push(i)
    console.log('lift_queue.value', lift_queue.value)
    if (cabin_status.value === 'ready') {
      call()
    }
  }

}
const movingFloor = ref()
async function call() {
  cabin_status.value = 'moving'
  console.log('status', cabin_status.value)

  var promise = new Promise((resolve) => {
    movingFloor.value = lift_queue.value.shift()
    console.log('floor', movingFloor.value)
    var time = Math.abs(movingFloor.value - cabin_floor.value) * 1000
    console.log('time', time)
    elevatorMove(movingFloor.value, time)
    setTimeout(resolve, time)

  })
  await promise.then(() => {
    cabin_status.value = 'waiting'
    console.log('status', cabin_status.value)
    setTimeout(() => {
      cabin_status.value = 'ready'
      console.log('status', cabin_status.value)
      toFloor.value = ''
      cabin_direction.value = ''
      if (lift_queue.value.length != 0) {
        call()

      }
    }, 3000)
  })

}

async function elevatorMove(floor, time) {
  // cabin_status.value = 'moving'


  var promise = new Promise((resolve) => {

    var cabin = document.getElementById('cabin');
    // lift_cabin.value.setFloor(floor)
    toFloor.value = floor
    if ((cabin_floor.value - floor) > 0) {
      cabin_direction.value = '↓'
    }
    else cabin_direction.value = '↑'
    var animation = cabin.animate([
      // { transform: `translateY(${cabin_y.value})` },
      { transform: `translateY(-${(floor - 1) * floor_height.value}px)` }
    ], time);

    animation.addEventListener('finish', function () {
      cabin.style.transform = `translateY(-${(floor - 1) * floor_height.value}px)`;
    });
    setTimeout(resolve, time)
  })

  // })
  await promise.then(() => {
    // console.log(floor)
    cabin_floor.value = floor
  })


}

onBeforeMount(() => {
  floors.value = store.getters.getFloorsCount
  shafts.value = store.getters.getShaftsCount
})
onMounted(() => {
  // floors.value = store.getters.getFloorsCount()
  const element = floor_shaft.value[0]
  // console.log(element.clientHeight)
  getshaftWidth(element)
  getFloorHeight(element)
  // store.commit('setCabinWidth', shaft_width.value)
  // await store.dispatch('changeCabinWidth', shaft_width.value)
  // store.commit('setCabinHeight', floor_height.value)

})

</script>

<style scope lang="scss">
.building {

  //margin: 20px;
  width: 100%;
  height: 100%;
  border: 0.5px solid #D8DDDD;
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
  border-right: 1px solid #D8DDDD;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
}

.floor {
  //background-color: red;
  height: 100%;
  border: 0.5px solid #D8DDDD;
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
    border: 1px solid #D8DDDD;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    position: relative;
    cursor: pointer;

    .radio {
      margin: 0;
      cursor: pointer;
    }

    .radio:checked {
      content: "";
      position: absolute;
      -webkit-transition: all 0.2s ease;
      -moz-transition: all 0.2s ease;
      -o-transition: all 0.2s ease;
      transition: all 0.2s ease;
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