/**
 * Initializes the site's associatecarousel module.
 * @constructor
 * @param {Object} el - The site's associatecarousel container element.
 */

import Swiper, { Navigation } from 'swiper'
import { addClass, removeClass } from 'lib/util'

const associatecarousel = el => {
  Swiper.use([Navigation])
  const nextEl = el.querySelector('.carousel-next')
  const prevEl = el.querySelector('.carousel-prev')
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
    console.log(swiper)
    const newSlides = (isMobileMatches ? originalSlideEls : groupedSlideEls).map(slide => slide.cloneNode(true))
    swiper.params.loop = newSlides.length > 1
    swiper.appendSlide(newSlides)
    swiper.slideToLoop(0, 0)
  }
  if (swiperEl) {
    const navigation = nextEl && prevEl ? { navigation: { nextEl, prevEl } } : false
    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 10,
      ...navigation
    })
    updateSlides(swiper, mobileBreakpoints.matches)
    mobileBreakpoints.addEventListener('change', e => {
      updateSlides(swiper, e.matches)
    })
  }
}

export default associatecarousel
