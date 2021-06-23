/**
 * Initializes the javascript for the carousel module
 * @param {Object} el - The DOM Node containing the data-module="carousel" attribute.
 */

import Swiper, { Navigation, Pagination } from 'swiper'

const carousel = el => {
  Swiper.use([Navigation, Pagination])
  let swiper

  const carousel = el.querySelector('.carousel-container')

  const slidesPerView = !isNaN(parseFloat(carousel.dataset.slidesPerView)) ? parseFloat(carousel.dataset.slidesPerView) : 1
  const spaceBetween = !isNaN(parseFloat(carousel.dataset.spacing)) ? parseFloat(carousel.dataset.spacing) : 0

  const loop = carousel.dataset.loop === 'true'
  const totalSlides = carousel.querySelectorAll('.swiper-slide').length

  const next = carousel.querySelector('.carousel-next')
  const prev = carousel.querySelector('.carousel-prev')
  const navigation = next && prev ? { navigation: { nextEl: next, prevEl: prev } } : false

  const paginationEl = carousel.querySelector('.carousel-pagination')
  const pagination = !!carousel.dataset.pagination && { pagination: { el: paginationEl, clickable: true } }

  const allowTouchMove = totalSlides > 1

  const breakpoints = {
    xl: '1199',
    lg: '991',
    md: '767',
    sm: '575',
    xs: '399'
  }
  const breakpointInit = carousel.dataset.initAtBreakpoint
    ? window.matchMedia(`(max-width: ${breakpoints[carousel.dataset.initAtBreakpoint]}px)`)
    : false

  const carouselBreakpoints = !!carousel.dataset.initAtBreakpoint || {
    breakpoints: {
      320: {
        slidesPerView: slidesPerView > 1 ? slidesPerView - 2 : slidesPerView,
        spaceBetween: spaceBetween / 1.75
      },
      768: {
        slidesPerView: slidesPerView > 1 ? slidesPerView - 2 : slidesPerView,
        spaceBetween: spaceBetween / 1.5
      },
      992: {
        slidesPerView: slidesPerView > 1 ? slidesPerView - 1 : slidesPerView,
        spaceBetween: spaceBetween / 1.25
      },
      1200: {
        slidesPerView: slidesPerView,
        spaceBetween: spaceBetween
      }
    }
  }

  const carouselArgs = {
    slidesPerView: 1,
    spaceBetween: spaceBetween / 2,
    loop: loop,
    loopedSlides: totalSlides,
    allowTouchMove,
    ...navigation,
    ...pagination,
    ...carouselBreakpoints,
    on: {
      slideChangeTransitionStart: function () {
        const $wrapperEl = this.$wrapperEl
        const params = this.params
        $wrapperEl.children(('.' + (params.slideClass) + '.' + (params.slideDuplicateClass)))
          .each(function () {
            const idx = this.getAttribute('data-swiper-slide-index')
            this.innerHTML = $wrapperEl.children('.' + params.slideClass + '[data-swiper-slide-index="' + idx + '"]:not(.' + params.slideDuplicateClass + ')').html()
          })
      },
      slideChangeTransitionEnd: function () {
        this.slideToLoop(this.realIndex, 0, false)
      }
    }
  }

  const breakpointMatch = () => {
    if (breakpointInit.matches) {
      swiper = new Swiper(carousel, carouselArgs)
    } else if (swiper !== undefined) {
      swiper.destroy()
      swiper = undefined
    }
  }

  if (breakpointInit) {
    breakpointInit.addEventListener('change', breakpointMatch)
    breakpointMatch()
  } else {
    swiper = new Swiper(carousel, carouselArgs)
  }
  return swiper
}

export default carousel
