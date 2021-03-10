import select from 'select-dom'
import inViewport from 'in-viewport'
import { addClass, isFirefox } from 'lib/util'

export default el => {
  const video = select('.js-video', el) || false

  if (video) {
    const src = video.getAttribute('data-src')

    inViewport(
      video,
      {
        offset: 300
      },
      () => {
        if (isFirefox()) {
          video.setAttribute('src', src)
          addClass(el, 'is-loaded')
        } else {
          fetch(src)
            .then(() => {
              video.setAttribute('src', src)
            })
            .then(() => {
              addClass(el, 'is-loaded')
            })
        }
      }
    )
  }
}
