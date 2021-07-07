import { mapState } from 'vuex'
import store from 'lib/store'
import { formatPrice } from 'lib/util'
import iconData from './product-icons'

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    shop: {
      type: Object,
      required: true
    },
    upscribeKeepComponentInSync: {
      type: Boolean,
      default: false
    },
    upscribeSalePriceQuerySelector: {
      type: Boolean,
      default: false
    },
    upscribeRegularPriceQuerySelector: {
      type: Boolean,
      default: false
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
      moneyFormat: 'amount',
      selectedOptions: { ...initialSelectedOptions },
      selectedFrequencyIndex: 0,
      productPurchaseType: 'onetime',
      subscriptionPrice: null,
      subscriptionAmount: null,
      optionIcons: iconData,
      componentMounted: !1
    }
  },
  mounted () {
    this.activeVariantId = this.product.variants[0].id
    // reset
    this.index = ''
    this.selectedFrequencyIndex = 0
    this.productPurchaseType = 'onetime'
    this.subscriptionPrice = null

    // add listener for variant update, set in variant_selection.js
    // this listener could be different depeneding on if the theme uses the same base setup
    var vm = this
    window.addEventListener('upscribeVariantUpdate', function (event) {
      vm.handleVariantUpdateEvent(event)
    }, false)

    // if (this.upscribeKeepComponentInSync === true) {
    window.addEventListener(
      'upscribeProductPurchaseTypeUpdate',
      function (event) {
        vm.setProductPurchaseType(event.detail)
      },
      false
    )

    window.addEventListener(
      'upscribeFrequencyIndexUpdate',
      function (event) {
        vm.setFrequency(event.detail)
      },
      false
    )
    // }
    this.componentMounted = 1
  },
  watch: {
    selectedVariantId (newValue) {
      if (newValue) {
        this.$emit('update-variant-id', newValue)
        store.dispatch('pdp/setSelectedVariantId', { id: newValue })
      }
    },
    productPurchaseType (newVal) {
      // if (this.upscribeKeepComponentInSync) {
      // Upscribe Product Purchase Type Update
      window.dispatchEvent(new CustomEvent('upscribeProductPurchaseTypeUpdate', {
        detail: newVal
      }))
      // }
      let originalPrice
      let comparePrice
      // if one time
      if (newVal === 'onetime') {
      // use stored non-discount prices from previous changes
        originalPrice = this.activeSubsriptionDisplayPrice || false
        comparePrice = this.activeSubsriptionDisplayComparePrice || false

        // put into money format
        var formatOriginalPrice = originalPrice ? this.formatMoney(originalPrice) : false
        var formatComparePrice = comparePrice ? this.formatMoney(comparePrice) : false

        // replace pricing elements with new vals
        this.setPricingDisplayEls(formatOriginalPrice, formatComparePrice)
      } else {
      // if subscription
      // use stored non-discount prices from previous changes
        originalPrice = this.activeSubsriptionDisplayPrice || false
        comparePrice = this.activeSubsriptionDisplayComparePrice || false

        // calculate subscription discount and replace pricing elements with new vals
        this.calculateVariantPrices(originalPrice, comparePrice)
      }
    }
  },
  computed: {
    ...mapState('cart', ['addedToCartSuccessfully', 'addedToCartErrorMessage']),
    productId () {
      return this.product.id
    },
    productName () {
      return this.product.title
    },
    selectedOptionValues () {
      return Object.values(this.selectedOptions)
    },
    hasSingleVariant () {
      return this.product.variants.length === 1
    },
    selectedVariantId () {
      const variant = this.getVariantMatchingOptions(this.selectedOptionValues)
      // upscribe
      if (variant) {
        window.dispatchEvent(new CustomEvent('upscribeVariantUpdate', {
          detail: variant
        }))
      }

      if (this.hasSingleVariant) {
        return this.product.variants[0].id
      } else if (variant) {
        return variant.id
      } else {
        return ''
      }
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
    },
    applicableVariants () {
      if (!this.initialApplicableVariants) return false
      return this.initialApplicableVariants.split(',')
    },
    activeVariantIsApplicableVariant () {
    // all are applicable

      if (!this.activeVariantId) {
        this.productPurchaseType = 'onetime'
        return false
      }

      if (!this.initialApplicableVariants) return true

      if (this.applicableVariants.includes(this.activeVariantId.toString())) {
        return true
      } else {
        this.productPurchaseType = 'onetime'
        return false
      }
    },

    // helper for if current state is subscription
    subscriptionSelected () {
      return this.productPurchaseType === 'subscription'
    },
    // used for single purchase that will be able to reactivate as a subscription in the future
    isOnetimeSubscription () {
      return this.chargeLimit === 'onetime'
    },
    // subscription title, used in cart and sent to checkout for replacement
    subscriptionProductTitleDisplay () {
      let display = ''
      display += this.subscriptionProductTitle
        ? this.subscriptionProductTitle
        : this.product.title
      display += this.discountDisplay
        ? ' - ' + this.discountDisplay + ' off'
        : ''
      return display
    },
    activeDiscountType () {
      var discountAmount = this.discountAmount
      var defaultGlobalDiscountAmount = this.defaultGlobalDiscountAmount
      var activeDiscount = discountAmount || defaultGlobalDiscountAmount

      return activeDiscount.indexOf('$') > -1 ? '$' : '%'
    },
    activeDiscountAmount () {
      var discountAmount = this.discountAmount
      var defaultGlobalDiscountAmount = this.defaultGlobalDiscountAmount

      return discountAmount || defaultGlobalDiscountAmount || 0
    },
    chargeLimit () {
      return this.initialChargeLimit ? this.initialChargeLimit : 0
    },
    intervalFrequency () {
      return this.intervalFrequncyMetafield
        ? this.intervalFrequncyMetafield
        : '15,30,45,60'
    },
    // build frequency options for select boxes
    selectFrequencyOptions () {
      var intervalFrequency = this.intervalFrequency
      var intervalUnit = this.intervalUnit

      if (!intervalFrequency || !intervalUnit) return false

      return intervalFrequency.split(',').map(function (frequency) {
        return {
          value: frequency.trim(),
          mainText: frequency.trim(),
          subText: false
        }
      })
    },
    // plural unit display check
    finalSubscriptionProperty () {
      var selectedFrequency = this.selectedFrequency
      var unit = this.intervalUnit
      if (!this.subscriptionSelected && !this.isOnetimeSubscription) { return false }

      if (selectedFrequency > 1) {
        return selectedFrequency + ' ' + unit + 's'
      } else {
        return selectedFrequency + ' ' + unit
      }
    },
    selectedFrequency () {
      return this.selectFrequencyOptions[this.selectedFrequencyIndex].value
    },
    intervalUnit () {
      return this.intervalUnitMetafield ? this.intervalUnitMetafield : 'day'
    },
    initialApplicableVariants () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.applicable_variants
        : null
    },
    subscriptionProductTitle () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.subscription_product_title
        : null
    },
    intervalFrequncyMetafield () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.interval_frequency
        : null
    },
    intervalUnitMetafield () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.interval_unit
        : null
    },
    defaultGlobalDiscountAmount () {
      return this.shop.default_discount_amount
        ? this.shop.default_discount_amount
        : null
    },
    discountAmount () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.discount_amount
        : null
    },
    initialChargeLimit () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.charge_limit
        : ''
    },
    recurringDiscountAmount () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.recurring_discount_amount
        : null
    },
    recurringDiscountAfterOrder () {
      return this.product.sf_upscribe
        ? this.product.sf_upscribe.recurring_discount_after_order
        : null
    },
    oneTimeMessage () {
      return this.shop ? this.shop.one_time_message : ''
    },
    subscriptionMessage () {
      return this.shop ? this.shop.subscribe_message : ''
    },
    learnMoreUrl () {
      return this.shop ? this.shop.learn_more_url : ''
    },
    howItWorksTitle () {
      return this.shop ? this.shop.how_it_works_title : ''
    },
    howItWorksText () {
      return this.shop ? this.shop.how_it_works_text : ''
    },
    isActive () {
      console.log(this.selectedFrequencyIndex, this.index)
      return this.selectedFrequencyIndex === this.index
    },
    isEnableUpscribe () {
      return this.product.sf_upscribe.enable_subscription
    }
  },
  methods: {
    activeSubsriptionDisplayPrice () {
      return this.product
        .selected_or_first_available_variant
        ? this.product.selected_or_first_available_variant.price
        : null
    },
    activeSubsriptionDisplayComparePrice () {
      return this.product
        .selected_or_first_available_variant
        ? this.product.selected_or_first_available_variant
          .compare_at_price
        : null
    },

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
      const params = { id: this.selectedVariantId, quantity: 1, properties: {} }
      if (this.subscriptionSelected) {
        const subscriptionProperties = {
          'Discount Amount': this.activeDiscountAmount,
          'Interval Frequency': this.intervalFrequency,
          'Interval Unit': this.intervalUnit,
          Subscription: this.finalSubscriptionProperty,
          'Subscription Amount': this.subscriptionAmount,
          'Subscription Product Title': this.subscriptionProductTitleDisplay,
          'Charge Limit': this.chargeLimit,
          'Recurring Discount Amount': this.recurringDiscountAmount,
          'Recurring Discount After Order': this.recurringDiscountAfterOrder
        }
        params.properties = Object.assign({}, params.properties, subscriptionProperties)
      }
      await store.dispatch('cart/addToCart', params)
      this.$nextTick(() => {
        this.resetSelectedOptions()
        if (this.addedToCartSuccessfully) {
          store.dispatch('cart/setIsPopOutCartActive', true)
        } else {
          this.$emit('added-to-cart-error')
        }
      })
    },
    resetSelectedOptions () {
      this.selectedOptions = { ...this.initialSelectedOptions }
      this.productPurchaseType = 'onetime'
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
    },
    setFrequency (val) {
      this.selectedFrequencyIndex = val
    },

    clickOption (index, option) {
      // console.log(this.selectedFrequency === this.index)
      this.index = index
      this.option = option
      // this.isActive(index)
      // console.log(index, this.option)
      this.$emit('click-option', this.index)
      console.log(this.index)
      // Upscribe Frequency Update
      window.dispatchEvent(new CustomEvent('upscribeFrequencyIndexUpdate', {
        detail: this.index
      }))
    },
    getParameterByName (name, url = window.location.href) {
      name = name.replace(/[\]]/g, '\\$&')
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
      var results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    },
    getIndex (index) {
      console.log(index)
      this.index = index
    },
    setProductPurchaseType (val) {
      if (!val) return
      this.productPurchaseType = val
    },
    discountCalculatedValue (total) {
      var discountType = this.activeDiscountType
      var discountAmount = this.activeDiscountAmount
        .replace('%', '')
        .replace('$', '')

      var calcDiscountAmount = 0

      if (discountType === '$') {
      // fixed
        calcDiscountAmount = discountAmount
      } else if (discountType === '%') {
      // percentage
        calcDiscountAmount = (total * discountAmount) / 100
      }
      return total - calcDiscountAmount
    },
    // replace pricing values, for compare and regular pricing
    setPricingDisplayEls (original, compare) {
      let regularEl
      let saleEl
      let strikethroughPrice
      if (this.upscribeRegularPriceQuerySelector === true) {
        regularEl = document.querySelector(
          this.upscribeRegularPriceQuerySelector
        )
      } else {
        regularEl = document.querySelector('.upscribe-price-item-regular')
      }

      if (this.upscribeSalePriceQuerySelector) {
        saleEl = document.querySelector(
          this.upscribeSalePriceQuerySelector
        )
      } else {
        saleEl = document.querySelector('.upscribe-price-item-sale')
        strikethroughPrice = document.querySelector('.strikethrough-price')
      }

      if (!regularEl && !saleEl) {
        return
      }

      if (compare) {
        if (regularEl) regularEl.innerHTML = compare
        if (saleEl) {
          saleEl.innerHTML = original
          strikethroughPrice.innerHTML = original
        }
      } else {
        if (regularEl) regularEl.innerHTML = original
        if (saleEl) {
          saleEl.innerHTML = ''
          strikethroughPrice.innerHTML = ''
        }
      }
    },
    // on event triggered from variant change in select boxes
    handleVariantUpdateEvent (event) {
      var variant = event.detail
      var originalPrice = variant.price || false
      var originalComparePrice = variant.compare_at_price || false

      // console.log({ variant })

      this.activeVariantId = variant.id

      // calculate and set new values
      this.calculateVariantPrices(originalPrice, originalComparePrice)

      // update original price if available
      this.calculateOriginalVariantPrices(variant)

      // store values if subscription isn't currently selected
      this.activeSubsriptionDisplayPrice = originalPrice
      this.activeSubsriptionDisplayComparePrice = originalPrice
    // this.activeSubsriptionDisplayComparePrice = originalComparePrice
    // this.activeSubsriptionDisplayComparePrice = originalComparePrice
    },
    getFinalCurrencyRate (amount) {
      return parseInt(amount)
    },
    calculateOriginalVariantPrices (variant) {
      var price = variant.price
      var originalNoDiscountPriceEl = document.querySelector(
        '.upscribe-price-item-original'
      )

      if (originalNoDiscountPriceEl) {
        originalNoDiscountPriceEl.innerHTML = price
      }
    },
    calculateVariantPrices (originalPrice, originalComparePrice) {
      var displayDiscountPrice = false
      var displayDiscountComparePrice = false

      if (originalPrice) {
      // var originalPriceEl = document.querySelector('.upscribe-price-item-regular')
        var discountPrice =
          originalPrice - this.discountCalculatedValue(originalPrice)

        // set for passing in cart property to checkout - not formatted
        this.subscriptionAmount = this.getFinalCurrencyRate(
          originalPrice - discountPrice
        )

        displayDiscountPrice = this.formatMoney(originalPrice - discountPrice)
      }

      if (originalComparePrice) {
        var discountComparePrice =
          originalComparePrice -
          this.discountCalculatedValue(originalComparePrice)

        displayDiscountComparePrice = this.formatMoney(
          originalComparePrice - discountComparePrice
        )
      }

      // replace price elements if subscription selected
      if (this.subscriptionSelected) {
        this.setPricingDisplayEls(
          displayDiscountPrice,
          displayDiscountComparePrice
        )
      } else {
      // if onetime selected, store to use if selected next
        this.activeSubsriptionDisplayPrice = displayDiscountPrice
        this.activeSubsriptionDisplayComparePrice = displayDiscountComparePrice
      }
    },
    // shopify format money
    formatMoney (cents, format) {
      if (typeof cents === 'string') {
        cents = cents.replace('.', '')
      }
      var value = ''
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
      var formatString = format || this.moneyFormat

      function formatWithDelimiters (number, precision, thousands, decimal) {
        thousands = thousands || ','
        decimal = decimal || '.'

        if (isNaN(number) || number === null) {
          return 0
        }

        number = (number / 100.0).toFixed(precision)

        var parts = number.split('.')
        var dollarsAmount = parts[0].replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g,
          '$1' + thousands
        )
        var centsAmount = parts[1] ? decimal + parts[1] : ''

        return dollarsAmount + centsAmount
      }
      switch (formatString.match(placeholderRegex)) {
        case 'amount':
          value = formatWithDelimiters(cents, 2)
          break
        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0)
          break
        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',')
          break
        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',')
          break
        case 'amount_no_decimals_with_space_separator':
          value = formatWithDelimiters(cents, 0, ' ')
          break
        case 'amount_with_apostrophe_separator':
          value = formatWithDelimiters(cents, 2, "'")
          break
      }
      // console.log(value)

      return formatString.replace(placeholderRegex, value)
    },
    initialSelectedOptions: () => {
      this.product.options.reduce((result, option) => {
        // Initially, none of the option has any selected value
        result[option] = null
        return result
      })
    },
    toggleOption (option, value) {
      const cloneSelectedOptions = Object.assign({}, this.selectedOptions)
      if (cloneSelectedOptions[option] && cloneSelectedOptions[option] === value) {
        cloneSelectedOptions[option] = null
      } else {
        cloneSelectedOptions[option] = value
      }
      this.selectedOptions = Object.assign({}, cloneSelectedOptions)
    }
  },
  destroyed () {
    window.removeEventListener('upscribeVariantUpdate', this.handleVariantUpdateEvent)
    window.removeEventListener('upscribeProductPurchaseTypeUpdate', this.setProductPurchaseType)
    window.removeEventListener('upscribeFrequencyIndexUpdate', this.setFrequency)
  }
}
