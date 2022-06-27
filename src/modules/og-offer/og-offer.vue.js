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
const UPDATE_DETAILS_EVENT_NAME = 'update-og-offer-details'

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
    // Update window.product_ids for Ordergroove - adapted from the `<script>`
    // tag in the original liquid template.
    window.order_line_items = this.productIds

    this.$__initializeData()
    this.$_addOgOfferObserver()

    debug('mounted')
  },
  computed: {
    // Aggregate object of selling plan details
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

    // Array of product ids passed into the module
    productIds() {
      return this.productIdsString.split(',') || []
    },

    // Reference to the DOM node where Ordergroove stores selling plan map
    sellingPlanMap() {
      const frequency = this.frequency
      const variantId = this.variantId

      const refKey = `${variantId}-${frequency}`
      const map = this.$refs[refKey]

      debug('sellingPlanMap', refKey, map)

      return map
    },

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
    }
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
     * Watch `variantId` for updates.
     */
    variantId() {
      debug('[watch] variantId', this.variantId)
      this.$_updateFrequencyData()
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

/* eslint-enable comma-dangle,space-before-function-paren */
