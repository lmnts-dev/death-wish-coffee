/**
 * Initializes the site's productform module.
 * @constructor
 * @param {Object} el - The site's productform container element.
 */

import Vue from 'vue'
// import { addClass, removeClass } from 'lib/util'

// const productform = el => {
//   const inputEls = el.querySelectorAll('.js-product-input')
//   const variantEl = el.querySelector('.js-product-variants')
//   const submitButtonEl = el.querySelector('.js-form-submit')
//   const priceEls = el.querySelectorAll('.js-variant-price')
//   const firstVariantTitle = el.getAttribute('data-first-variant-title')
//   const options = {}
//
//   // Toggle price display
//   const setPrice = variantTitle => {
//     if (!priceEls.length || !variantTitle) {
//       return
//     }
//     for (const priceEl of priceEls) {
//       const priceMatchOption = priceEl.getAttribute('data-match-option')
//       const isMatched = variantTitle.indexOf(priceMatchOption) >= 0
//       if (isMatched) {
//         addClass(priceEl, 'active')
//       } else {
//         removeClass(priceEl, 'active')
//       }
//     }
//   }
//
//   setPrice(firstVariantTitle)
//
//   if (inputEls.length && variantEl) {
//     for (const inputEl of inputEls) {
//       inputEl.addEventListener('change', () => {
//         const optionIndex = inputEl.getAttribute('data-option-index')
//         const optionKey = `option${optionIndex}`
//         options[optionKey] = inputEl.value
//         const selectedTitle = Object.keys(options).sort().map(key => options[key]).join(' / ')
//         let selectedValue = null
//         for (const optionEl of variantEl.options) {
//           if (optionEl.getAttribute('data-title') === selectedTitle) {
//             selectedValue = optionEl.value
//             optionEl.selected = true
//           } else {
//             optionEl.selected = false
//           }
//         }
//
//         // Set value for variant dropdown, fallback to blank value if null
//         variantEl.value = selectedValue
//         // Toggle button in case of variant available or not
//         if (selectedValue) {
//           submitButtonEl.removeAttribute('disabled')
//         } else {
//           submitButtonEl.setAttribute('disabled', true)
//         }
//         setPrice(selectedTitle)
//       })
//     }
//   }
// }

const productFormRoot = el => {
  return new Vue({
    el,
    name: 'ProductFormRoot',
    delimiters: ['${', '}']
  })
}

export default productFormRoot
