const MINUS_SELECTOR = '.js-cart-item-control-minus'
const PLUS_SELECTOR = '.js-cart-item-control-plus'
const QUANTITY_SELECTOR = '.form-field__input'

const cartItemControl = (el) => {
  const minusEl = el.querySelector(MINUS_SELECTOR)
  const plusEl = el.querySelector(PLUS_SELECTOR)
  const quantityEl = el.querySelector(QUANTITY_SELECTOR)

  const buttonClickHandler = (buttonEl, callback) => {
    buttonEl.addEventListener('click', (e) => {
      e.preventDefault()
      quantityEl.value = callback(parseInt(quantityEl.value))
      el.classList.add('is-updated')
    })
  }

  buttonClickHandler(minusEl, (value) => Math.max(value - 1, quantityEl.min || 0))
  buttonClickHandler(plusEl, (value) => Math.min(value + 1, quantityEl.max || Infinity))
}

export default cartItemControl
