/**
 * Initializes the site's productform module.
 * @constructor
 * @param {Object} el - The site's productform container element.
 */
const productform = el => {
  const inputEls = el.querySelectorAll('.js-product-input')
  const variantEl = el.querySelector('.js-product-variants')
  const submitButtonEl = el.querySelector('.js-form-submit')
  const priceVariants = el.querySelectorAll('.js-variant-price')
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
          for (const priceVariant of priceVariants) {
            const variantTitle = priceVariant.getAttribute('data-variant-title')

            console.log('variantTitle', variantTitle.split(' / '))

            const titleContains = variantTitle.split(' / ').some(function (v) { return selectedTitle.indexOf(v) >= 0 })
            const selectedContains = variantTitle === selectedTitle
            const displayCondition = selectedContains ? variantTitle === selectedTitle : titleContains
            console.log(titleContains)
            console.log(selectedContains)
            console.log(displayCondition)

            if (titleContains) {
              priceVariant.style.display = 'block'
            } else {
              priceVariant.style.display = 'none'
            }
          }
        }
      })
    }
  }
}

export default productform
