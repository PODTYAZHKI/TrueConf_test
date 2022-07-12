import { createStore } from 'vuex'

export default createStore({
  state: {
    cabin_width: 0,
    cabin_height: 0,
    cabin_y: 0,
    cabin_floor: 1
  },
  getters: {
    getCabinWidth(state) {
      return state.cabin_width
    },
    getCabinHeight(state) {
      return state.cabin_height
    },
    getCabinY(state) {
      return state.cabin_y
    },
    getCabinFloor(state) {
      return state.cabin_floor
    }
  },
  mutations: {
    setCabinWidth(state, cabin_width) {
      state.cabin_width = cabin_width
    },
    setCabinHeight(state, cabin_height) {
      state.cabin_height = cabin_height
    },
    setCabinY(state, cabin_y) {
      state.cabin_y = cabin_y
    },
    setCabinFloor(state, cabin_floor) {
      state.cabin_floor = cabin_floor
    },
  },
  actions: {
  },
  modules: {
  }
})
