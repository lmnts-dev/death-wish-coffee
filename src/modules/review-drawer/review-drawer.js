/**
 * Initializes the javascript for the review-drawer module
 * @param {Object} el - The DOM Node containing the data-module="review-drawer" attribute.
 */

import scrollToElement from 'scroll-to-element'
import { addClass, removeClass } from 'lib/util'

const reviewDrawer = el => {
  const bottomline = document.querySelector('.js-yotpo-bottomline')
  const buttonToggle = document.querySelector('.js-button-toggle-review')
  const mainWidget = document.querySelector('.js-yotpo-main')

  buttonToggle.addEventListener('click', () => {
    if ([...buttonToggle.classList].includes('rotate')) {
      addClass(bottomline, 'active')
      removeClass(mainWidget, 'active')
      removeClass(buttonToggle, 'rotate')
      bottomline.after(buttonToggle)
    } else {
      removeClass(bottomline, 'active')
      addClass(mainWidget, 'active')
      addClass(buttonToggle, 'rotate')
      mainWidget.after(buttonToggle)
    }
  })

  document.addEventListener('pdpReviewScroll', () => {
    const offset = -104 // header height
    scrollToElement(el, { offset })
  })
}

export default reviewDrawer
