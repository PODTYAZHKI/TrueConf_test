import { createStore } from "vuex";

export default createStore({
  state: {
    shafts_count: 1,
    floors_count: 5,
  },
  getters: {
    getShaftsCount(state) {
      return state.shafts_count;
    },
    getFloorsCount(state) {
      return state.floors_count;
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
