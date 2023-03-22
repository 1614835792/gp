// import Vue from 'vue'
// import Vuex from 'vuex'
import { createStore } from "vuex"
import global from '@/store/modules/global'
import getters from './getters'

// Vue.use(Vuex)

const store = createStore({
  modules: {
	global
  },
  getters
})

export default store
