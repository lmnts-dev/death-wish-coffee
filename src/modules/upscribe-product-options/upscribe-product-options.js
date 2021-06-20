/**
 * Initializes the site's upscribeproductoptions module.
 * @constructor
 * @param {Object} el - The site's upscribeproductoptions container element.
 */

import Vue from 'vue'

const upscribeproductoptions = el => {
  const UpscribeForm = Vue.component('UpscribeForm', {
    el: '#upscribe-subscription-product',
    props: {
      product: {
        type: Object,
        required: true
      },
      shop: {
        type: Object,
        required: true
      }
    },
    delimiters: ['${', '}'],
    data: {
      selectedOptions: { ...this.initialSelectedOptions },
      initialSelectedOptions: () => {
        this.product.options.reduce((result, option) => {
          // Initially, none of the option has any selected value
          result[option] = null
          return result
        })
      },
      activeVariantId: this.product.variants[0].id,
      initialApplicableVariants: this.product.metafields
        ? this.product.metafields.applicable_variants
        : '',
      subscriptionProductTitle: this.product.metafields
        ? this.product.metafields.subscription_product_title
        : '',
      intervalFrequncyMetafield: this.product.metafields
        ? this.product.metafields.interval_frequency
        : '',
      intervalUnitMetafield: this.product.metafields
        ? this.product.metafields.interval_unit
        : '',
      defaultGlobalDiscountAmount: this.shop.default_discount_amount
        ? this.shop.default_discount_amount
        : '',
      discountAmount: this.product.metafields
        ? this.product.metafields.discount_amount
        : '',
      initialChargeLimit: this.product.metafields
        ? this.product.metafields.charge_limit
        : '',
      recurringDiscountAmount: this.product.metafields
        ? this.product.metafields.recurring_discount_amount
        : '',
      recurringDiscountAfterOrder: this.product.metafields
        ? this.product.metafields.recurring_discount_after_order
        : '',
      oneTimeMessage: this.shop.one_time_message,
      subscriptionMessage: this.shop.subscribe_message,
      learnMoreUrl: this.shop.learn_more_url,
      howItWorksTitle: this.shop.how_it_works_title,
      howItWorksText: this.shop.how_it_works_text,
      activeSubsriptionDisplayPrice: this.product
        .selected_or_first_available_variant
        ? this.product.selected_or_first_available_variant.price
        : '',
      activeSubsriptionDisplayComparePrice: this.product
        .selected_or_first_available_variant
        ? this.product.selected_or_first_available_variant
          .compare_at_price
        : '',
      selectedFrequencyIndex: 0,
      productPurchaseType: 'onetime',
      subscriptionPrice: null,
      subscriptionAmount: null,
      componentMounted: !1
    },
    mounted () {
      this.activeVariantId = this.product.variants[0].id

      // reset
      this.selectedFrequencyIndex = 0
      this.productPurchaseType = 'onetime'
      this.subscriptionPrice = null

      // add listener for variant update, set in variant_selection.js
      // this listener could be different depeneding on if the theme uses the same base setup
      var vm = this
      window.addEventListener('upscribeVariantUpdate', function (event) {
        vm.handleVariantUpdateEvent(event)
      }, false)
      if (this.upscribeKeepComponentInSync === true) {
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
      }

      this.componentMounted = true
    },
    watch: {
      selectedVariantId (newValue) {
        if (newValue) {
          this.$emit('update-variant-id', newValue)
        }
      },
      // when onetime vs subscription is toggled
      productPurchaseType (newVal) {
        if (this.upscribeKeepComponentInSync) { // Upscribe Product Purchase Type Update
          window.dispatchEvent(new CustomEvent('upscribeProductPurchaseTypeUpdate', {
            detail: newVal
          }))
        }
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
      intervalFrequency () {
        return this.intervalFrequncyMetafield
          ? this.intervalFrequncyMetafield
          : '15,30,45,60'
      }
    },
    methods: {
      getParameterByName (name, url = window.location.href) {
        name = name.replace(/[\]]/g, '\\$&')
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
        var results = regex.exec(url)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
      },
      setFrequency (val) {
        this.selectedFrequencyIndex = val
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
            '{{upscribe_regular_price_query_selector}}'
          )
        } else {
          regularEl = document.querySelector('.upscribe-price-item-regular')
        }

        if (this.upscribeSalePriceQuerySelector) {
          saleEl = document.querySelector(
            '{{upscribe_sale_price_query_selector}}'
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

        console.log({ variant })

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

        switch (formatString.match(placeholderRegex)[1]) {
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

        return formatString.replace(placeholderRegex, value)
      }
    },
    destroyed () {
      window.removeEventListener('upscribeVariantUpdate', this.handleVariantUpdateEvent)
      window.removeEventListener('upscribeProductPurchaseTypeUpdate', this.setProductPurchaseType)
      window.removeEventListener('upscribeFrequencyIndexUpdate', this.setFrequency)
    }
  })
  return UpscribeForm
}

export default upscribeproductoptions
