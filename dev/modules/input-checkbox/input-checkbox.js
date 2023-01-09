/**
 * Initializes the site's inputcheckbox module.
 * @constructor
 * @param {Object} el - The site's inputcheckbox container element.
 */
const inputcheckbox = el => {
  const checkbox = el.querySelector('.form-checkbox__checkbox')

  el.addEventListener('click', () => {
    if (checkbox.checked) {
      checkbox.setAttribute('checked', '')
    } else {
      checkbox.removeAttribute('checked')
    }
  })
}

export default inputcheckbox
