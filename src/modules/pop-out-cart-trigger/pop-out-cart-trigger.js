/**
 * Initializes the site's popoutcarttrigger module.
 * @constructor
 * @param {Object} el - The site's popoutcarttrigger container element.
 */

import Vue from 'vue'
import store from 'lib/store'
import { mapState } from 'vuex'

const popoutcarttrigger = el => {
  return new Vue({
    el,
    delimiters: ['${', '}'],
    name: 'PopOutCartTriggerRoot',
    store,
    computed: {
      ...mapState('cart', ['cart', 'isPopOutCartActive'])
    },
    methods: {
      togglePopOutCart () {
        const state = !this.isPopOutCartActive
        store.dispatch('cart/setIsPopOutCartActive', state)
      }
    }
  })
}

export default popoutcarttrigger
