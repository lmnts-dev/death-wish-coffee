import store from 'lib/store'
import { formatPrice } from 'lib/util'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    const initialSelectedOptions = this.product.options.reduce(
      (result, option) => {
        // Initially, none of the option has any selected value
        result[option] = null
        return result
      },
      {}
    )

    return {
      initialSelectedOptions,
      selectedOptions: { ...initialSelectedOptions }
    }
  },
  computed: {
    selectedOptionValues () {
      return Object.values(this.selectedOptions)
    },
    selectedVariantId () {
      const variant = this.getVariantMatchingOptions(this.selectedOptionValues)

      return variant ? variant.id : ''
    },
    priceDecidingFactor () {
      // Find out which variant option affects pricing
      for (const option of this.product.options) {
        const availableValues = this.product.options_by_name[option].option.values
        const pricesContainingOption = {}

        for (const variant of this.product.variants) {
          for (const value of variant.options) {
            if (!availableValues.includes(value)) {
              continue
            }

            if (!pricesContainingOption[value]) {
              pricesContainingOption[value] = []
            } else if (pricesContainingOption[value].includes(variant.price)) {
              // if multiple variants with the same option value has the same price then this is the
              // option we're looking for
              return option
            }

            pricesContainingOption[value].push(variant.price)
          }
        }
      }

      return this.product.options[0]
    }
  },
  watch: {
    selectedVariantId (newValue) {
      if (newValue) {
        this.$emit('update-variant-id', newValue)
      }
    }
  },
  methods: {
    sanitize (name) {
      return name.replace(/[^\w-]+/g, '')
    },
    optionInputId (option, value) {
      return `product-${this.product.id}-option-${this.sanitize(option)}-${this.sanitize(value)}`
    },
    isVariantMatchingOptions (variant, options) {
      return variant.options.every(
        (value, valueIndex) => value === options[valueIndex]
      )
    },
    getVariantMatchingOptions (options) {
      return this.product.variants.find(
        variant => this.isVariantMatchingOptions(variant, options)
      )
    },
    getPriceForOptionValue (optionIndex, value) {
      const options = []

      // In case user hasn't actually selected anything, default to the first
      // value of each option
      for (const [option, value] of Object.entries(this.selectedOptions)) {
        options.push(value || this.product.options_by_name[option].option.values[0])
      }
      options[optionIndex] = value

      const matchedVariant = this.getVariantMatchingOptions(options)

      return formatPrice(matchedVariant ? matchedVariant.price : this.product.variants[0].price)
    },
    async handleAddToCart () {
      if (!this.selectedVariantId) {
        return
      }
      await store.dispatch('cart/addToCart', { id: this.selectedVariantId, quantity: 1 })
      this.$nextTick(() => {
        this.resetSelectedOptions()
        store.dispatch('cart/setIsPopOutCartActive', true)
      })
    },
    resetSelectedOptions () {
      this.selectedOptions = { ...this.initialSelectedOptions }
    },
    handleVariantSelecting (e) {
      const variantId = parseInt(e.target.value)
      const variant = this.product.variants.find(v => v.id === variantId)
      this.selectedOptions = this.product.options.reduce(
        (result, option, index) => Object.assign({}, result, {
          [option]: variant.options[index]
        }),
        {}
      )
    }
  }
}
