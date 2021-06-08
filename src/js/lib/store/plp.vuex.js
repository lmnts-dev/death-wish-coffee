import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    definitions: [],
    products: [],
    values: {}
  },
  mutations: {
    mutateDefinitions (state, definitions) {
      state.definitions = definitions

      // make sure nested state values are all reactive and can be used as v-model
      for (const definition of definitions) {
        Vue.set(state.values, definition.name, definition.default || null)
      }
    },
    mutateProducts (state, products) {
      state.products = products
    }
  },
  actions: {
    init ({ commit }) {
      if (typeof window.DWC_PLP === 'undefined') {
        return
      }

      if (typeof window.DWC_PLP.definitions !== 'undefined') {
        commit('mutateDefinitions', window.DWC_PLP.definitions)
      }

      if (typeof window.DWC_PLP.products !== 'undefined') {
        commit('mutateProducts', window.DWC_PLP.products)
      }
    }
  }
}
