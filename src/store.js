import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    resolution: {
      width: 0,
      height: 0,
    },
    modal1_msg: '',
  },
  mutations: {
    SET_WINDOW_RESOLUTION(state, payload){
      state.resolution.width = payload[0];
      state.resolution.height = payload[1];
    },
    SET_MODAL1_MSG(state, payload){
      state.modal1_msg = payload;
    }
  },
  actions: {

  }
})
