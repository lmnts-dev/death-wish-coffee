import Vue from 'vue'

/**
 * Initializes the site's productform module.
 * @constructor
 * @param {Object} el - The site's productform container element.
 */
const productFormRoot = el => {
  return new Vue({
    el,
    name: 'ProductFormRoot',
    delimiters: ['${', '}']
  })
}

export default productFormRoot
