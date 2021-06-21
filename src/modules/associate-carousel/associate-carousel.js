/**
 * Initializes the site's associatecarousel module.
 * @constructor
 * @param {Object} el - The site's associatecarousel container element.
 */

import Swiper from 'swiper'
import { addClass, removeClass } from 'lib/util'

const associatecarousel = el => {
  const numberOfItemsPerView = el.getAttribute('data-item-per-view') || 24
  const swiperEl = el.querySelector('.js-swiper')
  const mobileBreakpoints = window.matchMedia('(max-width: 991px)')
  const originalSlideEls = swiperEl ? Array.from(swiperEl.querySelectorAll('.js-item')).map(item => item.cloneNode(true)) : []
  const groupedSlideEls = originalSlideEls.length
    ? originalSlideEls
      .reduce((result, item, index) => {
        const group = Math.floor(index / numberOfItemsPerView)
        if (!result[group]) {
          result[group] = []
        }
        result[group].push(item.cloneNode(true))
        return result
      }, [])
      .map(group => {
        const groupEl = document.createElement('div')
        addClass(groupEl, 'swiper-slide')
        for (const item of group) {
          removeClass(item, 'swiper-slide')
          groupEl.appendChild(item)
        }
        return groupEl
      })
    : []
  const updateSlides = (swiper, isMobileMatches) => {
    swiper.removeAllSlides()
    const newSlides = (isMobileMatches ? originalSlideEls : groupedSlideEls).map(slide => slide.cloneNode(true))
    swiper.appendSlide(newSlides)
    swiper.slideToLoop(0, 0)
  }
  if (swiperEl) {
    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      loop: true
    })
    updateSlides(swiper, mobileBreakpoints.matches)
    mobileBreakpoints.addEventListener('change', e => {
      updateSlides(swiper, e.matches)
    })
  }
}

export default associatecarousel
