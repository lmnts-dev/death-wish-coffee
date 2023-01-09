import Vue from 'vue'
import store from 'lib/store'
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
    store,
    name: 'ProductFormRoot',
    delimiters: ['${', '}']
  })
}

export default productFormRoot
