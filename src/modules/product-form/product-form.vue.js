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
  },
  computed: {
    ...mapState('cart', ['addedToCartSuccessfully', 'addedToCartErrorMessage']),
    /**
     * Product ID.
     *
     * @returns String
     */
    productId() {
      return this.product.id
    },
    /**
     * Alias for the product.title.
     *
     * @returns String
     */
    productName() {
      return this.product.title
    },
    /**
     * Initial product variant.
     *
     * @returns Variant
     */
    initialVariant() {
      return this.product.selected_or_first_available_variant
    },
    /**
     * Array of `values` from the selected options.
     *
     * @returns Array
     */
    selectedOptionValues() {
      return Object.values(this.selectedOptions)
    },
    /**
     * Indicates if the product only has a single variant.
     *
     * @returns Boolean
     */
    hasSingleVariant() {
      return this.product.variants.length === 1
    },
    /**
     * Current selected variant.
     *
     * @returns Variant || {}
     */
    selectedVariant() {
      const variant = this.findVariantWithOptions(this.selectedOptionValues)
      debug('selectedVariant', variant)

      const selected = this.hasSingleVariant
        ? this.product.variants[0]
        : variant

      return selected
    },
    /**
     * The ID of the selected variant.
     *
     * @returns String
     */
    selectedVariantId() {
      return this.selectedVariant ? this.selectedVariant.id : ''
    },
    /**
     * Determine if the product variant can be added to the cart.
     *
     * @returns Boolean
     */
    isAbleAddToCart() {
      return !this.selectedVariant || this.selectedVariant.available
    },
    /**
     * Text for the Add to Cart button.
     *
     * @returns String
     */
    addToCartButtonText() {
      return this.isAbleAddToCart ? 'Add To Cart' : 'Sold Out'
    },
    /**
     * Determine the variant option that affects pricing.
     */
    priceDecidingFactor() {
      const product = this.product
      const defaultOptionName = product.options[0]

      for (const optionName of product.options) {
        const option = product.options_by_name[optionName].option
        const availableValues = option.values
        const pricesContainingOption = {}

        for (const variant of product.variants) {
          for (const value of variant.options) {
            if (!availableValues.includes(value)) {
              continue
            }

            if (!pricesContainingOption[value]) {
              pricesContainingOption[value] = []
            } else if (pricesContainingOption[value].includes(variant.price)) {
              // If multiple variants with the same option value have the
              // same price then this is the option we're looking for
              debug('priceDecidingFactor found', optionName)
              return optionName
            }

            pricesContainingOption[value].push(variant.price)
          }
        }
      }

      debug('priceDecidingFactor default', defaultOptionName)
      return defaultOptionName
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
      return this.productPurchaseType === PURCHASE_TYPES.onetime
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
      display += this.product.title

      // Discount
      display += this.discountDisplay
        ? ' - ' + this.discountDisplay + ' off'
        : ''

      return display
    },
    /**
     * Active discount type.
     *
     * Determines if the `activeDiscountAmount` is in dollars or percent.
     *
     * @returns String ('$' || '%')
     */
    activeDiscountType() {
      const activeDiscount = this.activeDiscountAmount

      if (activeDiscount) {
        return activeDiscount.indexOf('$') > -1 ? '$' : '%'
      } else {
        return ''
      }
    },
    /**
     * Active discount amount.
     *
     * Checks for a global discount and provides an extension point for
     * a specific discount override.
     *
     * @returns String
     */
    activeDiscountAmount() {
      const defaultGlobalDiscountAmount = this.defaultGlobalDiscountAmount

      return defaultGlobalDiscountAmount || '0'
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
    /**
     * Default discount from the shop.
     *
     * @returns String || null
     */
    defaultGlobalDiscountAmount() {
      return this.shop.default_discount_amount
        ? this.shop.default_discount_amount
        : null
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
    /**
     * Ordergroove selling plan ID.
     *
     * @returns String || undefined
     */
    sellingPlanId() {
      return this.ogOfferDetails.sellingPlanId
    },
    /**
     * Selling plan allocation from the product variant.
     *
     * `selling_plan_allocations` is a collection added to the product
     * variant that contains pricing information for each selling plan.
     *
     * @returns Allocation || {}
     */
    sellingPlanAllocation() {
      const variant = this.selectedVariant
      const planAllocations = variant && variant.selling_plan_allocations

      if (!planAllocations) return {}

      const allocation = planAllocations.find(planAllocation => {
        const allocationPlanId = planAllocation.selling_plan_id

        return parseInt(allocationPlanId) === parseInt(this.sellingPlanId)
      })

      debug('sellingPlanAllocation', allocation)

      return allocation || {}
    }
  },
  methods: {
    /**
     * Create DOM ID for option inputs.
     *
     * @param {*} option
     * @param {*} value
     * @returns String
     */
    optionInputId(option, value) {
      return `product-${this.product.id}-option-${sanitize(option)}-${sanitize(value)}`
    },
    /**
     * Finds the variant that matches all options passed in.
     *
     * @param {Array} options
     * @returns Variant || undefined
     */
    findVariantWithOptions(options) {
      return this.product.variants.find(variant => {
        return variant.options.every(
          (value, valueIndex) => value === options[valueIndex]
        )
      })
    },
    /**
     * Get the price for the option value.
     *
     * @param {*} optionIndex
     * @param {*} value
     * @returns String
     */
    getPriceForOptionValue(optionIndex, value) {
      const options = []

      // In case user hasn't actually selected anything, default to the first
      // value of each option
      for (const [option, value] of Object.entries(this.selectedOptions)) {
        options.push(value || this.product.options_by_name[option].option.values[0])
      }

      options[optionIndex] = value

      const matchedVariant = this.findVariantWithOptions(options)
      const price = matchedVariant
        ? matchedVariant.price
        : this.product.variants[0].price

      return formatPrice(price)
    },
    /**
     * Handle form add to cart.
     *
     * @returns void || undefined
     */
    async handleAddToCart() {
      if (!this.selectedVariantId) {
        return
      }

      const params = {
        id: this.selectedVariantId,
        properties: {},
        quantity: 1,
      }

      if (this.subscriptionSelected) {
        const subscriptionProperties = {
          'Discount Amount': this.activeDiscountAmount,
          'Interval Frequency': this.intervalFrequency,
          'Interval Unit': this.intervalUnit,
          Subscription: this.finalSubscriptionProperty,
          'Subscription Amount': this.subscriptionAmount,
          'Subscription Product Title': this.subscriptionProductTitleDisplay,
        }

        params.properties = Object.assign(
          {}, params.properties, subscriptionProperties
        )
      }

      debug('handleAddToCart', params)

      await store.dispatch('cart/addToCart', params)

      this.$nextTick(() => {
        this.resetSelectedOptions()

        if (this.addedToCartSuccessfully) {
          // Display pop-out cart
          store.dispatch('cart/setIsPopOutCartActive', true)
        } else {
          this.$emit('added-to-cart-error')
        }
      })
    },
    /**
     * Reset the selected options for the form.
     */
    resetSelectedOptions() {
      this.selectedOptions = {
        ...this.initialSelectedOptions,
      }
    },
    /**
     * Handle variant selection from the form.
     *
     * @param {*} event
     */
    handleVariantSelect(event) {
      const variantId = parseInt(event.target.value)
      const variant = this.product.variants.find(v => v.id === variantId)

      // Update selectedOptions
      this.selectedOptions = this.product.options.reduce(
        (result, option, index) => Object.assign({}, result, {
          [option]: variant.options[index]
        }),
        {}
      )
    },
    /**
     * Discount the passed in total using the active discount.
     *
     * @param {*} total
     * @returns Number
     */
    discountCalculatedValue(total) {
      var discountType = this.activeDiscountType
      var discountAmount = this.activeDiscountAmount
        .replace('%', '')
        .replace('$', '')

      var calcDiscountAmount = 0

      // Fixed amount
      if (discountType === '$') {
        calcDiscountAmount = discountAmount
      // Percentage
      } else if (discountType === '%') {
        calcDiscountAmount = (total * discountAmount) / 100
      }

      return total - calcDiscountAmount
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
    /**
     * Calculate the variant prices taking into account discounts.
     *
     * @param {*} originalPrice
     * @param {*} originalComparePrice
     */
    calculateVariantPrices(originalPrice, originalComparePrice) {
      let displayDiscountPrice = false
      let displayDiscountComparePrice = false

      if (originalPrice) {
        const discountPrice =
          originalPrice - this.discountCalculatedValue(originalPrice)

        // Set unformatted amount for use in cart and checkout
        this.subscriptionAmount = parseInt(originalPrice - discountPrice)

        displayDiscountPrice = formatMoney(
          originalPrice - discountPrice, this.moneyFormat
        )
      }

      if (originalComparePrice) {
        const discountComparePrice =
          originalComparePrice -
          this.discountCalculatedValue(originalComparePrice)

        displayDiscountComparePrice = formatMoney(
          originalComparePrice - discountComparePrice, this.moneyFormat
        )
      }

      // Store the new prices
      this.activeSubsriptionDisplayPrice = displayDiscountPrice
      this.activeSubsriptionDisplayComparePrice = displayDiscountComparePrice
    },
    /**
     * Initial options selected in the form.
     */
    initialSelectedOptions() {
      this.product.options.reduce((result, option) => {
        // Initially, none of the option has any selected value
        result[option] = null
        return result
      })
    },
    /**
     * Handle the click event for product options.
     *
     * @param {*} option
     * @param {*} value
     */
    toggleOption(option, value) {
      const cloneSelectedOptions = Object.assign({}, this.selectedOptions)

      if (cloneSelectedOptions[option] && cloneSelectedOptions[option] === value) {
        cloneSelectedOptions[option] = null
      } else {
        cloneSelectedOptions[option] = value
      }

      this.selectedOptions = Object.assign({}, cloneSelectedOptions)
    },
    /**
     * Indicate if an option should be disabled in the form.
     *
     * @param {*} option
     * @param {*} value
     * @returns Boolean || undefined
     */
    disableOption(option, value) {
      for (const variant of this.product.variants) {
        if (variant.title === value && variant.available === false) {
          return true
        }
      }
    },
    /**
     * Toggle the size chart active data value.
     */
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
}

/**
 * Simple debug function to conditionally display debug information.
 */
function debug() {
  if (DEBUG) {
    console.debug('[product-form] ', ...arguments)
  }
}

/**
 * Shopify format money.
 *
 * @param {Number | String} cents
 * @param {String} format
 * @returns String
 */
function formatMoney(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '')
  }

  var value = ''
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/

  switch (format.match(placeholderRegex)) {
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

  return format.replace(placeholderRegex, value)
}

/**
 * Format a number with delimiters.
 *
 * @param {*} number
 * @param {*} precision
 * @param {*} thousands
 * @param {*} decimal
 * @returns
 */
function formatWithDelimiters(number, precision, thousands, decimal) {
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

/**
 * Sanitize string.
 *
 * @param {String} name
 * @returns String
 */
function sanitize(name) {
  return name.replace(/[^\w-]+/g, '')
}

/* eslint-enable comma-dangle,space-before-function-paren */
