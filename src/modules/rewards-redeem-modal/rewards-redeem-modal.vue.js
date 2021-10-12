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
      isActive: false,
      activeSliderProductId: null,
      variableProductAmount: 0,
      pointsPurchased: null,
      isDiscountCodeCopied: false
    }
  },
  watch: {
    isDiscountCodeCopied (currentValue) {
      if (currentValue) {
        setTimeout(() => {
          this.isDiscountCodeCopied = false
        }, 2000)
      }
    }
  },
  computed: {
    variableProduct () {
      return this.redeemProducts.find(p => p.id === this.activeSliderProductId)
    },
    variableProductMin () {
      return this.variableProduct && this.variableProduct.variable_points_min
    },
    variableProductMax () {
      return this.variableProduct && this.variableProduct.variable_points_max && Math.min(this.variableProduct.variable_points_max, Math.floor(this.pointsBalance / 100) * 100)
    },
    variableProductStep () {
      return this.variableProduct && this.variableProduct.variable_points_step
    },
    purchasedDiscountCode () {
      return this.pointsPurchased && this.pointsPurchased.reward_fulfillment && this.pointsPurchased.reward_fulfillment.code
    }
  },
  methods: {
    async checkAndPurchase (product) {
      if (product.exchange_type === 'fixed') {
        await this.redeem(product)
      }
      if (product.exchange_type === 'variable') {
        if (this.variableProduct && this.variableProductAmount) {
          this.redeem(this.variableProduct, this.variableProductAmount)
        } else {
          this.selectVariableAmount(product)
        }
      }
    },
    async redeem (product, variableAmount) {
      if (variableAmount) {
        const pointsPurchased = await window.Smile.purchasePointsProduct(product.id, { points_to_spend: variableAmount })
        this.pointsPurchased = pointsPurchased
      } else {
        const pointsPurchased = await window.Smile.purchasePointsProduct(product.id)
        this.pointsPurchased = pointsPurchased
      }
      this.activeSliderProductId = null
      this.variableProductAmount = 0
    },
    selectVariableAmount (product) {
      this.activeSliderProductId = product.id
    },
    copyDiscountCode () {
      if (this.purchasedDiscountCode) {
        navigator.clipboard.writeText(this.purchasedDiscountCode)
        const inputEl = Array.isArray(this.$refs.input) ? this.$refs.input[0] : this.$refs.input
        if (inputEl) {
          inputEl.focus()
        }
        this.isDiscountCodeCopied = true
      }
    },
    focusInput (e) {
      const inputEl = e.currentTarget
      inputEl.setSelectionRange(0, this.purchasedDiscountCode.length)
    },
    activate () {
      this.isActive = true
      addClass(document.body, 'is-modal-active')
    },
    deactivate () {
      this.isActive = false
      removeClass(document.body, 'is-modal-active')
    },
    back () {
      this.activeSliderProductId = null
      this.variableProductAmount = 0
      this.pointsPurchased = null
    }
  }
}
