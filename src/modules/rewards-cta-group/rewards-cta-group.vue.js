import VImage from '../v-image/v-image.vue'
export default {
  components: {
    VImage
  },
  props: {
    referralUrl: {
      type: String,
      default: ''
    },
    copyAlertDuration: {
      type: Number,
      default: 2000
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
        this.isCopied = true
      }
    }
  }
}
