/**
 * Initializes the site's inputemail module.
 * @constructor
 * @param {Object} el - The site's inputemail container element.
 */

import select from 'select-dom'
import { monitorFieldValue } from 'lib/util'

const inputemail = el => {
  const field = select('.form-field__input', el)
  monitorFieldValue(field)
}

export default inputemail
