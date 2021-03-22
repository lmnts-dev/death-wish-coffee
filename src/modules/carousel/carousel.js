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

  const loop = !!carousel.dataset.loop
  const totalSlides = carousel.querySelectorAll('.carousel-slide').length

  const next = carousel.querySelector('.carousel-next')
  const prev = carousel.querySelector('.carousel-prev')
  const navigation = !!carousel.dataset.navigation && { navigation: { nextEl: next, prevEl: prev } }

  const paginationEl = carousel.querySelector('.carousel-pagination')
  const pagination = !!carousel.dataset.pagination && { pagination: { el: paginationEl, clickable: true } }

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
      576: {
        slidesPerView: slidesPerView > 1 ? slidesPerView - 3 : slidesPerView,
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
    ...navigation,
    ...pagination,
    ...carouselBreakpoints
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
}

export default carousel
