import { formatPrice } from 'lib/util'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    // Prime product options to make this reactive
    const selectedOptions = this.product.options.reduce(
      (result, option) => {
        // Initially, none of the option has any selected value
        result[option] = null
        return result
      },
      {}
    )

    return {
      selectedOptions
    }
  },
  computed: {
    selectedOptionValues () {
      return Object.values(this.selectedOptions)
    },
    selectedVariantId () {
      const variant = this.getVariantMatchingOptions(this.selectedOptionValues)

      return variant ? variant.id : ''
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
    getPriceForLastOptionValue (value) {
      const options = []

      // In case user hasn't actually selected anything, default to the first
      // value of each option
      for (const [option, value] of Object.entries(this.selectedOptions)) {
        options.push(value || this.product.options_by_name[option].option.values[0])
      }
      options[options.length - 1] = value

      const matchedVariant = this.getVariantMatchingOptions(options)

      return formatPrice(matchedVariant ? matchedVariant.price : this.product.variants[0].price)
    }
  }
}
