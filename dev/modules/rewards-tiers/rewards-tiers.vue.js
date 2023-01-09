export default {
  props: {
    vipTiers: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      benefits: [
        { title: 'Points Earned', key: 'pointsEarned' },
        { title: 'Birthday Gift', key: 'birthdayGifts' },
        { title: 'Free Standard Shipping', key: 'freeShip' },
        { title: 'Giveaways', key: 'giveaways' },
        { title: 'Reapers-Only Merch + Mugs', key: 'merch' },
        { title: 'Private Raffles + Giveaways', key: 'privateRaffles' }
      ]
    }
  }
}
