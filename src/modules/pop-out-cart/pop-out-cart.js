const TRANSITION_DURATION = 300

/**
 * Initializes the javascript for the pop-out-cart module
 * @param {Object} el - The DOM Node containing the data-module="pop-out-cart" attribute.
 */
const popOutCart = (el) => {
  const toggle = document.querySelector(el.dataset.toggleSelector)
  let previousFocus = null

  const setActiveState = (newState) => {
    const firstFocusable = el.querySelector('input, a')
    toggle.setAttribute('aria-expanded', newState)
    toggle.classList.toggle('is-active', newState)
    el.classList.toggle('is-active', newState)
    el.setAttribute('aria-hidden', !newState)

    if (newState) {
      // Set focus on the dialog
      previousFocus = document.activeElement
      setTimeout(() => firstFocusable.focus(), TRANSITION_DURATION)
    } else {
      // Restore focus outside of dialog
      firstFocusable.blur()
      previousFocus.focus()
      previousFocus = null
    }
  }

  // open / close when clicking on toggle
  if (toggle) {
    toggle.addEventListener('click', function () {
      const newState = toggle.getAttribute('aria-expanded') !== 'true'
      setActiveState(newState)
    })
  }

  // close when click outside
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !el.contains(e.target)) {
      setActiveState(false)
    }
  })
}

export default popOutCart
