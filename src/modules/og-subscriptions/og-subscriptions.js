import Cookies from 'js-cookie'

/**
 * Initializes the javascript for the og-subscriptions module
 * @param {Object} el - The DOM Node containing the data-module="og-subscription" attribute.
 */

const ogSubscriptions = (el) => {
  console.warn('initializing og-subscriptions module')
  if (!el) return

  const customerId = el.getAttribute('data-og-customer-id')
  const timestamp = el.getAttribute('data-og-timestamp')
  const signature = el.getAttribute('data-og-signature')

  // Create a new `og_auth` cookie each time this module is initialized
  writeOgAuthCookie(customerId, timestamp, signature)

  // Add the Ordergroove SMI script to the document after the cookie is set
  addOgSMI()
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
    'og_auth',
    value, {
      expires,
      path: '/',
      secure: true
    }
  )
}
export default ogSubscriptions
