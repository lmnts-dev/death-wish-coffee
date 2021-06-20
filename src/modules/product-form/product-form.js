import Vue from 'vue'
import store from 'lib/store'
import ProductForm from './product-form.vue'
import VOption from '../upscribe-product-options/upscribe-product-options-select.vue'
import UpscribeForm from '../upscribe-product-options/upscribe-product-options'

/**
 * Initializes the site's productform module.
 * @constructor
 * @param {Object} el - The site's productform container element.
 */
const productFormRoot = el => {
  return new Vue({
    el,
    components: {
      ProductForm,
      VOption,
      UpscribeForm
    },
    data: {
      product: '',
      addedToCartSuccessfully: '',
      addedToCartErrorMessage: '',
      selectedVariantId: '',
      componentMounted: false,
      initialSelectedOptions: ''
    },
    store,
    name: 'ProductFormRoot',
    delimiters: ['${', '}']
  })
}

export default productFormRoot
