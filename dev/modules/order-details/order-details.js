/**
 * Initializes the javascript for the order-details module
 * @param {Object} el - The DOM Node containing the data-module="order-details" attribute.
 */

const orderDetails = (el) => {
  const backButton = el.querySelector('.js-back-button')

  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back()
    })
  }
}

export default orderDetails
