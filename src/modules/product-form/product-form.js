import Vue from 'vue'
import ProductForm from './product-form.vue'

/**
 * Initializes the site's productform module.
 * @constructor
 * @param {Object} el - The site's productform container element.
 */
const productFormRoot = el => {
  return new Vue({
    el,
    components: {
      ProductForm
    },
    name: 'ProductFormRoot',
    delimiters: ['${', '}']
  })
}

export default productFormRoot
