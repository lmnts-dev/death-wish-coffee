/**
 * Initializes the javascript for the plp-filter module
 * @param {Object} el - The DOM Node containing the data-module="plp-filter" attribute.
 */

import { toggle, triggerCustomEvent } from 'lib/util'

const plpFilter = (el) => {
  const filterBlocks = el.querySelectorAll('.js-filter-block')
  const filterBlockActiveClass = 'active'
  if (filterBlocks.length) {
    filterBlocks.forEach(block => {
      const title = block.querySelector('.js-filter-block-title')
      if (title) {
        title.addEventListener('click', () => {
          toggle(block, filterBlockActiveClass)
          triggerCustomEvent(el, 'toggleFilterBlock')
        })
      }
    })
  }
}

export default plpFilter
