import { addClass, removeClass } from 'lib/util'
import { isDate } from 'validator'
import axios from 'axios'

export default {
  props: {
    earnActivities: {
      type: Array,
      default: () => []
    },
    rewardsCustomerId: {
      type: Number,
      default: 0
    },
    channelKey: {
      type: String,
      default: 0
    }
  },
  data () {
    return {
      isActive: false,
      isBirthdayFormActive: false,
      birthdayMonthFirst: '',
      birthdayMonthLast: '',
      birthdayDayFirst: '',
      birthdayDayLast: '',
      birthdayErrorMessage: ''
    }
  },
  computed: {
    birthdayMonth () {
      return this.birthdayMonthFirst && this.birthdayMonthLast ? `${this.birthdayMonthFirst}${this.birthdayMonthLast}` : ''
    },
    birthdayDay () {
      return this.birthdayDayFirst && this.birthdayDayLast ? `${this.birthdayDayFirst}${this.birthdayDayLast}` : ''
    },
    birthday () {
      return this.birthdayMonth && this.birthdayDay ? `1907-${this.birthdayMonth}-${this.birthdayDay}` : ''
    }
  },
  methods: {
    activate () {
      this.isActive = true
      addClass(document.body, 'is-modal-active')
    },
    deactivate () {
      this.isActive = false
      removeClass(document.body, 'is-modal-active')
    },
    back () {
      this.isBirthdayFormActive = false
      this.birthdayErrorMessage = ''
      this.birthdayMonthFirst = ''
      this.birthdayMonthLast = ''
      this.birthdayDayFirst = ''
      this.birthdayDayLast = ''
    },
    async earnPoints (activity) {
      switch (activity.activity_rule.type) {
        case 'shopify_online_order': {
          window.location.href = '/collections'
          break
        }
        case 'customer_birthday': {
          this.isBirthdayFormActive = true
          break
        }
        case 'signup': {
          window.location.href = '/account/register'
          break
        }
        default: {
          await window.Smile.createActivity({ token: activity.activity_rule.type })
        }
      }
    },
    nextInput (e) {
      const inputEl = e.currentTarget
      const inputMaxLength = inputEl.getAttribute('maxlength') ? parseInt(inputEl.getAttribute('maxlength')) : 0
      const value = inputEl.value
      const index = inputEl.getAttribute('data-index') ? parseInt(inputEl.getAttribute('data-index')) : 0
      const nextInputRef = index && `input${index + 1}`
      const nextInputEl = nextInputRef ? this.$refs[nextInputRef] : null
      if (inputMaxLength && value.length === inputMaxLength && nextInputEl) {
        nextInputEl.focus()
      }
    },
    async saveDate () {
      this.birthdayErrorMessage = ''
      if (!this.birthday) {
        this.birthdayErrorMessage = 'Please enter your birthday first'
      } else if (!isDate(this.birthday)) {
        this.birthdayErrorMessage = 'Please enter a valid date'
      } else if (this.rewardsCustomerId) {
        const date = new Date(this.birthday)
        const data = {
          customer: {
            date_of_birth: date.toISOString()
          }
        }
        const config = {
          headers: {
            'smile-channel-key': this.channelKey,
            'smile-client': 'smile-ui'
          }
        }
        try {
          await axios.put(`https://platform.smile.io/v1/customers/${this.rewardsCustomerId}`, data, config)
          this.birthdayErrorMessage = false
          this.back()
        } catch (error) {
          this.birthdayErrorMessage = 'Unexpected error occurred! Please try again later.'
          setTimeout(() => {
            this.back()
          }, 1000)
        }
      } else {
        this.birthdayErrorMessage = 'Please log in first'
      }
    }
  }
}
