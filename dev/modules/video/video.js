import select from 'select-dom'
import inViewport from 'in-viewport'
import { addClass, isFirefox } from 'lib/util'

export default el => {
  const video = select('.js-video', el) || false
  if (!video) {
    return
  }

  const playButton = select('.js-play', el) || false
  const src = video.getAttribute('data-src')
  const disableScrollActivate = el.hasAttribute('data-disable-scroll-activate')
  const handleVideoLoad = () => {
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

  if (!disableScrollActivate) {
    inViewport(
      video,
      {
        offset: 300
      },
      handleVideoLoad
    )
  } else if (playButton) {
    playButton.addEventListener('click', function () {
      handleVideoLoad()
      addClass(el, 'active')
    })
  }
}
