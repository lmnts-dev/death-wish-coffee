import { contains } from 'lib/util'
import VImage from '../v-image/v-image.vue'
import Carousel from '../carousel/carousel'
import Video from '../video/video'

export default {
  components: {
    VImage
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      imageCarousel: null
    }
  },
  computed: {
    images () {
      return this.product.media.filter(item => item.media_type === 'image')
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
