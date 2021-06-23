import { formatPrice } from 'lib/util'
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
    productId () {
      return this.product.id
    },
    productTitle () {
      return this.product.title
    },
    productPrice () {
      return this.product.price
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
  }
}
