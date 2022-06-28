/* eslint-disable comma-dangle,space-before-function-paren */
import { mapState } from 'vuex'
import store from 'lib/store'
import { formatPrice } from 'lib/util'
import iconData from './product-icons'
import OgOffer, { UPDATE_DETAILS_EVENT_NAME } from '../og-offer/og-offer.vue'

// Flag to enable debug logging. Refer to `debug()` below.
const DEBUG = true

// Map of product purchase types
const PURCHASE_TYPES = {
  onetime: 'onetime',
  subscription: 'subscription',
}

export default {
  components: {
    OgOffer
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    shop: {
      type: Object,
      required: true
    },
    isActiveSubscription: Boolean,
    queryStringVariant: {
      type: String,
      default: () => ('')
    },
    subscriptionChecked: Boolean
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
      componentMounted: !1,
      moneyFormat: 'amount',
      ogOfferDetails: {},
      optionIcons: iconData,
      selectedOptions: { ...initialSelectedOptions },
      sizeChartActive: false,
      subscriptionAmount: null,
    }
  },
  mounted () {
    this.activeVariantId = this.product.variants[0].id
    // reset
    this.index = ''

    for (var key in this.product.options_by_name) {
      const option = this.product.options_by_name[key].option
      const optionPosition = option.position
      this.$set(this.selectedOptions, key, this.initialVariant[`option${optionPosition}`])
    }

    this.$_addUpdateOgOfferDetailsListener()
    this.componentMounted = 1
  },
  watch: {
    /**
     * Watch `selectedVariantId` for updates.
     *
     * @param {*} newValue
     */
    selectedVariantId(newValue) {
      debug('selectedVariantId', newValue)

      this.$_handleVariantUpdate()
      this.$emit('update-variant-id', newValue)
      store.dispatch('pdp/setSelectedVariantId', { id: newValue })
    },
    productPurchaseType (newVal) {
      let originalPrice
      let comparePrice
      // if one time
      if (newVal === PURCHASE_TYPES.onetime) {
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
    initialVariant () {
      return this.product.selected_or_first_available_variant
    },
    selectedOptionValues () {
      return Object.values(this.selectedOptions)
    },
    hasSingleVariant () {
      return this.product.variants.length === 1
    },
    /**
     * Current selected variant.
     *
     * @returns Variant || {}
     */
    selectedVariant() {
      const variant = this.getVariantMatchingOptions(this.selectedOptionValues)
      debug('selectedVariant', variant)

      const selected = this.hasSingleVariant
        ? this.product.variants[0]
        : variant

      return selected || {}
    },
    selectedVariantId () {
      return this.selectedVariant ? this.selectedVariant.id : ''
    },
    isAbleAddToCart () {
      return !this.selectedVariant || this.selectedVariant.available
    },
    addToCartButtonText () {
      return this.isAbleAddToCart ? 'Add To Cart' : 'Sold Out'
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
    /**
     * Test if the current purchase type is a subscription.
     *
     * @returns Boolean
     */
    subscriptionSelected() {
      const selected = this.productPurchaseType === PURCHASE_TYPES.subscription

      debug('subscriptionSelected', selected)
      return selected
    },
    /**
     * Indicates if this is a onetime subscription.
     *
     * Used for single purchase that is able to reactivate as a subscription.
     *
     * @returns Boolean
     */
    isOnetimeSubscription() {
      return this.chargeLimit === PURCHASE_TYPES.onetime
    },
    /**
     * Subscription product title for display in the cart.
     *
     * Used in cart and sent to checkout for replacement.
     *
     * @returns String
     */
    subscriptionProductTitleDisplay() {
      let display = ''

      // Product title
      display += this.subscriptionProductTitle
        ? this.subscriptionProductTitle
        : this.product.title

      // Discount
      display += this.discountDisplay
        ? ' - ' + this.discountDisplay + ' off'
        : ''

      return display
    },
    activeDiscountType () {
      var discountAmount = this.discountAmount
      var defaultGlobalDiscountAmount = this.defaultGlobalDiscountAmount
      var activeDiscount = discountAmount || defaultGlobalDiscountAmount

      if (activeDiscount) {
        return activeDiscount.indexOf('$') > -1 ? '$' : '%'
      } else {
        return ''
      }
    },
    activeDiscountAmount () {
      var discountAmount = this.discountAmount
      var defaultGlobalDiscountAmount = this.defaultGlobalDiscountAmount

      return discountAmount || defaultGlobalDiscountAmount || '0'
    },
    chargeLimit () {
      return this.initialChargeLimit ? this.initialChargeLimit : 0
    },
    /**
     * Subscription frequency interval.
     *
     * Returns the value of the interval - number of days, months, etc.
     *
     * @returns String
     */
    intervalFrequency() {
      return this.ogOfferDetails.frequency.interval || '1'
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
    /**
     * Subscription label used in the cart.
     *
     * i.e. "1 month", "3 months", etc.
     *
     * @returns String || Boolean
     */
    finalSubscriptionProperty() {
      if (!this.subscriptionSelected && !this.isOnetimeSubscription) {
        return false
      }

      const label = this.ogOfferDetails.frequency.label

      debug('finalSubscriptionProperty', label)
      return label
    },
    /**
     * Subscription frequency unit.
     *
     * Returns the singular value of the unit - 'day', 'week', 'month', etc.
     *
     * @returns String
     */
    intervalUnit() {
      return this.ogOfferDetails.frequency.unit || 'day'
    },
    subscriptionProductTitle () {
      // TODO-ORDERGROOVE
      return null
    },
    defaultGlobalDiscountAmount () {
      return this.shop.default_discount_amount
        ? this.shop.default_discount_amount
        : null
    },
    discountAmount () {
      // TODO-ORDERGROOVE
      return null
    },
    initialChargeLimit () {
      // TODO-ORDERGROOVE
      return ''
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
    formattedSubscriptionAmount () {
      return this.subscriptionAmount ? formatPrice(this.subscriptionAmount) : ''
    },
    /**
     * The purchase type for the selected product.
     *
     * @returns String
     */
    productPurchaseType() {
      const subscribed = this.ogOfferDetails.subscribeChecked

      return subscribed ? PURCHASE_TYPES.subscription : PURCHASE_TYPES.onetime
    },
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
    clickOption (index, option) {
      this.index = index
      this.option = option
      // console.log(index, this.option)
      this.$emit('click-option', this.index)
      console.log(this.index)
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
      let regularEl = null
      let saleEl = null
      let strikethroughPrice = null
      // TODO-ORDERGROOVE
      regularEl = document.querySelector('.TODO-ORDERGROOVE-price-item-regular')
      saleEl = document.querySelector('.TODO-ORDERGROOVE-price-item-sale')
      strikethroughPrice = document.querySelector('.strikethrough-price')

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
    /**
     * Handler for variant updates.
     *
     * Ensures pricing is updated in response to variant changes. Can
     * be called in places that aren't strictly variant-related.
     */
    // on event triggered from variant change in select boxes
    $_handleVariantUpdate() {
      const variant = this.selectedVariant || {}
      this.activeVariantId = variant.id

      const originalPrice = this.sellingPlanAllocation.price ||
        variant.price || false

      const originalComparePrice = variant.compare_at_price || false

      debug('handleVariantUpdate', {
        sellingPlan: this.sellingPlanAllocation,
        variant,
      })

      this.calculateVariantPrices(originalPrice, originalComparePrice)
    },
    getFinalCurrencyRate (amount) {
      return parseInt(amount)
    },
    calculateOriginalVariantPrices (variant) {
      // TODO-ORDERGROOVE
      console.log('calculateOriginalVariantPrices', variant)
    },
    calculateVariantPrices (originalPrice, originalComparePrice) {
      var displayDiscountPrice = false
      var displayDiscountComparePrice = false

      if (originalPrice) {
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
    },
    disableOption (option, value) {
      for (const variant of this.product.variants) {
        if (variant.title === value && variant.available === false) {
          return true
        }
      }
    },
    toggleSizeChart () {
      this.sizeChartActive = !this.sizeChartActive
    },
    /**
     * Add a listener for `og-offer` details updates.
     */
    $_addUpdateOgOfferDetailsListener() {
      const handler = this.$_handleOgOfferDetails

      this.$children.forEach(child => {
        if (child.ogOfferDetails) {
          // Wire-up handler for og-offer selling plan details
          child.$on(UPDATE_DETAILS_EVENT_NAME, handler)

          // Fire handler when listener is added to capture any changes
          handler(child.ogOfferDetails)
        }
      })
    },
    /**
     * Handler for the `og-offer` update events.
     *
     * @param {*} ogOfferDetails
     */
    $_handleOgOfferDetails(ogOfferDetails) {
      debug('$_handleOgOfferDetails', ogOfferDetails)

      this.ogOfferDetails = ogOfferDetails
      this.$_handleVariantUpdate()
    },
  },
  destroyed () {
  }
}

/**
 * Simple debug function to conditionally display debug information.
 */
function debug() {
  if (DEBUG) {
    console.debug('[product-form] ', ...arguments)
  }
}
/* eslint-enable comma-dangle,space-before-function-paren */
