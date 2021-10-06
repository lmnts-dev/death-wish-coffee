/**
 * Initializes the site's rewardswrapper module.
 * @constructor
 * @param {Object} el - The site's rewardswrapper container element.
 */

import Vue from 'vue'
import axios from 'axios'
import RewardsHero from '../rewards-hero/rewards-hero.vue'
import RewardsCtaGroup from '../rewards-cta-group/rewards-cta-group.vue'

// @TODO: This line is used for Vue debugging. Remove after finished this task.
Vue.config.devtools = true

const rewardswrapper = el => {
  return new Vue({
    el,
    delimiters: ['${', '}'],
    name: 'RewardsWrapper',
    components: {
      RewardsHero,
      RewardsCtaGroup
    },
    data () {
      return {
        loaded: false,
        rewardsCustomer: null,
        smileChannel: null,
        channelKey: null,
        activities: []
      }
    },
    computed: {
      rewardsCustomerId () {
        return this.rewardsCustomer && this.rewardsCustomer.id
      },
      referralUrl () {
        return this.rewardsCustomer && this.rewardsCustomer.referral_url
      },
      enabledActivities () {
        return this.activities.filter(activity => activity.activity_rule.is_enabled)
      }
    },
    created () {
      document.addEventListener('smile-shopify-loaded', async () => {
        this.loaded = true
        this.channelKey = window.Smile.channel_key
        await this.getChannelData()
        window.SmileShopify.on('customer-identified', async () => {
          await this.reloadCustomer()
          await this.getCustomerActivities()
        })
      })
    },
    methods: {
      async getChannelData () {
        if (!this.channelKey) {
          return
        }
        try {
          const smileResponse = await axios.get('https://platform.smile.io/v1/smile_ui/init', {
            params: { channel_key: this.channelKey },
            headers: {
              'smile-channel-key': this.channelKey,
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
      },
      async getCustomerActivities () {
        try {
          const activities = await axios.get('https://platform.smile.io/v1/customer_activity_rules', {
            params: { customer_id: this.rewardsCustomerId },
            headers: {
              'smile-channel-key': this.channelKey,
              'smile-client': 'smile-ui'
            }
          })
          this.activities = activities.data && activities.data.customer_activity_rules ? activities.data.customer_activity_rules : []
        } catch (error) {
          console.log('Error fetching activities')
        }
      }
    }
  })
}

export default rewardswrapper
