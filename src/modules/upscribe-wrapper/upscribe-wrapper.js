/**
 * Initializes the site's upscribewrapper module.
 * @constructor
 * @param {Object} el - The site's upscribewrapper container element.
 */

const upscribewrapper = el => {
  const upscribeBtn = document.getElementById('upscribe-btn')
  const portalWrapper = document.getElementById('upscribe-portal-wrapper')
  const accountWrapper = document.getElementById('account-parent')
  if (upscribeBtn) {
    upscribeBtn.addEventListener('click', () => {
      accountWrapper.style.display = 'none'
      portalWrapper.style.display = 'block'
    })
  }
}

export default upscribewrapper
