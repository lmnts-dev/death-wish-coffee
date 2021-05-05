/**
 * Initializes the site's plp module.
 * @constructor
 * @param {Object} el - The site's plp container element.
 */
import { addClass, removeClass } from 'lib/util'

const plp = el => {
  const filterEl = el.querySelector('.js-filter')
  const sortHeaderEl = el.querySelector('.js-sort-header')
  if (filterEl && sortHeaderEl) {
    sortHeaderEl.addEventListener('toggleFiter', (e) => {
      const isFilterActive = e.detail.active
      if (isFilterActive) {
        addClass(filterEl, 'active')
      } else {
        removeClass(filterEl, 'active')
      }
    })
  }
}

export default plp
