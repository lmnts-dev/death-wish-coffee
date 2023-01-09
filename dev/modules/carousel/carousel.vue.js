import Carousel from '../carousel/carousel'

export default {
  inheritAttrs: false,
  data () {
    return {
      swiper: null
    }
  },
  mounted () {
    this.swiper = Carousel(this.$el)
  }
}
