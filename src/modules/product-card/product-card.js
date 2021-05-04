/**
 * Initializes the javascript for the product-card module
 * @param {Object} el - The DOM Node containing the data-module="product-card" attribute.
 */

import { toggle } from 'lib/util'

const productCard = el => {
  const buttonEl = el.querySelector('.js-button')
  const closeButton = el.querySelector('.js-close')
  const overlay = el.querySelector('.js-overlay')
  const inputEls = el.querySelectorAll('.js-product-input')
  const variantEl = el.querySelector('.js-product-variants')
  const submitButtonEl = el.querySelector('.js-form-submit')
  const options = {}

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

  if (inputEls.length && variantEl) {
    for (const inputEl of inputEls) {
      inputEl.addEventListener('change', () => {
        const optionIndex = inputEl.getAttribute('data-option-index')
        const optionKey = `option${optionIndex}`
        options[optionKey] = inputEl.value
        const selectedTitle = Object.keys(options).sort().map(key => options[key]).join(' / ')
        let selectedValue = null
        for (const optionEl of variantEl.options) {
          if (optionEl.getAttribute('data-title') === selectedTitle) {
            selectedValue = optionEl.value
            optionEl.selected = true
          }
        }
        if (selectedValue) {
          variantEl.value = selectedValue

          if (submitButtonEl) {
            submitButtonEl.removeAttribute('disabled')
          }
        }
      })
    }
  }
}

export default productCard
