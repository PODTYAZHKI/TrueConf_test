<template>
  <div class="building">
    <div class="floors">
      <div v-for="i in floors" :key="i" class="floor" ref="floor">


      </div>
    </div>
    <div class="shafts">
      <div ref="shaft" :id='`shaft${j}`' class="shaft" v-for="j in shafts" :key="j">
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

    <Elevator_cabin v-for="j in shafts" :key="j" :id='`cabin${j}`' class="cabin" :width="shaft_width"
      :height="floor_height" :floor="moving_floor[j - 1]" :direction="cabin_direction[j - 1]"
      :blink="cabins_blink[j - 1]" />
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
const shaft = ref()
const floor_shaft = ref()
const shaft_width = ref(null)
const floor_height = ref(null)
// const cabin_y = ref('0px')
const cabins_floor = ref([])
const radio = ref()
const radio_wrapper = ref()
const cabin_direction = ref([])


function getshaftWidth(element) {
  shaft_width.value = element.clientWidth
}
function getFloorHeight(element) {
  floor_height.value = element.clientHeight
}

const lift_queue = ref([])
const cabins_status = ref([])
function queueColor(i) {
  radio_wrapper.value[i - 1].style.border = '1px solid red'
  radio.value[i - 1].className = 'call'
}
function chooseLift(floor) {
  var times = []
  for (let elevator = 0; elevator < shafts.value; elevator++) {
    times.push(
      {
        time: Math.abs(floor - cabins_floor.value[elevator]) * 1000,
        status: cabins_status.value[elevator],
        id: elevator
      })
  }
  times = times.filter(elevator => elevator.status != 'moving')
  console.log(times)
  // var minTime = Math.min(...times)
  var minTime = times.reduce((i, ac) => {
    return (i.time < ac.time ? i : ac);
  });
  console.log(minTime)
  var res = {
    elevator: minTime.id + 1,
    floor: floor
  }
  console.log(res)
  return res

}
function check_lift_queue(i) {
  if ((lift_queue.value.length === 0 || lift_queue.value.at(-1) != i) && (!cabins_floor.value.includes(i) || !moving_floor.value.includes(i))) {

    lift_queue.value.push(chooseLift(i))
    console.log(lift_queue.value)
    localStorage.setItem('queue', JSON.stringify(lift_queue.value))
    queueColor(i)

    if (cabins_status.value[0] === 'ready') {
    call()
    }
  }

}
const moving_floor = ref([])
const cabins_blink = ref([])

async function call() {

  // console.log('status', cabins_status.value)

  var promise = new Promise((resolve) => {
    var i = lift_queue.value.shift()
    var elevator = i.elevator
    moving_floor.value[elevator - 1] = i.floor
    cabins_status.value[elevator - 1] = 'moving'
    var time = Math.abs(moving_floor.value[elevator - 1] - cabins_floor.value[elevator - 1]) * 1000
    console.log('time', time)
    elevatorMove(elevator, moving_floor.value[elevator - 1], time)

    setTimeout(() => { resolve(elevator) }, time)

  })
  await promise.then((elevator) => {
    console.log(elevator)
    cabins_status.value[elevator - 1] = 'waiting'
    console.log('status', cabins_status.value)
    cabins_blink.value[elevator - 1] = true
    setTimeout(() => {
      cabins_blink.value[elevator - 1] = false
      cabins_status.value[elevator - 1] = 'ready'
      console.log('status', cabins_status.value)
      cabin_direction.value[elevator - 1] = ''
      radio_wrapper.value[moving_floor.value[elevator - 1] - 1].style.border = '1px solid green'

      radio.value[moving_floor.value[elevator - 1] - 1].classList.remove("call")
      if (lift_queue.value.length != 0) {
        call()

      }
      else {
        localStorage.removeItem('queue')
      }
    }, 3000)
  })

}

async function elevatorMove(elevator, floor, time) {
  // cabins_status.value = 'moving'


  var promise = new Promise((resolve) => {

    var cabin = document.getElementById(`cabin${elevator}`);
    if ((cabins_floor.value[elevator - 1] - floor) > 0) {
      cabin_direction.value[elevator - 1] = '↓'
    }
    else cabin_direction.value[elevator - 1] = '↑'
    var animation = cabin.animate([
      // { transform: `translateY(${cabin_y.value})` },
      { transform: `translateY(-${(floor - 1) * floor_height.value}px)` }
    ], time);

    animation.addEventListener('finish', function () {
      cabin.style.transform = `translateY(-${(floor - 1) * floor_height.value}px)`;
    });
    setTimeout(() => { resolve(elevator) }, time)
  })

  // })
  await promise.then(() => {
    // console.log(floor)
    cabins_floor.value[elevator - 1] = floor
    localStorage.setItem('cabins_floor', cabins_floor.value)
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
  for (let i = 0; i < shafts.value; i++) {
    // shaft.value[i].style.position = 'relative'
    // document.getElementById(`shaft${i+1}`).style.position = 'relative'
    document.getElementById(`cabin${i + 1}`).style.left = `${shaft_width.value * i}px`
    // cabin.value[i].style.position = 'absolute'

    // console.log(i)
  }
  cabins_floor.value = []
  moving_floor.value = []
  cabins_status.value = []
  cabins_blink.value = []
  cabin_direction.value = []
  for (let i = 0; i < shafts.value; i++) {
    cabins_floor.value.push(1)
    moving_floor.value.push(1)
    cabins_status.value.push('ready')
    cabins_blink.value.push(false)
    cabin_direction.value.push('')
    // console.log(i)
  }
  if (localStorage.getItem('cabins_floor') != null) {
    cabins_floor.value = localStorage.getItem('cabins_floor').split(',').map(Number)
    moving_floor.value = localStorage.getItem('cabins_floor').split(',').map(Number)
    

    // cabins_floor.value.forEach((el) => {
    //   el = Number(el)
    //   console.log(el)
    // })
    // cabins_floor.value[0] = Number(cabins_floor.value[0])
    console.log(cabins_floor.value)
    for (let i = 0; i < cabins_floor.value.length; i++) {
      var cabin = document.getElementById(`cabin${i + 1}`);
      console.log(cabin)
      cabin.style.transform = `translateY(-${(cabins_floor.value[i] - 1) * floor_height.value}px)`;
      // console.log(cabin)
    }



  }
  // else {
  //   cabins_floor.value = []
  //   moving_floor.value = []
  //   cabins_status.value = []
  //   cabins_blink.value = []
  //   cabin_direction.value = []
  //   for (let i = 0; i < shafts.value; i++) {
  //     cabins_floor.value.push(1)
  //     moving_floor.value.push(1)
  //     cabins_status.value.push('ready')
  //     cabins_blink.value.push(false)
  //     cabin_direction.value.push('')
  //     // console.log(i)
  //   }
  //   // cabins_status.value[0] = 'moving'
  //   console.log(cabins_status.value)
  //   // cabins_floor.value = 1
  // }
  if (localStorage.getItem('queue') != null) {

    lift_queue.value = JSON.parse(localStorage.getItem('queue'))

    // if (lift_queue.value[0] === cabins_floor.value) {
    // lift_queue.value.shift()
    // }
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
  //display: inline-block;
  bottom: 0;


}

.cabin:last-of-type {
  background-color: red;
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