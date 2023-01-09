/**
 * Initializes the site's formactivateaccount module.
 * @constructor
 * @param {Object} el - The site's formactivateaccount container element.
 */

import { validateForm } from 'lib/util'

const formactivateaccount = el => {
  const formEl = el.querySelector('.js-form')
  const submitButtonEl = el.querySelector('.js-submit')
  if (submitButtonEl && formEl) {
    submitButtonEl.addEventListener('click', (e) => {
      e.preventDefault()
      const isValid = validateForm(formEl)
      if (isValid) {
        formEl.submit()
      }
    })
  }
}

export default formactivateaccount
