/**
 * Initializes the site's accordion module.
 * @constructor
 * @param {Object} el - The site's accordion container element.
 */

import { removeClass, addClass } from '../../js/lib/util'

function accordion (el) {
  const accordionItems = el.querySelectorAll('.accordion__item')

  for (const item of accordionItems) {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) {
        removeClass(accordionItems, 'active')
      } else {
        removeClass(accordionItems, 'active')
        addClass(item, 'active')
      }
    })
  }
}

export default accordion
