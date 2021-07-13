export default {
  namespaced: true,
  state: {
    selectedVariantId: null
  },
  mutations: {
    mutateSelectedVariantId (state, value) {
      state.selectedVariantId = value
    }
  },
  actions: {
    setSelectedVariantId ({ commit }, { id }) {
      commit('mutateSelectedVariantId', id)
    }
  }
}
