import Video from '../video/video'
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    Video(this.$el)
    const videoEl = this.$refs.video instanceof Array ? this.$refs.video[0] : this.$refs.video
    videoEl.addEventListener('ended', () => {
      this.$emit('video-ended')
    })
  }
}
