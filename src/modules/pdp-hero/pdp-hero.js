/**
 * Initializes the javascript for the pdp-hero module
 * @param {Object} el - The DOM Node containing the data-module="pdp-hero" attribute.
 */

import Vue from 'vue'
import PdpHero from '../pdp-hero/pdp-hero.vue'

const pdpHero = (el) => {
  return new Vue({
    el,
    name: 'PdpHeroRoot',
    delimiters: ['${', '}'],
    components: {
      PdpHero
    }
  })
}

export default pdpHero
