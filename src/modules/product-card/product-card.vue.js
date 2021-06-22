import { mapState } from 'vuex'
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
      return this.product.options_by_name.Size && this.product.options_by_name.Size.selected_variant_drop.compare_at_price ? this.product.options_by_name.Size.selected_variant_drop.compare_at_price : ''
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
    handleHover (e) {
      if (this.videoComponent) {
        this.isHovered = e.type === 'mouseenter'
        if (e.type === 'mouseenter') {
          this.videoComponent.play()
        } else {
          this.videoComponent.reset()
        }
      }
    },
    handleVideoEnded () {
      this.isHovered = false
    }
  },
  mounted () {
    this.renderReviews()
  }
}
