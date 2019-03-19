import Vue from 'vue'
import Vuex from 'vuex'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
ScatterJS.plugins( new ScatterEOS() );

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    resolution: {
      width: 0,
      height: 0,
    },
    modal1_msg: '',
    scatter: ScatterJS.scatter,
    eosAccount:null,
    eos: null,
    network: ScatterJS.Network.fromJson({
      name: 'Kylin',
      blockchain:'eos',
      chainId:'5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
      host:'api-kylin.eoslaomao.com',
      port:443,
      protocol:'https'
    }),
    credit: 0,
    game_connected: false,
  },
  getters: {
    'getEosAccount': state => state.eosAccount,
    'getScatter': state => state.scatter,
    'getNetwork': state => state.network,
    'getCredit': state => state.credit,
    'getEos': state => state.eos,
    'getGameConnected': state => state.game_connected,
  },
  mutations: {
    SET_WINDOW_RESOLUTION(state, payload){
      state.resolution.width = payload[0];
      state.resolution.height = payload[1];
    },
    SET_MODAL1_MSG(state, payload){
      state.modal1_msg = payload;
    },
    setScatter: (state, data) => {
      state.scatter = data
    },
    setEosAccount: (state, data) => {
      state.eosAccount = data
    },
    setEos: (state, data) => {
      state.eos = data
    },
    setCredit: (state, data) => {
      state.credit = data
    },
    setGameConnected: (state, data) => {
      state.game_connected = data
    },
  },
  actions: {
    setScatter: ({commit},data) => {
      commit('setScatter',data)
    },
    setEosAccount: ({commit},data) => {
      commit('setEosAccount',data)
    },
    setEos: ({commit},data) => {
      commit('setEos',data)
    },
    setCredit: ({commit},data) => {
      commit('setCredit',data)
    },
    setGameConnected: ({commit},data) => {
      commit('setGameConnected',data)
    },
  }
})
