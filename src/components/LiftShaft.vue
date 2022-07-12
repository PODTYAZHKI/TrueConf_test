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
          <div class="button-wrapper" ref="radio_wrapper">
            <input ref="radio" type="radio" checked='True' class="radio" @click="check_lift_queue(i)" />

          </div>
        </div>
      </div>
    </div>

    <Elevator_cabin class="cabin" :width="shaft_width" :height="floor_height" :floor="toFloor"
      :direction="cabin_direction" :blink="cabin_blink" />
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
const cabin_floor = ref()
const radio = ref()
const radio_wrapper = ref()
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
function queueColor(i) {
  radio_wrapper.value[i - 1].style.border = '1px solid red'
    radio.value[i - 1].className = 'call'
}
function check_lift_queue(i) {
  if ((lift_queue.value.length === 0 || lift_queue.value.at(-1) != i) && (i != cabin_floor.value || movingFloor.value != i)) {
    lift_queue.value.push(i)
    localStorage.setItem('queue', lift_queue.value)
    console.log(store.getters.getCabinQueue)
    queueColor(i)
    console.log('lift_queue.value', lift_queue.value)
    if (cabin_status.value === 'ready') {
      call()
    }
  }

}
const movingFloor = ref(1)
const cabin_blink = ref()
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
    cabin_blink.value = true
    setTimeout(() => {
      cabin_blink.value = false
      cabin_status.value = 'ready'
      console.log('status', cabin_status.value)
      toFloor.value = ''
      cabin_direction.value = ''
      radio_wrapper.value[movingFloor.value - 1].style.border = '1px solid green'

      radio.value[movingFloor.value - 1].classList.remove("call")
      if (lift_queue.value.length != 0) {
        call()

      } else {
        localStorage.removeItem('queue')
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
    localStorage.setItem('cabin_floor', floor)
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
  if (localStorage.getItem('cabin_floor') != null){
    cabin_floor.value = localStorage.getItem('cabin_floor')
    var cabin = document.getElementById('cabin');
    cabin.style.transform = `translateY(-${(cabin_floor.value - 1) * floor_height.value}px)`;

  } else {
    cabin_floor.value = 1
  }
  if (localStorage.getItem('queue') != null){
    lift_queue.value = localStorage.getItem('queue').split(',')
    if (lift_queue.value[0] === cabin_floor.value) {
      lift_queue.value.shift()
    }
    console.log(lift_queue.value)
    setTimeout(call, 1000)
  }
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
    padding-top: 1px;
    width: 20px;
    height: 20px;
    border: 1px solid green;
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



  }
}

input[type="radio"] {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  /* Remove most all native input styles */
  appearance: none;
  /* For iOS < 15 */
  background-color: white;
  /* Not removed via appearance */
  margin: 0;

  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 50%;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;
}

input[type="radio"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em green;
  /* Windows High Contrast Mode */
  background-color: CanvasText;
}

input[type="radio"].call::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em red;
  /* Windows High Contrast Mode */
  background-color: CanvasText;
}

input[type="radio"]:checked::before {
  transform: scale(1);
}
</style>