/**
 * Initializes the site's upscribewrapper module.
 * @constructor
 * @param {Object} el - The site's upscribewrapper container element.
 */

import Vue from 'vue'

const upscribewrapper = el => {
  const vue = new Vue({
    el: '#subscription-wrapper',
    delimiters: ['${', '}'],
    data: {
      showPortal: false
    },
    methods: {
      showUpscribe: function () {
        this.showPortal = true
      }
    }
  })

  return vue
}

export default upscribewrapper
