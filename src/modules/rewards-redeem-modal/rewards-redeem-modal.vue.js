import { addClass, removeClass } from 'lib/util'

export default {
  props: {
    redeemProducts: {
      type: Array,
      default: () => []
    },
    pointsBalance: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    async checkAndRedeem (product) {
      if (product.exchange_type === 'fixed') {
        await this.redeem(product)
      }
      if (product.exchange_type === 'variable') {
        this.selectVariableAmount()
      }
    },
    async redeem (product, variableAmount) {
      if (variableAmount) { } else {
        const pointsPurchased = window.Smile.purchasePointsProduct(product.id)
        console.log(pointsPurchased)
      }
    },
    selectVariableAmount (product) {
      console.log(product)
    },
    activate () {
      this.isActive = true
      addClass(document.body, 'is-modal-active')
    },
    deactivate () {
      this.isActive = false
      removeClass(document.body, 'is-modal-active')
    }
  }
}
