import { contains } from 'lib/util'
import { mapState } from 'vuex'
import VImage from '../v-image/v-image.vue'
import PdpAddToCart from '../pdp-add-to-cart/pdp-add-to-cart.vue'
import Carousel from '../carousel/carousel'
import Video from '../video/video'

export default {
  components: {
    VImage,
    PdpAddToCart
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    subscriptionChecked: Boolean
  },
  data () {
    return {
      imageCarousel: null
    }
  },
  computed: {
    ...mapState('pdp', ['selectedVariantId']),
    selectedVariant () {
      return this.selectedVariantId && this.product.variants.find(v => v.id === this.selectedVariantId)
    },
    images () {
      return this.product.media.filter(item => item.media_type === 'image')
    },
    selectedImageIndex () {
      return this.selectedVariant && this.selectedVariant.featured_media && this.images.findIndex(image => image.id === this.selectedVariant.featured_media.id)
    }
  },
  watch: {
    selectedImageIndex (newValue, oldValue) {
      if (newValue < 0 || newValue === oldValue) {
        return
      }
      if (this.imageCarousel) {
        this.imageCarousel.slideToLoop(newValue)
      }
    }
  },
  mounted () {
    const carouselEl = this.$refs.carousel instanceof Array ? this.$refs.carousel[0] : this.$refs.carousel
    if (carouselEl) {
      this.buildImageCarousel(carouselEl)
    }
  },
  methods: {
    buildImageCarousel (carouselEl) {
      this.imageCarousel = Carousel(carouselEl)
      const videoEls = this.imageCarousel.slides
        .map(slide => slide.querySelector('.js-video-module'))
        .filter(videoEl => videoEl && !contains(videoEl, 'is-loaded'))
      if (videoEls.length) {
        videoEls.map(videoEl => Video(videoEl))
      }
    }
  }
}
