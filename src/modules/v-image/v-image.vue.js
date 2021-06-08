import Vue from 'vue'
import { buildImageSrcset } from 'lib/util'

Vue.component('v-image', {
  props: {
    imageSrc: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      src: '',
      srcsets: []
    }
  },
  created () {
    const srcsetData = buildImageSrcset(this.imageSrc)
    this.srcsets = srcsetData.srcsets
    this.src = srcsetData.src
  }
})
