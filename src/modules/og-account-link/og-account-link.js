import Cookies from 'js-cookie'

/**
 * Initializes the javascript for the og-offer module
 * @param {Object} el - The DOM Node containing the data-module="og-account-link" attribute.
 */

const ogAccountLink = (el) => {
  console.warn('initializing og-account-link module')
  if (!el) return

  const customerId = el.getAttribute('data-og-customer-id')
  const timestamp = el.getAttribute('data-og-timestamp')
  const signature = el.getAttribute('data-og-signature')

  // Create a new `og_auth` cookie each time this module is initialized
  writeOgAuthCookie(customerId, timestamp, signature)
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
export default ogAccountLink
