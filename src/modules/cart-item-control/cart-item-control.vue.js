export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    idPrefix: {
      type: String,
      default: 'cart-item-control-'
    }
  },
  computed: {
    inputId () {
      return `${this.idPrefix}${this.item.key}`
    }
  }
}
