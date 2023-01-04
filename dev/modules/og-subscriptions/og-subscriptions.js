import Cookies from 'js-cookie'

/**
 * Initializes the javascript for the og-subscriptions module
 * @param {Object} el - The DOM Node containing the data-module="og-subscription" attribute.
 */

const AUTH_COOKIE_NAME = 'og_auth'
const UPDATE_PAYMENT_FORM_ID = 'update-payment-form'

const ogSubscriptions = (el) => {
  console.warn('initializing og-subscriptions module')
  if (!el) return

  const customerId = el.getAttribute('data-og-customer-id')
  const timestamp = el.getAttribute('data-og-timestamp')
  const customerSignature = el.getAttribute('data-og-customer-signature')
  const signature = el.getAttribute('data-og-signature')

  // Create a new `og_auth` cookie each time this module is initialized
  writeOgAuthCookie(customerId, timestamp, signature)

  // Add the Ordergroove SMI script to the document after the cookie is set
  addOgSMI()

  // Add update payment button handler
  addUpdatePaymentHandler(customerId, timestamp, customerSignature)
}

/**
 * Create the script element for the SMI (msi) script.
 *
 * The script attaches to the `#og-msi` element in the DOM and renders the
 * subscription management interface (SMI) there.
 */
const addOgSMI = () => {
  const smiScript = document.createElement('script')
  smiScript.src = 'https://static.ordergroove.com/a967464e9f0e11ecbc8f5ec5529cdc00/msi.js'
  smiScript.defer = true

  if (!document.contains(smiScript)) {
    document.body.appendChild(smiScript)
  }
}

/**
 * Add the event handler for the update payment form.
 *
 * This adds an event listener, which is dynamically created so that the
 * authentication information can be added to the request auth.
 *
 * @param {*} customerId
 * @param {*} timestamp
 * @param {*} customerSignature
 */
const addUpdatePaymentHandler = (customerId, timestamp, customerSignature) => {
  const updatePaymentForm = document.getElementById(UPDATE_PAYMENT_FORM_ID)
  if (!updatePaymentForm) return

  updatePaymentForm.addEventListener('submit', createUpdatePaymentHandler(customerId, timestamp, customerSignature))
}

/**
 * Dynamically create and return a new event handler function.
 *
 * @param {*} customerId
 * @param {*} timestamp
 * @param {*} customerSignature
 */
const createUpdatePaymentHandler = (customerId, timestamp, customerSignature) => {
  // Handler code is basically the same as Ordergroove adds to their hosted SMI page
  const handleUpdatePaymentFormSubmit = async (event) => {
    event.preventDefault()

    // Add data used for authentication
    const body = {
      auth: {
        customerId,
        hmac: customerSignature,
        timestamp
      },
      shop: 'deathwishcoffee.myshopify.com'
    }

    fetch('/apps/subscriptions/send-update-payment-email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => {
      if (response.status === 200) {
        alert(
          'You will receive an email that will let you update your credit card for all of your subscriptions.'
        )
      } else {
        response.text().then(alert)
      }
    })
  }

  return handleUpdatePaymentFormSubmit
}

/**
 * Create the cookie needed by the Ordergroove SMI authentication
 *
 * https://og-restrpc.readme.io/docs/integration-reference-material#authentication-page
 *
 * @param {*} customerId
 * @param {*} timestamp
 * @param {*} signature
 */
const writeOgAuthCookie = (customerId, timestamp, signature) => {
  const value = `${customerId}|${timestamp}|${signature}`
  // Expires in 2 hours (120 minutes)
  const expires = new Date(new Date().getTime() + 120 * 60 * 1000)

  return Cookies.set(
    AUTH_COOKIE_NAME,
    value, {
      expires,
      path: '/',
      secure: true
    }
  )
}
export default ogSubscriptions
