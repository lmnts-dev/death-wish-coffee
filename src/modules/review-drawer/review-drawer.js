/**
 * Initializes the javascript for the review-drawer module
 * @param {Object} el - The DOM Node containing the data-module="review-drawer" attribute.
 */

import scrollToElement from 'scroll-to-element'

const reviewDrawer = (el) => {
  document.addEventListener('pdpReviewScroll', () => {
    const offset = -104 // header height
    scrollToElement(el, { offset })
  })
}

export default reviewDrawer
