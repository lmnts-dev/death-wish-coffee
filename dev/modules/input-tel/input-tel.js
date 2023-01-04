/**
 * Initializes the site's inputtext module.
 * @constructor
 * @param {Object} el - The site's inputtext container element.
 */

import select from 'select-dom'
import { monitorFieldValue } from 'lib/util'

const inputtext = el => {
  const field = select('.form-field__input', el)
  monitorFieldValue(field)
}

export default inputtext
