/**
 * Initializes the javascript for the pdp-hero module
 * @param {Object} el - The DOM Node containing the data-module="pdp-hero" attribute.
 */

import { contains } from 'lib/util'
import Video from '../video/video'

const pdpHero = (el) => {
  let swiper = null
  const customizeSwiper = swiper => {
    const videoEls = swiper.slides
      .map(slide => slide.querySelector('.js-video-module'))
      .filter(videoEl => videoEl && !contains(videoEl, 'is-loaded'))
    if (videoEls.length) {
      videoEls.map(videoEl => Video(videoEl))
    }
  }
  const carouselObserver = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      const isCarousel = mutation.oldValue.indexOf('js-swiper-container') !== -1
      const isCarouselInitialized = mutation.oldValue.indexOf('swiper-container-initialized') === -1 && contains(mutation.target, 'swiper-container-initialized')
      if (isCarousel && isCarouselInitialized) {
        if (contains(mutation.target.parentElement, 'js-carousel')) {
          swiper = mutation.target.swiper
          customizeSwiper(swiper)
          observer.disconnect()
        }
      }
    }
  })
  carouselObserver.observe(el, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class'],
    subtree: true
  })
}

export default pdpHero
