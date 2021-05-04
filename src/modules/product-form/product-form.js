/**
 * Initializes the site's productform module.
 * @constructor
 * @param {Object} el - The site's productform container element.
 */
const productform = el => {
  const inputEls = el.querySelectorAll('.js-product-input')
  const variantEl = el.querySelector('.js-product-variants')
  const submitButtonEl = el.querySelector('.js-form-submit')
  const options = {}

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

export default productform
