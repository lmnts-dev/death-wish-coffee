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

  const sortSelectEl = el.querySelector('.js-sort-select')
  if (sortSelectEl) {
    sortSelectEl.addEventListener('change', (e) => {
      const queryVarPairs = new Map(
        location.search.substr(1).split('&')
          .map(pair => pair.split('='))
          .filter(pair => pair.length > 1)
      )

      queryVarPairs.set('sort_by', e.target.value)
      location.search = new URLSearchParams([...queryVarPairs]).toString()
    })
  }
}

export default plpSortHeader
