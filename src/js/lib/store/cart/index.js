import Cart from 'lib/cart'
import { formatPrice } from 'lib/util'

export default {
  namespaced: true,
  state: {
    cart: {},
    isPopOutCartActive: false,
    addedToCartErrorMessage: '',
    addedToCartSuccessfully: false,
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
    mutateAddedToCartErrorMessage (state, message) {
      state.addedToCartErrorMessage = message
    },
    mutateAddedToCartSuccessfully (state, value) {
      state.addedToCartSuccessfully = value
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
    setAddedToCartErrorMessage ({ commit }, message) {
      commit('mutateAddedToCartErrorMessage', message)
    },
    setAddedToCartSuccessfully ({ commit }, value) {
      commit('mutateAddedToCartSuccessfully', value)
    },
    setCart ({ commit }, cart) {
      commit('mutateCart', cart)
    },
    resetAddedToCart ({ dispatch }) {
      dispatch('setAddedToCartErrorMessage', '')
      dispatch('setAddedToCartSuccessfully', false)
    },
    async getCart ({ dispatch }) {
      const cart = await Cart.get()
      dispatch('setCart', cart)
    },
    async addToCart ({ dispatch }, { id, quantity }) {
      dispatch('resetAddedToCart')
      const result = await Cart.add({ id, quantity })
      if (result.errors) {
        dispatch('setAddedToCartErrorMessage', result.description)
      } else {
        await dispatch('getCart')
        dispatch('setAddedToCartSuccessfully', true)
      }
      setTimeout(() => {
        dispatch('resetAddedToCart')
      }, 5000)
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
