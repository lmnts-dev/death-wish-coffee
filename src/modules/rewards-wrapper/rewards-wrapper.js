/**
 * Initializes the site's rewardswrapper module.
 * @constructor
 * @param {Object} el - The site's rewardswrapper container element.
 */

import Vue from 'vue'
import RewardsHero from '../rewards-hero/rewards-hero.vue'

Vue.config.devtools = true

const rewardswrapper = el => {
  return new Vue({
    el,
    delimiters: ['${', '}'],
    name: 'RewardsWrapper',
    components: {
      RewardsHero
    },
    data () {
      return {
        rewardsCustomer: null
      }
    },
    created () {
      document.addEventListener('smile-ui-loaded', async () => {
        const rewardsCustomer = await window.Smile.fetchCustomer({ include: 'vip_tier' })
        this.rewardsCustomer = rewardsCustomer
      })
    }
  })
}

export default rewardswrapper
