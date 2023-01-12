/* eslint-disable comma-dangle,space-before-function-paren */
import { mapState } from 'vuex'
import store from 'lib/store'
import { formatMoney, formatPrice, sanitize } from 'lib/util'
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
    OgOffer,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    shop: {
      type: Object,
    },
    isActiveSubscription: Boolean,
    queryStringVariant: {
      type: String,
      default: () => "",
    },
    subscriptionChecked: Boolean,
  },
  data() {
    const initialSelectedOptions = this.product.options.reduce(
      (result, option) => {
        // Initially, none of the option has any selected value
        result[option] = null;
        return result;
      },
      {}
    );

    return {
      componentMounted: !1,
      moneyFormat: "{{amount}}",
      ogOfferDetails: {},
      optionIcons: iconData,
      selectedOptions: { ...initialSelectedOptions },
      sizeChartActive: false,
      subscriptionAmount: null,
    };
  },
  mounted() {
    this.activeVariantId = this.product.variants[0].id;
    // reset
    this.index = "";

    for (var key in this.product.options_by_name) {
      const option = this.product.options_by_name[key].option;
      const optionPosition = option.position;
      this.$set(
        this.selectedOptions,
        key,
        this.initialVariant[`option${optionPosition}`]
      );
    }

    this.$_addUpdateOgOfferDetailsListener();
    this.componentMounted = 1;
  },
  computed: {
    ...mapState("cart", ["addedToCartSuccessfully", "addedToCartErrorMessage"]),

    /**
     * Active discount amount.
     *
     * Determines the active discount for the selected variant.
     *
     * @returns String
     */
    activeDiscountAmount() {
      const discount = this.defaultGlobalDiscountAmount || "0";

      return discount;
    },

    /**
     * Active discount type.
     *
     * Determines if the `activeDiscountAmount` is in dollars or percent.
     *
     * @returns String ('$' || '%')
     */
    activeDiscountType() {
      const activeDiscount = this.activeDiscountAmount;

      if (activeDiscount) {
        return activeDiscount.indexOf("$") > -1 ? "$" : "%";
      } else {
        return "";
      }
    },

    /**
     * Text for the Add to Cart button.
     *
     * @returns String
     */
    addToCartButtonText() {
      return this.isAbleAddToCart ? "Add To Cart" : "Sold Out";
    },

    /**
     * Default discount from the shop.
     *
     * @returns String || null
     */
    defaultGlobalDiscountAmount() {
      return this.shop && this.shop.default_discount_amount
        ? this.shop.default_discount_amount
        : null;
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
        return false;
      }

      const label = this.ogOfferDetails.frequency.label;

      debug("finalSubscriptionProperty", label);
      return label;
    },

    /**
     * Indicates if the product only has a single variant.
     *
     * @returns Boolean
     */
    hasSingleVariant() {
      return this.product.variants.length === 1;
    },

    /**
     * Initial product variant.
     *
     * @returns Variant
     */
    initialVariant() {
      return this.product.selected_or_first_available_variant;
    },

    /**
     * Subscription frequency interval.
     *
     * Returns the value of the interval - number of days, months, etc.
     *
     * @returns String
     */
    intervalFrequency() {
      return this.ogOfferDetails.frequency.interval || "1";
    },

    /**
     * Subscription frequency unit.
     *
     * Returns the singular value of the unit - 'day', 'week', 'month', etc.
     *
     * @returns String
     */
    intervalUnit() {
      return this.ogOfferDetails.frequency.unit || "day";
    },

    /**
     * Determine if the product variant can be added to the cart.
     *
     * @returns Boolean
     */
    isAbleAddToCart() {
      return !this.selectedVariant || this.selectedVariant.available;
    },

    /**
     * Indicates if this is a onetime subscription.
     *
     * Used for single purchase that is able to reactivate as a subscription.
     *
     * @returns Boolean
     */
    isOnetimeSubscription() {
      return this.productPurchaseType === PURCHASE_TYPES.onetime;
    },

    /**
     * Determine the variant option that affects pricing.
     */
    priceDecidingFactor() {
      const product = this.product;
      const defaultOptionName = product.options[0];

      for (const optionName of product.options) {
        const option = product.options_by_name[optionName].option;
        const availableValues = option.values;
        const pricesContainingOption = {};

        for (const variant of product.variants) {
          for (const value of variant.options) {
            if (!availableValues.includes(value)) {
              continue;
            }

            if (!pricesContainingOption[value]) {
              pricesContainingOption[value] = [];
            } else if (pricesContainingOption[value].includes(variant.price)) {
              // If multiple variants with the same option value have the
              // same price then this is the option we're looking for
              debug("priceDecidingFactor found", optionName);
              return optionName;
            }

            pricesContainingOption[value].push(variant.price);
          }
        }
      }

      debug("priceDecidingFactor default", defaultOptionName);
      return defaultOptionName;
    },

    /**
     * Product ID.
     *
     * @returns String
     */
    productId() {
      return this.product.id;
    },

    /**
     * Alias for the product.title.
     *
     * @returns String
     */
    productName() {
      return this.product.title;
    },

    /**
     * The purchase type for the selected product.
     *
     * @returns String
     */
    productPurchaseType() {
      const subscribed = this.ogOfferDetails.subscribeChecked;

      return subscribed ? PURCHASE_TYPES.subscription : PURCHASE_TYPES.onetime;
    },

    /**
     * Array of `values` from the selected options.
     *
     * @returns Array
     */
    selectedOptionValues() {
      return Object.values(this.selectedOptions);
    },

    /**
     * Current selected variant.
     *
     * @returns Variant || {}
     */
    selectedVariant() {
      const variant = this.findVariantWithOptions(this.selectedOptionValues);
      debug("selectedVariant", variant);

      const selected = this.hasSingleVariant
        ? this.product.variants[0]
        : variant;

      return selected;
    },

    /**
     * The ID of the selected variant.
     *
     * @returns String
     */
    selectedVariantId() {
      return this.selectedVariant ? this.selectedVariant.id : "";
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
      const variant = this.selectedVariant;
      const planAllocations = variant && variant.selling_plan_allocations;

      if (!planAllocations) return {};

      const allocation = planAllocations.find((planAllocation) => {
        const allocationPlanId = planAllocation.selling_plan_id;

        return parseInt(allocationPlanId) === parseInt(this.sellingPlanId);
      });

      debug("sellingPlanAllocation", allocation);

      return allocation || {};
    },

    /**
     * Calculated discount amount for the selected selling plan.
     *
     * @returns String || null
     */
    sellingPlanDiscountPercent() {
      if (!this.sellingPlanAllocation) {
        debug("sellingPlanDiscountPercent", { discount: 0 });
        return null;
      }

      // Calculate the discount percent from the selling plan
      const plan = this.sellingPlanAllocation;
      const discount =
        100 - Math.round((plan.price / plan.compare_at_price) * 100);

      debug("sellingPlanDiscountPercent", { discount });
      return discount;
    },

    /**
     * Format the selling plan discount percent as a string for display.
     */
    sellingPlanDiscountPercentString() {
      return `${this.sellingPlanDiscountPercent}%`;
    },

    /**
     * Ordergroove selling plan ID.
     *
     * @returns String || undefined
     */
    sellingPlanId() {
      return this.ogOfferDetails.sellingPlanId;
    },

    /**
     * Subscription product title for display in the cart.
     *
     * Used in cart and sent to checkout for replacement.
     *
     * @returns String
     */
    subscriptionProductTitleDisplay() {
      let display = "";

      // Product title
      display += this.product.title;

      // Discount
      display += this.discountDisplay
        ? " - " + this.discountDisplay + " off"
        : "";

      return display;
    },

    /**
     * Test if the current purchase type is a subscription.
     *
     * @returns Boolean
     */
    subscriptionSelected() {
      const selected = this.productPurchaseType === PURCHASE_TYPES.subscription;

      debug("subscriptionSelected", selected);
      return selected;
    },
  },
  methods: {
    /**
     * Add a listener for `og-offer` details updates.
     */
    $_addUpdateOgOfferDetailsListener() {
      const handler = this.$_handleOgOfferDetails;

      this.$children.forEach((child) => {
        if (child.ogOfferDetails) {
          // Wire-up handler for og-offer selling plan details
          child.$on(UPDATE_DETAILS_EVENT_NAME, handler);

          // Fire handler when listener is added to capture any changes
          handler(child.ogOfferDetails);
        }
      });
    },

    /**
     * Handler for the `og-offer` update events.
     *
     * @param {*} ogOfferDetails
     */
    $_handleOgOfferDetails(ogOfferDetails) {
      debug("$_handleOgOfferDetails", ogOfferDetails);

      this.ogOfferDetails = ogOfferDetails;
      this.$_handleVariantUpdate();
    },

    /**
     * Handler for variant updates.
     *
     * Ensures pricing is updated in response to variant changes. Can
     * be called in places that aren't strictly variant-related.
     */
    $_handleVariantUpdate() {
      const variant = this.selectedVariant || {};
      this.activeVariantId = variant.id;

      const originalPrice =
        this.sellingPlanAllocation.price || variant.price || false;

      const originalComparePrice =
        this.sellingPlanAllocation.compare_at_price ||
        variant.compare_at_price ||
        false;

      debug("handleVariantUpdate", {
        sellingPlan: this.sellingPlanAllocation,
        variant,
      });

      this.calculateVariantPrices(originalPrice, originalComparePrice);
    },

    /**
     * Toggle the Ordergroove subscription button.
     */
    $_toggleSubscriptionButton() {
      const button = document.querySelector("og-offer button.og-button-toggle");
      button.click();
    },

    /**
     * Calculate the variant prices taking into account discounts.
     *
     * @param {*} originalPrice
     * @param {*} originalComparePrice
     */
    calculateVariantPrices(originalPrice, originalComparePrice) {
      let displayDiscountPrice = false;
      let displayDiscountComparePrice = false;

      if (originalPrice) {
        const discountPrice =
          originalPrice - this.discountCalculatedValue(originalPrice);

        // Set unformatted amount for use in cart and checkout
        this.subscriptionAmount = parseInt(originalPrice - discountPrice);

        displayDiscountPrice = formatMoney(
          originalPrice - discountPrice,
          this.moneyFormat
        );
      }

      if (originalComparePrice) {
        const discountComparePrice =
          originalComparePrice -
          this.discountCalculatedValue(originalComparePrice);

        displayDiscountComparePrice = formatMoney(
          originalComparePrice - discountComparePrice,
          this.moneyFormat
        );
      }

      debug("calculateVariantPrices", {
        originalPrice,
        displayDiscountPrice,
        originalComparePrice,
        displayDiscountComparePrice,
      });

      // Store the new prices
      this.activeSubsriptionDisplayPrice = displayDiscountPrice;
      this.activeSubsriptionDisplayComparePrice = displayDiscountComparePrice;
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
          return true;
        }
      }
    },

    /**
     * Discount the passed in total using the active discount.
     *
     * @param {*} total
     * @returns Number
     */
    discountCalculatedValue(total) {
      var discountType = this.activeDiscountType;
      var discountAmount = this.activeDiscountAmount
        .replace("%", "")
        .replace("$", "");

      var calcDiscountAmount = 0;

      // Fixed amount
      if (discountType === "$") {
        calcDiscountAmount = discountAmount;
        // Percentage
      } else if (discountType === "%") {
        calcDiscountAmount = (total * discountAmount) / 100;
      }

      return total - calcDiscountAmount;
    },

    /**
     * Finds the variant that matches all options passed in.
     *
     * @param {Array} options
     * @returns Variant || undefined
     */
    findVariantWithOptions(options) {
      return this.product.variants.find((variant) => {
        return variant.options.every(
          (value, valueIndex) => value === options[valueIndex]
        );
      });
    },

    /**
     * Get the price for the option value.
     *
     * Used for the option that is the `priceDecidingFactor` so we can
     * make assumptions and only find matching variants on the single
     * option/factor.
     *
     * @param {*} value - option value
     * @param {*} optionIndex - index of the option in the variant
     * @returns String
     */
    getPriceForOptionValue(value, optionIndex) {
      // Find the variant that matches the passed in option value/index
      const matchedVariant = this.product.variants.find(variant => {
        return variant.options[optionIndex] === value
      })

      // Fallback: default to first variant if a match isn't found
      const price = matchedVariant
        ? matchedVariant.price
        : this.product.variants[0].price;

      return formatPrice(price);
    },

    /**
     * Handle form add to cart.
     *
     * @returns void || undefined
     */
    async handleAddToCart() {
      if (!this.selectedVariantId) {
        return;
      }

      const params = {
        id: this.selectedVariantId,
        properties: {},
        quantity: 1,
      };

      // const discountAmount = this.sellingPlanDiscountPercent
      //   ? this.sellingPlanDiscountPercentString
      //   : this.activeDiscountAmount

      if (this.subscriptionSelected) {
        // Add selling plan
        params.sellingPlan = parseInt(this.sellingPlanId);

        // const subscriptionProperties = {
        //   'Discount Amount': discountAmount,
        //   'Interval Frequency': this.intervalFrequency,
        //   'Interval Unit': this.intervalUnit,
        //   Subscription: this.finalSubscriptionProperty,
        //   'Subscription Amount': this.subscriptionAmount,
        //   'Subscription Product Title': this.subscriptionProductTitleDisplay,
        // }

        // // Add subscription properties to line item properties
        // params.properties = Object.assign(
        //   {}, params.properties, subscriptionProperties
        // )
      }

      debug("handleAddToCart", params);

      await store.dispatch("cart/addToCart", params);

      this.$nextTick(() => {
        this.resetSelectedOptions();

        if (this.addedToCartSuccessfully) {
          // Display pop-out cart
          store.dispatch('cart/setIsPopOutCartActive', true)

          // Function written by Klaviyo included in the klaviyo-tracking snippet
          addedToCart();
        } else {
          this.$emit("added-to-cart-error");
        }
      });
    },

    /**
     * Handle variant selection from the form.
     *
     * @param {*} event
     */
    handleVariantSelect(event) {
      const variantId = parseInt(event.target.value);
      const variant = this.product.variants.find((v) => v.id === variantId);

      // Update selectedOptions
      this.selectedOptions = this.product.options.reduce(
        (result, option, index) =>
          Object.assign({}, result, {
            [option]: variant.options[index],
          }),
        {}
      );
    },

    /**
     * Initial options selected in the form.
     */
    initialSelectedOptions() {
      this.product.options.reduce((result, option) => {
        // Initially, none of the option has any selected value
        result[option] = null;
        return result;
      });
    },

    /**
     * Create DOM ID for option inputs.
     *
     * @param {*} option
     * @param {*} value
     * @returns String
     */
    optionInputId(option, value) {
      return `product-${this.product.id}-option-${sanitize(option)}-${sanitize(
        value
      )}`;
    },

    /**
     * Reset the selected options for the form.
     */
    resetSelectedOptions() {
      // If there is a selling plan, we need to reset the button to "one-time"
      if (this.sellingPlanId) {
        this.$_toggleSubscriptionButton();
      }

      this.selectedOptions = {
        ...this.initialSelectedOptions,
      };
    },

    /**
     * Handle the click event for product options.
     *
     * @param {*} option
     * @param {*} value
     */
    toggleOption(option, value) {
      const cloneSelectedOptions = Object.assign({}, this.selectedOptions);

      if (
        cloneSelectedOptions[option] &&
        cloneSelectedOptions[option] === value
      ) {
        cloneSelectedOptions[option] = null;
      } else {
        cloneSelectedOptions[option] = value;
      }

      this.selectedOptions = Object.assign({}, cloneSelectedOptions);
    },

    /**
     * Toggle the size chart active data value.
     */
    toggleSizeChart() {
      this.sizeChartActive = !this.sizeChartActive;
    },
  },
  watch: {
    /**
     * Watch `selectedVariantId` for updates.
     *
     * @param {*} newValue
     */
    selectedVariantId(newValue) {
      debug("selectedVariantId", newValue);

      this.$_handleVariantUpdate();
      this.$emit("update-variant-id", newValue);
      store.dispatch("pdp/setSelectedVariantId", { id: newValue });
    },
  },
};

/**
 * Simple debug function to conditionally display debug information.
 */
function debug() {
  if (DEBUG) {
    console.debug('[product-form] ', ...arguments)
  }
}

/* eslint-enable comma-dangle,space-before-function-paren */
