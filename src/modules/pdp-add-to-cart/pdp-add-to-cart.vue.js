import { formatPrice, triggerCustomEvent } from 'lib/util'
import { mapState } from 'vuex'
import ProductForm from '../product-form/product-form.vue'

export default {
  components: {
    ProductForm
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    queryStringVariant: {
      type: String,
      default: () => ('')
    }
  },
  computed: {
    ...mapState('pdp', ['selectedVariantId']),
    selectedVariant () {
      return this.selectedVariantId && this.product.variants.find(v => v.id === this.selectedVariantId)
    },
    productId () {
      return this.product.id
    },
    productTitle () {
      return this.product.title
    },
    productPrice () {
      return this.selectedVariant ? this.selectedVariant.price : this.product.price
    },
    formattedProductPrice () {
      return this.productPrice ? '$' + formatPrice(this.productPrice) : ''
    },
    productDescription () {
      return this.product.description
    },
    productExtraDescriptions () {
      return [this.product.extra_description_1, this.product.extra_description_2].filter(item => !!item)
    }
  },
  methods: {
    reviewScroll () {
      triggerCustomEvent(document, 'pdpReviewScroll')
    }
  },
  mounted () {
    // console.log(this.queryStringVariant)
  }
}
