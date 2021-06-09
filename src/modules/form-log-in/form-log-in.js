/**
* Initial javascript for the form-log-in module
*/

import { toggle, addClass, removeClass } from 'lib/util'

const formLogIn = (el) => {
  const forgotPasswordBtn = el.querySelector('.form-login-footer__account--password')
  const loginForm = el.querySelector('.form-login__form')
  const forgotForm = el.querySelector('.form-forgot')
  const cancelBtn = el.querySelector('.form-forgot__cancel')
  const successMsg = el.querySelector('.form-forgot-form__success')
  const successMsgClone = el.querySelector('.form-login__success-msg')
  const shouldActivateForgotForm = location.hash === '#recover'

  if (shouldActivateForgotForm) {
    addClass(forgotForm, 'visible')
    removeClass(loginForm, 'visible')
    history.replaceState('', document.title, location.pathname + location.search)
  }

  if (successMsg) {
    successMsgClone.appendChild(successMsg)
    toggle(successMsgClone, 'active')
  }

  forgotPasswordBtn.addEventListener('click', () => {
    swapForms()
  })

  cancelBtn.addEventListener('click', () => {
    swapForms()
  })

  const swapForms = () => {
    toggle(loginForm, 'visible')
    toggle(forgotForm, 'visible')
  }
}

export default formLogIn
