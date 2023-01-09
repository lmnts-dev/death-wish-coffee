/**
 * Initializes the site's inputtextarea module.
 * @constructor
 * @param {Object} el - The site's inputtextarea container element.
 */

import select from 'select-dom'
import { monitorFieldValue } from 'lib/util'

const inputtextarea = el => {
  const field = select('.form-field__input', el)
  monitorFieldValue(field)
}

export default inputtextarea
