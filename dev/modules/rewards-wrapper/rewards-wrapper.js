/**
 * Initializes the site's rewardswrapper module.
 * @constructor
 * @param {Object} el - The site's rewardswrapper container element.
 */

import Vue from 'vue'
import axios from 'axios'
import RewardsHero from '../rewards-hero/rewards-hero.vue'
import RewardsIntro from '../rewards-intro/rewards-intro.vue'
import RewardsCtaGroup from '../rewards-cta-group/rewards-cta-group.vue'
import RewardsTiers from '../rewards-tiers/rewards-tiers.vue'
import RewardsProgram from '../rewards-program/rewards-program.vue'

const rewardswrapper = el => {
  return new Vue({
    el,
    delimiters: ['${', '}'],
    name: 'RewardsWrapper',
    components: {
      RewardsHero,
      RewardsIntro,
      RewardsCtaGroup,
      RewardsTiers,
      RewardsProgram
    },
    data () {
      return {
        loaded: false,
        rewardsCustomer: null,
        smileChannel: null,
        channelKey: null,
        allEarnActivities: [],
        allRedeemProducts: []
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
      },
      vipTiers () {
        const tiers = this.smileChannel && this.smileChannel.milestone_vip_program && this.smileChannel.milestone_vip_program.vip_tiers ? this.smileChannel.milestone_vip_program.vip_tiers : []
        return tiers.map((tier, index, originalArray) => {
          const nextTier = originalArray[index + 1]
          const condition = nextTier ? `${tier.milestone}-${nextTier.milestone - 1} DW` : `${tier.milestone}+ DW`
          const benefits = {}
          switch (tier.name) {
            case 'Level 2': {
              benefits.pointsEarned = '$1=3 DW'
              benefits.birthdayGifts = '+300DW'
              benefits.freeShip = true
              benefits.giveaways = true
              benefits.merch = false
              benefits.privateRaffles = false
              break
            }
            case 'Level 3': {
              benefits.pointsEarned = '$1=5 DW'
              benefits.birthdayGifts = '+400DW'
              benefits.freeShip = true
              benefits.giveaways = true
              benefits.merch = true
              benefits.privateRaffles = false
              break
            }
            case 'Level 4': {
              benefits.pointsEarned = '$1=7 DW'
              benefits.birthdayGifts = '+500DW'
              benefits.freeShip = true
              benefits.giveaways = true
              benefits.merch = true
              benefits.privateRaffles = true
              break
            }
            default: {
              benefits.pointsEarned = '$1=1 DW'
              benefits.birthdayGifts = '+200DW'
              benefits.freeShip = true
              benefits.giveaways = false
              benefits.merch = false
              benefits.privateRaffles = false
            }
          }
          return {
            ...tier,
            benefits,
            condition
          }
        })
      },
      redeemProducts () {
        return this.allRedeemProducts.map(product => {
          let isPurchasable = this.pointsBalance > 0
          if (product.exchange_type === 'fixed' && this.pointsBalance < product.points_price) {
            isPurchasable = false
          }
          if (product.exchange_type === 'variable') {
            if (product.variable_points_min && this.pointsBalance < product.variable_points_min) {
              isPurchasable = false
            } else if (product.variable_points_step && this.pointsBalance < product.variable_points_step) {
              isPurchasable = false
            }
          }
          return {
            ...product,
            is_purchasable: isPurchasable
          }
        })
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
            this.allRedeemProducts = [...pointsProducts]
          })
        } catch (error) {
          console.log('Error fetching redeem products')
        }
      }
    }
  })
}

export default rewardswrapper
