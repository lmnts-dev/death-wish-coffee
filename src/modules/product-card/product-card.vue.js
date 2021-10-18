import { mapState } from 'vuex'
import ProductForm from '../product-form/product-form.vue'
import VImage from '../v-image/v-image.vue'
import VVideo from '../v-video/v-video.vue'
import { formatPrice, debounce } from 'lib/util'
import cookies from 'js-cookie'

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
    isFeatured: Boolean,
    showReview: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      shouldShowMessage: false,
      selectedVariantId: null,
      isHovered: false,
      showProductForm: false
    }
  },
  computed: {
    ...mapState('cart', ['addedToCartErrorMessage']),
    selectedVariant () {
      return this.product.variants.find(v => v.id === this.selectedVariantId)
    },
    price () {
      return this.selectedVariant ? this.selectedVariant.price : this.product.price
    },
    comparePrice () {
      const compareAtPrice = this.selectedVariant ? this.selectedVariant.compare_at_price : this.product.compareAtPrice
      return this.price < compareAtPrice ? compareAtPrice : ''
    },
    videoComponent () {
      return this.$refs.videoComp instanceof Array ? this.$refs.videoComp[0] : this.$refs.videoComp
    }
  },
  watch: {
    product () {
      this.renderReviews()
    },
    addedToCartErrorMessage (newValue) {
      if (!newValue) {
        this.shouldShowMessage = false
      }
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
    },
    handleAddedToCartError () {
      this.shouldShowMessage = true
    },
    async handleHover (e) {
      if (this.videoComponent) {
        this.isHovered = e.type === 'mouseenter'
        if (e.type === 'mouseenter') {
          await this.videoComponent.play()
        } else {
          this.videoComponent.reset()
        }
      }
    },
    handleVideoEnded () {
      this.isHovered = false
    },
    setCookieReview () {
      cookies.set('anchor_review_drawer', 'true')
    }
  },
  mounted () {
    this.renderReviews()
  }
}
