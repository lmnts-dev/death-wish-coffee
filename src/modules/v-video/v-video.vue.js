import Video from '../video/video'
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  mounted () {
    Video(this.$el)
  }
}
