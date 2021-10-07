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
      isActive: false
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
    }
  }
}
