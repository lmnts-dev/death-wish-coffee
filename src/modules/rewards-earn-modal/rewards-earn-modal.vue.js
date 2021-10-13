import { addClass, removeClass } from 'lib/util'
import { isDate } from 'validator'

export default {
  props: {
    earnActivities: {
      type: Array,
      default: () => []
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
    saveDate () {
      this.birthdayErrorMessage = ''
      if (!this.birthday) {
        this.birthdayErrorMessage = 'Please enter your birthday first'
      } else if (!isDate(this.birthday)) {
        this.birthdayErrorMessage = 'Please enter a valid date'
      } else {
        console.log('valid birth day')
      }
    }
  }
}
