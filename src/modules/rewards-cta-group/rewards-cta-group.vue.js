import VImage from '../v-image/v-image.vue'
import rewardsEarnModal from '../rewards-earn-modal/rewards-earn-modal.vue'

export default {
  components: {
    VImage,
    rewardsEarnModal
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
    }
  },
  data () {
    return {
      isCopied: false
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
    }
  }
}
