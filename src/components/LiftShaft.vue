<template>
  <div class="building">
    <div class="floors">
      <div v-for="i in floors" :key="i" class="floor" ref="floor" />
    </div>
    <div class="shafts">
      <div ref="shaft" :id='`shaft${j}`' class="shaft" v-for="j in shafts" :key="j">
        <div class="floor_shaft" ref="floor_shaft" v-for="i in floors" :key="i" />
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
  </div>

</template>

<script setup>

import { ref, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import Elevator_cabin from './ElevatorCabin.vue'

const store = useStore()
const floors = ref()
const shafts = ref()
const shaft = ref()
const floor_shaft = ref()
const shaft_width = ref(null)
const floor_height = ref(null)
const cabins_floor = ref([])
const radio = ref()
const radio_wrapper = ref()
const cabin_direction = ref([])
const lift_queue = ref([])
const cabins_status = ref([])
const moving_floor = ref([])
const cabins_blink = ref([])

// Функция вычисления ширины кабины лифта
function getShaftWidth(element) {
  shaft_width.value = element.clientWidth
}
// Функция вычисления высоты кабины лифта
function getFloorHeight(element) {
  floor_height.value = element.clientHeight
}
// Функция изменения цвета кнопки вызова  
function queueColor(i) {
  radio_wrapper.value[i - 1].style.border = '1px solid red'
  radio.value[i - 1].className = 'call'
}
// Функция определения ближайшего лифта 
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
  if (shafts.value > 1) {
    times = times.filter(elevator => elevator.status != 'moving')
  }
  var minTime = times.reduceRight((i, ac) => {
    return (i.time < ac.time ? i : ac);
  });
  var res = {
    elevator: minTime.id + 1,
    floor: floor
  }
  return res
}
// Функция добавления вызова в очередь 
function check_lift_queue(i) {
  if ((lift_queue.value.length === 0 || lift_queue.value.at(-1) != i) && (!cabins_floor.value.includes(i) && !moving_floor.value.includes(i))) {
    var e = chooseLift(i)
    lift_queue.value.push(e)
    localStorage.setItem('queue', JSON.stringify(lift_queue.value))
    queueColor(i)
    if (cabins_status.value[e.elevator - 1] === 'ready') {
      call()
    }
  }
}
// Функция вызова лифта
async function call() {
  var promise = new Promise((resolve) => {
    var i = lift_queue.value.shift()
    var elevator = i.elevator
    moving_floor.value[elevator - 1] = i.floor
    cabins_status.value[elevator - 1] = 'moving'
    var time = Math.abs(moving_floor.value[elevator - 1] - cabins_floor.value[elevator - 1]) * 1000
    elevatorMove(elevator, moving_floor.value[elevator - 1], time)
    setTimeout(() => { resolve(elevator) }, time)
  })
  await promise.then((elevator) => {
    cabins_status.value[elevator - 1] = 'waiting'
    cabins_blink.value[elevator - 1] = true
    setTimeout(() => {
      cabins_blink.value[elevator - 1] = false
      cabins_status.value[elevator - 1] = 'ready'
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
// Функция анимации движения лифта 
async function elevatorMove(elevator, floor, time) {
  var promise = new Promise((resolve) => {
    var cabin = document.getElementById(`cabin${elevator}`);
    if ((cabins_floor.value[elevator - 1] - floor) > 0) {
      cabin_direction.value[elevator - 1] = '↓'
    }
    else cabin_direction.value[elevator - 1] = '↑'
    var animation = cabin.animate([
      { transform: `translateY(-${(floor - 1) * floor_height.value}px)` }
    ], time);
    animation.addEventListener('finish', function () {
      cabin.style.transform = `translateY(-${(floor - 1) * floor_height.value}px)`;
    });
    setTimeout(() => { resolve(elevator) }, time)
  })
  await promise.then(() => {
    cabins_floor.value[elevator - 1] = floor
    localStorage.setItem('cabins_floor', cabins_floor.value)
  })
}

onBeforeMount(() => {
  floors.value = store.getters.getFloorsCount
  shafts.value = store.getters.getShaftsCount
})
onMounted(() => {
  const element = floor_shaft.value[0]
  getShaftWidth(element)
  getFloorHeight(element)
  document.getElementById(`cabin${1}`).style.left = `${shaft_width.value * i}px`
  for (let i = 1; i < shafts.value; i++) {
    document.getElementById(`cabin${i + 1}`).style.left = `${shaft_width.value * i + 1}px`
  }
  cabins_floor.value = []
  moving_floor.value = []
  cabins_status.value = []
  cabins_blink.value = []
  cabin_direction.value = []
  var i = localStorage.getItem('cabins_floor')
  if (i != null) {
    i = i.split(',').map(Number)
    if (i.length === shafts.value) {
      cabins_floor.value = i
      for (let i = 0; i < cabins_floor.value.length; i++) {
        var cabin = document.getElementById(`cabin${i + 1}`);
        cabin.style.transform = `translateY(-${(cabins_floor.value[i] - 1) * floor_height.value}px)`;
      }
    } else {
      localStorage.removeItem('cabins_floor')
    }
  } else {
    for (let i = 0; i < shafts.value; i++) {
      cabins_floor.value.push(1)
      moving_floor.value.push(1)
    }
  }
  for (let i = 0; i < shafts.value; i++) {
    cabins_status.value.push('ready')
    cabins_blink.value.push(false)
    cabin_direction.value.push('')
  }
  if (localStorage.getItem('queue') != null) {
    lift_queue.value = JSON.parse(localStorage.getItem('queue'))
    for (let i of lift_queue.value) {
      if (i.floor === cabins_floor.value[i.elevator - 1]) {
        lift_queue.value.shift()
      }
    }
    setTimeout(() => {
      if (lift_queue.value.length != 0) call()
    }, 1000)
  }
})
</script>

<style scope lang="scss">
.building {
  width: 100%;
  height: 100%;
  border: 0.5px solid #D8DDDD;
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
  height: 100%;
  border: 0.5px solid #D8DDDD;

  &_shaft {
    width: 100px;
    height: 100%;
  }
}

.cabin {
  position: absolute;
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

// Стили для кнопок вызова
input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: white;
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
  background-color: CanvasText;
}

input[type="radio"]:checked::before {
  transform: scale(1);
}
</style>