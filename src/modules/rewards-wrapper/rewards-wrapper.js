/**
 * Initializes the site's rewardswrapper module.
 * @constructor
 * @param {Object} el - The site's rewardswrapper container element.
 */

import Vue from 'vue'
import axios from 'axios'
import RewardsHero from '../rewards-hero/rewards-hero.vue'

// @TODO: This line is used for Vue debugging. Remove after finished this task.
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
        rewardsCustomer: null,
        smileChannel: null
      }
    },
    created () {
      document.addEventListener('smile-shopify-loaded', async () => {
        const channelKey = window.Smile.channel_key
        await this.getChannelData(channelKey)
        window.SmileShopify.on('customer-identified', async () => {
          this.reloadCustomer()
        })
      })
    },
    methods: {
      async getChannelData (channelKey) {
        if (!channelKey) {
          return
        }
        try {
          const smileResponse = await axios.get('https://platform.smile.io/v1/smile_ui/init', {
            params: { channel_key: channelKey },
            headers: {
              'smile-channel-key': channelKey,
              'smile-client': 'smile-ui'
            }
          })
          this.smileChannel = smileResponse.data
        } catch (error) {
          console.log('Error loading Smile.io')
        }
      },
      async reloadCustomer () {
        try {
          const rewardsCustomer = await window.Smile.fetchCustomer({ include: 'vip_tier' })
          this.rewardsCustomer = rewardsCustomer
        } catch (error) {
          console.log('Error fetching customer data')
        }
      }
    }
  })
}

export default rewardswrapper
