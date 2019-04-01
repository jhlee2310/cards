import Vue from 'vue'
import Vuex from 'vuex'
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs';

ScatterJS.plugins( new ScatterEOS() );

const network = ScatterJS.Network.fromJson({
  name: 'Kylin',
  blockchain:'eos',
  chainId:'5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
  host:'api-kylin.eoslaomao.com',
  port:443,
  protocol:'https',
  //httpEndpoint: 'https:/api-kylin.eoslaomao.com:443',
});

Object.defineProperty(Vue.prototype, '$eos', { value: ScatterJS.scatter.eos(network, Eos) });
Vue.prototype.scatter = ScatterJS.scatter

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    resolution: {
      width: 0,
      height: 0,
    },    
    //scatter: ScatterJS.scatter,
    eosAccount:null,    
    network, 
    credit: 0,
    game_connected: false,
    open_scatter_error: false,
    room_id: null,
    game_loaded: false,
    isReady: false,
    welcome: null,
  },
  getters: {
    'getEosAccount': state => state.eosAccount,
    'getScatter': state => state.scatter,
    'getNetwork': state => state.network,
    'getCredit': state => state.credit,
    'getEos': state => state.eos,
    'getGameConnected': state => state.game_connected,
    'getRoomId': state => state.room_id,    
  },
  mutations: {
    SET_WELCOME(state, payload){
      state.welcome = payload
    },
    SET_IS_READY(state, payload){
      state.isReady = payload
    },
    SET_GAME_LOADED(state, payload){
      state.game_loaded = payload
    },
    SET_OPEN_SCATTER_ERROR(state, payload){
      state.open_scatter_error = payload;
    },
    SET_WINDOW_RESOLUTION(state, payload){
      state.resolution.width = payload[0];
      state.resolution.height = payload[1];
    },
    SET_MODAL1_MSG(state, payload){
      state.modal1_msg = payload;
    },
    SET_CREDIT(state, payload){
      state.credit = payload
    },
    SET_GAME_CONNECTED(state, payload){
      state.game_connected = payload
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
    SET_ROOM_ID: (state, data) => {
      state.room_id = data
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
    setOpenScatterError: ({commit}, data ) => {
      commit('SET_OPEN_SCATTER_ERROR', data)
    },
    setRoomId: ({commit}, data ) => {
      commit('SET_ROOM_ID', data)
    },
  }
})
