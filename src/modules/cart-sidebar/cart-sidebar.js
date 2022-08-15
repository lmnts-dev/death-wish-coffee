import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from 'lib/store'

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
            return !!item.selling_plan_allocation
          })
        }
        return false
      }
    },
    methods: {
      checkout () {
        window.location.href = '/checkout'
      }
    }
  })
}

export default cartsidebar
