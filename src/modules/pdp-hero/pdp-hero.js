/**
 * Initializes the javascript for the pdp-hero module
 * @param {Object} el - The DOM Node containing the data-module="pdp-hero" attribute.
 */

import Vue from 'vue'
import Carousel from '../carousel/carousel'
import { contains } from 'lib/util'
import Video from '../video/video'

const pdpHero = (el) => {
  return new Vue({
    el,
    name: 'PdpHeroRoot',
    delimiters: ['${', '}'],
    data () {
      return {
        imageCarousel: null
      }
    },
    mounted () {
      const carouselEl = this.$refs.carousel instanceof Array ? this.$refs.carousel[0] : this.$refs.carousel
      if (carouselEl) {
        this.imageCarousel = Carousel(carouselEl)
        this.customizeImageCarousel()
      }
    },
    methods: {
      customizeImageCarousel () {
        const videoEls = this.imageCarousel.slides
          .map(slide => slide.querySelector('.js-video-module'))
          .filter(videoEl => videoEl && !contains(videoEl, 'is-loaded'))
        if (videoEls.length) {
          videoEls.map(videoEl => Video(videoEl))
        }
      }
    }
  })
}

export default pdpHero
