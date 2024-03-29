import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import store from 'lib/store'
import VImage from '../v-image/v-image.vue'
import CartItemControl from '../cart-item-control/cart-item-control.vue'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

/**
 * Initializes the javascript for the pop-out-cart module
 * @param {Object} el - The DOM Node containing the data-module="pop-out-cart" attribute.
 */
const popOutCart = (el) => {
  return new Vue({
    el,
    data () {
      return {
        breakpoint: 768,
        isMobile: false
      }
    },
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
        if (this.items.length > 0) {
          return this.items.some(item => {
            return item.properties instanceof Object ? Object.keys(item.properties).includes('Subscription') : false
          })
        }
        return false
      },
      totalCartPrice () {
        const price = this.items.reduce((a, b) => {
          const itemPrice = b.properties instanceof Object && typeof b.properties['Subscription Amount'] !== 'undefined' ? parseInt(b.properties['Subscription Amount']) : b.price
          return a + itemPrice * b.quantity
        }, 0)
        return price / 100
      }
    },
    watch: {
      isClickedOutside (newValue) {
        if (newValue) {
          store.dispatch('cart/setIsPopOutCartActive', false)
        }
      },
      isPopOutCartActive (value) {
        if (value && this.isMobile) {
          disableBodyScroll(this.$refs.cart)
        } else {
          clearAllBodyScrollLocks()
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
      this.resizeHandler()
      window.addEventListener('resize', this.resizeHandler)
    },
    methods: {
      removeItem (item) {
        store.dispatch('cart/updateCart', { id: item.id, quantity: 0 })
      },
      checkout () {
        window.location.href = '/checkout'
      },
      resizeHandler () {
        this.isMobile = window.innerWidth < this.breakpoint
      },
      closePopOutCart () {
        store.dispatch('cart/setIsPopOutCartActive', false)
      }
    },
    destroy () {
      window.addEventListener('resize', this.resizeHandler)
    }
  })
}

export default popOutCart
