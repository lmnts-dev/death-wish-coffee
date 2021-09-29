/**
 * Initializes the javascript for the review-drawer module
 * @param {Object} el - The DOM Node containing the data-module="review-drawer" attribute.
 */

import scrollToElement from 'scroll-to-element'
import { addClass, removeClass } from 'lib/util'
import cookies from 'js-cookie'

const reviewDrawer = el => {
  const bottomline = document.querySelector('.js-yotpo-bottomline')
  const buttonToggle = document.querySelector('.js-button-toggle-review')
  const mainWidget = document.querySelector('.js-yotpo-main')
  const anchorReviewDrawer = 'anchor_review_drawer'

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

  const scrollToAndClick = function () {
    const offset = -104 // header height
    scrollToElement(el, { offset })
    buttonToggle.click()
  }

  document.addEventListener('pdpReviewScroll', () => {
    scrollToAndClick()
  })

  if (cookies.get(anchorReviewDrawer)) {
    scrollToAndClick()
    cookies.remove(anchorReviewDrawer)
  }
}

export default reviewDrawer
