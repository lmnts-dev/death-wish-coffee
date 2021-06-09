import Vue from 'vue'
import Plp from './plp.vue'
import store from 'lib/store'

/**
 * Initializes the site's plp module.
 * @constructor
 * @param {Object} el - The site's plp container element.
 */
const plpRoot = el => {
  store.dispatch('plp/init')

  return new Vue({
    el,
    store,
    components: {
      Plp
    },
    name: 'PlpRoot',
    delimiters: ['${', '}']
  })
}

export default plpRoot
