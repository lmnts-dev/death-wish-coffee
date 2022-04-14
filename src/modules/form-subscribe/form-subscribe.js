/**
 * Initializes the site's formsubscribe module.
 * @constructor
 * @param {Object} el - The site's formsubscribe container element.
 */

import axios from 'axios'
import select from 'dom-select'

const formsubscribe = el => {
  const submitEl = el.querySelector('.js-submit')
  const inputEls = el.querySelector('.js-input-field input')
  const feedbackEl = el.querySelector('.js-response-message')

  if (submitEl) {
    submitEl.addEventListener('click', (e) => {
      e.preventDefault()
      const params = new URLSearchParams()
      params.append('g', 'HwmMcA')
      params.append('email', inputEls.value)
      params.append('source', 'Website Newsletter Form')

      axios({
        crossDomain: true,
        method: 'post',
        url: 'https://manage.kmail-lists.com/ajax/subscriptions/subscribe',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache'
        },
        data: params
      }).then(response => {
        if (response.data.success) {
          // ordergroove
          dataLayer.push({
            event: "form_submit",
            form: "general",
          });

          if (response.data.data.is_subscribed) {
            updateFormFeedback('Looks like you are already subscribed to our mailing list.')
          } else {
            updateFormFeedback('Success! Please check your inbox to confirm your subscription.')
            inputEls.value = ''
          }
        } else {
          updateFormFeedback('An unexpected error occured - please try again later.', true)
        }
      }).catch(err => {
        console.log(err)
        updateFormFeedback('An unexpected error occured - please try again later.', true)
      })
    })

    const updateFormFeedback = (message = false) => {
      feedbackEl.innerHTML = message

      const errorFocusField = select('.form-field__error')

      inputEls.addEventListener('focusout', () => {
        if (message) {
          feedbackEl.innerHTML = ''
        }
      })

      if (message) {
        errorFocusField.innerHTML = ''
      }
    }
  }
}

export default formsubscribe
