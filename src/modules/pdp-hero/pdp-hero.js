/**
 * Initializes the javascript for the pdp-hero module
 * @param {Object} el - The DOM Node containing the data-module="pdp-hero" attribute.
 */

import Vue from 'vue'
import store from 'lib/store'
import PdpHero from '../pdp-hero/pdp-hero.vue'
import QueryString from 'query-string'

const pdpHero = (el) => {
  return new Vue({
    el,
    name: 'PdpHeroRoot',
    delimiters: ['${', '}'],
    components: {
      PdpHero
    },
    store,
    data () {
      return {
        subscriptionChecked: false
      }
    },
    created () {
      const params = QueryString.parse(location.search, { parseBooleans: true })
      this.subscriptionChecked = !!params['subscription-checked']
    }
  })
}

export default pdpHero
