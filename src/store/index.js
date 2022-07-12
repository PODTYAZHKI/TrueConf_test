import { createStore } from 'vuex'

export default createStore({
  state: {
    cabin_width: 10,
    cabin_height: 10,
    cabin_y: 0,
    cabin_floor: 1,

    shafts_count: 1,
    floors_count: 5,
    
  },
  getters: {
    getCabinWidth(state) {
      return state.cabin_width
    },
    getCabinHeight(state) {
      return state.cabin_height
    },
    getShaftsCount(state) {
      return state.shafts_count
    },
    getFloorsCount(state) {
      return state.floors_count
    }
    // getCabinY(state) {
    //   return state.cabin_y
    // },
    // getCabinFloor(state) {
    //   return state.cabin_floor
    // }
  },
  mutations: {
    setCabinWidth(state, cabin_width) {
      state.cabin_width = cabin_width
    },
    setCabinHeight(state, cabin_height) {
      state.cabin_height = cabin_height
    },
    // setCabinY(state, cabin_y) {
    //   state.cabin_y = cabin_y
    // },
    // setCabinFloor(state, cabin_floor) {
    //   state.cabin_floor = cabin_floor
    // },
  },
  actions: {
    // changeCabinWidth({ commit }, payload) {
    //   commit('setCabinWidth', payload)
    //   // console.log(123)
    // },
  },
  modules: {
  }
})
