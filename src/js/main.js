import init from 'lib/init'
import LazyLoad from 'vanilla-lazyload'
import { contains, addClass, buildImageSrcset } from 'lib/util'

document.addEventListener('DOMContentLoaded', () => {
  init().mount()

  const loadImg = new LazyLoad({
    elements_selector: '.image__img',
    threshold: -10,
    callback_enter: function (el) {
      const parentNode = el.parentNode
      const prevSibling = el.previousElementSibling
      const webpSrc = prevSibling.srcset
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
})
