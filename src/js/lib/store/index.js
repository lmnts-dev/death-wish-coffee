import Vue from 'vue'
import Vuex from 'vuex'

import PlpModule from './plp'

Vue.use(Vuex)

const store = new Vuex.Store({})
store.registerModule('plp', PlpModule)

export default store
