/* eslint-disable comma-dangle,space-before-function-paren */
import Vue from 'vue'

// Flag to enable debug logging. Refer to `debug()` below.
const DEBUG = true

// Mapping of `og-offer` attribute names to the keys in the data object
const OG_OFFER_ATTRIBUTE_TO_DATA_KEY_MAP = {
  frequency: 'frequency',
  product: 'variantId',
  'selling-plan-id': 'sellingPlanId',
}

// List of attributes to observe for changes
const OG_OFFER_ATTRIBUTES_TO_OBSERVE = [
  'frequency',
  'product',
  'selling-plan-id',
]

// Key used for the `og-offer` ref
const OG_OFFER_REF_KEY = 'og-offer'

// Event name used when emitting details updates to the parent component
export const UPDATE_DETAILS_EVENT_NAME = 'update-og-offer-details'

/**
 * `og-offer`
 */
export default {
  inheritAttrs: false,
  props: {
    productIdsString: {
      type: String,
      required: true
    },
    selectedVariant: {
      type: Object
    }
  },
  data() {
    return {
      frequency: null,
      frequencyInterval: null,
      frequencyLabel: null,
      frequencyUnit: null,
      location: null,
      sellingPlanId: null,
      subscribed: false,
      variantId: null,
    }
  },
  created() {
    console.warn('og-offer module created')
  },
  mounted() {
    this.$__initializeData()
    this.$_addOgOfferObserver()
    this.$_updateWindowLineItems()

    debug('mounted')
  },
  computed: {
    /**
     * Aggregate object of selling plan details.
     *
     * This is what is sent up to the parent for update events.
     *
     * @returns Object
     */
    ogOfferDetails() {
      const details = {
        frequency: {
          code: this.frequency,
          interval: this.frequencyInterval,
          label: this.frequencyLabel,
          unit: this.frequencyUnit
        },
        sellingPlanId: this.sellingPlanId,
        subscribeChecked: this.subscribeChecked,
        variantId: this.variantId
      }

      debug('ogOfferDetails', details)

      return details
    },

    /**
     * Array of product ids passed into the module.
     *
     * @returns Array
     */
    productIds() {
      return this.productIdsString
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0)
    },

    /**
     * Reference to the DOM node where Ordergroove stores selling plan map.
     *
     * @returns Vue Ref
     */
    sellingPlanMap() {
      const map = this.getSellingPlanMap(this.variantId, this.frequency)

      debug('sellingPlanMap', map)

      return map
    },

    /**
     * Explicit check if the subscribe button is checked.
     *
     * @returns Boolean
     */
    subscribeChecked() {
      // eslint-disable-next-line no-unneeded-ternary
      return this.sellingPlanId ? true : false
    },
  },
  methods: {
    /**
     * Initialize data values.
     */
    $__initializeData() {
      const ogOffer = this.$refs[OG_OFFER_REF_KEY]

      this.frequency = ogOffer.getAttribute('frequency')
      this.location = ogOffer.getAttribute('location')
      this.sellingPlanId = ogOffer.getAttribute('selling-plan-id')
      this.variantId = ogOffer.getAttribute('product')

      debug('$__initializeData')
    },

    /**
     * Add an observer for the `og-offer` element.
     */
    $_addOgOfferObserver() {
      const ogOffer = this.$refs[OG_OFFER_REF_KEY]
      const vm = this

      const mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          const target = mutation.target
          const attribute = mutation.attributeName
          const value = target.getAttribute(attribute)

          debug('[observer] og-offer attribute changed', attribute, value)
          // Forward attribute changes to the module
          vm.$_updateDataValue(attribute, value)
        })
      })

      // Watch for changes to the `og-offer` element
      mutationObserver.observe(ogOffer, {
        attributes: true,
        attributeFilter: OG_OFFER_ATTRIBUTES_TO_OBSERVE
      })
    },

    /**
     * Update a value in `data`.
     *
     * Updates a key on the `data` object in a way that triggers reactive
     * updates and then emits a custom event for tracking in the parent.
     *
     * @param {String} key e
     * @param {Any} value - value to update
     */
    $_updateDataValue(key, value) {
      Vue.set(this.$data, OG_OFFER_ATTRIBUTE_TO_DATA_KEY_MAP[key], value)
      this.$emit(UPDATE_DETAILS_EVENT_NAME, this.ogOfferDetails)

      debug(`[emit] ${UPDATE_DETAILS_EVENT_NAME}`, this.ogOfferDetails)
    },

    /**
     * Update frequency data from Ordergroove selling plan map data.
     */
    $_updateFrequencyData() {
      const planMap = this.sellingPlanMap
      if (!planMap) return

      this.frequencyInterval = planMap.getAttribute('data-frequency-interval')
      this.frequencyLabel = planMap.getAttribute('data-frequency-label')
      this.frequencyUnit = planMap.getAttribute('data-frequency-unit')
    },

    /**
     * Update prices on the subscription buttons.
     *
     * There is an issue with Ordergroove where prices for any variant
     * other than the default are not updated correctly. This function
     * overwrites the `shadow-root` for the `og-price` node with prices
     * from the selling plan map for the specific frequency.
     */
    $_updateSubscriptionButtonsPrices() {
      const buttonsContainer = document.querySelector('div.og-optin-buttons')
      if (!buttonsContainer) return

      const buttons = buttonsContainer.querySelectorAll('og-optin-button')
      if (!buttons || buttons.length === 0) return

      // Update the price for each button
      buttons.forEach(button => {
        const frequency = button.getAttribute('default-frequency')
        const plan = this.getSellingPlanMap(this.variantId, frequency)
        const price = plan.getAttribute('data-price')

        const ogPrice = button.querySelector('og-price')

        if (ogPrice && ogPrice.shadowRoot) {
          // eslint-disable-next-line no-template-curly-in-string
          const formattedPrice = formatMoney(price, '${{amount}}')

          ogPrice.shadowRoot.innerHTML = buildButtonPriceDocumentFragment(formattedPrice)
          debug('$_updateSubscriptionButtonsPrices', frequency, formattedPrice)
        }
      })
    },

    /**
     * Update window.order_line_items for Ordergroove.
     *
     * Code adapted from the `<script>` tag in the original liquid template.
     */
    $_updateWindowLineItems() {
      window.order_line_items = this.productIds
      debug('$_updateWindowLineItems', this.productIds)
    },

    /**
     * Get the ref that stores the plan map for the variant and frequency.
     *
     * @returns Vue Ref
     */
    getSellingPlanMap(variantId, frequency) {
      const refKey = `${variantId}-${frequency}`
      const map = this.$refs[refKey]

      debug('getSellingPlanMap', refKey, map)

      return map
    },
  },
  watch: {
    /**
     * Watch `frequency` for updates.
     */
    frequency() {
      debug('[watch] frequency', this.frequency)
      this.$_updateFrequencyData()
    },

    /**
     * Watch `selectedVariant` prop for updates.
     */
    selectedVariant() {
      debug('[watch] selectedVariant', this.selectedVariant)
    },

    /**
     * Watch `variantId` for updates.
     */
    variantId() {
      debug('[watch] variantId', this.variantId)
      this.$_updateFrequencyData()

      // Ensure DOM is updated before updating subscription buttons
      Vue.nextTick(this.$_updateSubscriptionButtonsPrices)
    },
  },
}

/**
 * Simple debug function to conditionally display debug information.
 */
function debug() {
  if (DEBUG) {
    console.debug('[og-offer] ', ...arguments)
  }
}

/**
 * Build a document fragment for a subscription button price.
 *
 * @param {String} price
 * @returns String
 */
function buildButtonPriceDocumentFragment(price) {
  return `
    <!---->
    <slot name="prepend"></slot>
    ${price}
    <slot name="append"></slot>
    <!---->
  `
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
  // Regex to match a liquid-type token in a string, i.e. {{amount}}
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/

  // Find matched "group" in the format string, i.e. {{amount}} -> amount
  const match = format.match(placeholderRegex)[1]

  switch (match) {
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
  debug('formatMoney', { cents, format, value, match })
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

/* eslint-enable comma-dangle,space-before-function-paren */
