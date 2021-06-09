/**
 * Initializes the javascript for the product-card module
 * @param {Object} el - The DOM Node containing the data-module="product-card" attribute.
 */

import select from 'select-dom'

const productCard = el => {
  const overlay = select('.js-overlay', el)
  const options = select('.product-form__options', el)

  overlay.addEventListener('click', e => {
    if (!options.contains(e.target)) {
      window.location.href = overlay.dataset.url
    }
  })
}

export default productCard
