/**
 * Initializes the site's productcarousel module.
 * @constructor
 * @param {Object} el - The site's productcarousel container element.
 */

import Swiper, { Navigation, Pagination } from 'swiper'

const productcarousel = el => {
  const breakpoints = {
    xl: '1199',
    lg: '991',
    md: '767',
    sm: '575',
    xs: '399'
  }
  const breakpointLGMax = el.dataset.initAtBreakpoint && window.matchMedia(`(max-width: ${breakpoints[el.dataset.initAtBreakpoint]}px)`)
  Swiper.use([Navigation, Pagination])
  let swiper

  const carousel = el.querySelector('.product-carousel__container')
  const totalSlides = el.querySelector('.product-carousel .alt-product-card').length
  const next = carousel.querySelector('.product-carousel-next')
  const prev = carousel.querySelector('.product-carousel-prev')
  let slidesPerView = 4

  const spaceBetween = 40

  const getBreakpointSlidesPerView = () => {
    return slidesPerView > 1 ? --slidesPerView : slidesPerView
  }

  const carouselArgs = {
    slidesPerView: 1,
    spaceBetween: spaceBetween / 2,
    loop: true,
    loopedSlides: totalSlides,
    navigation: { nextEl: next, prevEl: prev },
    breakpoints: {
      1200: {
        slidesPerView: slidesPerView,
        spaceBetween: spaceBetween
      },
      992: {
        slidesPerView: getBreakpointSlidesPerView(),
        spaceBetween: spaceBetween / 1.25
      },
      768: {
        slidesPerView: getBreakpointSlidesPerView(),
        spaceBetween: spaceBetween / 1.5
      },
      576: {
        slidesPerView: getBreakpointSlidesPerView(),
        spaceBetween: spaceBetween / 1.75
      }
    }
  }

  const breakpointMatch = () => {
    if (breakpointLGMax.matches) {
      swiper = new Swiper(carousel, carouselArgs)
    } else if (swiper !== undefined) {
      swiper.destroy()
      swiper = undefined
    }
  }

  if (breakpointLGMax) {
    breakpointLGMax.addEventListener('change', breakpointMatch)
    breakpointMatch()
  } else {
    swiper = new Swiper(carousel, carouselArgs)
  }
}

export default productcarousel
