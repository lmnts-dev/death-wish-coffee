import Cart from 'lib/cart'

export default {
  namespaced: true,
  state: {
    cart: {},
    isPopOutCartActive: false,
    addToCartErrorMessage: ''
  },
  mutations: {
    mutateCart (state, cart) {
      state.cart = Object.assign({}, cart)
    },
    mutateAddToCartErrorMessage (state, message) {
      state.addToCartErrorMessage = message
    },
    mutateIsPopOutCartActive (state, value) {
      state.isPopOutCartActive = value
    }
  },
  actions: {
    setIsPopOutCartActive ({ commit }, value) {
      commit('mutateIsPopOutCartActive', value)
    },
    setAddToCartErrorMessage ({ commit }, message) {
      commit('mutateAddToCartErrorMessage', message)
    },
    setCart ({ commit }, cart) {
      commit('mutateCart', cart)
    },
    async getCart ({ dispatch }) {
      const cart = await Cart.get()
      dispatch('setCart', cart)
    },
    async addToCart ({ dispatch }, { id, quantity }) {
      dispatch('setAddToCartErrorMessage', '')
      const result = await Cart.add({ id, quantity })
      if (result.status) {
        dispatch('setAddToCartErrorMessage', result.description)
        setTimeout(() => {
          dispatch('setAddToCartErrorMessage', '')
        }, 5000)
      } else {
        await dispatch('getCart')
      }
    }
  }
}
