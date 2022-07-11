<template>
  <div class="shaft">
    <div v-for="i in floors" :key="i" class="floor">
      <div class="floor_shift">
        {{i}}
      </div>
    </div>
  </div>
</template>

<script setup>

// import { ref, onMounted } from 'vue'
const floors = 5

// function draw() {
  // const canvas = ref(null);
  // var canvas = document.getElementById("canvas")
  // console.log(canvas)
  // canvas.value.beginPath();
  // for (var y = 10; y < 100; y += 10) {
  //   canvas.value.moveTo(10, y);
  //   canvas.value.lineTo(90, y);
  // }
  // canvas.value.stroke();

// }
  // onMounted(draw())

// function draw() {
//   manager.drawGrid(4, 4, 1, 'black')
// }

// onMounted(() => {
//   myContext = myCanvas.value.getContext('2d')
//   manager = new CanvasManager(myContext, size.w, size.h)
//   draw();
// });
// onUpdated(() => {
//   draw();
// });

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

}
.floor {
  //background-color: red;
  height: 100%;
  border: 0.5px solid grey;
  &_shift {
    width: 100px;
    height: 100%;
    //background-color: white;
    border-right: 1px solid grey
  }
}
</style>