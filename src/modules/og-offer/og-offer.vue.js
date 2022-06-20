export default {
  inheritAttrs: false,
  props: {
    productIdsString: {
      type: String,
      required: true
    }
  },
  data () {
    return { }
  },
  computed: {
    productIds () {
      return this.productIdsString.split(',') || []
    }
  },
  created () {
    console.warn('og-offer module created')
  },
  // TODO-ORDERGROOVE: is this the correct location for this code?
  mounted () {
    // Update window.product_ids for Ordergroove - adapted from the `<script>`
    // tag in the original liquid template.
    window.order_line_items = this.productIds
  }
}
