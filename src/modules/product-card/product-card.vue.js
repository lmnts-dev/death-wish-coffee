import Vue from 'vue'
import { debounce } from 'lib/util'

let yotpoApi = null
let yotpoRetries = 0

/**
 * Force Yotpo to re-render all review widgets after they're mounted.
 * Debounce is used to make sure this is only called once per batch of components.
 */
const refreshYotpo = debounce(() => {
  if (!window.yotpo || !window.Yotpo || !window.Yotpo.API) {
    // If yotpo is not initialized yet, wait for one second and retry 5 times maximum
    if (yotpoRetries < 5) {
      setTimeout(
        refreshYotpo,
        1000
      )
    }
    yotpoRetries++
    return
  }

  if (!yotpoApi) {
    yotpoApi = new window.Yotpo.API(window.yotpo)
  }

  yotpoApi.refreshWidgets()
})

Vue.component('product-card', {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isOverlayActive: false
    }
  },
  watch: {
    product () {
      this.renderReviews()
      console.log('updated!')
    }
  },
  methods: {
    renderReviews () {
      this.$nextTick(() => {
        refreshYotpo()
      })
    }
  },
  mounted () {
    this.renderReviews()
  }
})
