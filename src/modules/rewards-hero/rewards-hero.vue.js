export default {
  props: {
    rewardsCustomer: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {
    console.log(this.rewardsCustomer)
  },
  computed: {
    firstName () {
      return this.rewardsCustomer && this.rewardsCustomer.first_name
    },
    pointsBalance () {
      return this.rewardsCustomer && this.rewardsCustomer.points_balance
    },
    tier () {
      return this.rewardsCustomer.vip_tier
    }
  }
}
