import Vue from 'vue'
import ProductCard from './product-card.vue'

/**
 * Initializes the javascript for the product-card module
 * @param {Object} el - The DOM Node containing the data-module="product-card" attribute.
 */
const productCardRoot = el => {
  return new Vue({
    el,
    components: {
      ProductCard
    },
    name: 'ProductCardRoot',
    delimiters: ['${', '}']
  })
}

export default productCardRoot
