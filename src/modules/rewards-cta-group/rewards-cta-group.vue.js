import VImage from '../v-image/v-image.vue'
import RewardsEarnModal from '../rewards-earn-modal/rewards-earn-modal.vue'
import RewardsRedeemModal from '../rewards-redeem-modal/rewards-redeem-modal.vue'

export default {
  components: {
    VImage,
    RewardsEarnModal,
    RewardsRedeemModal
  },
  props: {
    referralUrl: {
      type: String,
      default: ''
    },
    copyAlertDuration: {
      type: Number,
      default: 2000
    },
    earnActivities: {
      type: Array,
      default: () => []
    },
    redeemProducts: {
      type: Array,
      default: () => []
    },
    pointsBalance: {
      type: Number,
      default: 0
    },
    rewardsCustomerId: {
      type: Number,
      default: 0
    },
    channelKey: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isCopied: false
    }
  },
  computed: {
    isRedeemable () {
      return this.redeemProducts.some(function (product) { return product.is_purchasable })
    }
  },
  watch: {
    isCopied (currentValue) {
      if (currentValue) {
        setTimeout(() => {
          this.isCopied = false
        }, this.copyAlertDuration)
      }
    }
  },
  methods: {
    copyReferralUrl () {
      if (this.referralUrl) {
        navigator.clipboard.writeText(this.referralUrl)
        const inputEl = Array.isArray(this.$refs.input) ? this.$refs.input[0] : this.$refs.input
        if (inputEl) {
          inputEl.focus()
        }
        this.isCopied = true
      }
    },
    focusInput (e) {
      const inputEl = e.currentTarget
      inputEl.setSelectionRange(0, this.referralUrl.length)
    },
    activateEarnModal () {
      const redeemModalComponent = Array.isArray(this.$refs.redeemModal) ? this.$refs.redeemModal[0] : this.$refs.redeemModal
      redeemModalComponent.deactivate()
      const earnModalComponent = Array.isArray(this.$refs.earnModal) ? this.$refs.earnModal[0] : this.$refs.earnModal
      earnModalComponent.activate()
    },
    activateRedeemModal () {
      const earnModalComponent = Array.isArray(this.$refs.earnModal) ? this.$refs.earnModal[0] : this.$refs.earnModal
      earnModalComponent.deactivate()
      const redeemModalComponent = Array.isArray(this.$refs.redeemModal) ? this.$refs.redeemModal[0] : this.$refs.redeemModal
      redeemModalComponent.activate()
    }
  }
}
