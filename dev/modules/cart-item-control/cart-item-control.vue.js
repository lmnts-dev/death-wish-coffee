import store from 'lib/store'

export default {
  props: {
    initialQuantity: {
      type: Number,
      default: 1
    },
    item: {
      type: Object,
      default: () => ({})
    },
    idPrefix: {
      type: String,
      default: 'cart-item-control-'
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    }
  },
  data () {
    return {
      isUpdated: false,
      quantity: this.initialQuantity
    }
  },
  computed: {
    inputId () {
      return `${this.idPrefix}${this.item.key}`
    }
  },
  methods: {
    decrease () {
      this.quantity = Math.max(this.quantity - 1, this.min)
      this.isUpdated = this.quantity !== this.initialQuantity
    },
    increase () {
      this.quantity = Math.min(this.quantity + 1, this.max)
      this.isUpdated = this.quantity !== this.initialQuantity
    },
    async submitUpdating () {
      await store.dispatch('cart/updateCart', { id: this.item.id, quantity: this.quantity })
      this.isUpdated = false
    }
  }
}
