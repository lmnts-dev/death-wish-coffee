import Cart from 'lib/cart'
import { formatPrice } from 'lib/util'

export default {
  namespaced: true,
  state: {
    cart: {},
    isPopOutCartActive: false,
    addToCartErrorMessage: '',
    isClickedOutsidePopOutCart: false,
    isClickedOutsidePopOutCartTrigger: false
  },
  getters: {
    items ({ cart }) {
      return (cart.items || []).map(item => Object.assign({}, item, {
        formatted_line_price: `$${formatPrice(item.line_price)}`
      }))
    },
    itemCount ({ cart }) {
      return cart.item_count || 0
    },
    totalPrice ({ cart }) {
      return cart.total_price || 0
    },
    formattedTotalPrice (state, { totalPrice }) {
      return totalPrice ? `$${formatPrice(totalPrice)}` : ''
    },
    totalDiscount ({ cart }) {
      return cart.total_discount || 0
    },
    formattedTotalDiscount (state, { totalDiscount }) {
      return totalDiscount ? `$${formatPrice(totalDiscount)}` : ''
    },
    hasItems (state, { itemCount }) {
      return itemCount > 0
    },
    isClickedOutside ({ isClickedOutsidePopOutCart, isClickedOutsidePopOutCartTrigger }) {
      return isClickedOutsidePopOutCart && isClickedOutsidePopOutCartTrigger
    }
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
    },
    mutateIsClickedOutsidePopOutCart (state, value) {
      state.isClickedOutsidePopOutCart = value
    },
    mutateIsClickedOutsidePopOutCartTrigger (state, value) {
      state.isClickedOutsidePopOutCartTrigger = value
    }
  },
  actions: {
    setIsPopOutCartActive ({ commit, dispatch }, value) {
      commit('mutateIsPopOutCartActive', value)
      dispatch('resetClickedOutside')
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
    },
    async updateCart ({ dispatch }, { id, quantity }) {
      const response = await Cart.update({ id, quantity })
      if (!response.errors) {
        await dispatch('getCart')
      }
    },
    resetClickedOutside ({ dispatch }) {
      dispatch('updateIsClickedOutsidePopOutCart', false)
      dispatch('updateIsClickedOutsidePopOutCartTrigger', false)
    },
    updateIsClickedOutsidePopOutCart ({ commit }, value) {
      commit('mutateIsClickedOutsidePopOutCart', value)
    },
    updateIsClickedOutsidePopOutCartTrigger ({ commit }, value) {
      commit('mutateIsClickedOutsidePopOutCartTrigger', value)
    }
  }
}
