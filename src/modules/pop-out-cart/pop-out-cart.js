import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import store from 'lib/store'
import VImage from '../v-image/v-image.vue'
import CartItemControl from '../cart-item-control/cart-item-control.vue'

/**
 * Initializes the javascript for the pop-out-cart module
 * @param {Object} el - The DOM Node containing the data-module="pop-out-cart" attribute.
 */
const popOutCart = (el) => {
  return new Vue({
    el,
    delimiters: ['${', '}'],
    name: 'PopOutCartRoot',
    store,
    components: {
      VImage,
      CartItemControl
    },
    computed: {
      ...mapState('cart', ['isPopOutCartActive']),
      ...mapGetters('cart', ['items', 'totalPrice', 'totalDiscount', 'formattedTotalPrice', 'formattedTotalDiscount', 'isClickedOutside']),
      cartHasSubscriptionItem () {
        return this.items.length > 0 ? this.items.some(item => Object.keys(item.properties).includes('Subscription')) : false
      }
    },
    watch: {
      isClickedOutside (newValue) {
        if (newValue) {
          store.dispatch('cart/setIsPopOutCartActive', false)
        }
      }
    },
    mounted () {
      document.addEventListener('click', e => {
        if (!this.$el.contains(e.target)) {
          store.dispatch('cart/updateIsClickedOutsidePopOutCart', true)
          setTimeout(() => {
            store.dispatch('cart/updateIsClickedOutsidePopOutCart', false)
          }, 10)
        }
      })
    },
    methods: {
      removeItem (item) {
        store.dispatch('cart/updateCart', { id: item.id, quantity: 0 })
      }
    }
  })
}

export default popOutCart
