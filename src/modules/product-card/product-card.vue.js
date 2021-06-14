import ProductForm from '../product-form/product-form.vue'
import VImage from '../v-image/v-image.vue'
import VVideo from '../v-video/v-video.vue'
import { formatPrice, debounce } from 'lib/util'

let yotpoApi = null
let yotpoRetries = 0

/**
 * Force Yotpo to re-render all review widgets after they're mounted.
 * Debounce is used to make sure this is only called once per batch of components.
 */
const refreshYotpo = debounce(() => {
  if (!window.yotpo || !window.Yotpo || !window.Yotpo.API) {
    // If yotpo is not initialized yet, wait for one second and retry 5 times maximum
    if (yotpoRetries < 5) {
      setTimeout(
        refreshYotpo,
        1000
      )
    }
    yotpoRetries++
    return
  }

  if (!yotpoApi) {
    yotpoApi = new window.Yotpo.API(window.yotpo)
  }

  yotpoApi.refreshWidgets()
})

export default {
  components: {
    ProductForm,
    VImage,
    VVideo
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    isFeatured: Boolean
  },
  data () {
    return {
      selectedVariantId: null
    }
  },
  computed: {
    selectedVariant () {
      return this.product.variants.find(v => v.id === this.selectedVariantId)
    },
    price () {
      return this.selectedVariant ? this.selectedVariant.price : this.product.price
    }
  },
  watch: {
    product () {
      this.renderReviews()
    }
  },
  methods: {
    renderReviews () {
      this.$nextTick(() => {
        refreshYotpo()
      })
    },
    formatPrice,
    handleSelectedVariant (variantId) {
      this.selectedVariantId = variantId
    }
  },
  mounted () {
    this.renderReviews()
  }
}
