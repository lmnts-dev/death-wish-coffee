import Vue from 'vue'

/**
 * Initializes the javascript for the product-card module
 * @param {Object} el - The DOM Node containing the data-module="product-card" attribute.
 */
const productCardRoot = el => {
  return new Vue({
    el,
    name: 'ProductCardRoot',
    delimiters: ['${', '}']
  })
}

export default productCardRoot
