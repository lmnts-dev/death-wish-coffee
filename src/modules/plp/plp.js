import { addClass, removeClass, getHeight } from 'lib/util'
import store from 'lib/store'

/**
 * Initializes the site's plp module.
 * @constructor
 * @param {Object} el - The site's plp container element.
 */
const plp = el => {
  const filterEl = el.querySelector('.js-filter')
  const sortHeaderEl = el.querySelector('.js-sort-header')
  const containerEl = el.querySelector('.js-container')
  const setContainerMinHeight = () => {
    if (!containerEl || !filterEl) {
      return
    }
    const height = getHeight(filterEl)
    containerEl.style.minHeight = height
  }
  setContainerMinHeight()
  if (filterEl && sortHeaderEl) {
    sortHeaderEl.addEventListener('toggleFiter', (e) => {
      const isFilterActive = e.detail.active
      if (isFilterActive) {
        addClass(filterEl, 'active')
      } else {
        removeClass(filterEl, 'active')
      }
      setContainerMinHeight()
    })
    filterEl.addEventListener('toggleFilterBlock', () => {
      setContainerMinHeight()
    })
  }

  store.dispatch('plp/init')
}

export default plp
