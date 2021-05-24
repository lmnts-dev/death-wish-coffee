/**
 * Initializes the javascript for the product-hero-card module
 * @param {Object} el - The DOM Node containing the data-module="product-hero-card" attribute.
 */

import { getHeight, debounce } from 'lib/util'
import select from 'select-dom'
import on from 'dom-event'

const productHeroCard = (el) => {
  const descriptionEl = select('.js-description', el)
  const contentEl = select('.js-content', el)
  const textEl = select('.js-text', el)

  const sliceText = () => {
    if (textEl) {
      let from = 50
      if (window.matchMedia('screen and (min-width: 1280px)').matches) {
        from = 100
      }
      if (window.matchMedia('screen and (min-width: 1440px)').matches) {
        from = 325
      }
      if (window.matchMedia('screen and (min-width: 1920px)').matches) {
        from = 500
      }
      textEl.innerHTML = textEl.innerHTML.slice(0, from)
    }
  }

  const doTransform = () => {
    setTimeout(() => {
      if (contentEl && descriptionEl) {
        const descriptionHeight = getHeight(descriptionEl)
        contentEl.setAttribute('style', `transform: translateY(${descriptionHeight})`)
        on(el, 'mouseenter', () => {
          contentEl.setAttribute('style', 'transform: none')
        })
        on(el, 'mouseleave', () => {
          contentEl.setAttribute('style', `transform: translateY(${descriptionHeight})`)
        })
      }
    })
  }

  sliceText()
  doTransform()

  on(window, 'resize', debounce(() => {
    doTransform()
    sliceText()
  }))
}

export default productHeroCard
