import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from 'lib/store'
// import VImage from '../v-image/v-image.vue'
// import CartItemControl from '../cart-item-control/cart-item-control.vue'

/**
 * Initializes the javascript for the pop-out-cart module
 * @param {Object} el - The DOM Node containing the data-module="pop-out-cart" attribute.
 */
const cartsidebar = (el) => {
  return new Vue({
    el,
    delimiters: ['${', '}'],
    name: 'CartSidebar',
    store,
    computed: {
      ...mapGetters('cart', ['items', 'totalPrice', 'totalDiscount', 'formattedTotalPrice', 'formattedTotalDiscount', 'isClickedOutside']),
      cartHasSubscriptionItem () {
        if (this.items.length > 0) {
          return this.items.some(item => {
            return item.properties instanceof Object ? Object.keys(item.properties).includes('Subscription') : false
          })
        }
        return false
      }
    }
  })
}

export default cartsidebar
