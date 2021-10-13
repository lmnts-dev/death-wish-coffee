import { addClass, removeClass } from 'lib/util'
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
      birthdayDayLast: ''
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
    focusInput (e) {
      const inputEl = e.currentTarget
      const value = e.currentTarget.value
      const length = value ? value.length : 0
      inputEl.setSelectionRange(0, length)
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

    }
  }
}
