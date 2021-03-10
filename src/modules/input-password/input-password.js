/**
 * Initializes the site's inputpassword module.
 * @constructor
 * @param {Object} el - The site's inputpassword container element.
 */

import select from 'select-dom'
import { monitorFieldValue } from 'lib/util'

const inputpassword = el => {
  const field = select('.form-field__input', el)
  monitorFieldValue(field)
}

export default inputpassword
