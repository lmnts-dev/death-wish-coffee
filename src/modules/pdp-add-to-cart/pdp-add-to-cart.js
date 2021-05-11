/**
 * Initializes the javascript for the pdp-add-to-cart module
 * @param {Object} el - The DOM Node containing the data-module="pdp-add-to-cart" attribute.
 */

import { triggerCustomEvent } from 'lib/util'

const pdpAddToCart = (el) => {
  const reviewEl = el.querySelector('.js-review')
  if (reviewEl) {
    reviewEl.addEventListener('click', () => {
      triggerCustomEvent(document, 'pdpReviewScroll')
    })
  }
}

export default pdpAddToCart
