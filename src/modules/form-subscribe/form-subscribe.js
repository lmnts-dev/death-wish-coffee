/**
 * Initializes the site's formsubscribe module.
 * @constructor
 * @param {Object} el - The site's formsubscribe container element.
 */

import { validateInput } from 'lib/util'

const formsubscribe = el => {
  const submitEl = el.querySelector('.js-submit')
  const inputEls = el.querySelectorAll('.js-input-field input')
  if (submitEl) {
    submitEl.addEventListener('click', (e) => {
      let isValid = true
      if (inputEls.length) {
        for (let i = 0; i < inputEls.length; i++) {
          isValid = isValid && validateInput(inputEls[i])
        }
      }
      if (!isValid) {
        e.preventDefault()
      }
    })
  }
}

export default formsubscribe
