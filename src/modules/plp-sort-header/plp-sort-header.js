/**
 * Initializes the javascript for the plp-sort-header module
 * @param {Object} el - The DOM Node containing the data-module="plp-sort-header" attribute.
 */

import { triggerCustomEvent } from 'lib/util'

const plpSortHeader = (el) => {
  const buttonEl = el.querySelector('.js-filter-button')
  let filterActive = false
  if (buttonEl) {
    buttonEl.addEventListener('click', () => {
      filterActive = !filterActive
      triggerCustomEvent(el, 'toggleFiter', { detail: { active: filterActive } })
    })
  }
}

export default plpSortHeader
