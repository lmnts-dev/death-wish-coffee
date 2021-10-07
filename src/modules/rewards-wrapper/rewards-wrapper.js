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
        allEarnActivities: [],
        redeemProducts: []
      }
    },
    computed: {
      rewardsCustomerId () {
        return this.rewardsCustomer && this.rewardsCustomer.id
      },
      referralUrl () {
        return this.rewardsCustomer && this.rewardsCustomer.referral_url
      },
      earnActivities () {
        const enabledActivities = this.allEarnActivities.filter(activity => activity.activity_rule.is_enabled)
        const actionableActivities = enabledActivities
          .filter(activity => activity.is_actionable ? activity.activity_rule.type !== 'signup' : activity.activity_rule.type === 'shopify_online_order')
          .sort((a, b) => a.default_sort_order - b.default_sort_order)
          .map(activity => Object.assign({}, activity, { is_actionable: true }))
        const inactionableActivities = enabledActivities
          .filter(activity => actionableActivities.every(a => a.id !== activity.id))
          .sort((a, b) => b.default_sort_order - a.default_sort_order)
          .map(activity => Object.assign({}, activity, { is_actionable: false }))
        return [...actionableActivities, ...inactionableActivities]
      },
      pointsBalance () {
        return this.rewardsCustomer && this.rewardsCustomer.points_balance
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
          await this.getRedeemProducts()
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
          const activitiesResponse = await axios.get('https://platform.smile.io/v1/customer_activity_rules', {
            params: { customer_id: this.rewardsCustomerId },
            headers: {
              'smile-channel-key': this.channelKey,
              'smile-client': 'smile-ui'
            }
          })
          this.allEarnActivities = activitiesResponse.data && activitiesResponse.data.customer_activity_rules ? activitiesResponse.data.customer_activity_rules : []
        } catch (error) {
          console.log('Error fetching activities')
        }
      },
      async getRedeemProducts () {
        try {
          window.Smile.fetchAllPointsProducts().then(pointsProducts => {
            this.redeemProducts = [...pointsProducts]
          })
        } catch (error) {
          console.log('Error fetching redeem products')
        }
      }
    }
  })
}

export default rewardswrapper
