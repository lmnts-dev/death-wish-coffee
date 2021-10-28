export default {
  props: {
    rewardsCustomer: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    customerId () {
      return this.rewardsCustomer && this.rewardsCustomer.id
    },
    firstName () {
      return this.rewardsCustomer && this.rewardsCustomer.first_name
    },
    pointsBalance () {
      return this.rewardsCustomer && this.rewardsCustomer.points_balance
    },
    tier () {
      return this.rewardsCustomer && this.rewardsCustomer.vip_tier
    }
  }
}
