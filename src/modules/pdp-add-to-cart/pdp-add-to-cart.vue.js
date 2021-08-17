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
      const hTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      let tag
      let closingTag

      for (const item of hTags) {
        if (this.product.description.includes(item)) {
          console.log('original tag: ', item)
          tag = item
          closingTag = `/${item}`
          return this.product.description.replace(tag, 'h2').replace(closingTag, '/h2')
        }
      }
    },
    productExtraDescriptions () {
      return [this.product.extra_description_1, this.product.extra_description_2].filter(item => !!item)
    }
  },
  methods: {
    reviewScroll () {
      triggerCustomEvent(document, 'pdpReviewScroll')
    }
  }
}
