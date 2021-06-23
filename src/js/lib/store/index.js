import Vue from 'vue'
import Vuex from 'vuex'

import PlpModule from './plp'
import PdpModule from './pdp'
import CartModule from './cart'

Vue.use(Vuex)

const store = new Vuex.Store({})
store.registerModule('plp', PlpModule)
store.registerModule('pdp', PdpModule)
store.registerModule('cart', CartModule)

export default store
