/**
 * Initializes the javascript for the product-card module
 * @param {Object} el - The DOM Node containing the data-module="product-card" attribute.
 */

import { toggle } from 'lib/util'

const productCard = el => {
  const buttonEl = el.querySelector('.js-button')
  const closeButton = el.querySelector('.js-close')
  const overlay = el.querySelector('.js-overlay')

  if (buttonEl) {
    buttonEl.addEventListener('click', () => {
      toggle(overlay, 'is-active')
    })
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      toggle(overlay, 'is-active')
    })
  }
}

export default productCard
