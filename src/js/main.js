import init from 'lib/init'
import LazyLoad from 'vanilla-lazyload'
import { contains, addClass, buildImageSrcset } from 'lib/util'
import scrollToElement from 'scroll-to-element'
import store from 'lib/store'
import select from 'select-dom'

document.addEventListener('DOMContentLoaded', async () => {
  init().mount()

  const loadImg = new LazyLoad({
    elements_selector: '.image__img',
    threshold: -10,
    callback_enter: function (el) {
      const parentNode = el.parentNode
      const prevSibling = el.previousElementSibling
      const webpSrc = prevSibling && prevSibling.srcset
      const src = el.getAttribute('data-src') || el.src
      const isSized = contains(el, 'sized-img')
      const isExcludeSmallWidths = el.getAttribute('data-srcset-exclude-small') !== null
      const srcsetData = buildImageSrcset(src, webpSrc, isSized, isExcludeSmallWidths)
      for (const srcset of srcsetData.srcsets) {
        const source = document.createElement('source')
        if (srcset.isWebp) {
          source.type = 'image/webp'
        }
        source.srcset = srcset.url
        source.media = srcset.media
        parentNode.insertBefore(source, el)
      }
      el.setAttribute('data-src', srcsetData.src)
    },
    callback_loaded: function (el) {
      const elParent = el.parentElement
      addClass(elParent, 'img-loaded')
    }
  })

  if (window.location.hash) {
    requestAnimationFrame(() => {
      const hashEl = select(window.location.hash)
      const navHeight = select('.navigation').offsetHeight
      if (hashEl) {
        scrollToElement(hashEl, {
          offset: -navHeight
        })
      }
    })
  }

  // Get cart data for Vuex state
  await store.dispatch('cart/getCart')
})
