/**
 * Initializes the site's promobar module.
 * @constructor
 * @param {Object} el - The site's promobar container element.
 */

import { addClass, removeClass, debounce } from 'lib/util'
import cookies from 'js-cookie'

function promobar (el) {
  const closeBtn = el.querySelector('.js-close')
  const hidePromoBar = cookies.get('hide_promobar')
  const body = document.body
  const page = document.querySelector('#page')

  const disableBar = el => {
    cookies.set('hide_promobar', 'true')
    removeClass(el, 'has-promo-bar')
  }
  const showBar = ele => {
    addClass(ele, 'has-promo-bar')
    setTimeout(() => {
      el.dispatchEvent(new CustomEvent('promoBarHeightSet', { detail: { promobarHeight: el.offsetHeight }, bubbles: true }))
      page.style.paddingTop = el.offsetHeight + 'px'
    })
  }

  window.addEventListener('resize', debounce(() => {
    el.dispatchEvent(new CustomEvent('promoBarHeightSet', { detail: { promobarHeight: el.offsetHeight }, bubbles: true }))
    page.style.paddingTop = el.offsetHeight + 'px'
  }))

  if (typeof hidePromoBar === 'undefined') {
    showBar(body)
  }

  closeBtn.addEventListener('click', function () {
    addClass(body, 'promo-bar-removed')
    disableBar(body)
  })
}

export default promobar
